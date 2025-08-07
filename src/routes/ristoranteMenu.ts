import express from 'express';
import { PrismaClient } from '@prisma/client';
import { mainMenuItems } from '../config/mainMenu';
import { ristoranteMenuItems } from '../config/sectionMenu';
import { ristoranteMenuImpostazioniSubItems } from '../config/subSectionMenu';
import { sectionIcons } from '../config/sectionIcons';
import { uiIcons } from '../config/uiIcons';
import { elementiCancellatiTableData } from '../config/sectionTableData';
import { isAuthenticated } from '../middlewares/auth';
import { 
  allergeniConfig, 
  categoriaMenuFissoConfig, 
  categoriaPiattiConfig,
  generatePageTitle
} from '../config/subSectionConfig';
import { 
  allergeneFormData, 
  categoriaMenuFissoFormData, 
  categoriaPiattiFormData 
} from '../config/subSectionFormData';
import { createSubSectionActionNav } from '../config/actionNavConfig';

const prisma = new PrismaClient();

const router = express.Router();

// Middleware per tutte le route del ristorante menu
router.use(isAuthenticated);

// === ROUTE PRINCIPALI ===
router.get('/', (req, res) => {
  const currentPath = '/ristorante-menu';
  let sectionMenu = ristoranteMenuItems;
  
  res.render('pages/ristorante-menu/index', {
    title: 'Menu Ristorante',
    description: 'Gestisci il menu del ristorante',
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
    description: 'Gestisci i menu fissi del ristorante',
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
    description: 'Gestisci i piatti del ristorante',
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
    description: 'Gestisci i servizi del ristorante',
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
  let sectionTabs = ristoranteMenuImpostazioniSubItems;
  
  res.render('pages/ristorante-menu/impostazioni', {
    title: 'Impostazioni Menu',
    description: 'Gestisci le configurazioni del menu ristorante',
    layout: 'layouts/sections',
    mainMenu: mainMenuItems,
    sectionMenu,
    sectionTabs,
    sectionIcons,
    currentPath,
    isInternalPage: false,
    breadcrumbs: [
      { label: 'Menu Ristorante', href: '/ristorante-menu' },
      { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' }
    ]
  });
});

// === SOTTOSEZIONI IMPOSTAZIONI ===
router.get('/impostazioni/categoria-menu-fisso', async (req, res) => {
  try {
    const currentPath = '/ristorante-menu/impostazioni/categoria-menu-fisso';
    let sectionMenu = ristoranteMenuItems;
    let sectionTabs = ristoranteMenuImpostazioniSubItems;
    
    // Recuperare le categorie menu fisso dal database (escludendo quelle cancellate)
    const categorieMenuFisso = await prisma.categoriaMenuFisso.findMany({
      where: {
        deletedAt: null
      },
      orderBy: {
        nome: 'asc'
      }
    });
    
    const config = { ...categoriaMenuFissoConfig };
    config.hasItems = categorieMenuFisso.length > 0;
    config.items = categorieMenuFisso;
    
    // Gestire messaggi di successo/errore
    const successMessage = req.query.success ? decodeURIComponent(req.query.success as string) : undefined;
    const errorMessage = req.query.error ? decodeURIComponent(req.query.error as string) : undefined;
    
    // Configurazione actionNav per questa sottosezione
    const actionNavConfig = createSubSectionActionNav('categoria-menu-fisso', 'index');
    
    res.render('pages/ristorante-menu/impostazioni/subSection', {
      title: 'Categoria Menu Fisso',
      description: 'Gestisci le categorie per i menu fissi del ristorante',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionTabs,
      sectionIcons,
      currentPath,
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
        { label: 'Categoria Menu Fisso', href: '/ristorante-menu/impostazioni/categoria-menu-fisso' }
      ],
      successMessage,
      errorMessage,
      tableConfigJson: JSON.stringify(config.tableConfig),
      actionNavConfig,
      isInternalPage: false,
      ...config
    });
  } catch (error) {
    console.error('Errore nel recupero delle categorie menu fisso:', error);
    res.status(500).send('Errore interno del server');
  }
});

router.get('/impostazioni/categoria-piatti', async (req, res) => {
  try {
    const currentPath = '/ristorante-menu/impostazioni/categoria-piatti';
    let sectionMenu = ristoranteMenuItems;
    let sectionTabs = ristoranteMenuImpostazioniSubItems;
    
    // Recuperare le categorie piatti dal database (escludendo quelle cancellate)
    const categoriePiatti = await prisma.categoriaPiatti.findMany({
      where: {
        deletedAt: null
      },
      orderBy: {
        nome: 'asc'
      }
    });
    
    const config = { ...categoriaPiattiConfig };
    config.hasItems = categoriePiatti.length > 0;
    config.items = categoriePiatti;
    
    // Gestire messaggi di successo/errore
    const successMessage = req.query.success ? decodeURIComponent(req.query.success as string) : undefined;
    const errorMessage = req.query.error ? decodeURIComponent(req.query.error as string) : undefined;
    
    // Configurazione actionNav per questa sottosezione
    const actionNavConfig = createSubSectionActionNav('categoria-piatti', 'index');
    
    res.render('pages/ristorante-menu/impostazioni/subSection', {
      title: 'Categoria Piatti',
      description: 'Gestisci le categorie per i piatti del ristorante',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionTabs,
      sectionIcons,
      currentPath,
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
        { label: 'Categoria Piatti', href: '/ristorante-menu/impostazioni/categoria-piatti' }
      ],
      successMessage,
      errorMessage,
      tableConfigJson: JSON.stringify(config.tableConfig),
      actionNavConfig,
      isInternalPage: false,
      ...config
    });
  } catch (error) {
    console.error('Errore nel recupero delle categorie piatti:', error);
    res.status(500).send('Errore interno del server');
  }
});

router.get('/impostazioni/allergeni', async (req, res) => {
  try {
    const currentPath = '/ristorante-menu/impostazioni/allergeni';
    let sectionMenu = ristoranteMenuItems;
    let sectionTabs = ristoranteMenuImpostazioniSubItems;
    
    // Recuperare gli allergeni dal database (escludendo quelli cancellati)
    const allergeni = await prisma.allergene.findMany({
      where: {
        deletedAt: null
      },
      orderBy: {
        nome: 'asc'
      }
    });
    
    const config = { ...allergeniConfig };
    config.hasItems = allergeni.length > 0;
    config.items = allergeni;
    
    // Gestire messaggi di successo/errore
    const successMessage = req.query.success ? decodeURIComponent(req.query.success as string) : undefined;
    const errorMessage = req.query.error ? decodeURIComponent(req.query.error as string) : undefined;
    
    // Configurazione actionNav per questa sottosezione
    const actionNavConfig = createSubSectionActionNav('allergeni', 'index');
    
    res.render('pages/ristorante-menu/impostazioni/subSection', {
      title: 'Allergeni',
      description: 'Gestisci gli allergeni per i piatti del ristorante',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionTabs,
      sectionIcons,
      currentPath,
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
        { label: 'Allergeni', href: '/ristorante-menu/impostazioni/allergeni' }
      ],
      successMessage,
      errorMessage,
      tableConfigJson: JSON.stringify(config.tableConfig),
      actionNavConfig, 
      isInternalPage: false,
      ...config
    });
  } catch (error) {
    console.error('Errore nel recupero degli allergeni:', error);
    res.status(500).send('Errore interno del server');
  }
});

