import express from 'express';
import passport from 'passport';
import { isAuthenticated } from '../middlewares/auth';

const router = express.Router();

// Route per il login
router.get('/login', (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.render('pages/auth', {
    title: 'Login',
    layout: 'layouts/default',
    error: req.flash('error')
  });
});

// Route per il logout
router.get('/logout', isAuthenticated, (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/login');
  });
});

// Route per l'autenticazione Google
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Callback per l'autenticazione Google
router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: '/auth/login',
    failureFlash: true
  }),
  (req, res) => {
    res.redirect('/');
  }
);

// Rota per il login locale
router.post('/local', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth',
  failureFlash: true
}));

export default router; 