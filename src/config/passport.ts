import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { PrismaClient, User } from '@prisma/client';
import { DoneCallback } from 'passport';
import { Request } from 'express';

const prisma = new PrismaClient();

export const configurePassport = (passport: any) => {
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

  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: '/auth/google/callback',
    passReqToCallback: true
  }, async (req: Request, accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
    try {
      const userCount = await prisma.user.count();
      const isFirstUser = userCount === 0;

      let user = await prisma.user.findFirst({
        where: { googleId: profile.id }
      });

      if (!user) {
        if (isFirstUser) {
          user = await prisma.user.create({
            data: {
              googleId: profile.id,
              email: profile.emails![0].value,
              name: profile.displayName,
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
}; 