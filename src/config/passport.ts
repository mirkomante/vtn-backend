import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { Strategy as LocalStrategy } from 'passport-local';
import { PrismaClient, User } from '@prisma/client';
import { DoneCallback } from 'passport';
import { Request } from 'express';
import bcrypt from 'bcryptjs';
import { isStrategyEnabled, logAuthConfig } from './auth';

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
    passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: '/auth/google/callback',
      passReqToCallback: true
    }, async (_req: Request, _accessToken: string, _refreshToken: string, profile: Profile, done: VerifyCallback) => {
    try {
      const userCount = await prisma.user.count();
      const isFirstUser = userCount === 0;

      let user = await prisma.user.findFirst({
        where: { googleId: profile.id }
      });

      if (!user) {
        if (isFirstUser) {
          // Estrai nome e cognome dal displayName di Google
          const displayName = profile.displayName || '';
          const nameParts = displayName.split(' ');
          const givenName = nameParts[0] || '';
          const familyName = nameParts.slice(1).join(' ') || '';
          
          user = await prisma.user.create({
            data: {
              googleId: profile.id,
              email: profile.emails![0].value,
              givenName: givenName,
              familyName: familyName,
              role: 'admin',
              auth: 'admin',
              authProvider: 'google',
              profilePicture: profile.photos?.[0]?.value || null
            }
          });
        } else {
          return done(null, false);
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

      return done(null, user);
    } catch (error) {
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