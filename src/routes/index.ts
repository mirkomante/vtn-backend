import express from 'express';
import { mainMenuItems } from '../config/mainMenu';
import { sectionMenuItems } from '../config/sectionMenu';
import { sectionIcons } from '../config/sectionIcons';
import { isAuthenticated } from '../middlewares/auth';

const router = express.Router();

// Tutte le route richiedono autenticazione
router.use(isAuthenticated);

router.get('/', (req, res) => {
  const currentPath = '/';
  let sectionMenu = sectionMenuItems.defaultNavigationItems;
  
  res.render('index', {
    title: 'Prenotazioni',
    layout: 'layouts/main',
    mainMenu: mainMenuItems,
    sectionMenu,
    sectionIcons,
    currentPath
  });
});

// Route protette
router.get('/profile', (req, res) => {
  res.render('profile', {
    title: 'Profilo'
  });
});

// Altre route protette...

export default router; 