// === ROUTE CRUD ALLERGENI ===
router.get('/impostazioni/allergeni/nuovo', (req, res) => {
  const currentPath = '/ristorante-menu/impostazioni/allergeni/nuovo';
  let sectionMenu = ristoranteMenuItems;
  let sectionTabs = ristoranteMenuImpostazioniSubItems;

  const formConfig = allergeneFormData.getFormData ? allergeneFormData.getFormData(allergeneFormData, false) : allergeneFormData;
  
  // Configurazione actionNav per questa pagina
  const actionNavConfig = createSubSectionActionNav('allergeni', 'new');

  res.render('pages/ristorante-menu/impostazioni/new', {
    title: 'Nuovo Allergene',
    description: 'Crea un nuovo allergene per i piatti del ristorante',
    layout: 'layouts/sections',
    mainMenu: mainMenuItems,
    sectionMenu,
    sectionTabs,
    sectionIcons,
    currentPath,
    formConfig,
    itemType: 'Allergene',
    backUrl: '/ristorante-menu/impostazioni/allergeni',
    actionNavConfig, // Passa la configurazione actionNav
    breadcrumbs: [
      { label: 'Menu Ristorante', href: '/ristorante-menu' },
      { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
      { label: 'Allergeni', href: '/ristorante-menu/impostazioni/allergeni' },
      { label: 'Nuovo Allergene', href: '/ristorante-menu/impostazioni/allergeni/nuovo' }
    ],
    isInternalPage: true // Aggiungi questa proprietà
  });
});

router.post('/impostazioni/allergeni/nuovo', async (req, res) => {
  const { nome, descrizione } = req.body;
  
  try {
    // Verifica se esiste già un allergene con lo stesso nome
    const existingAllergene = await prisma.allergene.findUnique({
      where: { nome }
    });

    if (existingAllergene) {
      const formConfig = allergeneFormData.getFormData ? allergeneFormData.getFormData(allergeneFormData, false, null, req.body) : allergeneFormData;
      
      // Configurazione actionNav per questa pagina
      const actionNavConfig = createSubSectionActionNav('allergeni', 'new');
      
      return res.status(400).render('pages/ristorante-menu/impostazioni/new', {
        title: 'Nuovo Allergene',
        description: 'Crea un nuovo allergene per i piatti del ristorante',
        layout: 'layouts/sections',
        mainMenu: mainMenuItems,
        sectionMenu: ristoranteMenuItems,
        sectionTabs: ristoranteMenuImpostazioniSubItems,
        sectionIcons,
        currentPath: '/ristorante-menu/impostazioni/allergeni/nuovo',
        formConfig,
        itemType: 'Allergene',
        backUrl: '/ristorante-menu/impostazioni/allergeni',
        actionNavConfig, // Passa la configurazione actionNav
        breadcrumbs: [
          { label: 'Menu Ristorante', href: '/ristorante-menu' },
          { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
          { label: 'Allergeni', href: '/ristorante-menu/impostazioni/allergeni' },
          { label: 'Nuovo Allergene', href: '/ristorante-menu/impostazioni/allergeni/nuovo' }
        ],
        error: 'Un allergene con questo nome esiste già'
      });
    }

    const allergene = await prisma.allergene.create({
      data: {
        nome,
        descrizione: descrizione || null
      }
    });

    res.redirect(`/ristorante-menu/impostazioni/allergeni/dettagli/${allergene.id}?success=Allergene creato con successo`);
  } catch (error) {
    console.error('Errore nella creazione dell\'allergene:', error);
    
    const formConfig = allergeneFormData.getFormData ? allergeneFormData.getFormData(allergeneFormData, false, null, req.body) : allergeneFormData;
    
    // Configurazione actionNav per questa pagina
    const actionNavConfig = createSubSectionActionNav('allergeni', 'new');
    
    res.status(500).render('pages/ristorante-menu/impostazioni/new', {
      title: 'Nuovo Allergene',
      description: 'Crea un nuovo allergene per i piatti del ristorante',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu: ristoranteMenuItems,
      sectionTabs: ristoranteMenuImpostazioniSubItems,
      sectionIcons,
      currentPath: '/ristorante-menu/impostazioni/allergeni/nuovo',
      formConfig,
      itemType: 'Allergene',
      backUrl: '/ristorante-menu/impostazioni/allergeni',
      actionNavConfig,
      isInternalPage: true,
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
        { label: 'Allergeni', href: '/ristorante-menu/impostazioni/allergeni' },
        { label: 'Nuovo Allergene', href: '/ristorante-menu/impostazioni/allergeni/nuovo' }
      ],
      error: 'Si è verificato un errore durante la creazione dell\'allergene'
    });
  }
});

// Route per visualizzare allergene 
router.get('/impostazioni/allergeni/dettagli/:id', async (req, res) => {
  try {
    const currentPath = '/ristorante-menu/impostazioni/allergeni/dettagli/' + req.params.id;
    let sectionMenu = ristoranteMenuItems;
    let sectionTabs = ristoranteMenuImpostazioniSubItems;
    
    const allergene = await prisma.allergene.findFirst({
      where: { 
        id: req.params.id,
        deletedAt: null
      }
    });

    if (!allergene) {
      return res.status(404).send('Allergene non trovato');
    }

    const actionNavConfig = createSubSectionActionNav('allergeni', 'view', allergene.id);
    const customTitle = generatePageTitle(allergeniConfig, 'view', allergene);

    res.render('pages/ristorante-menu/impostazioni/view', {
      title: 'Dettagli Allergene',
      customTitle,
      description: 'Informazioni dettagliate dell\'allergene',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionTabs,
      sectionIcons,
      currentPath,
      item: allergene,
      itemType: 'Allergene',
      backUrl: '/ristorante-menu/impostazioni/allergeni',
      actionNavConfig,
      isInternalPage: true,
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
        { label: 'Allergeni', href: '/ristorante-menu/impostazioni/allergeni' },
        { label: allergene.nome, href: `/ristorante-menu/impostazioni/allergeni/dettagli/${allergene.id}` }
      ]
    });
  } catch (error) {
    console.error('Errore nel recupero dell\'allergene:', error);
    res.status(500).send('Errore interno del server');
  }
});

router.get('/impostazioni/allergeni/modifica/:id', async (req, res) => {
  const currentPath = '/ristorante-menu/impostazioni/allergeni/modifica';
  let sectionMenu = ristoranteMenuItems;
  let sectionTabs = ristoranteMenuImpostazioniSubItems;
  
  try {
    const allergene = await prisma.allergene.findFirst({
      where: { 
        id: req.params.id,
        deletedAt: null
      }
    });

    if (!allergene) {
      const actionNavConfig = createSubSectionActionNav('allergeni', 'edit');
      return res.status(404).render('error', {
        title: 'Allergene non trovato',
        layout: 'layouts/sections',
        mainMenu: mainMenuItems,
        sectionMenu,
        sectionTabs,
        sectionIcons,
        currentPath,
        actionNavConfig,
        isInternalPage: true,
        breadcrumbs: [
          { label: 'Menu Ristorante', href: '/ristorante-menu' },
          { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
          { label: 'Allergeni', href: '/ristorante-menu/impostazioni/allergeni' },
          { label: 'Allergene non trovato', href: `/ristorante-menu/impostazioni/allergeni/modifica/${req.params.id}` }
        ],
        error: 'L\'allergene richiesto non esiste'
      });
    }

    const formConfig = allergeneFormData.getFormData ? allergeneFormData.getFormData(allergeneFormData, true, allergene) : allergeneFormData;
    const actionNavConfig = createSubSectionActionNav('allergeni', 'edit');
    const customTitle = generatePageTitle(allergeniConfig, 'edit', allergene);

    res.render('pages/ristorante-menu/impostazioni/edit', {
      title: 'Modifica Allergene',
      customTitle,
      description: 'Modifica i dettagli dell\'allergene',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionTabs,
      sectionIcons,
      currentPath,
      item: allergene,
      formConfig,
      itemType: 'Allergene',
      detailUrl: `/ristorante-menu/impostazioni/allergeni/dettagli/${allergene.id}`,
      actionNavConfig,
      isInternalPage: true,
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
        { label: 'Allergeni', href: '/ristorante-menu/impostazioni/allergeni' },
        { label: allergene.nome, href: `/ristorante-menu/impostazioni/allergeni/modifica/${allergene.id}` }
      ]
    });
  } catch (error) {
    console.error('Errore nel recupero dell\'allergene per modifica:', error);
    const actionNavConfig = createSubSectionActionNav('allergeni', 'edit');
    res.status(500).render('error', {
      title: 'Errore',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionTabs,
      sectionIcons,
      currentPath,
      actionNavConfig,
      isInternalPage: true,
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
        { label: 'Allergeni', href: '/ristorante-menu/impostazioni/allergeni' },
        { label: 'Errore', href: `/ristorante-menu/impostazioni/allergeni/modifica/${req.params.id}` }
      ],
      error: 'Si è verificato un errore nel recupero dell\'allergene',
    });
  }
});

router.post('/impostazioni/allergeni/modifica/:id', async (req, res) => {
  const { nome, descrizione } = req.body;
  const allergeneId = req.params.id;
  
  try {
    const existingAllergene = await prisma.allergene.findUnique({
      where: { id: allergeneId }
    });

    if (!existingAllergene) {
      const actionNavConfig = createSubSectionActionNav('allergeni', 'edit');
      return res.status(404).render('error', {
        title: 'Allergene non trovato',
        layout: 'layouts/sections',
        mainMenu: mainMenuItems,
        sectionMenu: ristoranteMenuItems,
        sectionTabs: ristoranteMenuImpostazioniSubItems,
        sectionIcons,
        currentPath: '/ristorante-menu/impostazioni/allergeni/modifica',
        actionNavConfig,
        isInternalPage: true,
        breadcrumbs: [
          { label: 'Menu Ristorante', href: '/ristorante-menu' },
          { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
          { label: 'Allergeni', href: '/ristorante-menu/impostazioni/allergeni' },
          { label: 'Allergene non trovato', href: `/ristorante-menu/impostazioni/allergeni/modifica/${allergeneId}` }
        ],
        error: 'L\'allergene richiesto non esiste'
      });
    }

    if (nome !== existingAllergene.nome) {
      const allergeneWithSameName = await prisma.allergene.findUnique({
        where: { nome }
      });

      if (allergeneWithSameName) {
        const formConfig = allergeneFormData.getFormData ? allergeneFormData.getFormData(allergeneFormData, true, existingAllergene, req.body) : allergeneFormData;
        const actionNavConfig = createSubSectionActionNav('allergeni', 'edit');
        
        return res.status(400).render('pages/ristorante-menu/impostazioni/edit', {
          title: 'Modifica Allergene',
          description: 'Modifica i dettagli dell\'allergene',
          layout: 'layouts/sections',
          mainMenu: mainMenuItems,
          sectionMenu: ristoranteMenuItems,
          sectionTabs: ristoranteMenuImpostazioniSubItems,
          sectionIcons,
          currentPath: '/ristorante-menu/impostazioni/allergeni/modifica',
          actionNavConfig,
          isInternalPage: true,
          item: existingAllergene,
          formConfig,
          itemType: 'Allergene',
          detailUrl: `/ristorante-menu/impostazioni/allergeni/dettagli/${existingAllergene.id}`,
          breadcrumbs: [
            { label: 'Menu Ristorante', href: '/ristorante-menu' },
            { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
            { label: 'Allergeni', href: '/ristorante-menu/impostazioni/allergeni' },
            { label: existingAllergene.nome, href: `/ristorante-menu/impostazioni/allergeni/modifica/${existingAllergene.id}` }
          ],
          error: 'Un altro allergene con questo nome esiste già'
        });
      }
    }

    const updatedAllergene = await prisma.allergene.update({
      where: { id: allergeneId },
      data: {
        nome,
        descrizione: descrizione || null
      }
    });

    res.redirect(`/ristorante-menu/impostazioni/allergeni/dettagli/${updatedAllergene.id}?success=Allergene aggiornato con successo`);
  } catch (error) {
    console.error('Errore nell\'aggiornamento dell\'allergene:', error);
    
    // Recupera l'allergene per il rendering dell'errore
    let existingAllergene = null;
    try {
      existingAllergene = await prisma.allergene.findUnique({
        where: { id: allergeneId }
      });
    } catch (dbError) {
      console.error('Errore nel recupero dell\'allergene per rendering errore:', dbError);
    }
    
    const formConfig = allergeneFormData.getFormData ? allergeneFormData.getFormData(allergeneFormData, true, existingAllergene, req.body) : allergeneFormData;
    const actionNavConfig = createSubSectionActionNav('allergeni', 'edit');
    
    res.status(500).render('pages/ristorante-menu/impostazioni/edit', {
      title: 'Modifica Allergene',
      description: 'Modifica i dettagli dell\'allergene',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu: ristoranteMenuItems,
      sectionTabs: ristoranteMenuImpostazioniSubItems,
      sectionIcons,
      currentPath: '/ristorante-menu/impostazioni/allergeni/modifica',
      item: existingAllergene,
      formConfig,
      itemType: 'Allergene',
      detailUrl: existingAllergene ? `/ristorante-menu/impostazioni/allergeni/dettagli/${allergeneId}` : undefined,
      actionNavConfig,
      isInternalPage: true,
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
        { label: 'Allergeni', href: '/ristorante-menu/impostazioni/allergeni' },
        { label: existingAllergene?.nome || 'Modifica Allergene', href: `/ristorante-menu/impostazioni/allergeni/modifica/${allergeneId}` }
      ],
      error: 'Si è verificato un errore durante l\'aggiornamento dell\'allergene'
    });
  }
});

// Route per eliminazione singola allergene
router.delete('/impostazioni/allergeni/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.allergene.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    });
    
    res.json({ success: true, message: 'Allergene eliminato con successo' });
  } catch (error) {
    console.error('Errore nell\'eliminazione dell\'allergene:', error);
    res.status(500).json({ success: false, message: 'Errore nell\'eliminazione' });
  }
});

