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
        givenName: true,
        familyName: true,
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
      breadcrumbs: [
        { label: 'Admin', href: '/admin' },
        { label: 'Utenti', href: '/admin/utenti' }
      ],
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
      currentPath,
      breadcrumbs: [
        { label: 'Admin', href: '/admin' },
        { label: 'Utenti', href: '/admin/utenti' },
        { label: 'Nuovo Utente', href: '/admin/utenti/nuovo' }
      ],
      isEdit: false
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
        breadcrumbs: [
          { label: 'Admin', href: '/admin' },
          { label: 'Utenti', href: '/admin/utenti' },
          { label: 'Nuovo Utente', href: '/admin/utenti/nuovo' }
        ],
        error: 'Un utente con questa email esiste già',
        formData: req.body,
        isEdit: false
      });
    }

    // Crea il nuovo utente
    const newUser = await prisma.user.create({
      data: {
        givenName: nome,
        familyName: cognome,
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
      breadcrumbs: [
        { label: 'Admin', href: '/admin' },
        { label: 'Utenti', href: '/admin/utenti' },
        { label: 'Nuovo Utente', href: '/admin/utenti/nuovo' }
      ],
      error: 'Si è verificato un errore durante la creazione dell\'utente',
      formData: req.body,
      isEdit: false
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
        breadcrumbs: [
          { label: 'Admin', href: '/admin' },
          { label: 'Utenti', href: '/admin/utenti' },
          { label: 'Utente non trovato', href: `/admin/utenti/dettagli/${req.params.id}` }
        ],
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
      breadcrumbs: [
        { label: 'Admin', href: '/admin' },
        { label: 'Utenti', href: '/admin/utenti' },
        { label: `${user.givenName || ''} ${user.familyName || ''}`.trim() || 'Dettagli Utente', href: `/admin/utenti/dettagli/${user.id}` }
      ],
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
      breadcrumbs: [
        { label: 'Admin', href: '/admin' },
        { label: 'Utenti', href: '/admin/utenti' },
        { label: 'Errore', href: `/admin/utenti/dettagli/${req.params.id}` }
      ],
      error: 'Si è verificato un errore nel recupero dei dettagli utente'
    });
  }
});

router.get('/utenti/modifica/:id', async (req, res) => {
  const currentPath = '/admin/utenti/modifica';
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
        breadcrumbs: [
          { label: 'Admin', href: '/admin' },
          { label: 'Utenti', href: '/admin/utenti' },
          { label: 'Utente non trovato', href: `/admin/utenti/modifica/${req.params.id}` }
        ],
        error: 'L\'utente richiesto non esiste'
      });
    }

    res.render('pages/users/edit', {
      title: 'Modifica Utente',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionIcons,
      currentPath,
      user,
      isEdit: true,
      breadcrumbs: [
        { label: 'Admin', href: '/admin' },
        { label: 'Utenti', href: '/admin/utenti' },
        { label: user.name || 'Modifica Utente', href: `/admin/utenti/modifica/${user.id}` }
      ]
    });
  } catch (error) {
    console.error('Errore nel recupero dell\'utente per modifica:', error);
    res.status(500).render('error', {
      title: 'Errore',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionIcons,
      currentPath,
      breadcrumbs: [
        { label: 'Admin', href: '/admin' },
        { label: 'Utenti', href: '/admin/utenti' },
        { label: 'Errore', href: `/admin/utenti/modifica/${req.params.id}` }
      ],
      error: 'Si è verificato un errore nel recupero dell\'utente'
    });
  }
});

router.post('/utenti/modifica/:id', async (req, res) => {
  const { nome, cognome, email, password, ruolo } = req.body;
  const userId = req.params.id;
  
  try {
    // Verifica se l'utente esiste
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!existingUser) {
      return res.status(404).render('error', {
        title: 'Utente non trovato',
        layout: 'layouts/sections',
        mainMenu: mainMenuItems,
        sectionMenu: adminItems,
        sectionIcons,
        currentPath: '/admin/utenti/modifica',
        breadcrumbs: [
          { label: 'Admin', href: '/admin' },
          { label: 'Utenti', href: '/admin/utenti' },
          { label: 'Utente non trovato', href: `/admin/utenti/modifica/${userId}` }
        ],
        error: 'L\'utente richiesto non esiste'
      });
    }

    // Verifica se esiste già un altro utente con la stessa email
    if (email !== existingUser.email) {
      const userWithSameEmail = await prisma.user.findUnique({
        where: { email }
      });

      if (userWithSameEmail) {
        return res.status(400).render('pages/users/edit', {
          title: 'Modifica Utente',
          layout: 'layouts/sections',
          mainMenu: mainMenuItems,
          sectionMenu: adminItems,
          sectionIcons,
          currentPath: '/admin/utenti/modifica',
          user: existingUser,
          isEdit: true,
          breadcrumbs: [
            { label: 'Admin', href: '/admin' },
            { label: 'Utenti', href: '/admin/utenti' },
            { label: `${existingUser.givenName || ''} ${existingUser.familyName || ''}`.trim() || 'Modifica Utente', href: `/admin/utenti/modifica/${userId}` }
          ],
          error: 'Un utente con questa email esiste già',
          formData: req.body
        });
      }
    }

    // Prepara i dati per l'aggiornamento
    const updateData: any = {
      givenName: nome,
      familyName: cognome,
      email,
      role: ruolo
    };

    // Aggiungi la password solo se è stata fornita
    if (password && password.trim() !== '') {
      updateData.password = password; // Nota: in produzione dovresti hashare la password
    }

    // Aggiorna l'utente
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData
    });

    // Reindirizza alla pagina dei dettagli dell'utente con messaggio di successo
    res.redirect(`/admin/utenti/dettagli/${updatedUser.id}?success=Utente aggiornato con successo`);
  } catch (error) {
    console.error('Errore nell\'aggiornamento dell\'utente:', error);
    
    // Prova a recuperare l'utente per il rendering dell'errore
    let userForError = null;
    try {
      userForError = await prisma.user.findUnique({
        where: { id: userId }
      });
    } catch (findError) {
      console.error('Errore nel recupero dell\'utente per errore:', findError);
    }
    
    res.status(500).render('pages/users/edit', {
      title: 'Modifica Utente',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu: adminItems,
      sectionIcons,
      currentPath: '/admin/utenti/modifica',
      user: userForError,
      isEdit: true,
      breadcrumbs: [
        { label: 'Admin', href: '/admin' },
        { label: 'Utenti', href: '/admin/utenti' },
        { label: userForError ? `${userForError.givenName || ''} ${userForError.familyName || ''}`.trim() : 'Modifica Utente', href: `/admin/utenti/modifica/${userId}` }
      ],
      error: 'Si è verificato un errore durante l\'aggiornamento dell\'utente',
      formData: req.body
    });
  }
});

export default router; 