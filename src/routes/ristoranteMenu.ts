import express from 'express';
import { PrismaClient } from '@prisma/client';
import { mainMenuItems } from '../config/mainMenu';
import { ristoranteMenuItems } from '../config/sectionMenu';
import { ristoranteMenuImpostazioniSubItems } from '../config/subSectionMenu';
import { sectionIcons } from '../config/sectionIcons';
import { uiIcons } from '../config/uiIcons';
import { elementiCancellatiTableData, serviziTableData, piattiTableData, menuFissiTableData } from '../config/sectionTableData';
import { getCountText } from '../config/pluralHelper';
import { isAuthenticated } from '../middlewares/auth';
import { 
  allergeniConfig, 
  categoriaMenuFissoConfig, 
  categoriaPiattiConfig,
  generatePageTitle
} from '../config/subSectionConfig';
import { 
  piattoFormData
} from '../config/sectionFormData';
import { menuFissoFormData } from '../config/menuFissoFormData';
import { 
  allergeneFormData, 
  categoriaMenuFissoFormData, 
  categoriaPiattiFormData,
  servizioFormData
} from '../config/subSectionFormData';
import { createSubSectionActionNav, actionNavConfigs } from '../config/actionNavConfig';
import { scriptManager } from '../config/scriptManager';
import { getPaginationParams, calculatePagination } from '../config/paginationHelper';
import { 
  serviziDetailViewConfig,
  piattiDetailViewConfig,
  allergeniDetailViewConfig,
  categoriaMenuFissoDetailViewConfig,
  categoriaPiattiDetailViewConfig,
  getDetailViewConfig
} from '../config/detailViewConfig';

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
    currentPath,
    scripts: scriptManager.getScriptsForPage('dashboard')
  });
});

// === SEZIONI PRINCIPALI ===
router.get('/servizi', async (req, res) => {
  try {
    const currentPath = '/ristorante-menu/servizi';
    let sectionMenu = ristoranteMenuItems;
    
    // Gestione paginazione
    const paginationConfig = getPaginationParams(req, 20);
    
    // Conta totale elementi
    const totalItems = await prisma.servizioAccessorio.count({
      where: {
        deletedAt: null
      }
    });
    
    // Recupera i servizi dal database con paginazione
    const servizi = await prisma.servizioAccessorio.findMany({
      where: {
        deletedAt: null
      },
      orderBy: {
        nome: 'asc'
      },
      skip: paginationConfig.offset,
      take: paginationConfig.limit
    });
    
    // Calcola informazioni di paginazione
    const pagination = calculatePagination(
      totalItems,
      paginationConfig.page,
      paginationConfig.limit
    );
    
    // Gestire messaggi di successo/errore
    const successMessage = req.query.success ? decodeURIComponent(req.query.success as string) : undefined;
    const errorMessage = req.query.error ? decodeURIComponent(req.query.error as string) : undefined;
    
    // Configurazione actionNav per questa pagina
    const actionNavConfig = actionNavConfigs['servizi.index'];
    
    res.render('pages/ristorante-menu/servizi/index', {
      title: 'Servizi',
      description: 'Gestisci i servizi del ristorante',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionIcons,
      currentPath,
      scripts: scriptManager.getScriptsForPage('table'),
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Servizi', href: '/ristorante-menu/servizi' }
      ],
      items: servizi,
      hasItems: totalItems > 0,
      pagination,
      tableData: serviziTableData,
      success: successMessage ? [successMessage] : undefined,
      error: errorMessage,
      actionNavConfig,
      emptyState: {
        title: 'Nessun servizio disponibile',
        description: 'Non ci sono servizi configurati nel sistema. Aggiungi il primo servizio per iniziare.',
        buttonText: 'Aggiungi servizio',
        buttonHref: '/ristorante-menu/servizi/nuovo',
        iconName: 'menu',
        icon: sectionIcons['menu'],
        buttonIconName: 'piu',
        buttonIcon: uiIcons['piu']
      }
    });
  } catch (error) {
    console.error('Errore nel recupero dei servizi:', error);
    res.status(500).send('Errore interno del server');
  }
});

// === ROUTE CRUD SERVIZI ===
router.get('/servizi/nuovo', (req, res) => {
  const currentPath = '/ristorante-menu/servizi/nuovo';
  let sectionMenu = ristoranteMenuItems;
  
  const formConfig = servizioFormData.getFormData ? servizioFormData.getFormData(servizioFormData, false) : servizioFormData;
  
  // Configurazione actionNav per questa pagina
  const actionNavConfig = actionNavConfigs['servizi.new'];

  res.render('pages/ristorante-menu/servizi/new', {
    title: 'Nuovo Servizio',
    description: 'Crea un nuovo servizio per il ristorante',
    layout: 'layouts/sections',
    mainMenu: mainMenuItems,
    sectionMenu,
    sectionIcons,
    currentPath,
    formConfig,
    itemType: 'Servizio',
    backUrl: '/ristorante-menu/servizi',
    actionNavConfig,
    scripts: scriptManager.getScriptsForPage('form'),
    isInternalPage: true,
    breadcrumbs: [
      { label: 'Menu Ristorante', href: '/ristorante-menu' },
      { label: 'Servizi', href: '/ristorante-menu/servizi' },
      { label: 'Nuovo Servizio', href: '/ristorante-menu/servizi/nuovo' }
    ]
  });
});

router.post('/servizi/nuovo', async (req, res) => {
  const { nome, descrizione, prezzo, inLista } = req.body;
  
  try {
    // Verifica se esiste già un servizio con lo stesso nome
    const existingServizio = await prisma.servizioAccessorio.findFirst({
      where: { 
        nome,
        deletedAt: null
      }
    });

    if (existingServizio) {
      const formConfig = servizioFormData.getFormData ? servizioFormData.getFormData(servizioFormData, false, null, req.body) : servizioFormData;
      
      // Configurazione actionNav per questa pagina
      const actionNavConfig = actionNavConfigs['servizi.new'];
      
      return res.status(400).render('pages/ristorante-menu/servizi/new', {
        title: 'Nuovo Servizio',
        description: 'Crea un nuovo servizio per il ristorante',
        layout: 'layouts/sections',
        mainMenu: mainMenuItems,
        sectionMenu: ristoranteMenuItems,
        sectionIcons,
        currentPath: '/ristorante-menu/servizi/nuovo',
        formConfig,
        itemType: 'Servizio',
        backUrl: '/ristorante-menu/servizi',
        actionNavConfig,
        scripts: scriptManager.getScriptsForPage('form'),
        isInternalPage: true,
        breadcrumbs: [
          { label: 'Menu Ristorante', href: '/ristorante-menu' },
          { label: 'Servizi', href: '/ristorante-menu/servizi' },
          { label: 'Nuovo Servizio', href: '/ristorante-menu/servizi/nuovo' }
        ],
        error: 'Un servizio con questo nome esiste già'
      });
    }

    const servizio = await prisma.servizioAccessorio.create({
      data: {
        nome,
        descrizione: descrizione || null,
        prezzo: parseFloat(prezzo),
        inLista: inLista === 'on' || inLista === true
      }
    });

    return res.redirect(`/ristorante-menu/servizi/dettagli/${servizio.id}?success=Servizio creato con successo`);
  } catch (error) {
    console.error('Errore nella creazione del servizio:', error);
    
    const formConfig = servizioFormData.getFormData ? servizioFormData.getFormData(servizioFormData, false, null, req.body) : servizioFormData;
    
    // Configurazione actionNav per questa pagina
    const actionNavConfig = actionNavConfigs['servizi.new'];
    
    res.status(500).render('pages/ristorante-menu/servizi/new', {
      title: 'Nuovo Servizio',
      description: 'Crea un nuovo servizio per il ristorante',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu: ristoranteMenuItems,
      sectionIcons,
      currentPath: '/ristorante-menu/servizi/nuovo',
      formConfig,
      itemType: 'Servizio',
      backUrl: '/ristorante-menu/servizi',
      actionNavConfig,
      scripts: scriptManager.getScriptsForPage('form'),
      isInternalPage: true,
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Servizi', href: '/ristorante-menu/servizi' },
        { label: 'Nuovo Servizio', href: '/ristorante-menu/servizi/nuovo' }
      ],
      error: 'Si è verificato un errore durante la creazione del servizio'
    });
  }
});

// Route per visualizzare servizio
router.get('/servizi/dettagli/:id', async (req, res) => {
  try {
    const currentPath = '/ristorante-menu/servizi/dettagli/' + req.params.id;
    let sectionMenu = ristoranteMenuItems;
    
    const servizio = await prisma.servizioAccessorio.findFirst({
      where: { 
        id: req.params.id,
        deletedAt: null
      }
    });

    if (!servizio) {
      return res.status(404).send('Servizio non trovato');
    }

    const actionNavConfig = { ...actionNavConfigs['servizi.view'] };
    // Sostituisci :id con l'ID effettivo del servizio
    if (actionNavConfig.actions) {
      actionNavConfig.actions = actionNavConfig.actions.map(action => {
        if (action.type === 'link' && action.href?.includes(':id')) {
          return {
            ...action,
            href: action.href.replace(':id', servizio.id)
          };
        }
        return action;
      });
    }

    res.render('pages/ristorante-menu/servizi/view', {
      title: 'Dettagli Servizio',
      description: 'Informazioni dettagliate del servizio',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionIcons,
      currentPath,
      item: servizio,
      itemType: 'Servizio',
      backUrl: '/ristorante-menu/servizi',
      actionNavConfig,
      detailViewConfig: serviziDetailViewConfig,
      scripts: scriptManager.getScriptsForPage('dashboard'),
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Servizi', href: '/ristorante-menu/servizi' },
        { label: servizio.nome, href: `/ristorante-menu/servizi/dettagli/${servizio.id}` }
      ]
    });
  } catch (error) {
    console.error('Errore nel recupero del servizio:', error);
    res.status(500).send('Errore interno del server');
  }
});