// Route per eliminazione multipla allergeni
router.delete('/impostazioni/allergeni', async (req, res) => {
  const { itemIds } = req.body;
  
  if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
    return res.status(400).json({ 
      success: false, 
      message: 'Nessun allergene selezionato per la cancellazione' 
    });
  }
  
  try {
    // Verifica che tutti gli allergeni esistano e non siano già cancellati
    const existingAllergeni = await prisma.allergene.findMany({
      where: { 
        id: { in: itemIds },
        deletedAt: null
      }
    });

    if (existingAllergeni.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Nessun allergene valido trovato per la cancellazione' 
      });
    }

    // Esegui soft delete per tutti gli allergeni validi
    const validAllergeneIds = existingAllergeni.map(allergene => allergene.id);
    await prisma.allergene.updateMany({
      where: { 
        id: { in: validAllergeneIds }
      },
      data: { 
        deletedAt: new Date() 
      }
    });

    const deletedCount = validAllergeneIds.length;
    const skippedCount = itemIds.length - validAllergeneIds.length;
    
    let message = `Eliminati ${deletedCount} allergene/i con successo`;
    if (skippedCount > 0) {
      message += `. ${skippedCount} allergene/i già cancellati o non trovati.`;
    }

    res.json({ 
      success: true, 
      message,
      deletedCount,
      skippedCount
    });
  } catch (error) {
    console.error('Errore nella cancellazione degli allergeni:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Si è verificato un errore durante la cancellazione' 
    });
  }
});

// === ROUTE CRUD CATEGORIE MENU FISSO ===
router.get('/impostazioni/categoria-menu-fisso/nuovo', (req, res) => {
  const currentPath = '/ristorante-menu/impostazioni/categoria-menu-fisso/nuovo';
  let sectionMenu = ristoranteMenuItems;
  let sectionTabs = ristoranteMenuImpostazioniSubItems;

  const formConfig = categoriaMenuFissoFormData.getFormData ? categoriaMenuFissoFormData.getFormData(categoriaMenuFissoFormData, false) : categoriaMenuFissoFormData;
  
  // Configurazione actionNav per questa pagina
  const actionNavConfig = createSubSectionActionNav('categoria-menu-fisso', 'new');

  res.render('pages/ristorante-menu/impostazioni/new', {
    title: 'Nuova Categoria Menu Fisso',
    description: 'Crea una nuova categoria per i menu fissi del ristorante',
    layout: 'layouts/sections',
    mainMenu: mainMenuItems,
    sectionMenu,
    sectionTabs,
    sectionIcons,
    currentPath,
    formConfig,
    itemType: 'Categoria Menu Fisso',
    backUrl: '/ristorante-menu/impostazioni/categoria-menu-fisso',
    actionNavConfig,
    isInternalPage: true,
    breadcrumbs: [
      { label: 'Menu Ristorante', href: '/ristorante-menu' },
      { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
      { label: 'Categoria Menu Fisso', href: '/ristorante-menu/impostazioni/categoria-menu-fisso' },
      { label: 'Nuova Categoria', href: '/ristorante-menu/impostazioni/categoria-menu-fisso/nuovo' }
    ]
  });
});

router.post('/impostazioni/categoria-menu-fisso/nuovo', async (req, res) => {
  const { nome, descrizione, inLista } = req.body;
  
  try {
    const existingCategoria = await prisma.categoriaMenuFisso.findUnique({
      where: { nome }
    });

    if (existingCategoria) {
      const formConfig = categoriaMenuFissoFormData.getFormData ? categoriaMenuFissoFormData.getFormData(categoriaMenuFissoFormData, false, null, req.body) : categoriaMenuFissoFormData;
      
      // Configurazione actionNav per questa pagina
      const actionNavConfig = createSubSectionActionNav('categoria-menu-fisso', 'new');
      
      return res.status(400).render('pages/ristorante-menu/impostazioni/new', {
        title: 'Nuova Categoria Menu Fisso',
        description: 'Crea una nuova categoria per i menu fissi del ristorante',
        layout: 'layouts/sections',
        mainMenu: mainMenuItems,
        sectionMenu: ristoranteMenuItems,
        sectionTabs: ristoranteMenuImpostazioniSubItems,
        sectionIcons,
        currentPath: '/ristorante-menu/impostazioni/categoria-menu-fisso/nuovo',
        formConfig,
        itemType: 'Categoria Menu Fisso',
        backUrl: '/ristorante-menu/impostazioni/categoria-menu-fisso',
        actionNavConfig,
        isInternalPage: true,
        breadcrumbs: [
          { label: 'Menu Ristorante', href: '/ristorante-menu' },
          { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
          { label: 'Categoria Menu Fisso', href: '/ristorante-menu/impostazioni/categoria-menu-fisso' },
          { label: 'Nuova Categoria', href: '/ristorante-menu/impostazioni/categoria-menu-fisso/nuovo' }
        ],
        error: 'Una categoria con questo nome esiste già'
      });
    }

    const categoria = await prisma.categoriaMenuFisso.create({
      data: {
        nome,
        descrizione: descrizione || null,
        inLista: inLista === 'on' || inLista === true
      }
    });

    res.redirect(`/ristorante-menu/impostazioni/categoria-menu-fisso/dettagli/${categoria.id}?success=Categoria creata con successo`);
  } catch (error) {
    console.error('Errore nella creazione della categoria:', error);
    
    const formConfig = categoriaMenuFissoFormData.getFormData ? categoriaMenuFissoFormData.getFormData(categoriaMenuFissoFormData, false, null, req.body) : categoriaMenuFissoFormData;
    
    // Configurazione actionNav per questa pagina
    const actionNavConfig = createSubSectionActionNav('categoria-menu-fisso', 'new');
    
    res.status(500).render('pages/ristorante-menu/impostazioni/new', {
      title: 'Nuova Categoria Menu Fisso',
      description: 'Crea una nuova categoria per i menu fissi del ristorante',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu: ristoranteMenuItems,
      sectionTabs: ristoranteMenuImpostazioniSubItems,
      sectionIcons,
      currentPath: '/ristorante-menu/impostazioni/categoria-menu-fisso/nuovo',
      formConfig,
      itemType: 'Categoria Menu Fisso',
      backUrl: '/ristorante-menu/impostazioni/categoria-menu-fisso',
      actionNavConfig,
      isInternalPage: true,
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
        { label: 'Categoria Menu Fisso', href: '/ristorante-menu/impostazioni/categoria-menu-fisso' },
        { label: 'Nuova Categoria', href: '/ristorante-menu/impostazioni/categoria-menu-fisso/nuovo' }
      ],
      error: 'Si è verificato un errore durante la creazione della categoria'
    });
  }
});

// Route per visualizzare categoria menu fisso (corretta come users)
router.get('/impostazioni/categoria-menu-fisso/dettagli/:id', async (req, res) => {
  try {
    const currentPath = '/ristorante-menu/impostazioni/categoria-menu-fisso/dettagli/' + req.params.id;
    let sectionMenu = ristoranteMenuItems;
    let sectionTabs = ristoranteMenuImpostazioniSubItems;
    
    const categoria = await prisma.categoriaMenuFisso.findFirst({
      where: { 
        id: req.params.id,
        deletedAt: null
      }
    });

    if (!categoria) {
      return res.status(404).send('Categoria non trovata');
    }

    const actionNavConfig = createSubSectionActionNav('categoria-menu-fisso', 'view', categoria.id);
    const customTitle = generatePageTitle(categoriaMenuFissoConfig, 'view', categoria);

    res.render('pages/ristorante-menu/impostazioni/view', {
      title: 'Dettagli Categoria Menu Fisso',
      customTitle,
      description: 'Informazioni dettagliate della categoria',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionTabs,
      sectionIcons,
      currentPath,
      item: categoria,
      itemType: 'Categoria Menu Fisso',
      backUrl: '/ristorante-menu/impostazioni/categoria-menu-fisso',
      actionNavConfig,
      isInternalPage: true,
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
        { label: 'Categoria Menu Fisso', href: '/ristorante-menu/impostazioni/categoria-menu-fisso' },
        { label: categoria.nome, href: `/ristorante-menu/impostazioni/categoria-menu-fisso/dettagli/${categoria.id}` }
      ]
    });
  } catch (error) {
    console.error('Errore nel recupero della categoria:', error);
    res.status(500).send('Errore interno del server');
  }
});

