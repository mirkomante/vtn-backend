import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import { PrismaClient, User } from '@prisma/client';
import { DoneCallback } from 'passport';
import { Request } from 'express';
import bcrypt from 'bcryptjs';
import { isStrategyEnabled, logAuthConfig } from './auth';
import { EnvironmentValidator } from './env';

const prisma = new PrismaClient();

export const configurePassport = (passport: any) => {
  // Log della configurazione all'avvio
  logAuthConfig();
  passport.serializeUser((user: User, done: DoneCallback) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done: DoneCallback) => {
    try {
      const user = await prisma.user.findUnique({ where: { id } });
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  // Strategia Google OAuth (solo se abilitata)
  if (isStrategyEnabled('google')) {
    const config = EnvironmentValidator.getConfig();
    
    // Costruisci il callback URL dinamicamente
    const baseUrl = process.env.BASE_URL || 
      (process.env.NODE_ENV === 'production' 
        ? 'https://vtn-backend-203473363873.europe-west1.run.app'
        : 'http://localhost:8080');
    
    const callbackURL = `${baseUrl}/auth/google/callback`;
    
    console.log(`🔗 Google OAuth Callback URL: ${callbackURL}`);
    
    passport.use(new GoogleStrategy({
      clientID: config.google.clientId,
      clientSecret: config.google.clientSecret,
      callbackURL: callbackURL,
      passReqToCallback: true
    }, async (_req: Request, _accessToken: string, _refreshToken: string, profile: Profile, done: VerifyCallback) => {
    try {
      const userCount = await prisma.user.count();
      const isFirstUser = userCount === 0;
      const hasAdmin = await prisma.user.count({
        where: { role: 'admin' }
      }) > 0;

      let user = await prisma.user.findFirst({
        where: { googleId: profile.id }
      });

      if (!user) {
        // Estrai nome e cognome dal displayName di Google
        const displayName = profile.displayName || '';
        const nameParts = displayName.split(' ');
        const givenName = nameParts[0] || '';
        const familyName = nameParts.slice(1).join(' ') || '';
        
        // Determina il ruolo: admin se è il primo utente del sistema OPPURE se non ci sono admin
        const shouldBeAdmin = isFirstUser || !hasAdmin;
        
        user = await prisma.user.create({
          data: {
            googleId: profile.id,
            email: profile.emails![0].value,
            givenName: givenName,
            familyName: familyName,
            role: shouldBeAdmin ? 'admin' : 'user',
            auth: shouldBeAdmin ? 'admin' : 'user',
            authProvider: 'google',
            profilePicture: profile.photos?.[0]?.value || null
          }
        });

        if (shouldBeAdmin) {
          console.log(`🎉 Primo utente Google creato come admin: ${user.email}`);
        } else {
          console.log(`👤 Nuovo utente Google creato: ${user.email}`);
        }
      } else {
        if (!user.profilePicture && profile.photos?.[0]?.value) {
          user = await prisma.user.update({
            where: { id: user.id },
            data: {
              profilePicture: profile.photos[0].value
            }
          });
        }
      }

      console.log('👤 Google OAuth user processed:', {
        userId: user.id,
        email: user.email,
        role: user.role,
        auth: user.auth,
        isFirstUser: isFirstUser
      });
      
      return done(null, user);
    } catch (error) {
      console.error('❌ Google OAuth error:', error);
      return done(error, undefined);
    }
  }));
  }

  // Strategia Locale (email e password) - solo se abilitata
  if (isStrategyEnabled('local')) {
    passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, async (email: string, password: string, done: (error: any, user?: any, info?: any) => void) => {
    try {
      // Cerca l'utente per email
      const user = await prisma.user.findUnique({
        where: { 
          email: email.toLowerCase(),
          deletedAt: null // Solo utenti non cancellati
        }
      });

      if (!user) {
        return done(null, false, { message: 'Credenziali non valide' });
      }

      // Verifica che l'utente abbia una password (non solo OAuth)
      if (!user.password) {
        return done(null, false, { message: 'Account non configurato per login locale' });
      }

      // Verifica la password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      
      if (!isPasswordValid) {
        return done(null, false, { message: 'Credenziali non valide' });
      }

      // Aggiorna l'ultimo accesso se necessario
      if (user.authProvider !== 'local') {
        await prisma.user.update({
          where: { id: user.id },
          data: { authProvider: 'local' }
        });
      }

      return done(null, user);
    } catch (error) {
      console.error('Errore durante autenticazione locale:', error);
      return done(error, false);
    }
  }));
  }
}; 