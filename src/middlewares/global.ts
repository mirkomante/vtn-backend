import { Request, Response, NextFunction } from 'express';

// Middleware per rendere disponibili i messaggi flash in tutte le viste
export const flashMessages = (req: Request, res: Response, next: NextFunction) => {
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
};

// Middleware per rendere disponibile l'utente in tutte le viste
export const userToLocals = (req: Request, res: Response, next: NextFunction) => {
  res.locals.user = req.user;
  next();
}; 