router.get('/impostazioni/categoria-menu-fisso/modifica/:id', async (req, res) => {
  const currentPath = '/ristorante-menu/impostazioni/categoria-menu-fisso/modifica';
  let sectionMenu = ristoranteMenuItems;
  let sectionTabs = ristoranteMenuImpostazioniSubItems;
  
  try {
    const categoria = await prisma.categoriaMenuFisso.findFirst({
      where: { 
        id: req.params.id,
        deletedAt: null
      }
    });

    if (!categoria) {
      return res.status(404).render('error', {
        title: 'Categoria non trovata',
        layout: 'layouts/sections',
        mainMenu: mainMenuItems,
        sectionMenu,
        sectionTabs,
        sectionIcons,
        currentPath,
        breadcrumbs: [
          { label: 'Menu Ristorante', href: '/ristorante-menu' },
          { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
          { label: 'Categoria Menu Fisso', href: '/ristorante-menu/impostazioni/categoria-menu-fisso' },
          { label: 'Categoria non trovata', href: `/ristorante-menu/impostazioni/categoria-menu-fisso/modifica/${req.params.id}` }
        ],
        error: 'La categoria richiesta non esiste',
        isInternalPage: true 
      });
    }

    const formConfig = categoriaMenuFissoFormData.getFormData ? categoriaMenuFissoFormData.getFormData(categoriaMenuFissoFormData, true, categoria) : categoriaMenuFissoFormData;
    const actionNavConfig = createSubSectionActionNav('categoria-menu-fisso', 'edit');
    const customTitle = generatePageTitle(categoriaMenuFissoConfig, 'edit', categoria);

    res.render('pages/ristorante-menu/impostazioni/edit', {
      title: 'Modifica Categoria Menu Fisso',
      customTitle,
      description: 'Modifica i dettagli della categoria',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionTabs,
      sectionIcons,
      currentPath,
      item: categoria,
      formConfig,
      itemType: 'Categoria Menu Fisso',
      detailUrl: `/ristorante-menu/impostazioni/categoria-menu-fisso/dettagli/${categoria.id}`,
      actionNavConfig,
      isInternalPage: true,
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
        { label: 'Categoria Menu Fisso', href: '/ristorante-menu/impostazioni/categoria-menu-fisso' },
        { label: categoria.nome, href: `/ristorante-menu/impostazioni/categoria-menu-fisso/modifica/${categoria.id}` }
      ]
    });
  } catch (error) {
    console.error('Errore nel recupero della categoria per modifica:', error);
    res.status(500).render('error', {
      title: 'Errore',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionTabs,
      sectionIcons,
      currentPath,
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
        { label: 'Categoria Menu Fisso', href: '/ristorante-menu/impostazioni/categoria-menu-fisso' },
        { label: 'Errore', href: `/ristorante-menu/impostazioni/categoria-menu-fisso/modifica/${req.params.id}` }
      ],
      error: 'Si è verificato un errore nel recupero della categoria',
      isInternalPage: true 
    });
  }
});

router.post('/impostazioni/categoria-menu-fisso/modifica/:id', async (req, res) => {
  const { nome, descrizione, inLista } = req.body;
  const categoriaId = req.params.id;
  
  try {
    const existingCategoria = await prisma.categoriaMenuFisso.findUnique({
      where: { id: categoriaId }
    });

    if (!existingCategoria) {
      return res.status(404).render('error', {
        title: 'Categoria non trovata',
        layout: 'layouts/sections',
        mainMenu: mainMenuItems,
        sectionMenu: ristoranteMenuItems,
        sectionTabs: ristoranteMenuImpostazioniSubItems,
        sectionIcons,
        currentPath: '/ristorante-menu/impostazioni/categoria-menu-fisso/modifica',
        breadcrumbs: [
          { label: 'Menu Ristorante', href: '/ristorante-menu' },
          { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
          { label: 'Categoria Menu Fisso', href: '/ristorante-menu/impostazioni/categoria-menu-fisso' },
          { label: 'Categoria non trovata', href: `/ristorante-menu/impostazioni/categoria-menu-fisso/modifica/${categoriaId}` }
        ],
        error: 'La categoria richiesta non esiste'
      });
    }

    if (nome !== existingCategoria.nome) {
      const categoriaWithSameName = await prisma.categoriaMenuFisso.findUnique({
        where: { nome }
      });

      if (categoriaWithSameName) {
        const formConfig = categoriaMenuFissoFormData.getFormData ? categoriaMenuFissoFormData.getFormData(categoriaMenuFissoFormData, true, existingCategoria, req.body) : categoriaMenuFissoFormData;
        const actionNavConfig = createSubSectionActionNav('categoria-menu-fisso', 'edit');
        
        return res.status(400).render('pages/ristorante-menu/impostazioni/edit', {
          title: 'Modifica Categoria Menu Fisso',
          description: 'Modifica i dettagli della categoria',
          layout: 'layouts/sections',
          mainMenu: mainMenuItems,
          sectionMenu: ristoranteMenuItems,
          sectionTabs: ristoranteMenuImpostazioniSubItems,
          sectionIcons,
          currentPath: '/ristorante-menu/impostazioni/categoria-menu-fisso/modifica',
          actionNavConfig,
          isInternalPage: true,
          item: existingCategoria,
          formConfig,
          itemType: 'Categoria Menu Fisso',
          detailUrl: `/ristorante-menu/impostazioni/categoria-menu-fisso/dettagli/${existingCategoria.id}`,
          breadcrumbs: [
            { label: 'Menu Ristorante', href: '/ristorante-menu' },
            { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
            { label: 'Categoria Menu Fisso', href: '/ristorante-menu/impostazioni/categoria-menu-fisso' },
            { label: existingCategoria.nome, href: `/ristorante-menu/impostazioni/categoria-menu-fisso/modifica/${existingCategoria.id}` }
          ],
          error: 'Un\'altra categoria con questo nome esiste già'
        });
      }
    }

    const updatedCategoria = await prisma.categoriaMenuFisso.update({
      where: { id: categoriaId },
      data: {
        nome,
        descrizione: descrizione || null,
        inLista: inLista === 'on' || inLista === true
      }
    });

    res.redirect(`/ristorante-menu/impostazioni/categoria-menu-fisso/dettagli/${updatedCategoria.id}?success=Categoria aggiornata con successo`);
  } catch (error) {
    console.error('Errore nell\'aggiornamento della categoria:', error);
    
    // Recupera la categoria per il rendering dell'errore
    let existingCategoria = null;
    try {
      existingCategoria = await prisma.categoriaMenuFisso.findUnique({
        where: { id: categoriaId }
      });
    } catch (dbError) {
      console.error('Errore nel recupero della categoria per rendering errore:', dbError);
    }
    
    const formConfig = categoriaMenuFissoFormData.getFormData ? categoriaMenuFissoFormData.getFormData(categoriaMenuFissoFormData, true, existingCategoria, req.body) : categoriaMenuFissoFormData;
    
    res.status(500).render('pages/ristorante-menu/impostazioni/edit', {
      title: 'Modifica Categoria Menu Fisso',
      description: 'Modifica i dettagli della categoria',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu: ristoranteMenuItems,
      sectionTabs: ristoranteMenuImpostazioniSubItems,
      sectionIcons,
      currentPath: '/ristorante-menu/impostazioni/categoria-menu-fisso/modifica',
      item: existingCategoria,
      formConfig,
      itemType: 'Categoria Menu Fisso',
      detailUrl: existingCategoria ? `/ristorante-menu/impostazioni/categoria-menu-fisso/dettagli/${categoriaId}` : undefined,
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
        { label: 'Categoria Menu Fisso', href: '/ristorante-menu/impostazioni/categoria-menu-fisso' },
        { label: existingCategoria?.nome || 'Modifica Categoria', href: `/ristorante-menu/impostazioni/categoria-menu-fisso/modifica/${categoriaId}` }
      ],
      error: 'Si è verificato un errore durante l\'aggiornamento della categoria'
    });
  }
});

// Route per modifica massiva categorie menu fisso
router.get('/impostazioni/categoria-menu-fisso/modifica-massa', async (req, res) => {
  const currentPath = '/ristorante-menu/impostazioni/categoria-menu-fisso/modifica-massa';
  let sectionMenu = ristoranteMenuItems;
  let sectionTabs = ristoranteMenuImpostazioniSubItems;
  
  const categoriaIds = req.query.ids ? (req.query.ids as string).split(',') : [];
  
  if (categoriaIds.length === 0) {
    return res.redirect('/ristorante-menu/impostazioni/categoria-menu-fisso');
  }
  
  try {
    const selectedCategorie = await prisma.categoriaMenuFisso.findMany({
      where: { 
        id: { in: categoriaIds },
        deletedAt: null
      },
      select: {
        id: true,
        nome: true,
        descrizione: true,
        inLista: true
      }
    });

    if (selectedCategorie.length === 0) {
      return res.redirect('/ristorante-menu/impostazioni/categoria-menu-fisso');
    }

    const formConfig = categoriaMenuFissoFormData.getFormData ? categoriaMenuFissoFormData.getFormData(categoriaMenuFissoFormData, false, null, null, true, selectedCategorie) : categoriaMenuFissoFormData;
    const actionNavConfig = createSubSectionActionNav('categoria-menu-fisso', 'editBulk');

    res.render('pages/ristorante-menu/impostazioni/editBulk', {
      title: 'Modifica Massiva Categorie Menu Fisso',
      description: 'Modifica lo stato delle categorie selezionate',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionTabs,
      sectionIcons,
      currentPath,
      selectedItems: selectedCategorie,
      formConfig,
      itemType: 'Categoria Menu Fisso',
      backUrl: '/ristorante-menu/impostazioni/categoria-menu-fisso',
      actionNavConfig,
      isInternalPage: true,
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
        { label: 'Categoria Menu Fisso', href: '/ristorante-menu/impostazioni/categoria-menu-fisso' },
        { label: 'Modifica Massiva', href: '#' }
      ]
    });
  } catch (error) {
    console.error('Errore nel recupero delle categorie per modifica massiva:', error);
    res.redirect('/ristorante-menu/impostazioni/categoria-menu-fisso');
  }
});

