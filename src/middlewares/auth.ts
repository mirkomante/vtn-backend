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
  console.log('=== MIDDLEWARE ISADMIN CHIAMATO ===');
  console.log('User:', req.user);
  console.log('Session:', req.session);
  console.log('Is authenticated:', req.isAuthenticated());
  
  if (!req.isAuthenticated()) {
    console.log('Utente non autenticato, redirect a login');
    return res.redirect('/auth/login');
  }
  
  if (req.user && req.user.role !== 'admin') {
    console.log('Utente non admin, accesso negato');
    return res.status(403).send('Accesso negato');
  }
  
  console.log('Utente autenticato e admin, procedi');
  next();
}; 