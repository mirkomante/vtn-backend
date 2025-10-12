import { Request, Response, NextFunction } from 'express';
import { isStrategyEnabled, hasEnabledStrategy } from '../config/auth';

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

// Middleware per validare le strategie di autenticazione
export const validateAuthStrategy = (req: Request, res: Response, next: NextFunction) => {
  const strategy = req.params.strategy || req.route?.path?.includes('/local') ? 'local' : 'google';
  
  // Se è una richiesta per strategia locale ma non è abilitata
  if (strategy === 'local' && !isStrategyEnabled('local')) {
    console.log('Tentativo di accesso a strategia locale disabilitata');
    req.flash('error', 'Autenticazione locale non disponibile');
    return res.redirect('/auth/login');
  }
  
  // Se è una richiesta per strategia Google ma non è abilitata
  if (strategy === 'google' && !isStrategyEnabled('google')) {
    console.log('Tentativo di accesso a strategia Google disabilitata');
    req.flash('error', 'Autenticazione Google non disponibile');
    return res.redirect('/auth/login');
  }
  
  next();
};

// Middleware per verificare che almeno una strategia sia abilitata
export const requireAuthStrategy = (req: Request, res: Response, next: NextFunction) => {
  if (!hasEnabledStrategy()) {
    console.error('Nessuna strategia di autenticazione è abilitata!');
    return res.status(503).render('pages/error', {
      title: 'Servizio Non Disponibile',
      message: 'Nessuna strategia di autenticazione è configurata. Contatta l\'amministratore.',
      layout: 'layouts/default'
    });
  }
  next();
}; 