router.get('/servizi/modifica/:id', async (req, res) => {
  const currentPath = '/ristorante-menu/servizi/modifica';
  let sectionMenu = ristoranteMenuItems;
  
  try {
    const servizio = await prisma.servizioAccessorio.findFirst({
      where: { 
        id: req.params.id,
        deletedAt: null
      }
    });

    if (!servizio) {
      return res.status(404).render('error', {
        title: 'Servizio non trovato',
        layout: 'layouts/sections',
        mainMenu: mainMenuItems,
        sectionMenu,
        sectionIcons,
        currentPath,
        breadcrumbs: [
          { label: 'Menu Ristorante', href: '/ristorante-menu' },
          { label: 'Servizi', href: '/ristorante-menu/servizi' },
          { label: 'Servizio non trovato', href: `/ristorante-menu/servizi/modifica/${req.params.id}` }
        ],
        error: 'Il servizio richiesto non esiste'
      });
    }

    const formConfig = servizioFormData.getFormData ? servizioFormData.getFormData(servizioFormData, true, servizio) : servizioFormData;
    const actionNavConfig = actionNavConfigs['servizi.edit'];
    const customTitle = `Modifica servizio: ${servizio.nome}`;

    res.render('pages/ristorante-menu/servizi/edit', {
      title: 'Modifica Servizio',
      customTitle,
      description: 'Modifica i dettagli del servizio',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionIcons,
      currentPath,
      item: servizio,
      formConfig,
      itemType: 'Servizio',
      detailUrl: `/ristorante-menu/servizi/dettagli/${servizio.id}`,
      actionNavConfig,
      scripts: scriptManager.getScriptsForPage('form'),
      isInternalPage: true,
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Servizi', href: '/ristorante-menu/servizi' },
        { label: servizio.nome, href: `/ristorante-menu/servizi/modifica/${servizio.id}` }
      ]
    });
  } catch (error) {
    console.error('Errore nel recupero del servizio per modifica:', error);
    res.status(500).render('error', {
      title: 'Errore',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionIcons,
      currentPath,
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Servizi', href: '/ristorante-menu/servizi' },
        { label: 'Errore', href: `/ristorante-menu/servizi/modifica/${req.params.id}` }
      ],
      error: 'Si è verificato un errore nel recupero del servizio'
    });
  }
});

router.post('/servizi/modifica/:id', async (req, res) => {
  const { nome, descrizione, prezzo, inLista } = req.body;
  const servizioId = req.params.id;
  
  try {
    const existingServizio = await prisma.servizioAccessorio.findUnique({
      where: { id: servizioId }
    });

    if (!existingServizio) {
      return res.status(404).render('error', {
        title: 'Servizio non trovato',
        layout: 'layouts/sections',
        mainMenu: mainMenuItems,
        sectionMenu: ristoranteMenuItems,
        sectionIcons,
        currentPath: '/ristorante-menu/servizi/modifica',
        breadcrumbs: [
          { label: 'Menu Ristorante', href: '/ristorante-menu' },
          { label: 'Servizi', href: '/ristorante-menu/servizi' },
          { label: 'Servizio non trovato', href: `/ristorante-menu/servizi/modifica/${servizioId}` }
        ],
        error: 'Il servizio richiesto non esiste'
      });
    }

    if (nome !== existingServizio.nome) {
      const servizioWithSameName = await prisma.servizioAccessorio.findFirst({
        where: { 
          nome,
          deletedAt: null
        }
      });

      if (servizioWithSameName) {
        return res.status(400).render('pages/ristorante-menu/servizi/edit', {
          title: 'Modifica Servizio',
          description: 'Modifica i dettagli del servizio',
          layout: 'layouts/sections',
          mainMenu: mainMenuItems,
          sectionMenu: ristoranteMenuItems,
          sectionIcons,
          currentPath: '/ristorante-menu/servizi/modifica',
          item: existingServizio,
          itemType: 'Servizio',
          detailUrl: `/ristorante-menu/servizi/dettagli/${existingServizio.id}`,
          scripts: scriptManager.getScriptsForPage('form'),
          breadcrumbs: [
            { label: 'Menu Ristorante', href: '/ristorante-menu' },
            { label: 'Servizi', href: '/ristorante-menu/servizi' },
            { label: existingServizio.nome, href: `/ristorante-menu/servizi/modifica/${existingServizio.id}` }
          ],
          error: 'Un altro servizio con questo nome esiste già',
          formData: req.body
        });
      }
    }

    const updatedServizio = await prisma.servizioAccessorio.update({
      where: { id: servizioId },
      data: {
        nome,
        descrizione: descrizione || null,
        prezzo: parseFloat(prezzo),
        inLista: inLista === 'on' || inLista === true
      }
    });

    return res.redirect(`/ristorante-menu/servizi/dettagli/${updatedServizio.id}?success=Servizio aggiornato con successo`);
  } catch (error) {
    console.error('Errore nell\'aggiornamento del servizio:', error);
    
    // Recupera il servizio per il rendering dell'errore
    let existingServizio = null;
    try {
      existingServizio = await prisma.servizioAccessorio.findUnique({
        where: { id: servizioId }
      });
    } catch (dbError) {
      console.error('Errore nel recupero del servizio per rendering errore:', dbError);
    }
    
    res.status(500).render('pages/ristorante-menu/servizi/edit', {
      title: 'Modifica Servizio',
      description: 'Modifica i dettagli del servizio',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu: ristoranteMenuItems,
      sectionIcons,
      currentPath: '/ristorante-menu/servizi/modifica',
      item: existingServizio,
      itemType: 'Servizio',
      detailUrl: existingServizio ? `/ristorante-menu/servizi/dettagli/${servizioId}` : undefined,
      scripts: scriptManager.getScriptsForPage('form'),
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Servizi', href: '/ristorante-menu/servizi' },
        { label: existingServizio?.nome || 'Modifica Servizio', href: `/ristorante-menu/servizi/modifica/${servizioId}` }
      ],
      error: 'Si è verificato un errore durante l\'aggiornamento del servizio',
      formData: req.body
    });
  }
});

// Route per eliminazione singola servizio
router.delete('/servizi/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.servizioAccessorio.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    });
    
    res.json({ success: true, message: 'Servizio eliminato con successo' });
  } catch (error) {
    console.error('Errore nell\'eliminazione del servizio:', error);
    res.status(500).json({ success: false, message: 'Errore nell\'eliminazione' });
  }
});

// Route per eliminazione multipla servizi
router.delete('/servizi', async (req, res) => {
  const { itemIds } = req.body;
  
  if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
    return res.status(400).json({ 
      success: false, 
      message: 'Nessun servizio selezionato per la cancellazione' 
    });
  }
  
  try {
    // Verifica che tutti i servizi esistano e non siano già cancellati
    const existingServizi = await prisma.servizioAccessorio.findMany({
      where: { 
        id: { in: itemIds },
        deletedAt: null
      }
    });

    if (existingServizi.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Nessun servizio valido trovato per la cancellazione' 
      });
    }

    // Esegui soft delete per tutti i servizi validi
    const validServizioIds = existingServizi.map(servizio => servizio.id);
    await prisma.servizioAccessorio.updateMany({
      where: { 
        id: { in: validServizioIds }
      },
      data: { 
        deletedAt: new Date() 
      }
    });

    const deletedCount = validServizioIds.length;
    const skippedCount = itemIds.length - validServizioIds.length;
    
    let message = `Eliminati ${deletedCount} servizio/i con successo`;
    if (skippedCount > 0) {
      message += `. ${skippedCount} servizio/i già cancellati o non trovati.`;
    }

    res.json({ 
      success: true, 
      message,
      deletedCount,
      skippedCount
    });
  } catch (error) {
    console.error('Errore nella cancellazione dei servizi:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Si è verificato un errore durante la cancellazione' 
    });
  }
});

// === SEZIONE PIATTI ===

// Route per visualizzare lista piatti
router.get('/piatti', async (req, res) => {
  try {
    const currentPath = '/ristorante-menu/piatti';
    let sectionMenu = ristoranteMenuItems;
    
    // Parametri di paginazione
    const { page, limit, offset } = getPaginationParams(req);
    
    // Recupera i piatti con le relazioni
    const piatti = await prisma.piatto.findMany({
      where: {
        deletedAt: null
      },
      include: {
        categoria: true,
        allergeni: {
          include: {
            allergene: true
          }
        }
      },
      orderBy: {
        nome: 'asc'
      },
      skip: offset,
      take: limit
    });
    
    // Trasforma i dati per la tabella
    const items = piatti.map(piatto => ({
      ...piatto,
      categoria_nome: piatto.categoria.nome,
      allergeni_count: getCountText(piatto.allergeni.length, 'allergene')
    }));
    
    // Calcola paginazione
    const totalItems = await prisma.piatto.count({
      where: { deletedAt: null }
    });
    
    const pagination = calculatePagination(page, limit, totalItems);
    
    // Configurazione actionNav per questa pagina
    const actionNavConfig = actionNavConfigs['piatti.index'];
    
    res.render('pages/ristorante-menu/piatti/index', {
      title: 'Piatti',
      description: 'Gestione piatti del menu',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionIcons,
      currentPath,
      tableData: piattiTableData,
      items,
      hasItems: items.length > 0,
      pagination,
      scripts: scriptManager.getScriptsForPage('table'),
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Piatti', href: '/ristorante-menu/piatti' }
      ],
      actionNavConfig,
      emptyState: {
        title: 'Nessun piatto disponibile',
        description: 'Non ci sono piatti configurati nel sistema. Aggiungi il primo piatto per iniziare.',
        buttonText: 'Aggiungi piatto',
        buttonHref: '/ristorante-menu/piatti/nuovo',
        iconName: 'menu',
        icon: sectionIcons['menu'],
        buttonIconName: 'piu',
        buttonIcon: uiIcons['piu']
      }
    });
  } catch (error) {
    console.error('Errore nel recupero dei piatti:', error);
    res.status(500).send('Errore interno del server');
  }
});

