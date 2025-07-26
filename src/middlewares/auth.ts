import { Request, Response, NextFunction } from 'express';

// Middleware per verificare se l'utente è autenticato
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'Devi effettuare il login per accedere a questa pagina');
  res.redirect('/auth/login');
};

// Middleware per verificare se l'utente è admin
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated() && req.user && (req.user as any).auth === 'admin') {
    return next();
  }
  req.flash('error', 'Non hai i permessi necessari per accedere a questa pagina');
  res.redirect('/');
}; 