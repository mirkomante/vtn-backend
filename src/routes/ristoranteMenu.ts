import express from 'express';
import { mainMenuItems } from '../config/mainMenu';
import { ristoranteMenuItems } from '../config/sectionMenu';
import { ristoranteMenuImpostazioniSubItems } from '../config/subSectionMenu';
import { sectionIcons } from '../config/sectionIcons';
import { isAuthenticated } from '../middlewares/auth';

const router = express.Router();

// Middleware per tutte le route del ristorante menu
router.use(isAuthenticated);

// === ROUTE PRINCIPALI ===
router.get('/', (req, res) => {
  const currentPath = '/ristorante-menu';
  let sectionMenu = ristoranteMenuItems;
  
  res.render('pages/ristorante-menu/index', {
    title: 'Menu Ristorante',
    layout: 'layouts/sections',
    mainMenu: mainMenuItems,
    sectionMenu,
    sectionIcons,
    currentPath
  });
});

// === SEZIONI PRINCIPALI ===
router.get('/menu-fissi', (req, res) => {
  const currentPath = '/ristorante-menu/menu-fissi';
  let sectionMenu = ristoranteMenuItems;
  
  res.render('pages/ristorante-menu/menu-fissi', {
    title: 'Menu Fissi',
    layout: 'layouts/sections',
    mainMenu: mainMenuItems,
    sectionMenu,
    sectionIcons,
    currentPath,
    breadcrumbs: [
      { label: 'Menu Ristorante', href: '/ristorante-menu' },
      { label: 'Menu Fissi', href: '/ristorante-menu/menu-fissi' }
    ]
  });
});

router.get('/piatti', (req, res) => {
  const currentPath = '/ristorante-menu/piatti';
  let sectionMenu = ristoranteMenuItems;
  
  res.render('pages/ristorante-menu/piatti', {
    title: 'Piatti',
    layout: 'layouts/sections',
    mainMenu: mainMenuItems,
    sectionMenu,
    sectionIcons,
    currentPath,
    breadcrumbs: [
      { label: 'Menu Ristorante', href: '/ristorante-menu' },
      { label: 'Piatti', href: '/ristorante-menu/piatti' }
    ]
  });
});

router.get('/servizi', (req, res) => {
  const currentPath = '/ristorante-menu/servizi';
  let sectionMenu = ristoranteMenuItems;
  
  res.render('pages/ristorante-menu/servizi', {
    title: 'Servizi',
    layout: 'layouts/sections',
    mainMenu: mainMenuItems,
    sectionMenu,
    sectionIcons,
    currentPath,
    breadcrumbs: [
      { label: 'Menu Ristorante', href: '/ristorante-menu' },
      { label: 'Servizi', href: '/ristorante-menu/servizi' }
    ]
  });
});

// === SEZIONE IMPOSTAZIONI CON SOTTOSEZIONI ===
router.get('/impostazioni', (req, res) => {
  const currentPath = '/ristorante-menu/impostazioni';
  let sectionMenu = ristoranteMenuItems;
  let subSectionMenu = ristoranteMenuImpostazioniSubItems;
  
  res.render('pages/ristorante-menu/impostazioni', {
    title: 'Impostazioni',
    layout: 'layouts/sections',
    mainMenu: mainMenuItems,
    sectionMenu,
    subSectionMenu,
    sectionIcons,
    currentPath,
    breadcrumbs: [
      { label: 'Menu Ristorante', href: '/ristorante-menu' },
      { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' }
    ]
  });
});

// === SOTTOSEZIONI IMPOSTAZIONI ===
router.get('/impostazioni/categoria-menu-fisso', (req, res) => {
  const currentPath = '/ristorante-menu/impostazioni/categoria-menu-fisso';
  let sectionMenu = ristoranteMenuItems;
  let subSectionMenu = ristoranteMenuImpostazioniSubItems;
  
  res.render('pages/ristorante-menu/impostazioni/categoria-menu-fisso', {
    title: 'Categoria Menu Fisso',
    layout: 'layouts/sections',
    mainMenu: mainMenuItems,
    sectionMenu,
    subSectionMenu,
    sectionIcons,
    currentPath,
    breadcrumbs: [
      { label: 'Menu Ristorante', href: '/ristorante-menu' },
      { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
      { label: 'Categoria Menu Fisso', href: '/ristorante-menu/impostazioni/categoria-menu-fisso' }
    ]
  });
});

router.get('/impostazioni/categoria-piatti', (req, res) => {
  const currentPath = '/ristorante-menu/impostazioni/categoria-piatti';
  let sectionMenu = ristoranteMenuItems;
  let subSectionMenu = ristoranteMenuImpostazioniSubItems;
  
  res.render('pages/ristorante-menu/impostazioni/categoria-piatti', {
    title: 'Categoria Piatti',
    layout: 'layouts/sections',
    mainMenu: mainMenuItems,
    sectionMenu,
    subSectionMenu,
    sectionIcons,
    currentPath,
    breadcrumbs: [
      { label: 'Menu Ristorante', href: '/ristorante-menu' },
      { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
      { label: 'Categoria Piatti', href: '/ristorante-menu/impostazioni/categoria-piatti' }
    ]
  });
});

router.get('/impostazioni/allergeni', (req, res) => {
  const currentPath = '/ristorante-menu/impostazioni/allergeni';
  let sectionMenu = ristoranteMenuItems;
  let subSectionMenu = ristoranteMenuImpostazioniSubItems;
  
  res.render('pages/ristorante-menu/impostazioni/allergeni', {
    title: 'Allergeni',
    layout: 'layouts/sections',
    mainMenu: mainMenuItems,
    sectionMenu,
    subSectionMenu,
    sectionIcons,
    currentPath,
    breadcrumbs: [
      { label: 'Menu Ristorante', href: '/ristorante-menu' },
      { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
      { label: 'Allergeni', href: '/ristorante-menu/impostazioni/allergeni' }
    ]
  });
});

router.get('/cancellati', (req, res) => {
  const currentPath = '/ristorante-menu/cancellati';
  let sectionMenu = ristoranteMenuItems;
  
  res.render('pages/ristorante-menu/cancellati', {
    title: 'Elementi Cancellati',
    layout: 'layouts/sections',
    mainMenu: mainMenuItems,
    sectionMenu,
    sectionIcons,
    currentPath,
    breadcrumbs: [
      { label: 'Menu Ristorante', href: '/ristorante-menu' },
      { label: 'Cancellati', href: '/ristorante-menu/cancellati' }
    ]
  });
});

export default router; 