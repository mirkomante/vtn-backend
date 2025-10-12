import { Request, Response, NextFunction } from 'express';

// Middleware per rendere disponibile l'utente in tutte le viste
export const userToLocals = (req: Request, res: Response, next: NextFunction) => {
  res.locals.user = req.user;
  next();
}; 