router.post('/impostazioni/categoria-menu-fisso/modifica-massa', async (req, res) => {
  const { itemIds, inLista } = req.body;
  
  let categoriaIds: string[] = [];
  if (Array.isArray(itemIds)) {
    categoriaIds = itemIds;
  } else if (typeof itemIds === 'string') {
    categoriaIds = itemIds.split(',').filter(id => id.trim() !== '');
  }
  
  if (categoriaIds.length === 0) {
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      return res.json({ success: false, message: 'Nessuna categoria selezionata per la modifica' });
    }
    return res.redirect('/ristorante-menu/impostazioni/categoria-menu-fisso?error=Nessuna categoria selezionata per la modifica');
  }
  
  try {
    const existingCategorie = await prisma.categoriaMenuFisso.findMany({
      where: { 
        id: { in: categoriaIds },
        deletedAt: null
      }
    });

    if (existingCategorie.length === 0) {
      if (req.xhr || req.headers.accept?.includes('application/json')) {
        return res.json({ success: false, message: 'Nessuna categoria valida trovata per la modifica' });
      }
      return res.redirect('/ristorante-menu/impostazioni/categoria-menu-fisso?error=Nessuna categoria valida trovata per la modifica');
    }

    const updateData: any = {};
    
    if (inLista !== undefined) {
      updateData.inLista = inLista === 'on' || inLista === true;
    }

    if (Object.keys(updateData).length === 0) {
      if (req.xhr || req.headers.accept?.includes('application/json')) {
        return res.json({ success: false, message: 'Nessun campo valido fornito per l\'aggiornamento' });
      }
      return res.redirect('/ristorante-menu/impostazioni/categoria-menu-fisso?error=Nessun campo valido fornito per l\'aggiornamento');
    }

    await prisma.categoriaMenuFisso.updateMany({
      where: { 
        id: { in: categoriaIds }
      },
      data: updateData
    });

    const updatedCount = existingCategorie.length;
    const skippedCount = categoriaIds.length - existingCategorie.length;
    
    let message = `Aggiornate ${updatedCount} categoria${updatedCount === 1 ? '' : 'e'} con successo`;
    if (skippedCount > 0) {
      message += `. ${skippedCount} categoria${skippedCount === 1 ? '' : 'e'} non trovata${skippedCount === 1 ? '' : 'e'} o già cancellata${skippedCount === 1 ? '' : 'e'}.`;
    }
    
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      return res.json({ success: true, message });
    }
    
    res.redirect(`/ristorante-menu/impostazioni/categoria-menu-fisso?success=${encodeURIComponent(message)}`);
    
  } catch (error) {
    console.error('Errore durante la modifica massiva:', error);
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      return res.json({ success: false, message: 'Errore interno del server durante la modifica massiva' });
    }
    res.redirect('/ristorante-menu/impostazioni/categoria-menu-fisso?error=Errore interno del server durante la modifica massiva');
  }
});

// Route per eliminazione singola categoria menu fisso
router.delete('/impostazioni/categoria-menu-fisso/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.categoriaMenuFisso.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    });
    
    res.json({ success: true, message: 'Categoria eliminata con successo' });
  } catch (error) {
    console.error('Errore nell\'eliminazione della categoria:', error);
    res.status(500).json({ success: false, message: 'Errore nell\'eliminazione' });
  }
});

// Route per eliminazione multipla categorie menu fisso
router.delete('/impostazioni/categoria-menu-fisso', async (req, res) => {
  const { itemIds } = req.body;
  
  if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
    return res.status(400).json({ 
      success: false, 
      message: 'Nessuna categoria selezionata per la cancellazione' 
    });
  }
  
  try {
    // Verifica che tutte le categorie esistano e non siano già cancellate
    const existingCategorie = await prisma.categoriaMenuFisso.findMany({
      where: { 
        id: { in: itemIds },
        deletedAt: null
      }
    });

    if (existingCategorie.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Nessuna categoria valida trovata per la cancellazione' 
      });
    }

    // Esegui soft delete per tutte le categorie validi
    const validCategoriaIds = existingCategorie.map(categoria => categoria.id);
    await prisma.categoriaMenuFisso.updateMany({
      where: { 
        id: { in: validCategoriaIds }
      },
      data: { 
        deletedAt: new Date() 
      }
    });

    const deletedCount = validCategoriaIds.length;
    const skippedCount = itemIds.length - validCategoriaIds.length;
    
    let message = `Eliminate ${deletedCount} categoria/e con successo`;
    if (skippedCount > 0) {
      message += `. ${skippedCount} categoria/e già cancellate o non trovate.`;
    }

    res.json({ 
      success: true, 
      message,
      deletedCount,
      skippedCount
    });
  } catch (error) {
    console.error('Errore nella cancellazione delle categorie:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Si è verificato un errore durante la cancellazione' 
    });
  }
});

// === ROUTE CRUD CATEGORIE PIATTI ===
router.get('/impostazioni/categoria-piatti/nuovo', (req, res) => {
  const currentPath = '/ristorante-menu/impostazioni/categoria-piatti/nuovo';
  let sectionMenu = ristoranteMenuItems;
  let sectionTabs = ristoranteMenuImpostazioniSubItems;

  const formConfig = categoriaPiattiFormData.getFormData ? categoriaPiattiFormData.getFormData(categoriaPiattiFormData, false) : categoriaPiattiFormData;
  
  // Configurazione actionNav per questa pagina
  const actionNavConfig = createSubSectionActionNav('categoria-piatti', 'new');

  res.render('pages/ristorante-menu/impostazioni/new', {
    title: 'Nuova Categoria Piatti',
    description: 'Crea una nuova categoria per i piatti del ristorante',
    layout: 'layouts/sections',
    mainMenu: mainMenuItems,
    sectionMenu,
    sectionTabs,
    sectionIcons,
    currentPath,
    formConfig,
    itemType: 'Categoria Piatti',
    backUrl: '/ristorante-menu/impostazioni/categoria-piatti',
    actionNavConfig,
    isInternalPage: true,
    breadcrumbs: [
      { label: 'Menu Ristorante', href: '/ristorante-menu' },
      { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
      { label: 'Categoria Piatti', href: '/ristorante-menu/impostazioni/categoria-piatti' },
      { label: 'Nuova Categoria', href: '/ristorante-menu/impostazioni/categoria-piatti/nuovo' }
    ]
  });
});

router.post('/impostazioni/categoria-piatti/nuovo', async (req, res) => {
  const { nome, descrizione, inLista } = req.body;
  
  try {
    const existingCategoria = await prisma.categoriaPiatti.findUnique({
      where: { nome }
    });

    if (existingCategoria) {
      const formConfig = categoriaPiattiFormData.getFormData ? categoriaPiattiFormData.getFormData(categoriaPiattiFormData, false, null, req.body) : categoriaPiattiFormData;
      
      // Configurazione actionNav per questa pagina
      const actionNavConfig = createSubSectionActionNav('categoria-piatti', 'new');
      
      return res.status(400).render('pages/ristorante-menu/impostazioni/new', {
        title: 'Nuova Categoria Piatti',
        description: 'Crea una nuova categoria per i piatti del ristorante',
        layout: 'layouts/sections',
        mainMenu: mainMenuItems,
        sectionMenu: ristoranteMenuItems,
        sectionTabs: ristoranteMenuImpostazioniSubItems,
        sectionIcons,
        currentPath: '/ristorante-menu/impostazioni/categoria-piatti/nuovo',
        formConfig,
        itemType: 'Categoria Piatti',
        backUrl: '/ristorante-menu/impostazioni/categoria-piatti',
        actionNavConfig,
        isInternalPage: true,
        breadcrumbs: [
          { label: 'Menu Ristorante', href: '/ristorante-menu' },
          { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
          { label: 'Categoria Piatti', href: '/ristorante-menu/impostazioni/categoria-piatti' },
          { label: 'Nuova Categoria', href: '/ristorante-menu/impostazioni/categoria-piatti/nuovo' }
        ],
        error: 'Una categoria con questo nome esiste già'
      });
    }

    const categoria = await prisma.categoriaPiatti.create({
      data: {
        nome,
        descrizione: descrizione || null,
        inLista: inLista === 'on' || inLista === true
      }
    });

    res.redirect(`/ristorante-menu/impostazioni/categoria-piatti/dettagli/${categoria.id}?success=Categoria creata con successo`);
  } catch (error) {
    console.error('Errore nella creazione della categoria:', error);
    
    const formConfig = categoriaPiattiFormData.getFormData ? categoriaPiattiFormData.getFormData(categoriaPiattiFormData, false, null, req.body) : categoriaPiattiFormData;
    
    // Configurazione actionNav per questa pagina
    const actionNavConfig = createSubSectionActionNav('categoria-piatti', 'new');
    
    res.status(500).render('pages/ristorante-menu/impostazioni/new', {
      title: 'Nuova Categoria Piatti',
      description: 'Crea una nuova categoria per i piatti del ristorante',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu: ristoranteMenuItems,
      sectionTabs: ristoranteMenuImpostazioniSubItems,
      sectionIcons,
      currentPath: '/ristorante-menu/impostazioni/categoria-piatti/nuovo',
      formConfig,
      itemType: 'Categoria Piatti',
      backUrl: '/ristorante-menu/impostazioni/categoria-piatti',
      actionNavConfig,
      isInternalPage: true,
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
        { label: 'Categoria Piatti', href: '/ristorante-menu/impostazioni/categoria-piatti' },
        { label: 'Nuova Categoria', href: '/ristorante-menu/impostazioni/categoria-piatti/nuovo' }
      ],
      error: 'Si è verificato un errore durante la creazione della categoria'
    });
  }
});

// Route per visualizzare categoria piatti (corretta come users)
router.get('/impostazioni/categoria-piatti/dettagli/:id', async (req, res) => {
  try {
    const currentPath = '/ristorante-menu/impostazioni/categoria-piatti/dettagli/' + req.params.id;
    let sectionMenu = ristoranteMenuItems;
    let sectionTabs = ristoranteMenuImpostazioniSubItems;
    
    const categoria = await prisma.categoriaPiatti.findFirst({
      where: { 
        id: req.params.id,
        deletedAt: null
      }
    });

    if (!categoria) {
      return res.status(404).send('Categoria non trovata');
    }

    const actionNavConfig = createSubSectionActionNav('categoria-piatti', 'view', categoria.id);
    const customTitle = generatePageTitle(categoriaPiattiConfig, 'view', categoria);

    res.render('pages/ristorante-menu/impostazioni/view', {
      title: 'Dettagli Categoria Piatti',
      customTitle,
      description: 'Informazioni dettagliate della categoria',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionTabs,
      sectionIcons,
      currentPath,
      item: categoria,
      itemType: 'Categoria Piatti',
      backUrl: '/ristorante-menu/impostazioni/categoria-piatti',
      actionNavConfig,
      isInternalPage: true,
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
        { label: 'Categoria Piatti', href: '/ristorante-menu/impostazioni/categoria-piatti' },
        { label: categoria.nome, href: `/ristorante-menu/impostazioni/categoria-piatti/dettagli/${categoria.id}` }
      ]
    });
  } catch (error) {
    console.error('Errore nel recupero della categoria:', error);
    res.status(500).send('Errore interno del server');
  }
});

