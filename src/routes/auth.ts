import express from 'express';
import passport from 'passport';
import { isAuthenticated, validateAuthStrategy, requireAuthStrategy } from '../middlewares/auth';
import { getLoginUIConfig, isStrategyEnabled } from '../config/auth';

const router = express.Router();

// Middleware per verificare che almeno una strategia sia abilitata
router.use(requireAuthStrategy);

// Route per il login
router.get('/login', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  
  const uiConfig = getLoginUIConfig();
  
  res.render('pages/auth', {
    title: 'Login',
    layout: 'layouts/default',
    error: req.flash('error'),
    success: req.flash('success'),
    ...uiConfig
  });
});

// Route per il logout
router.get('/logout', isAuthenticated, (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash('success', 'Logout effettuato con successo');
    res.redirect('/auth/login');
  });
});

// Route per l'autenticazione Google (solo se abilitata)
if (isStrategyEnabled('google')) {
  router.get('/google',
    validateAuthStrategy,
    passport.authenticate('google', { scope: ['profile', 'email'] })
  );

  // Callback per l'autenticazione Google
  router.get('/google/callback',
    validateAuthStrategy,
    passport.authenticate('google', { 
      failureRedirect: '/auth/login',
      failureFlash: true
    }),
    (req, res) => {
      console.log('🔐 Google OAuth callback success:', {
        userId: (req.user as any)?.id,
        email: (req.user as any)?.email,
        role: (req.user as any)?.role,
        isAuthenticated: req.isAuthenticated()
      });
      res.redirect('/');
    }
  );
}

// Route per il login locale (solo se abilitata)
if (isStrategyEnabled('local')) {
  router.post('/local', 
    validateAuthStrategy,
    passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/auth/login',
      failureFlash: true
    })
  );
}

export default router; 