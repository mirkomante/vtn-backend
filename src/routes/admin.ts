import express from 'express';
import { mainMenuItems } from '../config/mainMenu';
import { sectionMenuItems } from '../config/sectionMenu';
import { adminItems } from '../config/sectionMenu';
import { sectionIcons } from '../config/sectionIcons';
import { prisma } from '../app';
import { utentiTableData } from '../config/sectionTableData';
import { isAdmin } from '../middlewares/auth';

const router = express.Router();

// Tutte le route admin richiedono autenticazione e ruolo admin
router.use(isAdmin);

router.get('/', (req, res) => {
  const currentPath = '/admin';
  let sectionMenu = adminItems;
  

  res.render('index', {
    title: 'Admin',
    layout: 'layouts/main',
    mainMenu: mainMenuItems,
    sectionMenu,
    sectionIcons,
    currentPath
  });
});

router.get('/utenti', async (req, res) => {
  const currentPath = '/admin/utenti';
  let sectionMenu = adminItems;
  
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        authProvider: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.render('pages/users/index', {
      title: 'Utenti',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionIcons,
      currentPath,
      tableData: utentiTableData,
      users,
      hasUsers: users.length > 0,
      emptyState: {
        title: 'Nessun utente trovato',
        description: 'Non ci sono utenti registrati nel sistema.',
        buttonText: 'Aggiungi utente'
      }
    });
  } catch (error) {
    console.error('Errore nel recupero degli utenti:', error);
    res.status(500).render('pages/users', {
      title: 'Utenti',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionIcons,
      currentPath,
      error: 'Si è verificato un errore nel recupero degli utenti'
    });
  }
});

router.get('/utenti/nuovo', (req, res) => {
  const currentPath = '/admin/utenti/nuovo';
  let sectionMenu = adminItems;

  res.render('pages/users/new', {
    title: 'Nuovo Utente',
    layout: 'layouts/sections',
    mainMenu: mainMenuItems,
    sectionMenu,
    sectionIcons,
    currentPath
  });
});

router.post('/utenti/nuovo', async (req, res) => {
  const { nome, cognome, email, password, ruolo } = req.body;
  
  try {
    // Verifica se esiste già un utente con la stessa email
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).render('pages/users/new', {
        title: 'Nuovo Utente',
        layout: 'layouts/sections',
        mainMenu: mainMenuItems,
        sectionMenu: adminItems,
        sectionIcons,
        currentPath: '/admin/utenti/nuovo',
        error: 'Un utente con questa email esiste già',
        formData: req.body
      });
    }

    // Crea il nuovo utente
    const newUser = await prisma.user.create({
      data: {
        email,
        password, // Nota: in produzione dovresti hashare la password
        role: ruolo,
        authProvider: 'local',
        auth: ruolo
      }
    });

    // Reindirizza alla pagina dei dettagli dell'utente con messaggio di successo
    res.redirect(`/admin/utenti/dettagli/${newUser.id}?success=Utente creato con successo`);
  } catch (error) {
    console.error('Errore nella creazione dell\'utente:', error);
    res.status(500).render('pages/users/new', {
      title: 'Nuovo Utente',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu: adminItems,
      sectionIcons,
      currentPath: '/admin/utenti/nuovo',
      error: 'Si è verificato un errore durante la creazione dell\'utente',
      formData: req.body
    });
  }
});

router.get('/utenti/dettagli/:id', async (req, res) => {
  const currentPath = '/admin/utenti/dettagli';
  let sectionMenu = adminItems;
  
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id }
    });

    if (!user) {
      return res.status(404).render('error', {
        title: 'Utente non trovato',
        layout: 'layouts/sections',
        mainMenu: mainMenuItems,
        sectionMenu,
        sectionIcons,
        currentPath,
        error: 'L\'utente richiesto non esiste'
      });
    }

    res.render('pages/users/view', {
      title: 'Dettagli Utente',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionIcons,
      currentPath,
      user,
      successMessage: req.query.success
    });
  } catch (error) {
    console.error('Errore nel recupero dei dettagli utente:', error);
    res.status(500).render('error', {
      title: 'Errore',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionIcons,
      currentPath,
      error: 'Si è verificato un errore nel recupero dei dettagli utente'
    });
  }
});

export default router; 