router.get('/impostazioni/categoria-piatti/modifica/:id', async (req, res) => {
  const currentPath = '/ristorante-menu/impostazioni/categoria-piatti/modifica';
  let sectionMenu = ristoranteMenuItems;
  let sectionTabs = ristoranteMenuImpostazioniSubItems;
  
  try {
    const categoria = await prisma.categoriaPiatti.findFirst({
      where: { 
        id: req.params.id,
        deletedAt: null
      }
    });

    if (!categoria) {
      const actionNavConfig = createSubSectionActionNav('categoria-piatti', 'edit');
      return res.status(404).render('error', {
        title: 'Categoria non trovata',
        layout: 'layouts/sections',
        mainMenu: mainMenuItems,
        sectionMenu,
        sectionTabs,
        sectionIcons,
        currentPath,
        actionNavConfig,
        isInternalPage: true,
        breadcrumbs: [
          { label: 'Menu Ristorante', href: '/ristorante-menu' },
          { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
          { label: 'Categoria Piatti', href: '/ristorante-menu/impostazioni/categoria-piatti' },
          { label: 'Categoria non trovata', href: `/ristorante-menu/impostazioni/categoria-piatti/modifica/${req.params.id}` }
        ],
        error: 'La categoria richiesta non esiste'
      });
    }

    const formConfig = categoriaPiattiFormData.getFormData ? categoriaPiattiFormData.getFormData(categoriaPiattiFormData, true, categoria) : categoriaPiattiFormData;
    const actionNavConfig = createSubSectionActionNav('categoria-piatti', 'edit');
    const customTitle = generatePageTitle(categoriaPiattiConfig, 'edit', categoria);

    res.render('pages/ristorante-menu/impostazioni/edit', {
      title: 'Modifica Categoria Piatti',
      customTitle,
      description: 'Modifica i dettagli della categoria',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionTabs,
      sectionIcons,
      currentPath,
      item: categoria,
      formConfig,
      itemType: 'Categoria Piatti',
      detailUrl: `/ristorante-menu/impostazioni/categoria-piatti/dettagli/${categoria.id}`,
      actionNavConfig,
      isInternalPage: true,
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
        { label: 'Categoria Piatti', href: '/ristorante-menu/impostazioni/categoria-piatti' },
        { label: categoria.nome, href: `/ristorante-menu/impostazioni/categoria-piatti/modifica/${categoria.id}` }
      ]
    });
  } catch (error) {
    console.error('Errore nel recupero della categoria per modifica:', error);
    const actionNavConfig = createSubSectionActionNav('categoria-piatti', 'edit');
    res.status(500).render('error', {
      title: 'Errore',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionTabs,
      sectionIcons,
      currentPath,
      actionNavConfig,
      isInternalPage: true,
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
        { label: 'Categoria Piatti', href: '/ristorante-menu/impostazioni/categoria-piatti' },
        { label: 'Errore', href: `/ristorante-menu/impostazioni/categoria-piatti/modifica/${req.params.id}` }
      ],
      error: 'Si è verificato un errore nel recupero della categoria'
    });
  }
});

router.post('/impostazioni/categoria-piatti/modifica/:id', async (req, res) => {
  const { nome, descrizione, inLista } = req.body;
  const categoriaId = req.params.id;
  
  try {
    const existingCategoria = await prisma.categoriaPiatti.findUnique({
      where: { id: categoriaId }
    });

    if (!existingCategoria) {
      const actionNavConfig = createSubSectionActionNav('categoria-piatti', 'edit');
      return res.status(404).render('error', {
        title: 'Categoria non trovata',
        layout: 'layouts/sections',
        mainMenu: mainMenuItems,
        sectionMenu: ristoranteMenuItems,
        sectionTabs: ristoranteMenuImpostazioniSubItems,
        sectionIcons,
        currentPath: '/ristorante-menu/impostazioni/categoria-piatti/modifica',
        actionNavConfig,
        isInternalPage: true,
        breadcrumbs: [
          { label: 'Menu Ristorante', href: '/ristorante-menu' },
          { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
          { label: 'Categoria Piatti', href: '/ristorante-menu/impostazioni/categoria-piatti' },
          { label: 'Categoria non trovata', href: `/ristorante-menu/impostazioni/categoria-piatti/modifica/${categoriaId}` }
        ],
        error: 'La categoria richiesta non esiste'
      });
    }

    if (nome !== existingCategoria.nome) {
      const categoriaWithSameName = await prisma.categoriaPiatti.findUnique({
        where: { nome }
      });

      if (categoriaWithSameName) {
        const formConfig = categoriaPiattiFormData.getFormData ? categoriaPiattiFormData.getFormData(categoriaPiattiFormData, true, existingCategoria, req.body) : categoriaPiattiFormData;
        const actionNavConfig = createSubSectionActionNav('categoria-piatti', 'edit');
        
        return res.status(400).render('pages/ristorante-menu/impostazioni/edit', {
          title: 'Modifica Categoria Piatti',
          description: 'Modifica i dettagli della categoria',
          layout: 'layouts/sections',
          mainMenu: mainMenuItems,
          actionNavConfig,
          sectionMenu: ristoranteMenuItems,
          sectionTabs: ristoranteMenuImpostazioniSubItems,
          sectionIcons,
          currentPath: '/ristorante-menu/impostazioni/categoria-piatti/modifica',
          item: existingCategoria,
          formConfig,
          itemType: 'Categoria Piatti',
          detailUrl: `/ristorante-menu/impostazioni/categoria-piatti/dettagli/${existingCategoria.id}`,
          breadcrumbs: [
            { label: 'Menu Ristorante', href: '/ristorante-menu' },
            { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
            { label: 'Categoria Piatti', href: '/ristorante-menu/impostazioni/categoria-piatti' },
            { label: existingCategoria.nome, href: `/ristorante-menu/impostazioni/categoria-piatti/modifica/${existingCategoria.id}` }
          ],
          error: 'Un\'altra categoria con questo nome esiste già'
        });
      }
    }

    const updatedCategoria = await prisma.categoriaPiatti.update({
      where: { id: categoriaId },
      data: {
        nome,
        descrizione: descrizione || null,
        inLista: inLista === 'on' || inLista === true
      }
    });

    res.redirect(`/ristorante-menu/impostazioni/categoria-piatti/dettagli/${updatedCategoria.id}?success=Categoria aggiornata con successo`);
  } catch (error) {
    console.error('Errore nell\'aggiornamento della categoria:', error);
    
    // Recupera la categoria per il rendering dell'errore
    let existingCategoria = null;
    try {
      existingCategoria = await prisma.categoriaPiatti.findUnique({
        where: { id: categoriaId }
      });
    } catch (dbError) {
      console.error('Errore nel recupero della categoria per rendering errore:', dbError);
    }
    
    const formConfig = categoriaPiattiFormData.getFormData ? categoriaPiattiFormData.getFormData(categoriaPiattiFormData, true, existingCategoria, req.body) : categoriaPiattiFormData;
    const actionNavConfig = createSubSectionActionNav('categoria-piatti', 'edit');
    
    res.status(500).render('pages/ristorante-menu/impostazioni/edit', {
      title: 'Modifica Categoria Piatti',
      description: 'Modifica i dettagli della categoria',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu: ristoranteMenuItems,
      sectionTabs: ristoranteMenuImpostazioniSubItems,
      sectionIcons,
      currentPath: '/ristorante-menu/impostazioni/categoria-piatti/modifica',
      item: existingCategoria,
      formConfig,
      itemType: 'Categoria Piatti',
      detailUrl: existingCategoria ? `/ristorante-menu/impostazioni/categoria-piatti/dettagli/${categoriaId}` : undefined,
      actionNavConfig,
      isInternalPage: true,
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
        { label: 'Categoria Piatti', href: '/ristorante-menu/impostazioni/categoria-piatti' },
        { label: existingCategoria?.nome || 'Modifica Categoria', href: `/ristorante-menu/impostazioni/categoria-piatti/modifica/${categoriaId}` }
      ],
      error: 'Si è verificato un errore durante l\'aggiornamento della categoria'
    });
  }
});

// Route per modifica massiva categorie piatti
router.get('/impostazioni/categoria-piatti/modifica-massa', async (req, res) => {
  const currentPath = '/ristorante-menu/impostazioni/categoria-piatti/modifica-massa';
  let sectionMenu = ristoranteMenuItems;
  let sectionTabs = ristoranteMenuImpostazioniSubItems;
  
  const categoriaIds = req.query.ids ? (req.query.ids as string).split(',') : [];
  
  if (categoriaIds.length === 0) {
    return res.redirect('/ristorante-menu/impostazioni/categoria-piatti');
  }
  
  try {
    const selectedCategorie = await prisma.categoriaPiatti.findMany({
      where: { 
        id: { in: categoriaIds },
        deletedAt: null
      },
      select: {
        id: true,
        nome: true,
        descrizione: true,
        inLista: true
      }
    });

    if (selectedCategorie.length === 0) {
      return res.redirect('/ristorante-menu/impostazioni/categoria-piatti');
    }

    const formConfig = categoriaPiattiFormData.getFormData ? categoriaPiattiFormData.getFormData(categoriaPiattiFormData, false, null, null, true, selectedCategorie) : categoriaPiattiFormData;
    const actionNavConfig = createSubSectionActionNav('categoria-piatti', 'editBulk');

    res.render('pages/ristorante-menu/impostazioni/editBulk', {
      title: 'Modifica Massiva Categorie Piatti',
      description: 'Modifica lo stato delle categorie selezionate',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionTabs,
      sectionIcons,
      currentPath,
      selectedItems: selectedCategorie,
      formConfig,
      itemType: 'Categoria Piatti',
      backUrl: '/ristorante-menu/impostazioni/categoria-piatti',
      actionNavConfig,
      isInternalPage: true,
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
        { label: 'Categoria Piatti', href: '/ristorante-menu/impostazioni/categoria-piatti' },
        { label: 'Modifica Massiva', href: '#' }
      ]
    });
  } catch (error) {
    console.error('Errore nel recupero delle categorie per modifica massiva:', error);
    res.redirect('/ristorante-menu/impostazioni/categoria-piatti');
  }
});