// Route per form nuovo piatto
router.get('/piatti/nuovo', async (req, res) => {
  try {
    const currentPath = '/ristorante-menu/piatti/nuovo';
    let sectionMenu = ristoranteMenuItems;
    
    // Recupera categorie e allergeni per i select
    const categorie = await prisma.categoriaPiatti.findMany({
      where: { deletedAt: null, inLista: true },
      orderBy: { nome: 'asc' }
    });
    
    const allergeni = await prisma.allergene.findMany({
      where: { deletedAt: null },
      orderBy: { nome: 'asc' }
    });
    
    // Configura il form
    const formConfig = piattoFormData.getFormData ? 
      piattoFormData.getFormData(piattoFormData, false) : 
      piattoFormData;
    
    // Popola le opzioni dei select
    formConfig.fields.forEach((field: any) => {
      if (field.name === 'categoriaId') {
        field.options = categorie.map(cat => ({
          value: cat.id,
          label: cat.nome
        }));
      } else if (field.name === 'allergeni') {
        field.options = allergeni.map(all => ({
          value: all.id,
          label: all.nome
        }));
      }
    });
    
    // Configurazione actionNav per questa pagina
    const actionNavConfig = actionNavConfigs['piatti.new'];
    
    res.render('pages/ristorante-menu/piatti/new', {
      title: 'Nuovo Piatto',
      description: 'Crea un nuovo piatto per il menu',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionIcons,
      currentPath,
      formConfig: formConfig.formConfig,
      fields: formConfig.fields,
      buttons: formConfig.buttons,
      scripts: scriptManager.getScriptsForPage('form'),
      actionNavConfig,
      isInternalPage: true,
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Piatti', href: '/ristorante-menu/piatti' },
        { label: 'Nuovo Piatto', href: '/ristorante-menu/piatti/nuovo' }
      ]
    });
  } catch (error) {
    console.error('Errore nel caricamento del form nuovo piatto:', error);
    res.status(500).send('Errore interno del server');
  }
});

// Route per creazione piatto
router.post('/piatti/nuovo', async (req, res) => {
  try {
    const { nome, descrizione, categoriaId, prezzo, allergeni, inLista } = req.body;
    
    // Crea il piatto
    const piatto = await prisma.piatto.create({
      data: {
        nome,
        descrizione: descrizione || null,
        categoriaId,
        prezzo: parseFloat(prezzo),
        inLista: inLista === 'true' || inLista === true
      }
    });
    
    // Associa gli allergeni se presenti
    if (allergeni && Array.isArray(allergeni) && allergeni.length > 0) {
      await prisma.piattoAllergene.createMany({
        data: allergeni.map((allergeneId: string) => ({
          piattoId: piatto.id,
          allergeneId
        }))
      });
    }
    
    return res.redirect(`/ristorante-menu/piatti/dettagli/${piatto.id}?success=Piatto creato con successo`);
  } catch (error) {
    console.error('Errore nella creazione del piatto:', error);
    
    const formConfig = piattoFormData.getFormData ? piattoFormData.getFormData(piattoFormData, false, null, req.body) : piattoFormData;
    
    res.status(400).render('pages/ristorante-menu/piatti/new', {
      title: 'Nuovo Piatto',
      description: 'Crea un nuovo piatto per il menu',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu: ristoranteMenuItems,
      sectionIcons,
      currentPath: '/ristorante-menu/piatti/nuovo',
      formConfig: formConfig.formConfig,
      fields: formConfig.fields,
      buttons: formConfig.buttons,
      scripts: scriptManager.getScriptsForPage('form'),
      error: ['Errore durante la creazione del piatto'],
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Piatti', href: '/ristorante-menu/piatti' },
        { label: 'Nuovo Piatto', href: '/ristorante-menu/piatti/nuovo' }
      ]
    });
  }
});

// Route per visualizzare piatto
router.get('/piatti/dettagli/:id', async (req, res) => {
  try {
    const currentPath = '/ristorante-menu/piatti/dettagli/' + req.params.id;
    let sectionMenu = ristoranteMenuItems;
    
    const piatto = await prisma.piatto.findFirst({
      where: { 
        id: req.params.id,
        deletedAt: null
      },
      include: {
        categoria: true,
        allergeni: {
          include: {
            allergene: true
          }
        }
      }
    });

    if (!piatto) {
      return res.status(404).send('Piatto non trovato');
    }

    // Trasforma i dati per la vista
    const item = {
      ...piatto,
      categoria_nome: piatto.categoria.nome
    };

    const actionNavConfig = { ...actionNavConfigs['piatti.view'] };
    // Sostituisci :id con l'ID effettivo del piatto
    if (actionNavConfig.actions) {
      actionNavConfig.actions = actionNavConfig.actions.map(action => {
        if (action.type === 'link' && action.href?.includes(':id')) {
          return {
            ...action,
            href: action.href.replace(':id', piatto.id)
          };
        }
        return action;
      });
    }

    res.render('pages/ristorante-menu/piatti/view', {
      title: 'Dettagli Piatto',
      description: 'Informazioni dettagliate del piatto',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionIcons,
      currentPath,
      item,
      itemType: 'Piatto',
      backUrl: '/ristorante-menu/piatti',
      actionNavConfig,
      detailViewConfig: piattiDetailViewConfig,
      scripts: scriptManager.getScriptsForPage('dashboard'),
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Piatti', href: '/ristorante-menu/piatti' },
        { label: piatto.nome, href: `/ristorante-menu/piatti/dettagli/${piatto.id}` }
      ]
    });
  } catch (error) {
    console.error('Errore nel recupero del piatto:', error);
    res.status(500).send('Errore interno del server');
  }
});

// Route per form modifica piatto
router.get('/piatti/modifica/:id', async (req, res) => {
  try {
    const currentPath = '/ristorante-menu/piatti/modifica/' + req.params.id;
    let sectionMenu = ristoranteMenuItems;
    
    const piatto = await prisma.piatto.findFirst({
      where: { 
        id: req.params.id,
        deletedAt: null
      },
      include: {
        categoria: true,
        allergeni: {
          include: {
            allergene: true
          }
        }
      }
    });

    if (!piatto) {
      return res.status(404).send('Piatto non trovato');
    }

    // Recupera categorie e allergeni per i select
    const categorie = await prisma.categoriaPiatti.findMany({
      where: { deletedAt: null, inLista: true },
      orderBy: { nome: 'asc' }
    });
    
    const allergeni = await prisma.allergene.findMany({
      where: { deletedAt: null },
      orderBy: { nome: 'asc' }
    });
    
    // Configura il form
    const formConfig = piattoFormData.getFormData ? 
      piattoFormData.getFormData(piattoFormData, true, piatto) : 
      piattoFormData;
    
    // Popola le opzioni dei select
    formConfig.fields.forEach((field: any) => {
      if (field.name === 'categoriaId') {
        field.options = categorie.map(cat => ({
          value: cat.id,
          label: cat.nome
        }));
      } else if (field.name === 'allergeni') {
        field.options = allergeni.map(all => ({
          value: all.id,
          label: all.nome
        }));
      }
    });

    // Configurazione actionNav per questa pagina
    const actionNavConfig = actionNavConfigs['piatti.edit'];

    res.render('pages/ristorante-menu/piatti/edit', {
      title: 'Modifica Piatto',
      description: 'Modifica i dettagli del piatto',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionIcons,
      currentPath,
      formConfig: formConfig.formConfig,
      fields: formConfig.fields,
      buttons: formConfig.buttons,
      item: piatto,
      itemType: 'Piatto',
      detailUrl: `/ristorante-menu/piatti/dettagli/${piatto.id}`,
      scripts: scriptManager.getScriptsForPage('form'),
      actionNavConfig,
      isInternalPage: true,
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Piatti', href: '/ristorante-menu/piatti' },
        { label: piatto.nome, href: `/ristorante-menu/piatti/modifica/${piatto.id}` }
      ]
    });
  } catch (error) {
    console.error('Errore nel caricamento del form modifica piatto:', error);
    res.status(500).send('Errore interno del server');
  }
});

// Route per aggiornamento piatto
router.post('/piatti/modifica/:id', async (req, res) => {
  try {
    const piattoId = req.params.id;
    const { nome, descrizione, categoriaId, prezzo, allergeni, inLista } = req.body;
    
    // Verifica che il piatto esista
    const existingPiatto = await prisma.piatto.findFirst({
      where: { 
        id: piattoId,
        deletedAt: null
      }
    });

    if (!existingPiatto) {
      return res.status(404).send('Piatto non trovato');
    }

    // Aggiorna il piatto
    const updatedPiatto = await prisma.piatto.update({
      where: { id: piattoId },
      data: {
        nome,
        descrizione: descrizione || null,
        categoriaId,
        prezzo: parseFloat(prezzo),
        inLista: inLista === 'true' || inLista === true
      }
    });

    // Aggiorna gli allergeni
    // Prima rimuovi tutte le associazioni esistenti
    await prisma.piattoAllergene.deleteMany({
      where: { piattoId }
    });

    // Poi aggiungi le nuove associazioni
    if (allergeni && Array.isArray(allergeni) && allergeni.length > 0) {
      await prisma.piattoAllergene.createMany({
        data: allergeni.map((allergeneId: string) => ({
          piattoId,
          allergeneId
        }))
      });
    }

    return res.redirect(`/ristorante-menu/piatti/dettagli/${updatedPiatto.id}?success=Piatto aggiornato con successo`);
  } catch (error) {
    console.error('Errore nell\'aggiornamento del piatto:', error);
    
    // Recupera il piatto per il rendering dell'errore
    let existingPiatto = null;
    try {
      existingPiatto = await prisma.piatto.findFirst({
        where: { id: req.params.id, deletedAt: null }
      });
    } catch (e) {
      console.error('Errore nel recupero del piatto per errore:', e);
    }

    res.status(500).render('pages/ristorante-menu/piatti/edit', {
      title: 'Modifica Piatto',
      description: 'Modifica i dettagli del piatto',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu: ristoranteMenuItems,
      sectionIcons,
      currentPath: '/ristorante-menu/piatti/modifica',
      item: existingPiatto,
      itemType: 'Piatto',
      detailUrl: existingPiatto ? `/ristorante-menu/piatti/dettagli/${req.params.id}` : undefined,
      scripts: scriptManager.getScriptsForPage('form'),
      error: ['Errore durante l\'aggiornamento del piatto'],
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Piatti', href: '/ristorante-menu/piatti' },
        { label: existingPiatto?.nome || 'Modifica Piatto', href: `/ristorante-menu/piatti/modifica/${req.params.id}` }
      ]
    });
  }
});

