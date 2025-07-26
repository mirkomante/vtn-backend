import { User as PrismaUser } from '@prisma/client';

type User = {
  id: string;
  email: string;
  password?: string;
  name?: string;
  role: string;
  googleId?: string;
  authProvider: string;
  createdAt: Date;
  updatedAt: Date;
};

declare global {
  namespace Express {
    interface Request {
      user?: User;
      isAuthenticated(): boolean;
      logout(callback: (err: any) => void): void;
      flash(type: string, message?: string): string | string[];
    }
  }
} 