router.post('/impostazioni/categoria-piatti/modifica-massa', async (req, res) => {
  const { itemIds, inLista } = req.body;
  
  let categoriaIds: string[] = [];
  if (Array.isArray(itemIds)) {
    categoriaIds = itemIds;
  } else if (typeof itemIds === 'string') {
    categoriaIds = itemIds.split(',').filter(id => id.trim() !== '');
  }
  
  if (categoriaIds.length === 0) {
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      return res.json({ success: false, message: 'Nessuna categoria selezionata per la modifica' });
    }
    return res.redirect('/ristorante-menu/impostazioni/categoria-piatti?error=Nessuna categoria selezionata per la modifica');
  }
  
  try {
    const existingCategorie = await prisma.categoriaPiatti.findMany({
      where: { 
        id: { in: categoriaIds },
        deletedAt: null
      }
    });

    if (existingCategorie.length === 0) {
      if (req.xhr || req.headers.accept?.includes('application/json')) {
        return res.json({ success: false, message: 'Nessuna categoria valida trovata per la modifica' });
      }
      return res.redirect('/ristorante-menu/impostazioni/categoria-piatti?error=Nessuna categoria valida trovata per la modifica');
    }

    const updateData: any = {};
    
    if (inLista !== undefined) {
      updateData.inLista = inLista === 'on' || inLista === true;
    }

    if (Object.keys(updateData).length === 0) {
      if (req.xhr || req.headers.accept?.includes('application/json')) {
        return res.json({ success: false, message: 'Nessun campo valido fornito per l\'aggiornamento' });
      }
      return res.redirect('/ristorante-menu/impostazioni/categoria-piatti?error=Nessun campo valido fornito per l\'aggiornamento');
    }

    await prisma.categoriaPiatti.updateMany({
      where: { 
        id: { in: categoriaIds }
      },
      data: updateData
    });

    const updatedCount = existingCategorie.length;
    const skippedCount = categoriaIds.length - existingCategorie.length;
    
    let message = `Aggiornate ${updatedCount} categoria${updatedCount === 1 ? '' : 'e'} con successo`;
    if (skippedCount > 0) {
      message += `. ${skippedCount} categoria${skippedCount === 1 ? '' : 'e'} non trovata${skippedCount === 1 ? '' : 'e'} o già cancellata${skippedCount === 1 ? '' : 'e'}.`;
    }
    
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      return res.json({ success: true, message });
    }
    
    res.redirect(`/ristorante-menu/impostazioni/categoria-piatti?success=${encodeURIComponent(message)}`);
    
  } catch (error) {
    console.error('Errore durante la modifica massiva:', error);
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      return res.json({ success: false, message: 'Errore interno del server durante la modifica massiva' });
    }
    res.redirect('/ristorante-menu/impostazioni/categoria-piatti?error=Errore interno del server durante la modifica massiva');
  }
});

// Route per eliminazione singola categoria piatti
router.delete('/impostazioni/categoria-piatti/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.categoriaPiatti.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    });
    
    res.json({ success: true, message: 'Categoria eliminata con successo' });
  } catch (error) {
    console.error('Errore nell\'eliminazione della categoria:', error);
    res.status(500).json({ success: false, message: 'Errore nell\'eliminazione' });
  }
});

// Route per eliminazione multipla categorie piatti
router.delete('/impostazioni/categoria-piatti', async (req, res) => {
  const { itemIds } = req.body;
  
  if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
    return res.status(400).json({ 
      success: false, 
      message: 'Nessuna categoria selezionata per la cancellazione' 
    });
  }
  
  try {
    // Verifica che tutte le categorie esistano e non siano già cancellate
    const existingCategorie = await prisma.categoriaPiatti.findMany({
      where: { 
        id: { in: itemIds },
        deletedAt: null
      }
    });

    if (existingCategorie.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Nessuna categoria valida trovata per la cancellazione' 
      });
    }

    // Esegui soft delete per tutte le categorie validi
    const validCategoriaIds = existingCategorie.map(categoria => categoria.id);
    await prisma.categoriaPiatti.updateMany({
      where: { 
        id: { in: validCategoriaIds }
      },
      data: { 
        deletedAt: new Date() 
      }
    });

    const deletedCount = validCategoriaIds.length;
    const skippedCount = itemIds.length - validCategoriaIds.length;
    
    let message = `Eliminate ${deletedCount} categoria${deletedCount === 1 ? '' : 'e'} con successo`;
    if (skippedCount > 0) {
      message += `. ${skippedCount} categoria${skippedCount === 1 ? '' : 'e'} già cancellata${skippedCount === 1 ? '' : 'e'} o non trovata${skippedCount === 1 ? '' : 'e'}.`;
    }

    res.json({ 
      success: true, 
      message,
      deletedCount,
      skippedCount
    });
  } catch (error) {
    console.error('Errore nella cancellazione delle categorie:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Si è verificato un errore durante la cancellazione' 
    });
  }
});

// Route per visualizzare gli elementi cancellati
router.get('/cancellati', async (req, res) => {
  const currentPath = '/ristorante-menu/cancellati';
  let sectionMenu = ristoranteMenuItems;
  
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const offset = (page - 1) * limit;
    const typeFilter = req.query.type as string;
    
    // Query base
    let whereClause = '';
    if (typeFilter) {
      whereClause = `WHERE type = '${typeFilter}'`;
    }
    
    // Query per il conteggio totale (senza filtri)
    const totalCountQuery = `SELECT COUNT(*) as count FROM "ElementiCancellati"`;
    const totalCountResult = await prisma.$queryRawUnsafe<[{ count: bigint }]>(totalCountQuery);
    const totalItemsInSystem = Number(totalCountResult[0].count);
    
    // Query per il conteggio con filtri applicati
    const filteredCountQuery = `SELECT COUNT(*) as count FROM "ElementiCancellati" ${whereClause}`;
    const filteredCountResult = await prisma.$queryRawUnsafe<[{ count: bigint }]>(filteredCountQuery);
    const filteredCount = Number(filteredCountResult[0].count);
    
    // Query per i dati
    const dataQuery = `
      SELECT * FROM "ElementiCancellati" 
      ${whereClause}
      ORDER BY "deletedAt" DESC 
      LIMIT ${limit} OFFSET ${offset}
    `;
    const deletedItems = await prisma.$queryRawUnsafe(dataQuery);

    // Determina se mostrare empty state o tabella vuota
    const isSectionEmpty = totalItemsInSystem === 0;
    const isFilteredEmpty = totalItemsInSystem > 0 && filteredCount === 0;
    const hasItems = (deletedItems as any[]).length > 0;

    res.render('pages/ristorante-menu/deleted', {
      title: 'Elementi Cancellati',
      description: 'Visualizza e gestisci gli elementi cancellati del menu',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionIcons,
      uiIcons,
      currentPath,
      deletedItems,
      hasItems,
      isSectionEmpty,
      isFilteredEmpty,
      currentTypeFilter: typeFilter,
      tableData: elementiCancellatiTableData,
      tableConfigJson: JSON.stringify({
        tableId: 'deleted-items-table',
        idField: 'id',
        labelField: 'nome',
        editMultipleButton: null,
        bulkEditUrl: null,
        editUrl: null,
        actionButtons: [
          {
            text: 'Ripristina',
            classes: 'bg-green-600 text-white ring-green-600 hover:bg-green-700 disabled:hover:bg-green-600',
            endpoint: '/ristorante-menu/restore',
            method: 'POST',
            confirmMessage: 'Sei sicuro di voler ripristinare questo elemento?',
            confirmMessageMultiple: 'Sei sicuro di voler ripristinare {count} elementi?',
            successMessage: 'Ripristinati {count} elemento/i con successo',
            errorMessage: 'Errore durante il ripristino'
          },
          {
            text: 'Elimina definitivamente',
            classes: 'bg-red-600 text-white ring-red-600 hover:bg-red-700 disabled:hover:bg-red-600',
            endpoint: '/ristorante-menu/permanent-delete',
            method: 'DELETE',
            confirmMessage: 'ATTENZIONE: Questa azione è irreversibile! Sei sicuro di voler eliminare definitivamente questo elemento?',
            confirmMessageMultiple: 'ATTENZIONE: Questa azione è irreversibile! Sei sicuro di voler eliminare definitivamente {count} elementi?',
            successMessage: 'Eliminati definitivamente {count} elemento/i',
            errorMessage: 'Errore durante l\'eliminazione definitiva'
          }
        ],
        disableClickableNames: true,
        tableData: elementiCancellatiTableData
      }),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(filteredCount / limit),
        totalItems: filteredCount,
        itemsPerPage: limit
      },
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Cancellati', href: '/ristorante-menu/cancellati' }
      ],
      emptyState: {
        title: 'Nessun elemento cancellato',
        description: 'Non ci sono elementi cancellati nel sistema.',
        buttonText: 'Torna al menu',
        buttonHref: '/ristorante-menu',
        iconName: 'tabella',
        icon: uiIcons['tabella'],
        buttonIconName: 'freccia-sx',
        buttonIcon: uiIcons['freccia-sx']
      }
    });
  } catch (error) {
    console.error('Errore nel recupero degli elementi cancellati:', error);
    
    // Gestione errore senza view separata
    res.render('pages/ristorante-menu/deleted', {
      title: 'Errore',
      description: 'Si è verificato un errore nel recupero degli elementi cancellati',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionIcons,
      uiIcons,
      currentPath,
      deletedItems: [],
      hasItems: false,
      isSectionEmpty: true,
      isFilteredEmpty: false,
      currentTypeFilter: '',
      tableData: elementiCancellatiTableData,
      tableConfigJson: JSON.stringify({
        tableId: 'deleted-items-table',
        idField: 'id',
        labelField: 'nome',
        editMultipleButton: null,
        bulkEditUrl: null,
        editUrl: null,
        actionButtons: [
          {
            text: 'Ripristina',
            classes: 'bg-green-600 text-white ring-green-600 hover:bg-green-700 disabled:hover:bg-green-600',
            endpoint: '/ristorante-menu/restore',
            method: 'POST',
            confirmMessage: 'Sei sicuro di voler ripristinare questo elemento?',
            confirmMessageMultiple: 'Sei sicuro di voler ripristinare {count} elementi?',
            successMessage: 'Ripristinati {count} elemento/i con successo',
            errorMessage: 'Errore durante il ripristino'
          },
          {
            text: 'Elimina definitivamente',
            classes: 'bg-red-600 text-white ring-red-600 hover:bg-red-700 disabled:hover:bg-red-600',
            endpoint: '/ristorante-menu/permanent-delete',
            method: 'DELETE',
            confirmMessage: 'ATTENZIONE: Questa azione è irreversibile! Sei sicuro di voler eliminare definitivamente questo elemento?',
            confirmMessageMultiple: 'ATTENZIONE: Questa azione è irreversibile! Sei sicuro di voler eliminare definitivamente {count} elementi?',
            successMessage: 'Eliminati definitivamente {count} elemento/i',
            errorMessage: 'Errore durante l\'eliminazione definitiva'
          }
        ],
        disableClickableNames: true,
        tableData: elementiCancellatiTableData
      }),
      error: 'Si è verificato un errore nel recupero degli elementi cancellati',
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Cancellati', href: '/ristorante-menu/cancellati' }
      ],
      emptyState: {
        title: 'Errore',
        description: 'Si è verificato un errore nel recupero degli elementi cancellati',
        buttonText: 'Riprova',
        buttonHref: '/ristorante-menu/cancellati',
        iconName: 'tabella',
        icon: uiIcons['tabella'],
        buttonIconName: 'freccia-sx',
        buttonIcon: uiIcons['freccia-sx']
      }
    });
  }
});

