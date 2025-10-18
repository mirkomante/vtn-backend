import express from 'express';
import { mainMenuItems } from '../config/mainMenu';
import { sectionMenuItems } from '../config/sectionMenu';
import { sectionIcons } from '../config/sectionIcons';
import { scriptManager } from '../config/scriptManager';
import { isAuthenticated } from '../middlewares/auth';
import { requireEnabledMenus } from '../middlewares/menuAccess';

const router = express.Router();

// Middleware per verificare che almeno un menu sia abilitato
router.use(requireEnabledMenus);

// Tutte le route richiedono autenticazione
router.use(isAuthenticated);

router.get('/', (req, res) => {
  console.log('🏠 Homepage access:', {
    isAuthenticated: req.isAuthenticated(),
    userId: (req.user as any)?.id,
    email: (req.user as any)?.email,
    role: (req.user as any)?.role
  });
  
  const currentPath = '/';
  let sectionMenu = sectionMenuItems.defaultNavigationItems;
  
  res.render('index', {
    title: 'Dashboard',
    layout: 'layouts/main',
    mainMenu: mainMenuItems,
    sectionMenu,
    sectionIcons,
    currentPath,
    scripts: scriptManager.getScriptsForPage('dashboard')
  });
});

// Rotta di test per il Script Manager
router.get('/test-scripts', (_req, res) => {
  // Test con tutti gli script disponibili
  const allScripts = [
    ...scriptManager.getScriptsForPage('dashboard'), // Script comuni
    ...scriptManager.getScriptsForPage('table'),     // Script per tabelle
    ...scriptManager.getScriptsForPage('form')       // Script per form
  ];
  
  // Rimuovi duplicati
  const uniqueScripts = [...new Set(allScripts)];
  
  res.render('pages/test-scripts', {
    title: 'Test Script Manager',
    layout: 'layouts/main',
    scripts: uniqueScripts,
    mainMenu: mainMenuItems,
    sectionMenu: sectionMenuItems.defaultNavigationItems,
    sectionIcons,
    currentPath: '/test-scripts'
  });
});

// Route protette
router.get('/profile', (_req, res) => {
  res.render('profile', {
    title: 'Profilo'
  });
});

// Altre route protette...

export default router; 