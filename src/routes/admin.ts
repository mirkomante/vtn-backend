import express from 'express';
import { mainMenuItems } from '../config/mainMenu';
import { adminItems } from '../config/sectionMenu';
import { sectionIcons } from '../config/sectionIcons';
import { uiIcons } from '../config/uiIcons';
import { prisma } from '../app';
import { utentiTableData } from '../config/sectionTableData';
import { isAdmin } from '../middlewares/auth';
import { userFormData } from '../config/sectionFormData';
import { scriptManager } from '../config/scriptManager';

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
      where: {
        deletedAt: null // Esclude gli utenti cancellati
      },
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

    const tableConfig = {
      tableId: 'users-table',
      idField: 'id',
      labelField: 'givenName',
      detailUrl: '/admin/utenti/dettagli/:id',
      editUrl: '/admin/utenti/modifica/:id',
      bulkEditUrl: '/admin/utenti/modifica-massa',
      editMultipleButton: {
        text: 'Modifica'
      },
      actionButton: {
        text: 'Elimina',
        classes: 'bg-red-600 text-white ring-red-600 hover:bg-red-700 disabled:hover:bg-red-600'
      },
      endpoint: '/admin/utenti',
      method: 'DELETE',
      confirmMessage: 'Sei sicuro di voler eliminare questo utente?',
      confirmMessageMultiple: 'Sei sicuro di voler eliminare {count} utenti?',
      successMessage: 'Eliminati {count} utente/i con successo',
      errorMessage: 'Errore durante l\'eliminazione',
      disableClickableNames: false
    };

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
      successMessage: req.query.success ? decodeURIComponent(req.query.success as string) : undefined,
      errorMessage: req.query.error ? decodeURIComponent(req.query.error as string) : undefined,
      scripts: scriptManager.getScriptsForPage('table'),
      tableConfigJson: JSON.stringify(tableConfig),
      tableInitScript: scriptManager.getTableInitScript('users-table'),
      breadcrumbs: [
        { label: 'Admin', href: '/admin' },
        { label: 'Utenti', href: '/admin/utenti' }
      ],
      emptyState: {
        title: 'Nessun utente trovato',
        description: 'Non ci sono utenti registrati nel sistema.',
        buttonText: 'Aggiungi utente',
        buttonHref: '/admin/utenti/nuovo',
        iconName: 'cartella-plus',
        icon: uiIcons['cartella-plus'],
        buttonIconName: 'piu',
        buttonIcon: uiIcons['piu']
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

  // Prepara la configurazione per il nuovo utente
  const formConfig = userFormData.getFormData(userFormData, false);

  res.render('pages/users/new', {
    title: 'Nuovo Utente',
    layout: 'layouts/sections',
    mainMenu: mainMenuItems,
    sectionMenu,
    sectionIcons,
    currentPath,
    formConfig,
    scripts: scriptManager.getScriptsForPage('form'),
    breadcrumbs: [
      { label: 'Admin', href: '/admin' },
      { label: 'Utenti', href: '/admin/utenti' },
      { label: 'Nuovo Utente', href: '/admin/utenti/nuovo' }
    ]
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
      const formConfig = userFormData.getFormData(userFormData, false, null, req.body);
      
      return res.status(400).render('pages/users/new', {
        title: 'Nuovo Utente',
        layout: 'layouts/sections',
        mainMenu: mainMenuItems,
        sectionMenu: adminItems,
        sectionIcons,
        currentPath: '/admin/utenti/nuovo',
        formConfig,
        breadcrumbs: [
          { label: 'Admin', href: '/admin' },
          { label: 'Utenti', href: '/admin/utenti' },
          { label: 'Nuovo Utente', href: '/admin/utenti/nuovo' }
        ],
        error: 'Un utente con questa email esiste già'
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
    
    const formConfig = userFormData.getFormData(userFormData, false, null, req.body);
    
    res.status(500).render('pages/users/new', {
      title: 'Nuovo Utente',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu: adminItems,
      sectionIcons,
      currentPath: '/admin/utenti/nuovo',
      formConfig,
      breadcrumbs: [
        { label: 'Admin', href: '/admin' },
        { label: 'Utenti', href: '/admin/utenti' },
        { label: 'Nuovo Utente', href: '/admin/utenti/nuovo' }
      ],
      error: 'Si è verificato un errore durante la creazione dell\'utente'
    });
  }
});

router.get('/utenti/dettagli/:id', async (req, res) => {
  const currentPath = '/admin/utenti/dettagli';
  let sectionMenu = adminItems;
  
  try {
    const user = await prisma.user.findFirst({
      where: { 
        id: req.params.id,
        deletedAt: null // Esclude utenti cancellati
      }
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
      scripts: scriptManager.getScriptsForPage('dashboard'),
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

// Route per modifica massiva utenti - DEVE ESSERE PRIMA di /utenti/modifica/:id
router.get('/utenti/modifica-massa', async (req, res) => {
  const currentPath = '/admin/utenti/modifica-massa';
  let sectionMenu = adminItems;
  
  const userIds = req.query.ids ? (req.query.ids as string).split(',') : [];
  
  if (userIds.length === 0) {
    return res.redirect('/admin/utenti');
  }
  
  try {
    const selectedUsers = await prisma.user.findMany({
      where: { 
        id: { in: userIds },
        deletedAt: null
      },
      select: {
        id: true,
        givenName: true,
        familyName: true,
        email: true,
        role: true,
        auth: true
      }
    });

    if (selectedUsers.length === 0) {
      return res.redirect('/admin/utenti');
    }

    // Prepara la configurazione per la modifica massiva
    const formConfig = userFormData.getFormData(userFormData, false, null, null, true, selectedUsers);

    res.render('pages/users/editBulk', {
      title: 'Modifica Massiva Utenti',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionIcons,
      currentPath,
      selectedUsers,
      formConfig,
      scripts: scriptManager.getScriptsForPage('bulkEdit'),
      bulkEditConfigScript: scriptManager.getBulkEditConfigScript(formConfig),
      breadcrumbs: [
        { label: 'Admin', href: '/admin' },
        { label: 'Utenti', href: '/admin/utenti' },
        { label: 'Modifica Massiva', href: '#' }
      ]
    });
  } catch (error) {
    console.error('Errore nel recupero degli utenti per modifica massiva:', error);
    res.redirect('/admin/utenti');
  }
});

// Route POST per modifica massiva utenti - DEVE ESSERE PRIMA di /utenti/modifica/:id
router.post('/utenti/modifica-massa', async (req, res) => {
  const { itemIds, ruolo, auth } = req.body;
  
  let userIds: string[] = [];
  if (Array.isArray(itemIds)) {
    userIds = itemIds;
  } else if (typeof itemIds === 'string') {
    userIds = itemIds.split(',').filter(id => id.trim() !== '');
  }
  
  if (userIds.length === 0) {
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      return res.json({ success: false, message: 'Nessun utente selezionato per la modifica' });
    }
    return res.redirect('/admin/utenti?error=Nessun utente selezionato per la modifica');
  }
  
  try {
    const existingUsers = await prisma.user.findMany({
      where: { 
        id: { in: userIds },
        deletedAt: null
      }
    });

    if (existingUsers.length === 0) {
      if (req.xhr || req.headers.accept?.includes('application/json')) {
        return res.json({ success: false, message: 'Nessun utente valido trovato per la modifica' });
      }
      return res.redirect('/admin/utenti?error=Nessun utente valido trovato per la modifica');
    }

    // Prepara i dati per l'aggiornamento (solo i campi forniti)
    const updateData: any = {};
    
    if (ruolo && ruolo.trim() !== '') {
      updateData.role = ruolo;
      updateData.auth = ruolo;
    }
    
    if (auth && auth.trim() !== '') {
      updateData.auth = auth;
    }

    // Se non ci sono dati da aggiornare, restituisci errore
    if (Object.keys(updateData).length === 0) {
      if (req.xhr || req.headers.accept?.includes('application/json')) {
        return res.json({ success: false, message: 'Nessun campo valido fornito per l\'aggiornamento. Seleziona almeno un campo da modificare.' });
      }
      return res.redirect('/admin/utenti?error=Nessun campo valido fornito per l\'aggiornamento. Seleziona almeno un campo da modificare.');
    }

    await prisma.user.updateMany({
      where: { 
        id: { in: userIds }
      },
      data: updateData
    });

    const updatedCount = existingUsers.length;
    const skippedCount = userIds.length - existingUsers.length;
    
    let message = `Aggiornati ${updatedCount} utente${updatedCount === 1 ? '' : 'i'} con successo`;
    if (skippedCount > 0) {
      message += `. ${skippedCount} utente${skippedCount === 1 ? '' : 'i'} non trovato${skippedCount === 1 ? '' : 'i'} o già cancellato${skippedCount === 1 ? '' : 'i'}.`;
    }
    
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      return res.json({ success: true, message });
    }
    
    res.redirect(`/admin/utenti?success=${encodeURIComponent(message)}`);
    
  } catch (error) {
    console.error('Errore durante la modifica massiva:', error);
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      return res.json({ success: false, message: 'Errore interno del server durante la modifica massiva' });
    }
    res.redirect('/admin/utenti?error=Errore interno del server durante la modifica massiva');
  }
});

// Route per modifica singola utente - DEVE ESSERE DOPO le route specifiche
router.get('/utenti/modifica/:id', async (req, res) => {
  const currentPath = '/admin/utenti/modifica';
  let sectionMenu = adminItems;
  
  try {
    const user = await prisma.user.findFirst({
      where: { 
        id: req.params.id,
        deletedAt: null // Esclude utenti cancellati
      }
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

    // Prepara la configurazione per la modifica
    const formConfig = userFormData.getFormData(userFormData, true, user);

    res.render('pages/users/edit', {
      title: 'Modifica Utente',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionIcons,
      currentPath,
      user,
      formConfig,
      scripts: scriptManager.getScriptsForPage('form'),
      breadcrumbs: [
        { label: 'Admin', href: '/admin' },
        { label: 'Utenti', href: '/admin/utenti' },
        { label: user.givenName || 'Modifica Utente', href: `/admin/utenti/modifica/${user.id}` }
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
        const formConfig = userFormData.getFormData(userFormData, true, existingUser, req.body);
        
        return res.status(400).render('pages/users/edit', {
          title: 'Modifica Utente',
          layout: 'layouts/sections',
          mainMenu: mainMenuItems,
          sectionMenu: adminItems,
          sectionIcons,
          currentPath: '/admin/utenti/modifica',
          user: existingUser,
          formConfig,
          breadcrumbs: [
            { label: 'Admin', href: '/admin' },
            { label: 'Utenti', href: '/admin/utenti' },
            { label: existingUser.givenName || 'Modifica Utente', href: `/admin/utenti/modifica/${existingUser.id}` }
          ],
          error: 'Un altro utente con questa email esiste già'
        });
      }
    }

    // Prepara i dati per l'aggiornamento
    const updateData: any = {
      givenName: nome,
      familyName: cognome,
      email,
      role: ruolo,
      auth: ruolo
    };

    // Aggiungi la password solo se fornita
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
    
    const formConfig = userFormData.getFormData(userFormData, true, existingUser, req.body);
    
    res.status(500).render('pages/users/edit', {
      title: 'Modifica Utente',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu: adminItems,
      sectionIcons,
      currentPath: '/admin/utenti/modifica',
      user: existingUser,
      formConfig,
      breadcrumbs: [
        { label: 'Admin', href: '/admin' },
        { label: 'Utenti', href: '/admin/utenti' },
        { label: existingUser?.givenName || 'Modifica Utente', href: `/admin/utenti/modifica/${userId}` }
      ],
      error: 'Si è verificato un errore durante l\'aggiornamento dell\'utente'
    });
  }
});

// Route per soft delete di uno o più utenti
router.delete('/utenti', async (req, res) => {
  const { itemIds } = req.body;
  
  if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
    return res.status(400).json({ 
      success: false, 
      message: 'Nessun utente selezionato per la cancellazione' 
    });
  }
  
  try {
    // Verifica che tutti gli utenti esistano e non siano già cancellati
    const existingUsers = await prisma.user.findMany({
      where: { 
        id: { in: itemIds },
        deletedAt: null
      }
    });

    if (existingUsers.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Nessun utente valido trovato per la cancellazione' 
      });
    }

    // Esegui soft delete per tutti gli utenti validi
    const validUserIds = existingUsers.map(user => user.id);
    await prisma.user.updateMany({
      where: { 
        id: { in: validUserIds }
      },
      data: { 
        deletedAt: new Date() 
      }
    });

    const deletedCount = validUserIds.length;
    const skippedCount = itemIds.length - validUserIds.length;
    
    let message = `Eliminati ${deletedCount} utente${deletedCount === 1 ? '' : 'i'} con successo`;
    if (skippedCount > 0) {
      message += `. ${skippedCount} utente${skippedCount === 1 ? '' : 'i'} già cancellato${skippedCount === 1 ? '' : 'i'} o non trovato${skippedCount === 1 ? '' : 'i'}.`;
    }

    res.json({ 
      success: true, 
      message,
      deletedCount,
      skippedCount
    });
  } catch (error) {
    console.error('Errore nella cancellazione degli utenti:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Si è verificato un errore durante la cancellazione' 
    });
  }
});

// Route per visualizzare gli utenti cancellati
router.get('/utenti/cancellati', async (req, res) => {
  const currentPath = '/admin/utenti/cancellati';
  let sectionMenu = adminItems;
  
  try {
    const deletedUsers = await prisma.user.findMany({
      where: {
        deletedAt: {
          not: null
        }
      },
      select: {
        id: true,
        givenName: true,
        familyName: true,
        email: true,
        role: true,
        authProvider: true,
        deletedAt: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.render('pages/users/deleted', {
      title: 'Utenti Cancellati',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionIcons,
      currentPath,
      tableData: utentiTableData,
      users: deletedUsers,
      hasUsers: deletedUsers.length > 0,
      tableConfigJson: JSON.stringify({
        tableId: 'deleted-users-table',
        idField: 'id',
        labelField: 'givenName',
        detailUrl: '/admin/utenti/dettagli/:id',
        editUrl: '/admin/utenti/modifica/:id',
        editMultipleButton: null,
        actionButton: {
          text: 'Ripristina',
          classes: 'bg-green-600 text-white ring-green-600 hover:bg-green-700 disabled:hover:bg-green-600'
        },
        endpoint: '/admin/utenti/restore',
        method: 'POST',
        confirmMessage: 'Sei sicuro di voler ripristinare questo utente?',
        confirmMessageMultiple: 'Sei sicuro di voler ripristinare {count} utenti?',
        successMessage: 'Ripristinati {count} utente/i con successo',
        errorMessage: 'Errore durante il ripristino',
        disableClickableNames: true
      }),
      breadcrumbs: [
        { label: 'Admin', href: '/admin' },
        { label: 'Utenti', href: '/admin/utenti' },
        { label: 'Cancellati', href: '/admin/utenti/cancellati' }
      ],
      emptyState: {
        title: 'Nessun utente cancellato',
        description: 'Non ci sono utenti cancellati nel sistema.',
        buttonText: 'Torna agli utenti',
        buttonHref: '/admin/utenti',
        iconName: 'tabella',
        icon: uiIcons['tabella'],
        buttonIconName: 'freccia-sx',
        buttonIcon: uiIcons['freccia-sx']
      }
    });
  } catch (error) {
    console.error('Errore nel recupero degli utenti cancellati:', error);
    res.status(500).render('error', {
      title: 'Errore',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionIcons,
      currentPath,
      error: 'Si è verificato un errore nel recupero degli utenti cancellati'
    });
  }
});

// Route per ripristinare uno o più utenti cancellati
router.post('/utenti/restore', async (req, res) => {
  const { itemIds } = req.body;
  
  if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
    return res.status(400).json({ 
      success: false, 
      message: 'Nessun utente selezionato per il ripristino' 
    });
  }
  
  try {
    // Verifica che tutti gli utenti esistano ed siano cancellati
    const existingUsers = await prisma.user.findMany({
      where: { 
        id: { in: itemIds },
        deletedAt: {
          not: null
        }
      }
    });

    if (existingUsers.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Nessun utente cancellato trovato per il ripristino' 
      });
    }

    // Ripristina tutti gli utenti validi
    const validUserIds = existingUsers.map(user => user.id);
    await prisma.user.updateMany({
      where: { 
        id: { in: validUserIds }
      },
      data: { 
        deletedAt: null 
      }
    });

    const restoredCount = validUserIds.length;
    const skippedCount = itemIds.length - validUserIds.length;
    
    let message = `Ripristinati ${restoredCount} utente${restoredCount === 1 ? '' : 'i'} con successo`;
    if (skippedCount > 0) {
      message += `. ${skippedCount} utente${skippedCount === 1 ? '' : 'i'} non trovato${skippedCount === 1 ? '' : 'i'} o già ripristinato${skippedCount === 1 ? '' : 'i'}.`;
    }

    res.json({ 
      success: true, 
      message,
      restoredCount,
      skippedCount
    });
  } catch (error) {
    console.error('Errore nel ripristino degli utenti:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Si è verificato un errore durante il ripristino' 
    });
  }
});

export default router; 