// Route per modifica massiva piatti
router.get('/piatti/modifica-massa', async (req, res) => {
  const currentPath = '/ristorante-menu/piatti/modifica-massa';
  let sectionMenu = ristoranteMenuItems;
  
  const piattoIds = req.query.ids ? (req.query.ids as string).split(',') : [];
  
  if (piattoIds.length === 0) {
    return res.redirect('/ristorante-menu/piatti');
  }

  try {
    // Recupera i piatti selezionati
    const piatti = await prisma.piatto.findMany({
      where: {
        id: { in: piattoIds },
        deletedAt: null
      },
      include: {
        categoria: true
      },
      orderBy: { nome: 'asc' }
    });

    if (piatti.length === 0) {
      return res.redirect('/ristorante-menu/piatti');
    }

    // Recupera categorie per il select
    const categorie = await prisma.categoriaPiatti.findMany({
      where: { deletedAt: null, inLista: true },
      orderBy: { nome: 'asc' }
    });

    // Configura il form per modifica massiva
    const formConfig = piattoFormData.getFormData ? 
      piattoFormData.getFormData(piattoFormData, false, null, null, true, piatti) : 
      piattoFormData;
    
    // Popola le opzioni del select categoria
    formConfig.fields.forEach((field: any) => {
      if (field.name === 'categoriaId') {
        field.options = categorie.map(cat => ({
          value: cat.id,
          label: cat.nome
        }));
      }
    });

    // Configurazione actionNav per questa pagina
    const actionNavConfig = actionNavConfigs['piatti.editBulk'];

    res.render('pages/ristorante-menu/piatti/editBulk', {
      title: 'Modifica Massiva Piatti',
      description: `Modifica ${piatti.length} piatti selezionati`,
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionIcons,
      currentPath,
      formConfig: formConfig.formConfig,
      fields: formConfig.fields,
      buttons: formConfig.buttons,
      selectedItems: piatti,
      itemType: 'Piatto',
      scripts: scriptManager.getScriptsForPage('form'),
      actionNavConfig,
      isInternalPage: true,
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Piatti', href: '/ristorante-menu/piatti' },
        { label: 'Modifica Massiva', href: '/ristorante-menu/piatti/modifica-massa' }
      ]
    });
  } catch (error) {
    console.error('Errore nel caricamento della modifica massiva piatti:', error);
    res.status(500).send('Errore interno del server');
  }
});

// Route per aggiornamento massivo piatti
router.post('/piatti/modifica-massa', async (req, res) => {
  try {
    const { itemIds, categoriaId, prezzo, inLista } = req.body;
    
    if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Nessun piatto selezionato' 
      });
    }

    // Prepara i dati da aggiornare
    const updateData: any = {};
    
    if (categoriaId && categoriaId !== '') {
      updateData.categoriaId = categoriaId;
    }
    
    if (prezzo && prezzo !== '') {
      updateData.prezzo = parseFloat(prezzo);
    }
    
    if (inLista !== undefined && inLista !== '') {
      updateData.inLista = inLista === 'true' || inLista === true;
    }

    // Aggiorna i piatti
    const updatedCount = await prisma.piatto.updateMany({
      where: {
        id: { in: itemIds },
        deletedAt: null
      },
      data: updateData
    });

    return res.json({
      success: true,
      message: `Aggiornati ${updatedCount.count} piatti con successo`,
      redirectUrl: '/ristorante-menu/piatti'
    });
  } catch (error) {
    console.error('Errore nell\'aggiornamento massivo dei piatti:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Errore durante l\'aggiornamento massivo' 
    });
  }
});

// Route per eliminazione singola piatto
router.delete('/piatti/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.piatto.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    });

    res.json({
      success: true,
      message: 'Piatto eliminato con successo'
    });
  } catch (error) {
    console.error('Errore nell\'eliminazione del piatto:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Errore durante l\'eliminazione del piatto' 
    });
  }
});

// Route per eliminazione multipla piatti
router.delete('/piatti', async (req, res) => {
  const { itemIds } = req.body;
  
  if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
    return res.status(400).json({ 
      success: false, 
      message: 'Nessun piatto selezionato' 
    });
  }

  try {
    const deletedCount = await prisma.piatto.updateMany({
      where: {
        id: { in: itemIds },
        deletedAt: null
      },
      data: {
        deletedAt: new Date()
      }
    });

    res.json({
      success: true,
      message: `Eliminati ${deletedCount.count} piatti con successo`
    });
  } catch (error) {
    console.error('Errore nell\'eliminazione multipla dei piatti:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Si è verificato un errore durante la cancellazione' 
    });
  }
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
    
    // Gestione paginazione
    const paginationConfig = getPaginationParams(req, 20);
    
    // Conta totale elementi
    const totalItems = await prisma.categoriaMenuFisso.count({
      where: {
        deletedAt: null
      }
    });
    
    // Recuperare le categorie menu fisso dal database con paginazione
    const categorieMenuFisso = await prisma.categoriaMenuFisso.findMany({
      where: {
        deletedAt: null
      },
      orderBy: {
        nome: 'asc'
      },
      skip: paginationConfig.offset,
      take: paginationConfig.limit
    });
    
    // Calcola informazioni di paginazione
    const pagination = calculatePagination(
      totalItems,
      paginationConfig.page,
      paginationConfig.limit
    );
    
    const config = { ...categoriaMenuFissoConfig };
    config.hasItems = totalItems > 0;
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
      scripts: scriptManager.getScriptsForPage('table'),
      tableConfigJson: JSON.stringify(config.tableConfig),
      tableInitScript: scriptManager.getTableInitScript(config.tableConfig.tableId),
      actionNavConfig,
      isInternalPage: false,
      pagination,
      ...config
    });
  } catch (error) {
    console.error('Errore nel recupero delle categorie menu fisso:', error);
    res.status(500).send('Errore interno del server');
  }
});

// Route AJAX per paginazione categoria menu fisso
router.get('/impostazioni/categoria-menu-fisso/ajax', async (req, res) => {
  try {
    // Gestione paginazione
    const paginationConfig = getPaginationParams(req, 20);
    
    // Conta totale elementi
    const totalItems = await prisma.categoriaMenuFisso.count({
      where: {
        deletedAt: null
      }
    });
    
    // Recuperare le categorie menu fisso dal database con paginazione
    const categorieMenuFisso = await prisma.categoriaMenuFisso.findMany({
      where: {
        deletedAt: null
      },
      orderBy: {
        nome: 'asc'
      },
      skip: paginationConfig.offset,
      take: paginationConfig.limit
    });
    
    // Calcola informazioni di paginazione
    const pagination = calculatePagination(
      totalItems,
      paginationConfig.page,
      paginationConfig.limit
    );
    
    const config = { ...categoriaMenuFissoConfig };
    config.hasItems = totalItems > 0;
    config.items = categorieMenuFisso;

    // Per ora, restituiamo solo i dati JSON
    // La tabella verrà aggiornata dal JavaScript frontend
    res.json({
      success: true,
      data: categorieMenuFisso,
      pagination,
      message: 'Dati caricati con successo'
    });
  } catch (error) {
    console.error('Errore nel recupero delle categorie menu fisso (AJAX):', error);
    res.status(500).json({
      success: false,
      message: 'Errore interno del server'
    });
  }
});

// === ROUTE PER MENU FISSI ===

// Route per visualizzare lista menu fissi
router.get('/menu-fissi', async (req, res) => {
  try {
    const currentPath = '/ristorante-menu/menu-fissi';
    let sectionMenu = ristoranteMenuItems;
    
    const { page, limit, offset } = getPaginationParams(req);
    
    const menuFissi = await prisma.menuFisso.findMany({
      where: {
        deletedAt: null
      },
      include: {
        categoria: true,
        piatti: {
          include: {
            piatto: true
          }
        },
        servizi: {
          include: {
            servizioAccessorio: true
          }
        }
      },
      orderBy: {
        nome: 'asc'
      },
      skip: offset,
      take: limit
    });
    
    const items = menuFissi.map(menu => ({
      ...menu,
      categoria_nome: menu.categoria.nome,
      piatti_count: getCountText(menu.piatti.length, 'piatto'),
      servizi_count: getCountText(menu.servizi.length, 'servizio')
    }));
    
    const totalItems = await prisma.menuFisso.count({
      where: { deletedAt: null }
    });
    
    const pagination = calculatePagination(page, limit, totalItems);
    
    // Configurazione actionNav per questa pagina
    const actionNavConfig = actionNavConfigs['menu-fissi.index'];
    
    res.render('pages/ristorante-menu/menu-fissi/index', {
      title: 'Menu Fissi',
      description: 'Gestione menu fissi del ristorante',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionIcons,
      currentPath,
      tableData: menuFissiTableData,
      items,
      hasItems: items.length > 0,
      pagination,
      scripts: scriptManager.getScriptsForPage('table'),
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Menu Fissi', href: '/ristorante-menu/menu-fissi' }
      ],
      actionNavConfig,
      emptyState: {
        title: 'Nessun menu fisso disponibile',
        description: 'Non ci sono menu fissi configurati nel sistema. Aggiungi il primo menu per iniziare.',
        buttonText: 'Aggiungi menu',
        buttonHref: '/ristorante-menu/menu-fissi/nuovo',
        iconName: 'menu',
        icon: sectionIcons['menu'],
        buttonIconName: 'piu',
        buttonIcon: uiIcons['piu']
      }
    });
  } catch (error) {
    console.error('Errore nel recupero dei menu fissi:', error);
    res.status(500).send('Errore interno del server');
  }
});

// Route per form nuovo menu fisso
router.get('/menu-fissi/nuovo', async (req, res) => {
  try {
    const currentPath = '/ristorante-menu/menu-fissi/nuovo';
    let sectionMenu = ristoranteMenuItems;
    
    // Recupera categorie, piatti e servizi per i select
    const categorie = await prisma.categoriaMenuFisso.findMany({
      where: { deletedAt: null, inLista: true },
      orderBy: { nome: 'asc' }
    });
    
    const piatti = await prisma.piatto.findMany({
      where: { deletedAt: null, inLista: true },
      orderBy: { nome: 'asc' }
    });
    
    const servizi = await prisma.servizioAccessorio.findMany({
      where: { deletedAt: null, inLista: true },
      orderBy: { nome: 'asc' }
    });
    
    // Configura il form
    const formConfig = menuFissoFormData.getFormData ? 
      menuFissoFormData.getFormData(menuFissoFormData, false) : 
      menuFissoFormData;
    
    // Popola le opzioni dei select
    formConfig.fields.forEach((field: any) => {
      if (field.name === 'categoriaId') {
        field.options = categorie.map(cat => ({
          value: cat.id,
          label: cat.nome
        }));
      } else if (field.name === 'piatti') {
        field.options = piatti.map(piatto => ({
          value: piatto.id,
          label: piatto.nome
        }));
      } else if (field.name === 'servizi') {
        field.options = servizi.map(servizio => ({
          value: servizio.id,
          label: servizio.nome
        }));
      }
    });
    
    // Configurazione actionNav per questa pagina
    const actionNavConfig = actionNavConfigs['menu-fissi.new'];
    
    res.render('pages/ristorante-menu/menu-fissi/new', {
      title: 'Nuovo Menu Fisso',
      description: 'Crea un nuovo menu fisso',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionIcons,
      currentPath,
      formConfig: formConfig.formConfig,
      fields: formConfig.fields,
      buttons: formConfig.buttons,
      scripts: scriptManager.getScriptsForPage('form'),
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Menu Fissi', href: '/ristorante-menu/menu-fissi' },
        { label: 'Nuovo', href: '/ristorante-menu/menu-fissi/nuovo' }
      ],
      actionNavConfig
    });
  } catch (error) {
    console.error('Errore nel caricamento del form nuovo menu fisso:', error);
    res.status(500).send('Errore interno del server');
  }
});