// Route per ripristinare uno o più elementi cancellati
router.post('/restore', async (req, res) => {
  const { itemIds, itemTypes } = req.body;
  
  if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0 || 
      !itemTypes || !Array.isArray(itemTypes) || itemTypes.length !== itemIds.length) {
    return res.status(400).json({ 
      success: false, 
      message: 'Dati mancanti per il ripristino' 
    });
  }
  
  try {
    let totalRestored = 0;
    let totalSkipped = 0;
    const results = [];

    // Raggruppa gli elementi per tipo
    const itemsByType: { [key: string]: string[] } = {};
    itemIds.forEach((id, index) => {
      const type = itemTypes[index];
      if (!itemsByType[type]) {
        itemsByType[type] = [];
      }
      itemsByType[type].push(id);
    });

    // Ripristina elementi per ogni tipo
    for (const [type, ids] of Object.entries(itemsByType)) {
      let restored = 0;
      let skipped = 0;

      switch (type) {
        case 'categoria-piatti':
          const existingCategoriePiatti = await prisma.categoriaPiatti.findMany({
            where: { 
              id: { in: ids as string[] },
              deletedAt: { not: null }
            }
          });
          if (existingCategoriePiatti.length > 0) {
            const validIds = existingCategoriePiatti.map(item => item.id);
            await prisma.categoriaPiatti.updateMany({
              where: { id: { in: validIds } },
              data: { deletedAt: null }
            });
            restored = validIds.length;
            skipped = (ids as string[]).length - validIds.length;
          } else {
            skipped = (ids as string[]).length;
          }
          break;

        case 'categoria-menu-fisso':
          const existingCategorieMenuFisso = await prisma.categoriaMenuFisso.findMany({
            where: { 
              id: { in: ids as string[] },
              deletedAt: { not: null }
            }
          });
          if (existingCategorieMenuFisso.length > 0) {
            const validIds = existingCategorieMenuFisso.map(item => item.id);
            await prisma.categoriaMenuFisso.updateMany({
              where: { id: { in: validIds } },
              data: { deletedAt: null }
            });
            restored = validIds.length;
            skipped = (ids as string[]).length - validIds.length;
          } else {
            skipped = (ids as string[]).length;
          }
          break;

        case 'allergene':
          const existingAllergeni = await prisma.allergene.findMany({
            where: { 
              id: { in: ids as string[] },
              deletedAt: { not: null }
            }
          });
          if (existingAllergeni.length > 0) {
            const validIds = existingAllergeni.map(item => item.id);
            await prisma.allergene.updateMany({
              where: { id: { in: validIds } },
              data: { deletedAt: null }
            });
            restored = validIds.length;
            skipped = (ids as string[]).length - validIds.length;
          } else {
            skipped = (ids as string[]).length;
          }
          break;

        case 'piatto':
          const existingPiatti = await prisma.piatto.findMany({
            where: { 
              id: { in: ids as string[] },
              deletedAt: { not: null }
            }
          });
          if (existingPiatti.length > 0) {
            const validIds = existingPiatti.map(item => item.id);
            await prisma.piatto.updateMany({
              where: { id: { in: validIds } },
              data: { deletedAt: null }
            });
            restored = validIds.length;
            skipped = (ids as string[]).length - validIds.length;
          } else {
            skipped = (ids as string[]).length;
          }
          break;

        case 'servizio-accessorio':
          const existingServizi = await prisma.servizioAccessorio.findMany({
            where: { 
              id: { in: ids as string[] },
              deletedAt: { not: null }
            }
          });
          if (existingServizi.length > 0) {
            const validIds = existingServizi.map(item => item.id);
            await prisma.servizioAccessorio.updateMany({
              where: { id: { in: validIds } },
              data: { deletedAt: null }
            });
            restored = validIds.length;
            skipped = (ids as string[]).length - validIds.length;
          } else {
            skipped = (ids as string[]).length;
          }
          break;

        case 'menu-fisso':
          const existingMenuFissi = await prisma.menuFisso.findMany({
            where: { 
              id: { in: ids as string[] },
              deletedAt: { not: null }
            }
          });
          if (existingMenuFissi.length > 0) {
            const validIds = existingMenuFissi.map(item => item.id);
            await prisma.menuFisso.updateMany({
              where: { id: { in: validIds } },
              data: { deletedAt: null }
            });
            restored = validIds.length;
            skipped = (ids as string[]).length - validIds.length;
          } else {
            skipped = (ids as string[]).length;
          }
          break;
      }

      totalRestored += restored;
      totalSkipped += skipped;
      results.push({ type, restored, skipped });
    }

    let message = `Ripristinati ${totalRestored} elemento/i con successo`;
    if (totalSkipped > 0) {
      message += `. ${totalSkipped} elemento/i non trovati o già ripristinati.`;
    }

    res.json({ 
      success: true, 
      message,
      restoredCount: totalRestored,
      skippedCount: totalSkipped,
      results
    });
  } catch (error) {
    console.error('Errore nel ripristino degli elementi:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Si è verificato un errore durante il ripristino' 
    });
  }
});

// Route per eliminazione fisica definitiva di uno o più elementi cancellati
router.delete('/permanent-delete', async (req, res) => {
  const { itemIds, itemTypes } = req.body;
  
  if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0 || 
      !itemTypes || !Array.isArray(itemTypes) || itemTypes.length !== itemIds.length) {
    return res.status(400).json({ 
      success: false, 
      message: 'Dati mancanti per l\'eliminazione definitiva' 
    });
  }
  
  try {
    let totalDeleted = 0;
    let totalSkipped = 0;
    const results = [];

    // Raggruppa gli elementi per tipo
    const itemsByType: { [key: string]: string[] } = {};
    itemIds.forEach((id, index) => {
      const type = itemTypes[index];
      if (!itemsByType[type]) {
        itemsByType[type] = [];
      }
      itemsByType[type].push(id);
    });

    // Elimina fisicamente elementi per ogni tipo
    for (const [type, ids] of Object.entries(itemsByType)) {
      let deleted = 0;
      let skipped = 0;

      switch (type) {
        case 'categoria-piatti':
          // Verifica che non ci siano piatti associati
          const piattiAssociati = await prisma.piatto.findMany({
            where: { 
              categoriaId: { in: ids as string[] },
              deletedAt: null
            }
          });
          
          if (piattiAssociati.length > 0) {
            skipped = (ids as string[]).length;
            results.push({ 
              type, 
              deleted: 0, 
              skipped: (ids as string[]).length,
              error: 'Impossibile eliminare categorie con piatti associati'
            });
            continue;
          }
          
          const deletedCategoriePiatti = await prisma.categoriaPiatti.deleteMany({
            where: { 
              id: { in: ids as string[] },
              deletedAt: { not: null }
            }
          });
          deleted = deletedCategoriePiatti.count;
          skipped = (ids as string[]).length - deleted;
          break;

        case 'categoria-menu-fisso':
          // Verifica che non ci siano menu fissi associati
          const menuFissiAssociati = await prisma.menuFisso.findMany({
            where: { 
              categoriaId: { in: ids as string[] },
              deletedAt: null
            }
          });
          
          if (menuFissiAssociati.length > 0) {
            skipped = (ids as string[]).length;
            results.push({ 
              type, 
              deleted: 0, 
              skipped: (ids as string[]).length,
              error: 'Impossibile eliminare categorie con menu fissi associati'
            });
            continue;
          }
          
          const deletedCategorieMenuFisso = await prisma.categoriaMenuFisso.deleteMany({
            where: { 
              id: { in: ids as string[] },
              deletedAt: { not: null }
            }
          });
          deleted = deletedCategorieMenuFisso.count;
          skipped = (ids as string[]).length - deleted;
          break;

        case 'allergene':
          const deletedAllergeni = await prisma.allergene.deleteMany({
            where: { 
              id: { in: ids as string[] },
              deletedAt: { not: null }
            }
          });
          deleted = deletedAllergeni.count;
          skipped = (ids as string[]).length - deleted;
          break;

        case 'piatto':
          const deletedPiatti = await prisma.piatto.deleteMany({
            where: { 
              id: { in: ids as string[] },
              deletedAt: { not: null }
            }
          });
          deleted = deletedPiatti.count;
          skipped = (ids as string[]).length - deleted;
          break;

        case 'servizio-accessorio':
          const deletedServizi = await prisma.servizioAccessorio.deleteMany({
            where: { 
              id: { in: ids as string[] },
              deletedAt: { not: null }
            }
          });
          deleted = deletedServizi.count;
          skipped = (ids as string[]).length - deleted;
          break;

        case 'menu-fisso':
          const deletedMenuFissi = await prisma.menuFisso.deleteMany({
            where: { 
              id: { in: ids as string[] },
              deletedAt: { not: null }
            }
          });
          deleted = deletedMenuFissi.count;
          skipped = (ids as string[]).length - deleted;
          break;
      }

      totalDeleted += deleted;
      totalSkipped += skipped;
      results.push({ type, deleted, skipped });
    }

    let message = `Eliminati definitivamente ${totalDeleted} elemento/i`;
    if (totalSkipped > 0) {
      message += `. ${totalSkipped} elemento/i non eliminati (già eliminati o con dipendenze).`;
    }

    res.json({ 
      success: true, 
      message,
      deletedCount: totalDeleted,
      skippedCount: totalSkipped,
      results
    });
  } catch (error) {
    console.error('Errore nell\'eliminazione definitiva degli elementi:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Si è verificato un errore durante l\'eliminazione definitiva' 
    });
  }
});

export default router; 