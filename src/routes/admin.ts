import express, { Request, Response } from 'express';
import { mainMenuItems } from '../config/mainMenu';
import { adminItems } from '../config/sectionMenu';
import { sectionIcons } from '../config/sectionIcons';
import { uiIcons } from '../config/uiIcons';
import { prisma } from '../app';
import { utentiTableData } from '../config/sectionTableData';
import { isAdmin } from '../middlewares/auth';
import { checkMenuAccess, requireEnabledMenus } from '../middlewares/menuAccess';
import { userFormData } from '../config/sectionFormData';
import { scriptManager } from '../config/scriptManager';
import { actionNavConfigs } from '../config/actionNavConfig';
import { getDetailViewConfig } from '../config/detailViewConfig';
import { PasswordUtils } from '../utils/passwordUtils';

const router = express.Router();

// Middleware per verificare che almeno un menu sia abilitato
router.use(requireEnabledMenus);

// Middleware per verificare l'accesso al menu admin
router.use(checkMenuAccess('admin'));

// Tutte le route admin richiedono autenticazione e ruolo admin
router.use(isAdmin);

router.get('/', (_req, res) => {
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

router.get('/utenti', async (req: Request, res: Response): Promise<void> => {
  const currentPath = '/admin/utenti';
  let sectionMenu = adminItems;
  
  try {
    // Filtro per ruolo
    const roleFilter = req.query.role as string;
    
    // Costruisci la clausola WHERE
    const whereClause: any = {
      deletedAt: null // Esclude gli utenti cancellati
    };
    
    if (roleFilter && roleFilter.trim() !== '') {
      whereClause.role = roleFilter;
    }
    
    const users = await prisma.user.findMany({
      where: whereClause,
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

    // Configurazione actionNav per questa pagina
    const actionNavConfig = actionNavConfigs['users.index'];

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
      description: 'Gestione utenti del sistema',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionIcons,
      currentPath,
      tableData: utentiTableData,
      users,
      hasUsers: users.length > 0,
      actionNavConfig,
      currentRoleFilter: roleFilter,
      success: req.query.success ? [decodeURIComponent(req.query.success as string)] : undefined,
      error: req.query.error ? [decodeURIComponent(req.query.error as string)] : undefined,
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

router.get('/utenti/nuovo', (_req, res) => {
  const currentPath = '/admin/utenti/nuovo';
  let sectionMenu = adminItems;

  // Configurazione actionNav per questa pagina
  const actionNavConfig = actionNavConfigs['users.new'];

  // Prepara la configurazione per il nuovo utente
  const formConfig = userFormData.getFormData(userFormData, false);

  res.render('pages/users/new', {
    title: 'Nuovo Utente',
    description: 'Crea un nuovo utente nel sistema',
    layout: 'layouts/sections',
    mainMenu: mainMenuItems,
    sectionMenu,
    sectionIcons,
    currentPath,
    formConfig,
    actionNavConfig,
    scripts: scriptManager.getScriptsForPage('form'),
    breadcrumbs: [
      { label: 'Admin', href: '/admin' },
      { label: 'Utenti', href: '/admin/utenti' },
      { label: 'Nuovo Utente', href: '/admin/utenti/nuovo' }
    ]
  });
});

router.post('/utenti/nuovo', async (req: Request, res: Response): Promise<void> => {
  const { nome, cognome, email, password, ruolo } = req.body;
  
  try {
    // Validazione password
    const passwordValidation = PasswordUtils.validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
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
        error: passwordValidation.errors.join(', ')
      });
    }

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

    // Hasha la password
    const hashedPassword = await PasswordUtils.hashPassword(password);

    // Crea il nuovo utente
    const newUser = await prisma.user.create({
      data: {
        givenName: nome,
        familyName: cognome,
        email,
        password: hashedPassword,
        role: ruolo,
        authProvider: 'local',
        auth: ruolo
      }
    });

    // Reindirizza alla pagina dei dettagli dell'utente con messaggio di successo
    res.redirect(`/admin/utenti/dettagli/${newUser.id}?success=Utente creato con successo`);
      return;
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

router.get('/utenti/dettagli/:id', async (req: Request, res: Response): Promise<void> => {
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

    // Configurazione actionNav per questa pagina
    const actionNavConfig = { ...actionNavConfigs['users.view'] };
    // Sostituisci :id con l'ID effettivo dell'utente
    if (actionNavConfig.actions) {
      actionNavConfig.actions = actionNavConfig.actions.map(action => {
        if (action.type === 'link' && action.href?.includes(':id')) {
          return {
            ...action,
            href: action.href.replace(':id', user.id)
          };
        }
        return action;
      });
    }

    // Configurazione vista dettaglio
    const detailViewConfig = getDetailViewConfig('utenti');
    const item = {
      ...user,
      fullName: `${user.givenName || ''} ${user.familyName || ''}`.trim() || 'Non specificato'
    };

    res.render('pages/users/view', {
      title: `Utente: ${user.givenName || 'Sconosciuto'}`,
      description: `Dettagli dell'utente ${user.givenName || 'sconosciuto'}`,
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionIcons,
      currentPath,
      detailViewConfig,
      item,
      actionNavConfig,
      scripts: scriptManager.getScriptsForPage('dashboard'),
      breadcrumbs: [
        { label: 'Admin', href: '/admin' },
        { label: 'Utenti', href: '/admin/utenti' },
        { label: `${user.givenName || ''} ${user.familyName || ''}`.trim() || 'Dettagli Utente', href: `/admin/utenti/dettagli/${user.id}` }
      ],
      success: req.query.success ? [req.query.success as string] : undefined
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
router.get('/utenti/modifica-massa', async (req: Request, res: Response): Promise<void> => {
  const currentPath = '/admin/utenti/modifica-massa';
  let sectionMenu = adminItems;
  
  const userIds = req.query.ids ? (req.query.ids as string).split(',') : [];
  
  if (userIds.length === 0) {
    res.redirect('/admin/utenti');
      return;
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
      res.redirect('/admin/utenti');
      return;
    }

    // Configurazione actionNav per questa pagina
    const actionNavConfig = actionNavConfigs['users.editBulk'];

    // Prepara la configurazione per la modifica massiva
    const formConfig = userFormData.getFormData(userFormData, false, null, null, true, selectedUsers);

    res.render('pages/users/editBulk', {
      title: 'Modifica Massiva Utenti',
      description: `Modifica ${selectedUsers.length} utenti selezionati`,
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionIcons,
      currentPath,
      selectedUsers,
      formConfig,
      actionNavConfig,
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
      return;
  }
});

// Route POST per modifica massiva utenti - DEVE ESSERE PRIMA di /utenti/modifica/:id
router.post('/utenti/modifica-massa', async (req: Request, res: Response): Promise<void> => {
  const { itemIds, ruolo, auth } = req.body;
  
  let userIds: string[] = [];
  if (Array.isArray(itemIds)) {
    userIds = itemIds;
  } else if (typeof itemIds === 'string') {
    userIds = itemIds.split(',').filter(id => id.trim() !== '');
  }
  
  if (userIds.length === 0) {
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      res.json({ success: false, message: 'Nessun utente selezionato per la modifica' });
      return;
      return;
    }
    res.redirect('/admin/utenti?error=Nessun utente selezionato per la modifica');
      return;
    return;
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
        res.json({ success: false, message: 'Nessun utente valido trovato per la modifica' });
      return;
        return;
      }
      res.redirect('/admin/utenti?error=Nessun utente valido trovato per la modifica');
      return;
      return;
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
        res.json({ success: false, message: 'Nessun campo valido fornito per l\'aggiornamento. Seleziona almeno un campo da modificare.' });
      return;
      }
      res.redirect('/admin/utenti?error=Nessun campo valido fornito per l\'aggiornamento. Seleziona almeno un campo da modificare.');
      return;
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
      res.json({ success: true, message });
      return;
    }
    
    res.redirect(`/admin/utenti?success=${encodeURIComponent(message)}`);
    
  } catch (error) {
    console.error('Errore durante la modifica massiva:', error);
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      res.json({ success: false, message: 'Errore interno del server durante la modifica massiva' });
      return;
    }
    res.redirect('/admin/utenti?error=Errore interno del server durante la modifica massiva');
      return;
  }
});

// Route AJAX per modifica massiva utenti
router.post('/utenti/modifica-massa/ajax', async (req: Request, res: Response): Promise<void> => {
  const { itemIds, ruolo, auth } = req.body;
  
  let userIds: string[] = [];
  if (Array.isArray(itemIds)) {
    userIds = itemIds;
  } else if (typeof itemIds === 'string') {
    userIds = itemIds.split(',').filter(id => id.trim() !== '');
  }
  
  if (userIds.length === 0) {
    res.json({ success: false, message: 'Nessun utente selezionato per la modifica' });
      return;
  }
  
  try {
    const existingUsers = await prisma.user.findMany({
      where: { 
        id: { in: userIds },
        deletedAt: null
      }
    });

    if (existingUsers.length === 0) {
      res.json({ success: false, message: 'Nessun utente valido trovato per la modifica' });
      return;
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
      res.json({ success: false, message: 'Nessun campo valido fornito per l\'aggiornamento. Seleziona almeno un campo da modificare.' });
      return;
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
    
    res.json({ success: true, message });
      return;
    
  } catch (error) {
    console.error('Errore durante la modifica massiva:', error);
    res.json({ success: false, message: 'Errore interno del server durante la modifica massiva' });
      return;
  }
});

// Route AJAX per creazione nuovo utente
router.post('/utenti/nuovo/ajax', async (req: Request, res: Response): Promise<void> => {
  const { nome, cognome, email, password, ruolo } = req.body;
  
  try {
    // Validazione password
    const passwordValidation = PasswordUtils.validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      res.json({
        success: false,
        message: passwordValidation.errors.join(', ')
      });
    }

    // Verifica se esiste già un utente con la stessa email
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      res.json({
        success: false,
        message: 'Un utente con questa email esiste già'
      });
    }

    // Hasha la password
    const hashedPassword = await PasswordUtils.hashPassword(password);

    // Crea il nuovo utente
    const newUser = await prisma.user.create({
      data: {
        givenName: nome,
        familyName: cognome,
        email,
        password: hashedPassword,
        role: ruolo,
        authProvider: 'local',
        auth: ruolo
      }
    });

    res.json({
      success: true,
      message: 'Utente creato con successo',
      data: { id: newUser.id },
      redirectUrl: `/admin/utenti/dettagli/${newUser.id}`
    });
  } catch (error) {
    console.error('Errore nella creazione dell\'utente:', error);
    res.json({
      success: false,
      message: 'Si è verificato un errore durante la creazione dell\'utente'
    });
  }
});

// Route per modifica singola utente - DEVE ESSERE DOPO le route specifiche
router.get('/utenti/modifica/:id', async (req: Request, res: Response): Promise<void> => {
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

    // Configurazione actionNav per questa pagina
    const actionNavConfig = { ...actionNavConfigs['users.edit'] };
    // Sostituisci :id con l'ID effettivo dell'utente
    if (actionNavConfig.actions) {
      actionNavConfig.actions = actionNavConfig.actions.map(action => {
        if (action.type === 'link' && action.href?.includes(':id')) {
          return {
            ...action,
            href: action.href.replace(':id', user.id)
          };
        }
        return action;
      });
    }

    // Prepara la configurazione per la modifica
    const formConfig = userFormData.getFormData(userFormData, true, user);

    res.render('pages/users/edit', {
      title: `Modifica Utente: ${user.givenName || 'Sconosciuto'}`,
      description: `Modifica i dettagli dell'utente ${user.givenName || 'sconosciuto'}`,
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionIcons,
      currentPath,
      user,
      formConfig,
      actionNavConfig,
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

router.post('/utenti/modifica/:id', async (req: Request, res: Response): Promise<void> => {
  const { nome, cognome, email, password, ruolo } = req.body;
  const userId = req.params.id;
  
  // Dichiaro existingUser fuori dal try per renderlo accessibile nel catch
  let existingUser: any = null;
  
  try {
    // Verifica se l'utente esiste
    existingUser = await prisma.user.findUnique({
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
      // Validazione password
      const passwordValidation = PasswordUtils.validatePasswordStrength(password);
      if (!passwordValidation.isValid) {
        const formConfig = userFormData.getFormData(userFormData, true, existingUser, req.body);
        return res.status(400).render('pages/users/edit', {
          title: 'Modifica Utente',
          layout: 'layouts/sections',
          mainMenu: mainMenuItems,
          sectionMenu: adminItems,
          sectionIcons,
          currentPath: `/admin/utenti/modifica/${userId}`,
          formConfig,
          breadcrumbs: [
            { label: 'Admin', href: '/admin' },
            { label: 'Utenti', href: '/admin/utenti' },
            { label: 'Modifica Utente', href: `/admin/utenti/modifica/${userId}` }
          ],
          error: passwordValidation.errors.join(', ')
        });
      }
      
      updateData.password = await PasswordUtils.hashPassword(password);
    }

    // Aggiorna l'utente
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData
    });

    // Reindirizza alla pagina dei dettagli dell'utente con messaggio di successo
    res.redirect(`/admin/utenti/dettagli/${updatedUser.id}?success=Utente aggiornato con successo`);
      return;
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

// Route AJAX per modifica utente
router.post('/utenti/modifica/:id/ajax', async (req: Request, res: Response): Promise<void> => {
  const { nome, cognome, email, password, ruolo } = req.body;
  const userId = req.params.id;
  
  try {
    // Verifica se l'utente esiste
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!existingUser) {
      res.json({
        success: false,
        message: 'Utente non trovato'
      });
      return;
    }

    // Verifica se esiste già un altro utente con la stessa email
    if (email !== existingUser.email) {
      const userWithSameEmail = await prisma.user.findUnique({
        where: { email }
      });

      if (userWithSameEmail) {
        res.json({
          success: false,
          message: 'Un altro utente con questa email esiste già'
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
      // Validazione password
      const passwordValidation = PasswordUtils.validatePasswordStrength(password);
      if (!passwordValidation.isValid) {
        res.json({
          success: false,
          message: passwordValidation.errors.join(', ')
        });
      }
      
      updateData.password = await PasswordUtils.hashPassword(password);
    }

    // Aggiorna l'utente
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData
    });

    res.json({
      success: true,
      message: 'Utente aggiornato con successo',
      redirectUrl: `/admin/utenti/dettagli/${updatedUser.id}`
    });
  } catch (error) {
    console.error('Errore nell\'aggiornamento dell\'utente:', error);
    res.json({
      success: false,
      message: 'Si è verificato un errore durante l\'aggiornamento dell\'utente'
    });
  }
});

// Route per soft delete di uno o più utenti
router.delete('/utenti', async (req: Request, res: Response): Promise<void> => {
  const { itemIds } = req.body;
  
  if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
    res.status(400).json({ 
      success: false, 
      message: 'Nessun utente selezionato per la cancellazione' 
    });
    return;
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
      res.status(404).json({ 
        success: false, 
        message: 'Nessun utente valido trovato per la cancellazione' 
      });
      return;
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
router.get('/utenti/cancellati', async (_req: Request, res: Response): Promise<void> => {
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

    const isSectionEmpty = deletedUsers.length === 0;
    const hasItems = deletedUsers.length > 0;

    res.render('pages/users/deleted', {
      title: 'Utenti Cancellati',
      description: 'Visualizza e gestisci gli utenti cancellati del sistema',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionIcons,
      uiIcons,
      currentPath,
      tableData: utentiTableData,
      deletedUsers,
      hasItems,
      isSectionEmpty,
      scripts: scriptManager.getScriptsForPage('table'),
      tableConfigJson: JSON.stringify({
        tableId: 'deleted-users-table',
        idField: 'id',
        labelField: 'givenName',
        editMultipleButton: null,
        bulkEditUrl: null,
        editUrl: null,
        actionButtons: [
          {
            text: 'Ripristina',
            classes: 'bg-green-600 text-white ring-green-600 hover:bg-green-700 disabled:hover:bg-green-600',
            endpoint: '/admin/utenti/restore',
            method: 'POST',
            confirmMessage: 'Sei sicuro di voler ripristinare questo utente?',
            confirmMessageMultiple: 'Sei sicuro di voler ripristinare {count} utenti?',
            successMessage: 'Ripristinati {count} utente/i con successo',
            errorMessage: 'Errore durante il ripristino'
          },
          {
            text: 'Elimina definitivamente',
            classes: 'bg-red-600 text-white ring-red-600 hover:bg-red-700 disabled:hover:bg-red-600',
            endpoint: '/admin/utenti/permanent-delete',
            method: 'DELETE',
            confirmMessage: 'ATTENZIONE: Questa azione è irreversibile! Sei sicuro di voler eliminare definitivamente questo utente?',
            confirmMessageMultiple: 'ATTENZIONE: Questa azione è irreversibile! Sei sicuro di voler eliminare definitivamente {count} utenti?',
            successMessage: 'Eliminati definitivamente {count} utente/i',
            errorMessage: 'Errore durante l\'eliminazione definitiva'
          }
        ],
        disableClickableNames: true,
        tableData: utentiTableData
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
    
    res.render('pages/users/deleted', {
      title: 'Errore',
      description: 'Si è verificato un errore nel recupero degli utenti cancellati',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionIcons,
      uiIcons,
      currentPath,
      deletedUsers: [],
      hasItems: false,
      isSectionEmpty: true,
      tableData: utentiTableData,
      tableConfigJson: JSON.stringify({
        tableId: 'deleted-users-table',
        idField: 'id',
        labelField: 'givenName',
        editMultipleButton: null,
        bulkEditUrl: null,
        editUrl: null,
        actionButtons: [
          {
            text: 'Ripristina',
            classes: 'bg-green-600 text-white ring-green-600 hover:bg-green-700 disabled:hover:bg-green-600',
            endpoint: '/admin/utenti/restore',
            method: 'POST',
            confirmMessage: 'Sei sicuro di voler ripristinare questo utente?',
            confirmMessageMultiple: 'Sei sicuro di voler ripristinare {count} utenti?',
            successMessage: 'Ripristinati {count} utente/i con successo',
            errorMessage: 'Errore durante il ripristino'
          },
          {
            text: 'Elimina definitivamente',
            classes: 'bg-red-600 text-white ring-red-600 hover:bg-red-700 disabled:hover:bg-red-600',
            endpoint: '/admin/utenti/permanent-delete',
            method: 'DELETE',
            confirmMessage: 'ATTENZIONE: Questa azione è irreversibile! Sei sicuro di voler eliminare definitivamente questo utente?',
            confirmMessageMultiple: 'ATTENZIONE: Questa azione è irreversibile! Sei sicuro di voler eliminare definitivamente {count} utenti?',
            successMessage: 'Eliminati definitivamente {count} utente/i',
            errorMessage: 'Errore durante l\'eliminazione definitiva'
          }
        ],
        disableClickableNames: true,
        tableData: utentiTableData
      }),
      error: 'Si è verificato un errore nel recupero degli utenti cancellati',
      breadcrumbs: [
        { label: 'Admin', href: '/admin' },
        { label: 'Utenti', href: '/admin/utenti' },
        { label: 'Cancellati', href: '/admin/utenti/cancellati' }
      ],
      emptyState: {
        title: 'Errore',
        description: 'Si è verificato un errore nel recupero degli utenti cancellati',
        buttonText: 'Riprova',
        buttonHref: '/admin/utenti/cancellati',
        iconName: 'tabella',
        icon: uiIcons['tabella'],
        buttonIconName: 'freccia-sx',
        buttonIcon: uiIcons['freccia-sx']
      }
    });
  }
});

// Route per ripristinare uno o più utenti cancellati
router.post('/utenti/restore', async (req: Request, res: Response): Promise<void> => {
  const { itemIds } = req.body;
  
  if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
    res.status(400).json({ 
      success: false, 
      message: 'Nessun utente selezionato per il ripristino' 
    });
    return;
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
      res.status(404).json({ 
        success: false, 
        message: 'Nessun utente cancellato trovato per il ripristino' 
      });
      return;
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

// Route per eliminazione fisica definitiva di uno o più utenti cancellati
router.delete('/utenti/permanent-delete', async (req: Request, res: Response): Promise<void> => {
  const { itemIds } = req.body;
  
  if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
    res.status(400).json({ 
      success: false, 
      message: 'Dati mancanti per l\'eliminazione definitiva' 
    });
    return;
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
      res.status(404).json({ 
        success: false, 
        message: 'Nessun utente valido trovato per l\'eliminazione definitiva' 
      });
      return;
    }

    // Elimina fisicamente gli utenti
    await prisma.user.deleteMany({
      where: { 
        id: { in: itemIds }
      }
    });

    const deletedCount = existingUsers.length;
    const skippedCount = itemIds.length - existingUsers.length;
    
    let message = `Eliminati definitivamente ${deletedCount} utente${deletedCount === 1 ? '' : 'i'}`;
    if (skippedCount > 0) {
      message += `. ${skippedCount} utente${skippedCount === 1 ? '' : 'i'} non trovato${skippedCount === 1 ? '' : 'i'} o non cancellato${skippedCount === 1 ? '' : 'i'}.`;
    }

    res.json({ 
      success: true, 
      message,
      deletedCount,
      skippedCount
    });
  } catch (error) {
    console.error('Errore nell\'eliminazione definitiva degli utenti:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Si è verificato un errore durante l\'eliminazione definitiva' 
    });
  }
});

export default router; 