// Route per visualizzare menu fisso
router.get('/menu-fissi/dettagli/:id', async (req, res) => {
  try {
    const currentPath = '/ristorante-menu/menu-fissi/dettagli/' + req.params.id;
    let sectionMenu = ristoranteMenuItems;
    
    const menuFisso = await prisma.menuFisso.findFirst({
      where: { 
        id: req.params.id,
        deletedAt: null
      },
      include: {
        categoria: true,
        piatti: {
          include: {
            piatto: true
          }
        },
        servizi: {
          include: {
            servizioAccessorio: true
          }
        }
      }
    });

    if (!menuFisso) {
      return res.status(404).send('Menu fisso non trovato');
    }

    // Prepara i dati per la vista dettaglio
    const item = {
      ...menuFisso,
      categoria_nome: menuFisso.categoria.nome
    };

    // Configurazione actionNav per questa pagina
    const actionNavConfig = { ...actionNavConfigs['menu-fissi.view'] };
    // Sostituisci :id con l'ID effettivo del menu fisso
    if (actionNavConfig.actions) {
      actionNavConfig.actions = actionNavConfig.actions.map(action => {
        if (action.type === 'link' && action.href?.includes(':id')) {
          return {
            ...action,
            href: action.href.replace(':id', menuFisso.id)
          };
        }
        return action;
      });
    }

    // Configurazione vista dettaglio
    const detailViewConfig = getDetailViewConfig('menu-fissi');

    res.render('pages/ristorante-menu/menu-fissi/view', {
      title: `Menu Fisso: ${menuFisso.nome}`,
      description: `Dettagli del menu fisso ${menuFisso.nome}`,
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionIcons,
      currentPath,
      item,
      detailViewConfig,
      scripts: scriptManager.getScriptsForPage('detail'),
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Menu Fissi', href: '/ristorante-menu/menu-fissi' },
        { label: menuFisso.nome, href: `/ristorante-menu/menu-fissi/dettagli/${menuFisso.id}` }
      ],
      actionNavConfig
    });
  } catch (error) {
    console.error('Errore nel recupero del menu fisso:', error);
    res.status(500).send('Errore interno del server');
  }
});

// Route per form modifica menu fisso
router.get('/menu-fissi/modifica/:id', async (req, res) => {
  try {
    const currentPath = '/ristorante-menu/menu-fissi/modifica/' + req.params.id;
    let sectionMenu = ristoranteMenuItems;
    
    const menuFisso = await prisma.menuFisso.findFirst({
      where: { 
        id: req.params.id,
        deletedAt: null
      },
      include: {
        categoria: true,
        piatti: {
          include: {
            piatto: true
          }
        },
        servizi: {
          include: {
            servizioAccessorio: true
          }
        }
      }
    });

    if (!menuFisso) {
      return res.status(404).send('Menu fisso non trovato');
    }

    // Recupera categorie, piatti e servizi per i select
    const categorie = await prisma.categoriaMenuFisso.findMany({
      where: { deletedAt: null, inLista: true },
      orderBy: { nome: 'asc' }
    });
    
    const piatti = await prisma.piatto.findMany({
      where: { deletedAt: null, inLista: true },
      orderBy: { nome: 'asc' }
    });
    
    const servizi = await prisma.servizioAccessorio.findMany({
      where: { deletedAt: null, inLista: true },
      orderBy: { nome: 'asc' }
    });
    
    // Configura il form
    const formConfig = menuFissoFormData.getFormData ? 
      menuFissoFormData.getFormData(menuFissoFormData, true, menuFisso) : 
      menuFissoFormData;
    
    // Popola le opzioni dei select
    formConfig.fields.forEach((field: any) => {
      if (field.name === 'categoriaId') {
        field.options = categorie.map(cat => ({
          value: cat.id,
          label: cat.nome
        }));
      } else if (field.name === 'piatti') {
        field.options = piatti.map(piatto => ({
          value: piatto.id,
          label: piatto.nome
        }));
      } else if (field.name === 'servizi') {
        field.options = servizi.map(servizio => ({
          value: servizio.id,
          label: servizio.nome
        }));
      }
    });

    // Configurazione actionNav per questa pagina
    const actionNavConfig = actionNavConfigs['menu-fissi.edit'];

    res.render('pages/ristorante-menu/menu-fissi/edit', {
      title: 'Modifica Menu Fisso',
      description: 'Modifica i dettagli del menu fisso',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionIcons,
      currentPath,
      formConfig: formConfig.formConfig,
      fields: formConfig.fields,
      buttons: formConfig.buttons,
      item: menuFisso,
      scripts: scriptManager.getScriptsForPage('form'),
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Menu Fissi', href: '/ristorante-menu/menu-fissi' },
        { label: menuFisso.nome, href: `/ristorante-menu/menu-fissi/dettagli/${menuFisso.id}` },
        { label: 'Modifica', href: `/ristorante-menu/menu-fissi/modifica/${menuFisso.id}` }
      ],
      actionNavConfig
    });
  } catch (error) {
    console.error('Errore nel caricamento del form modifica menu fisso:', error);
    res.status(500).send('Errore interno del server');
  }
});

// Route per modifica massiva menu fissi
router.get('/menu-fissi/modifica-massa', async (req, res) => {
  const currentPath = '/ristorante-menu/menu-fissi/modifica-massa';
  let sectionMenu = ristoranteMenuItems;
  
  const menuFissoIds = req.query.ids ? (req.query.ids as string).split(',') : [];
  
  if (menuFissoIds.length === 0) {
    return res.redirect('/ristorante-menu/menu-fissi');
  }

  try {
    // Recupera i menu fissi selezionati
    const menuFissi = await prisma.menuFisso.findMany({
      where: {
        id: { in: menuFissoIds },
        deletedAt: null
      },
      include: {
        categoria: true
      },
      orderBy: { nome: 'asc' }
    });

    if (menuFissi.length === 0) {
      return res.redirect('/ristorante-menu/menu-fissi');
    }

    // Recupera categorie per il select
    const categorie = await prisma.categoriaMenuFisso.findMany({
      where: { deletedAt: null, inLista: true },
      orderBy: { nome: 'asc' }
    });

    // Configura il form per modifica massiva
    const formConfig = menuFissoFormData.getFormData ? 
      menuFissoFormData.getFormData(menuFissoFormData, false, null, null, true, menuFissi) : 
      menuFissoFormData;
    
    // Popola le opzioni del select categoria
    formConfig.fields.forEach((field: any) => {
      if (field.name === 'categoriaId') {
        field.options = categorie.map(cat => ({
          value: cat.id,
          label: cat.nome
        }));
      }
    });

    // Configurazione actionNav per questa pagina
    const actionNavConfig = actionNavConfigs['menu-fissi.editBulk'];

    res.render('pages/ristorante-menu/menu-fissi/editBulk', {
      title: 'Modifica Massiva Menu Fissi',
      description: `Modifica ${menuFissi.length} menu fissi selezionati`,
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionIcons,
      currentPath,
      formConfig: formConfig.formConfig,
      fields: formConfig.fields,
      buttons: formConfig.buttons,
      selectedItems: menuFissi,
      scripts: scriptManager.getScriptsForPage('form'),
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Menu Fissi', href: '/ristorante-menu/menu-fissi' },
        { label: 'Modifica Massiva', href: '/ristorante-menu/menu-fissi/modifica-massa' }
      ],
      actionNavConfig,
      isInternalPage: true
    });
  } catch (error) {
    console.error('Errore nel caricamento della modifica massiva menu fissi:', error);
    res.status(500).send('Errore interno del server');
  }
});

router.get('/impostazioni/categoria-piatti', async (req, res) => {
  try {
    const currentPath = '/ristorante-menu/impostazioni/categoria-piatti';
    let sectionMenu = ristoranteMenuItems;
    let sectionTabs = ristoranteMenuImpostazioniSubItems;
    
    // Gestione paginazione
    const paginationConfig = getPaginationParams(req, 20);
    
    // Conta totale elementi
    const totalItems = await prisma.categoriaPiatti.count({
      where: {
        deletedAt: null
      }
    });
    
    // Recuperare le categorie piatti dal database con paginazione
    const categoriePiatti = await prisma.categoriaPiatti.findMany({
      where: {
        deletedAt: null
      },
      orderBy: {
        nome: 'asc'
      },
      skip: paginationConfig.offset,
      take: paginationConfig.limit
    });
    
    // Calcola informazioni di paginazione
    const pagination = calculatePagination(
      totalItems,
      paginationConfig.page,
      paginationConfig.limit
    );
    
    const config = { ...categoriaPiattiConfig };
    config.hasItems = totalItems > 0;
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
      scripts: scriptManager.getScriptsForPage('table'),
      tableConfigJson: JSON.stringify(config.tableConfig),
      tableInitScript: scriptManager.getTableInitScript(config.tableConfig.tableId),
      actionNavConfig,
      isInternalPage: false,
      pagination,
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
    
    // Gestione paginazione
    const paginationConfig = getPaginationParams(req, 20);
    
    // Conta totale elementi
    const totalItems = await prisma.allergene.count({
      where: {
        deletedAt: null
      }
    });
    
    // Recuperare gli allergeni dal database con paginazione
    const allergeni = await prisma.allergene.findMany({
      where: {
        deletedAt: null
      },
      orderBy: {
        nome: 'asc'
      },
      skip: paginationConfig.offset,
      take: paginationConfig.limit
    });
    
    // Calcola informazioni di paginazione
    const pagination = calculatePagination(
      totalItems,
      paginationConfig.page,
      paginationConfig.limit
    );
    
    const config = { ...allergeniConfig };
    config.hasItems = totalItems > 0;
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
      scripts: scriptManager.getScriptsForPage('table'),
      tableConfigJson: JSON.stringify(config.tableConfig),
      tableInitScript: scriptManager.getTableInitScript(config.tableConfig.tableId),
      actionNavConfig, 
      isInternalPage: false,
      pagination,
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
    scripts: scriptManager.getScriptsForPage('form'),
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
      
      return res.status(400).render('pages/ristorante-menu/servizi/new', {
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
    
    res.status(500).render('pages/ristorante-menu/servizi/new', {
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
      detailViewConfig: allergeniDetailViewConfig,
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

    res.render('pages/ristorante-menu/servizi/edit', {
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
        
        return res.status(400).render('pages/ristorante-menu/servizi/edit', {
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
          error: 'Un\'altra allergene con questo nome esiste già'
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
    
    res.status(500).render('pages/ristorante-menu/servizi/edit', {
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
    scripts: scriptManager.getScriptsForPage('form'),
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
      
      return res.status(400).render('pages/ristorante-menu/servizi/new', {
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
        scripts: scriptManager.getScriptsForPage('form'),
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
    
    res.status(500).render('pages/ristorante-menu/servizi/new', {
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
      scripts: scriptManager.getScriptsForPage('form'),
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
      detailViewConfig: categoriaMenuFissoDetailViewConfig,
      scripts: scriptManager.getScriptsForPage('dashboard'),
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

    res.render('pages/ristorante-menu/servizi/edit', {
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
      scripts: scriptManager.getScriptsForPage('form'),
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
        
        return res.status(400).render('pages/ristorante-menu/servizi/edit', {
          title: 'Modifica Categoria Menu Fisso',
          description: 'Modifica i dettagli della categoria',
          layout: 'layouts/sections',
          mainMenu: mainMenuItems,
          sectionMenu: ristoranteMenuItems,
          sectionTabs: ristoranteMenuImpostazioniSubItems,
          sectionIcons,
          currentPath: '/ristorante-menu/impostazioni/categoria-menu-fisso/modifica',
          actionNavConfig,
          scripts: scriptManager.getScriptsForPage('form'),
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
    
    res.status(500).render('pages/ristorante-menu/servizi/edit', {
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
      scripts: scriptManager.getScriptsForPage('form'),
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
      scripts: scriptManager.getScriptsForPage('bulkEdit'),
      bulkEditConfigScript: scriptManager.getBulkEditConfigScript(formConfig),
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
    scripts: scriptManager.getScriptsForPage('form'),
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
      
      return res.status(400).render('pages/ristorante-menu/servizi/new', {
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
        scripts: scriptManager.getScriptsForPage('form'),
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
    
    res.status(500).render('pages/ristorante-menu/servizi/new', {
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
      scripts: scriptManager.getScriptsForPage('form'),
      isInternalPage: true,
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
        { label: 'Categoria Piatti', href: '/ristorante-menu/impostazioni/categoria-piatti' },
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
      detailViewConfig: categoriaPiattiDetailViewConfig,
      scripts: scriptManager.getScriptsForPage('dashboard'),
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

    res.render('pages/ristorante-menu/servizi/edit', {
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
      scripts: scriptManager.getScriptsForPage('form'),
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
        
        return res.status(400).render('pages/ristorante-menu/servizi/edit', {
          title: 'Modifica Categoria Piatti',
          description: 'Modifica i dettagli della categoria',
          layout: 'layouts/sections',
          mainMenu: mainMenuItems,
          sectionMenu: ristoranteMenuItems,
          sectionTabs: ristoranteMenuImpostazioniSubItems,
          sectionIcons,
          currentPath: '/ristorante-menu/impostazioni/categoria-piatti/modifica',
          actionNavConfig,
          isInternalPage: true,
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
    
    res.status(500).render('pages/ristorante-menu/servizi/edit', {
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
      scripts: scriptManager.getScriptsForPage('bulkEdit'),
      bulkEditConfigScript: scriptManager.getBulkEditConfigScript(formConfig),
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
    const limit = parseInt(req.query.limit as string) || 20; // Cambiato da 50 a 20
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
      scripts: scriptManager.getScriptsForPage('table'),
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
      tableInitScript: scriptManager.getTableInitScript('deleted-items-table'),
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

// === ROUTE AJAX PER FORM MANAGER ===

// Route AJAX per creazione allergene
router.post('/impostazioni/allergeni/nuovo/ajax', async (req, res) => {
  const { nome, descrizione } = req.body;
  
  try {
    // Verifica se esiste già un allergene con lo stesso nome
    const existingAllergene = await prisma.allergene.findUnique({
      where: { nome }
    });

    if (existingAllergene) {
      return res.json({ 
        success: false, 
        message: 'Un allergene con questo nome esiste già' 
      });
    }

    const allergene = await prisma.allergene.create({
      data: {
        nome,
        descrizione: descrizione || null
      }
    });

    res.json({ 
      success: true, 
      message: 'Allergene creato con successo',
      data: { id: allergene.id }
    });
  } catch (error) {
    console.error('Errore nella creazione dell\'allergene:', error);
    res.json({ 
      success: false, 
      message: 'Si è verificato un errore durante la creazione dell\'allergene' 
    });
  }
});

// Route AJAX per modifica allergene
router.post('/impostazioni/allergeni/modifica/:id/ajax', async (req, res) => {
  const { nome, descrizione } = req.body;
  const allergeneId = req.params.id;
  
  try {
    const existingAllergene = await prisma.allergene.findUnique({
      where: { id: allergeneId }
    });

    if (!existingAllergene) {
      return res.json({ 
        success: false, 
        message: 'L\'allergene richiesto non esiste' 
      });
    }

    if (nome !== existingAllergene.nome) {
      const allergeneWithSameName = await prisma.allergene.findUnique({
        where: { nome }
      });

      if (allergeneWithSameName) {
        return res.json({ 
          success: false, 
          message: 'Un altro allergene con questo nome esiste già' 
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

    res.json({ 
      success: true, 
      message: 'Allergene aggiornato con successo',
      data: { id: updatedAllergene.id }
    });
  } catch (error) {
    console.error('Errore nell\'aggiornamento dell\'allergene:', error);
    res.json({ 
      success: false, 
      message: 'Si è verificato un errore durante l\'aggiornamento dell\'allergene' 
    });
  }
});

// Route AJAX per creazione categoria menu fisso
router.post('/impostazioni/categoria-menu-fisso/nuovo/ajax', async (req, res) => {
  const { nome, descrizione, inLista } = req.body;
  
  try {
    const existingCategoria = await prisma.categoriaMenuFisso.findUnique({
      where: { nome }
    });

    if (existingCategoria) {
      return res.json({ 
        success: false, 
        message: 'Una categoria con questo nome esiste già' 
      });
    }

    const categoria = await prisma.categoriaMenuFisso.create({
      data: {
        nome,
        descrizione: descrizione || null,
        inLista: inLista === 'on' || inLista === true
      }
    });

    res.json({ 
      success: true, 
      message: 'Categoria creata con successo',
      data: { id: categoria.id }
    });
  } catch (error) {
    console.error('Errore nella creazione della categoria:', error);
    res.json({ 
      success: false, 
      message: 'Si è verificato un errore durante la creazione della categoria' 
    });
  }
});

// Route AJAX per modifica categoria menu fisso
router.post('/impostazioni/categoria-menu-fisso/modifica/:id/ajax', async (req, res) => {
  const { nome, descrizione, inLista } = req.body;
  const categoriaId = req.params.id;
  
  try {
    const existingCategoria = await prisma.categoriaMenuFisso.findUnique({
      where: { id: categoriaId }
    });

    if (!existingCategoria) {
      return res.json({ 
        success: false, 
        message: 'La categoria richiesta non esiste' 
      });
    }

    if (nome !== existingCategoria.nome) {
      const categoriaWithSameName = await prisma.categoriaMenuFisso.findUnique({
        where: { nome }
      });

      if (categoriaWithSameName) {
        return res.json({ 
          success: false, 
          message: 'Un\'altra categoria con questo nome esiste già' 
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

    res.json({ 
      success: true, 
      message: 'Categoria aggiornata con successo',
      data: { id: updatedCategoria.id }
    });
  } catch (error) {
    console.error('Errore nell\'aggiornamento della categoria:', error);
    res.json({ 
      success: false, 
      message: 'Si è verificato un errore durante l\'aggiornamento della categoria' 
    });
  }
});

// Route AJAX per creazione categoria piatti
router.post('/impostazioni/categoria-piatti/nuovo/ajax', async (req, res) => {
  const { nome, descrizione, inLista } = req.body;
  
  try {
    const existingCategoria = await prisma.categoriaPiatti.findUnique({
      where: { nome }
    });

    if (existingCategoria) {
      return res.json({ 
        success: false, 
        message: 'Una categoria con questo nome esiste già' 
      });
    }

    const categoria = await prisma.categoriaPiatti.create({
      data: {
        nome,
        descrizione: descrizione || null,
        inLista: inLista === 'on' || inLista === true
      }
    });

    res.json({ 
      success: true, 
      message: 'Categoria creata con successo',
      data: { id: categoria.id }
    });
  } catch (error) {
    console.error('Errore nella creazione della categoria:', error);
    res.json({ 
      success: false, 
      message: 'Si è verificato un errore durante la creazione della categoria' 
    });
  }
});

// Route AJAX per modifica categoria piatti
router.post('/impostazioni/categoria-piatti/modifica/:id/ajax', async (req, res) => {
  const { nome, descrizione, inLista } = req.body;
  const categoriaId = req.params.id;
  
  try {
    const existingCategoria = await prisma.categoriaPiatti.findUnique({
      where: { id: categoriaId }
    });

    if (!existingCategoria) {
      return res.json({ 
        success: false, 
        message: 'La categoria richiesta non esiste' 
      });
    }

    if (nome !== existingCategoria.nome) {
      const categoriaWithSameName = await prisma.categoriaPiatti.findUnique({
        where: { nome }
      });

      if (categoriaWithSameName) {
        return res.json({ 
          success: false, 
          message: 'Un\'altra categoria con questo nome esiste già' 
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

    res.json({ 
      success: true, 
      message: 'Categoria aggiornata con successo',
      data: { id: updatedCategoria.id }
    });
  } catch (error) {
    console.error('Errore nell\'aggiornamento della categoria:', error);
    res.json({ 
      success: false, 
      message: 'Si è verificato un errore durante l\'aggiornamento della categoria' 
    });
  }
});

// === ROUTE MODIFICA MASSIVA SERVIZI ===

// Route per modifica massiva servizi
router.get('/servizi/modifica-massa', async (req, res) => {
  const currentPath = '/ristorante-menu/servizi/modifica-massa';
  let sectionMenu = ristoranteMenuItems;
  
  const servizioIds = req.query.ids ? (req.query.ids as string).split(',') : [];
  
  if (servizioIds.length === 0) {
    return res.redirect('/ristorante-menu/servizi');
  }
  
  try {
    const selectedServizi = await prisma.servizioAccessorio.findMany({
      where: { 
        id: { in: servizioIds },
        deletedAt: null
      },
      select: {
        id: true,
        nome: true,
        descrizione: true,
        prezzo: true,
        inLista: true
      }
    });

    if (selectedServizi.length === 0) {
      return res.redirect('/ristorante-menu/servizi');
    }

    const formConfig = servizioFormData.getFormData ? servizioFormData.getFormData(servizioFormData, false, null, null, true, selectedServizi) : servizioFormData;
    const actionNavConfig = actionNavConfigs['servizi.editBulk'];

    res.render('pages/ristorante-menu/servizi/editBulk', {
      title: 'Modifica Massiva Servizi',
      description: 'Modifica i servizi selezionati',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionIcons,
      currentPath,
      selectedItems: selectedServizi,
      formConfig,
      itemType: 'Servizio',
      backUrl: '/ristorante-menu/servizi',
      actionNavConfig,
      scripts: scriptManager.getScriptsForPage('bulkEdit'),
      bulkEditConfigScript: scriptManager.getBulkEditConfigScript(formConfig),
      isInternalPage: true,
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Servizi', href: '/ristorante-menu/servizi' },
        { label: 'Modifica Massiva', href: '#' }
      ]
    });
  } catch (error) {
    console.error('Errore nel recupero dei servizi per modifica massiva:', error);
    res.redirect('/ristorante-menu/servizi');
  }
});

router.post('/servizi/modifica-massa', async (req, res) => {
  const { itemIds, prezzo, inLista } = req.body;
  
  let servizioIds: string[] = [];
  if (Array.isArray(itemIds)) {
    servizioIds = itemIds;
  } else if (typeof itemIds === 'string') {
    servizioIds = itemIds.split(',').filter(id => id.trim() !== '');
  }
  
  if (servizioIds.length === 0) {
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      return res.json({ success: false, message: 'Nessun servizio selezionato per la modifica' });
    }
    return res.redirect('/ristorante-menu/servizi?error=Nessun servizio selezionato per la modifica');
  }
  
  try {
    const existingServizi = await prisma.servizioAccessorio.findMany({
      where: { 
        id: { in: servizioIds },
        deletedAt: null
      }
    });

    if (existingServizi.length === 0) {
      if (req.xhr || req.headers.accept?.includes('application/json')) {
        return res.json({ success: false, message: 'Nessun servizio valido trovato per la modifica' });
      }
      return res.redirect('/ristorante-menu/servizi?error=Nessun servizio valido trovato per la modifica');
    }

    const updateData: any = {};
    
    if (prezzo !== undefined && prezzo !== '') {
      updateData.prezzo = parseFloat(prezzo);
    }
    
    if (inLista !== undefined) {
      updateData.inLista = inLista === 'on' || inLista === true;
    }

    if (Object.keys(updateData).length === 0) {
      if (req.xhr || req.headers.accept?.includes('application/json')) {
        return res.json({ success: false, message: 'Nessun campo valido fornito per l\'aggiornamento' });
      }
      return res.redirect('/ristorante-menu/servizi?error=Nessun campo valido fornito per l\'aggiornamento');
    }

    await prisma.servizioAccessorio.updateMany({
      where: { 
        id: { in: servizioIds }
      },
      data: updateData
    });

    const updatedCount = existingServizi.length;
    const skippedCount = servizioIds.length - existingServizi.length;
    
    let message = `Aggiornati ${updatedCount} servizio${updatedCount === 1 ? '' : 'i'} con successo`;
    if (skippedCount > 0) {
      message += `. ${skippedCount} servizio${skippedCount === 1 ? '' : 'i'} non trovato${skippedCount === 1 ? '' : 'i'} o già cancellato${skippedCount === 1 ? '' : 'i'}.`;
    }
    
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      return res.json({ success: true, message });
    }
    
    res.redirect(`/ristorante-menu/servizi?success=${encodeURIComponent(message)}`);
    
  } catch (error) {
    console.error('Errore durante la modifica massiva:', error);
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      return res.json({ success: false, message: 'Errore interno del server durante la modifica massiva' });
    }
    res.redirect('/ristorante-menu/servizi?error=Errore interno del server durante la modifica massiva');
  }
});

// Route AJAX per modifica massiva servizi
router.post('/servizi/modifica-massa/ajax', async (req, res) => {
  const { itemIds, prezzo, inLista } = req.body;
  
  let servizioIds: string[] = [];
  if (Array.isArray(itemIds)) {
    servizioIds = itemIds;
  } else if (typeof itemIds === 'string') {
    servizioIds = itemIds.split(',').filter(id => id.trim() !== '');
  }
  
  if (servizioIds.length === 0) {
    return res.json({ success: false, message: 'Nessun servizio selezionato per la modifica' });
  }
  
  try {
    const existingServizi = await prisma.servizioAccessorio.findMany({
      where: { 
        id: { in: servizioIds },
        deletedAt: null
      }
    });

    if (existingServizi.length === 0) {
      return res.json({ success: false, message: 'Nessun servizio valido trovato per la modifica' });
    }

    const updateData: any = {};
    
    if (prezzo !== undefined && prezzo !== '') {
      updateData.prezzo = parseFloat(prezzo);
    }
    
    if (inLista !== undefined) {
      updateData.inLista = inLista === 'on' || inLista === true;
    }

    if (Object.keys(updateData).length === 0) {
      return res.json({ success: false, message: 'Nessun campo valido fornito per l\'aggiornamento' });
    }

    await prisma.servizioAccessorio.updateMany({
      where: { 
        id: { in: servizioIds }
      },
      data: updateData
    });

    const updatedCount = existingServizi.length;
    const skippedCount = servizioIds.length - existingServizi.length;
    
    let message = `Aggiornati ${updatedCount} servizio${updatedCount === 1 ? '' : 'i'} con successo`;
    if (skippedCount > 0) {
      message += `. ${skippedCount} servizio${skippedCount === 1 ? '' : 'i'} non trovato${skippedCount === 1 ? '' : 'i'} o già cancellato${skippedCount === 1 ? '' : 'i'}.`;
    }
    
    res.json({ 
      success: true, 
      message,
      updatedCount,
      skippedCount
    });
    
  } catch (error) {
    console.error('Errore durante la modifica massiva:', error);
    res.json({ 
      success: false, 
      message: 'Errore interno del server durante la modifica massiva' 
    });
  }
});

// === ROUTE AJAX PER PIATTI ===

// Route AJAX per creazione piatto
router.post('/piatti/nuovo/ajax', async (req, res) => {
  const { nome, descrizione, categoriaId, prezzo, allergeni, inLista } = req.body;
  
  try {
    // Verifica se esiste già un piatto con lo stesso nome
    const existingPiatto = await prisma.piatto.findFirst({
      where: { 
        nome,
        deletedAt: null
      }
    });

    if (existingPiatto) {
      return res.json({ 
        success: false, 
        message: 'Un piatto con questo nome esiste già' 
      });
    }

    // Crea il piatto
    const piatto = await prisma.piatto.create({
      data: {
        nome,
        descrizione: descrizione || null,
        categoriaId,
        prezzo: parseFloat(prezzo),
        inLista: inLista === 'on' || inLista === true
      }
    });
    
    // Associa gli allergeni se presenti
    if (allergeni && Array.isArray(allergeni) && allergeni.length > 0) {
      await prisma.piattoAllergene.createMany({
        data: allergeni.map((allergeneId: string) => ({
          piattoId: piatto.id,
          allergeneId
        }))
      });
    }

    res.json({ 
      success: true, 
      message: 'Piatto creato con successo',
      data: { id: piatto.id }
    });
  } catch (error) {
    console.error('Errore nella creazione del piatto:', error);
    res.json({ 
      success: false, 
      message: 'Si è verificato un errore durante la creazione del piatto' 
    });
  }
});

// Route AJAX per modifica piatto
router.post('/piatti/modifica/:id/ajax', async (req, res) => {
  const { nome, descrizione, categoriaId, prezzo, allergeni, inLista } = req.body;
  const piattoId = req.params.id;
  
  try {
    const existingPiatto = await prisma.piatto.findUnique({
      where: { id: piattoId }
    });

    if (!existingPiatto) {
      return res.json({
        success: false,
        message: 'Piatto non trovato'
      });
    }

    // Verifica se esiste già un altro piatto con lo stesso nome
    const duplicatePiatto = await prisma.piatto.findFirst({
      where: { 
        nome,
        deletedAt: null,
        id: { not: piattoId }
      }
    });

    if (duplicatePiatto) {
      return res.json({
        success: false,
        message: 'Un altro piatto con questo nome esiste già'
      });
    }

    // Aggiorna il piatto
    const updatedPiatto = await prisma.piatto.update({
      where: { id: piattoId },
      data: {
        nome,
        descrizione: descrizione || null,
        categoriaId,
        prezzo: parseFloat(prezzo),
        inLista: inLista === 'on' || inLista === true
      }
    });

    // Rimuovi tutte le associazioni allergeni esistenti
    await prisma.piattoAllergene.deleteMany({
      where: { piattoId: piattoId }
    });

    // Aggiungi le nuove associazioni allergeni se presenti
    if (allergeni && Array.isArray(allergeni) && allergeni.length > 0) {
      await prisma.piattoAllergene.createMany({
        data: allergeni.map((allergeneId: string) => ({
          piattoId: piattoId,
          allergeneId
        }))
      });
    }

    res.json({ 
      success: true, 
      message: 'Piatto aggiornato con successo',
      data: { id: updatedPiatto.id }
    });
  } catch (error) {
    console.error('Errore nell\'aggiornamento del piatto:', error);
    res.json({ 
      success: false, 
      message: 'Si è verificato un errore durante l\'aggiornamento del piatto' 
    });
  }
});

// Route AJAX per modifica massiva piatti
router.post('/piatti/modifica-massa/ajax', async (req, res) => {
  const { itemIds, categoriaId, prezzo, inLista } = req.body;
  
  try {
    if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
      return res.json({ 
        success: false, 
        message: 'Nessun piatto selezionato' 
      });
    }

    const updateData: any = {};
    
    if (categoriaId) {
      updateData.categoriaId = categoriaId;
    }
    
    if (prezzo !== undefined && prezzo !== '') {
      updateData.prezzo = parseFloat(prezzo);
    }
    
    if (inLista !== undefined && inLista !== null) {
      updateData.inLista = inLista === 'on' || inLista === true;
    }

    // Aggiorna i piatti
    const result = await prisma.piatto.updateMany({
      where: {
        id: { in: itemIds },
        deletedAt: null
      },
      data: updateData
    });

    res.json({ 
      success: true, 
      message: `${result.count} piatto/i aggiornato/i con successo`,
      data: { updatedCount: result.count }
    });
  } catch (error) {
    console.error('Errore nella modifica massiva dei piatti:', error);
    res.json({ 
      success: false, 
      message: 'Si è verificato un errore durante la modifica massiva dei piatti' 
    });
  }
});

// === ROUTE AJAX PER SERVIZI ===

// Route AJAX per creazione servizio
router.post('/servizi/nuovo/ajax', async (req, res) => {
  const { nome, descrizione, prezzo, inLista } = req.body;
  
  try {
    // Verifica se esiste già un servizio con lo stesso nome
    const existingServizio = await prisma.servizioAccessorio.findFirst({
      where: { 
        nome,
        deletedAt: null
      }
    });

    if (existingServizio) {
      return res.json({ 
        success: false, 
        message: 'Un servizio con questo nome esiste già' 
      });
    }

    const servizio = await prisma.servizioAccessorio.create({
      data: {
        nome,
        descrizione: descrizione || null,
        prezzo: parseFloat(prezzo),
        inLista: inLista === 'on' || inLista === true
      }
    });

    res.json({ 
      success: true, 
      message: 'Servizio creato con successo',
      data: { id: servizio.id }
    });
  } catch (error) {
    console.error('Errore nella creazione del servizio:', error);
    res.json({ 
      success: false, 
      message: 'Si è verificato un errore durante la creazione del servizio' 
    });
  }
});

// Route AJAX per modifica servizio
router.post('/servizi/modifica/:id/ajax', async (req, res) => {
  const { nome, descrizione, prezzo, inLista } = req.body;
  const servizioId = req.params.id;
  
  try {
    const existingServizio = await prisma.servizioAccessorio.findUnique({
      where: { id: servizioId }
    });

    if (!existingServizio) {
      return res.json({ 
        success: false, 
        message: 'Il servizio richiesto non esiste' 
      });
    }

    if (nome !== existingServizio.nome) {
      const servizioWithSameName = await prisma.servizioAccessorio.findFirst({
        where: { 
          nome,
          deletedAt: null
        }
      });

      if (servizioWithSameName) {
        return res.json({ 
          success: false, 
          message: 'Un altro servizio con questo nome esiste già' 
        });
      }
    }

    const updatedServizio = await prisma.servizioAccessorio.update({
      where: { id: servizioId },
      data: {
        nome,
        descrizione: descrizione || null,
        prezzo: parseFloat(prezzo),
        inLista: inLista === 'on' || inLista === true
      }
    });

    res.json({ 
      success: true, 
      message: 'Servizio aggiornato con successo',
      data: { id: updatedServizio.id }
    });
  } catch (error) {
    console.error('Errore nell\'aggiornamento del servizio:', error);
    res.json({ 
      success: false, 
      message: 'Si è verificato un errore durante l\'aggiornamento del servizio' 
    });
  }
});

// === ROUTE AJAX PER MENU FISSI ===

// Route AJAX per creazione menu fisso
router.post('/menu-fissi/nuovo/ajax', async (req, res) => {
  const { nome, descrizione, categoriaId, prezzo, piatti, servizi, inLista } = req.body;
  
  try {
    // Verifica se esiste già un menu fisso con lo stesso nome
    const existingMenuFisso = await prisma.menuFisso.findFirst({
      where: { 
        nome,
        deletedAt: null
      }
    });

    if (existingMenuFisso) {
      return res.json({ 
        success: false, 
        message: 'Un menu fisso con questo nome esiste già' 
      });
    }

    // Crea il menu fisso
    const menuFisso = await prisma.menuFisso.create({
      data: {
        nome,
        descrizione: descrizione || null,
        categoriaId,
        prezzo: parseFloat(prezzo),
        inLista: inLista === 'on' || inLista === true
      }
    });
    
    // Associa i piatti se presenti
    if (piatti && Array.isArray(piatti) && piatti.length > 0) {
      await prisma.menuFissoPiatto.createMany({
        data: piatti.map((piattoId: string) => ({
          menuFissoId: menuFisso.id,
          piattoId
        }))
      });
    }
    
    // Associa i servizi se presenti
    if (servizi && Array.isArray(servizi) && servizi.length > 0) {
      await prisma.menuFissoServizioAccessorio.createMany({
        data: servizi.map((servizioId: string) => ({
          menuFissoId: menuFisso.id,
          servizioAccessorioId: servizioId
        }))
      });
    }

    res.json({ 
      success: true, 
      message: 'Menu fisso creato con successo',
      data: { id: menuFisso.id }
    });
  } catch (error) {
    console.error('Errore nella creazione del menu fisso:', error);
    res.json({ 
      success: false, 
      message: 'Si è verificato un errore durante la creazione del menu fisso' 
    });
  }
});

// Route AJAX per modifica menu fisso
router.post('/menu-fissi/modifica/:id/ajax', async (req, res) => {
  const { nome, descrizione, categoriaId, prezzo, piatti, servizi, inLista } = req.body;
  const menuFissoId = req.params.id;
  
  try {
    const existingMenuFisso = await prisma.menuFisso.findUnique({
      where: { id: menuFissoId }
    });

    if (!existingMenuFisso) {
      return res.json({
        success: false,
        message: 'Menu fisso non trovato'
      });
    }

    // Verifica se esiste già un altro menu fisso con lo stesso nome
    const duplicateMenuFisso = await prisma.menuFisso.findFirst({
      where: { 
        nome,
        deletedAt: null,
        id: { not: menuFissoId }
      }
    });

    if (duplicateMenuFisso) {
      return res.json({
        success: false,
        message: 'Un altro menu fisso con questo nome esiste già'
      });
    }

    // Aggiorna il menu fisso
    const updatedMenuFisso = await prisma.menuFisso.update({
      where: { id: menuFissoId },
      data: {
        nome,
        descrizione: descrizione || null,
        categoriaId,
        prezzo: parseFloat(prezzo),
        inLista: inLista === 'on' || inLista === true
      }
    });

    // Rimuovi tutte le associazioni piatti esistenti
    await prisma.menuFissoPiatto.deleteMany({
      where: { menuFissoId: menuFissoId }
    });

    // Aggiungi le nuove associazioni piatti se presenti
    if (piatti && Array.isArray(piatti) && piatti.length > 0) {
      await prisma.menuFissoPiatto.createMany({
        data: piatti.map((piattoId: string) => ({
          menuFissoId: menuFissoId,
          piattoId
        }))
      });
    }
    
    // Rimuovi tutte le associazioni servizi esistenti
    await prisma.menuFissoServizioAccessorio.deleteMany({
      where: { menuFissoId: menuFissoId }
    });

    // Aggiungi le nuove associazioni servizi se presenti
    if (servizi && Array.isArray(servizi) && servizi.length > 0) {
      await prisma.menuFissoServizioAccessorio.createMany({
        data: servizi.map((servizioId: string) => ({
          menuFissoId: menuFissoId,
          servizioAccessorioId: servizioId
        }))
      });
    }

    res.json({ 
      success: true, 
      message: 'Menu fisso aggiornato con successo',
      data: { id: updatedMenuFisso.id }
    });
  } catch (error) {
    console.error('Errore nell\'aggiornamento del menu fisso:', error);
    res.json({ 
      success: false, 
      message: 'Si è verificato un errore durante l\'aggiornamento del menu fisso' 
    });
  }
});

// Route AJAX per modifica massiva menu fissi
router.post('/menu-fissi/modifica-massa/ajax', async (req, res) => {
  const { itemIds, categoriaId, prezzo, inLista } = req.body;
  
  try {
    if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
      return res.json({ 
        success: false, 
        message: 'Nessun menu fisso selezionato' 
      });
    }

    const updateData: any = {};
    
    if (categoriaId) {
      updateData.categoriaId = categoriaId;
    }
    
    if (prezzo !== undefined && prezzo !== '') {
      updateData.prezzo = parseFloat(prezzo);
    }
    
    if (inLista !== undefined && inLista !== null) {
      updateData.inLista = inLista === 'on' || inLista === true;
    }

    // Aggiorna i menu fissi
    const result = await prisma.menuFisso.updateMany({
      where: {
        id: { in: itemIds },
        deletedAt: null
      },
      data: updateData
    });

    res.json({ 
      success: true, 
      message: `${result.count} menu fissi aggiornati con successo`,
      data: { updatedCount: result.count }
    });
  } catch (error) {
    console.error('Errore nella modifica massiva dei menu fissi:', error);
    res.json({ 
      success: false, 
      message: 'Si è verificato un errore durante la modifica massiva dei menu fissi' 
    });
  }
});

// Route per eliminazione singola menu fisso
router.delete('/menu-fissi/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.menuFisso.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    });

    res.json({ 
      success: true, 
      message: 'Menu fisso eliminato con successo' 
    });
  } catch (error) {
    console.error('Errore nell\'eliminazione del menu fisso:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Errore nell\'eliminazione' 
    });
  }
});

// Route per eliminazione multipla menu fissi
router.delete('/menu-fissi', async (req, res) => {
  const { itemIds } = req.body;
  
  if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
    return res.status(400).json({ 
      success: false, 
      message: 'Nessun menu fisso selezionato' 
    });
  }

  try {
    const result = await prisma.menuFisso.updateMany({
      where: {
        id: { in: itemIds },
        deletedAt: null
      },
      data: {
        deletedAt: new Date()
      }
    });

    res.json({ 
      success: true, 
      message: `${result.count} menu fisso/i eliminato/i con successo` 
    });
  } catch (error) {
    console.error('Errore nell\'eliminazione multipla dei menu fissi:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Errore nell\'eliminazione' 
    });
  }
});

export default router; 