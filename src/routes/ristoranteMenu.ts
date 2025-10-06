import express from 'express';
import { PrismaClient } from '@prisma/client';
import { mainMenuItems } from '../config/mainMenu';
import { ristoranteMenuItems } from '../config/sectionMenu';
import { ristoranteMenuImpostazioniSubItems } from '../config/subSectionMenu';
import { sectionIcons } from '../config/sectionIcons';
import { uiIcons } from '../config/uiIcons';
import { elementiCancellatiTableData, serviziTableData, piattiTableData, menuFissiTableData, viniTableData, birreTableData } from '../config/sectionTableData';
import { getCountText } from '../config/pluralHelper';
import { isAuthenticated } from '../middlewares/auth';
import { 
  allergeniConfig, 
  categoriaMenuFissoConfig, 
  categoriaPiattiConfig,
  nazioniConfig,
  regioniConfig,
  zoneConfig,
  tipologieVinoConfig,
  tipologieBirraConfig,
  tipologieLiquoreConfig,
  tipologieCocktailConfig,
  tipologieBevandaConfig,
  generatePageTitle
} from '../config/subSectionConfig';
import { 
  piattoFormData,
  vinoFormData,
  birraFormData
} from '../config/sectionFormData';
import { menuFissoFormData } from '../config/menuFissoFormData';
import { 
  allergeneFormData, 
  categoriaMenuFissoFormData, 
  categoriaPiattiFormData,
  nazioneFormData,
  regioneFormData,
  zonaFormData,
  tipologiaVinoFormData,
  tipologiaBirraFormData,
  tipologiaLiquoreFormData,
  tipologiaCocktailFormData,
  tipologiaBevandaFormData,
  servizioFormData
} from '../config/subSectionFormData';
import { createSubSectionActionNav, actionNavConfigs } from '../config/actionNavConfig';
import { scriptManager } from '../config/scriptManager';
import { getPaginationParams, calculatePagination } from '../config/paginationHelper';
import { 
  serviziDetailViewConfig,
  piattiDetailViewConfig,
  menuFissiDetailViewConfig,
  viniDetailViewConfig,
  birreDetailViewConfig,
  allergeniDetailViewConfig,
  categoriaMenuFissoDetailViewConfig,
  categoriaPiattiDetailViewConfig,
  nazioniDetailViewConfig,
  regioniDetailViewConfig,
  zoneDetailViewConfig,
  tipologieVinoDetailViewConfig,
  tipologieBirraDetailViewConfig,
  tipologieLiquoreDetailViewConfig,
  tipologieCocktailDetailViewConfig,
  tipologieBevandaDetailViewConfig,
  utentiDetailViewConfig,
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
    
    // Filtro per categoria
    const categoriaFilter = req.query.categoria as string;
    
    // Parametri di paginazione
    const { page, limit, offset } = getPaginationParams(req);
    
    // Costruisci la clausola WHERE
    const whereClause: any = {
      deletedAt: null
    };
    
    if (categoriaFilter && categoriaFilter.trim() !== '') {
      whereClause.categoriaId = categoriaFilter;
    }
    
    // Recupera i piatti con le relazioni
    const piatti = await prisma.piatto.findMany({
      where: whereClause,
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
      where: whereClause
    });
    
    // Calcola il totale di piatti nel sistema (senza filtri)
    const totalItemsInSystem = await prisma.piatto.count({
      where: { deletedAt: null }
    });
    
    // Determina gli stati vuoti
    const isSectionEmpty = totalItemsInSystem === 0;
    const isFilteredEmpty = totalItemsInSystem > 0 && totalItems === 0;
    const hasItems = items.length > 0;
    
    const pagination = calculatePagination(page, limit, totalItems);
    
    // Recupera le categorie per il filtro
    const categorie = await prisma.categoriaPiatti.findMany({
      where: { deletedAt: null },
      orderBy: { nome: 'asc' }
    });
    
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
      hasItems,
      isSectionEmpty,
      isFilteredEmpty,
      pagination,
      currentCategoriaFilter: categoriaFilter,
      categorie,
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

// === SEZIONE VINI ===

// Route per visualizzare lista vini
router.get('/vini', async (req, res) => {
  try {
    const currentPath = '/ristorante-menu/vini';
    let sectionMenu = ristoranteMenuItems;
    
    // Filtro per tipologia
    const tipologiaFilter = req.query.tipologia as string;
    
    // Parametri di paginazione
    const { page, limit, offset } = getPaginationParams(req);
    
    // Costruisci la clausola WHERE
    const whereClause: any = {
      deletedAt: null
    };
    
    if (tipologiaFilter && tipologiaFilter.trim() !== '') {
      whereClause.tipologiaId = tipologiaFilter;
    }
    
    // Recupera i vini con le relazioni
    const vini = await prisma.vino.findMany({
      where: whereClause,
      include: {
        tipologia: true,
        nazione: true,
        regione: true,
        zona: true
      },
      orderBy: {
        nome: 'asc'
      },
      skip: offset,
      take: limit
    });
    
    // Trasforma i dati per la tabella
    const items = vini.map(vino => ({
      ...vino,
      tipologia_nome: vino.tipologia.nome,
      nazione_nome: vino.nazione.nome,
      regione_nome: vino.regione?.nome || '',
      zona_nome: vino.zona?.nome || ''
    }));
    
    // Calcola paginazione
    const totalItems = await prisma.vino.count({
      where: whereClause
    });
    
    // Calcola il totale di vini nel sistema (senza filtri)
    const totalItemsInSystem = await prisma.vino.count({
      where: { deletedAt: null }
    });
    
    // Determina gli stati vuoti
    const isSectionEmpty = totalItemsInSystem === 0;
    const isFilteredEmpty = totalItemsInSystem > 0 && totalItems === 0;
    const hasItems = items.length > 0;
    
    const pagination = calculatePagination(page, limit, totalItems);
    
    // Recupera le tipologie per il filtro
    const tipologie = await prisma.tipologiaVino.findMany({
      where: { deletedAt: null },
      orderBy: { nome: 'asc' }
    });
    
    // Configurazione actionNav per questa pagina
    const actionNavConfig = actionNavConfigs['vini.index'];
    
    res.render('pages/ristorante-menu/vini/index', {
      title: 'Vini',
      description: 'Gestione vini del menu',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionIcons,
      currentPath,
      tableData: viniTableData,
      items,
      hasItems,
      isSectionEmpty,
      isFilteredEmpty,
      pagination,
      currentTipologiaFilter: tipologiaFilter,
      tipologie,
      scripts: scriptManager.getScriptsForPage('table'),
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Vini', href: '/ristorante-menu/vini' }
      ],
      actionNavConfig,
      emptyState: {
        title: 'Nessun vino disponibile',
        description: 'Non ci sono vini configurati nel sistema. Aggiungi il primo vino per iniziare.',
        buttonText: 'Aggiungi vino',
        buttonHref: '/ristorante-menu/vini/nuovo',
        iconName: 'menu',
        icon: sectionIcons['menu'],
        buttonIconName: 'piu',
        buttonIcon: uiIcons['piu']
      }
    });
  } catch (error) {
    console.error('Errore nel recupero dei vini:', error);
    res.status(500).send('Errore interno del server');
  }
});

// Route per form nuovo vino
router.get('/vini/nuovo', async (req, res) => {
  try {
    const currentPath = '/ristorante-menu/vini/nuovo';
    let sectionMenu = ristoranteMenuItems;
    
    // Recupera le tipologie per il form
    const tipologie = await prisma.tipologiaVino.findMany({
      where: { deletedAt: null },
      orderBy: { nome: 'asc' }
    });
    
    // Recupera le nazioni per il form
    const nazioni = await prisma.nazione.findMany({
      where: { deletedAt: null },
      orderBy: { nome: 'asc' }
    });
    
    // Recupera le regioni per il form
    const regioni = await prisma.regione.findMany({
      where: { deletedAt: null },
      orderBy: { nome: 'asc' }
    });
    
    // Recupera le zone per il form
    const zone = await prisma.zona.findMany({
      where: { deletedAt: null },
      orderBy: { nome: 'asc' }
    });
    
    // Prepara i dati del form
    const formData = vinoFormData.getFormData(vinoFormData, false);
    
    // Popola le opzioni dei select
    formData.fields = formData.fields.map(field => {
      if (field.name === 'tipologiaId') {
        return { ...field, options: tipologie.map(t => ({ value: t.id, label: t.nome })) };
      } else if (field.name === 'nazioneId') {
        return { ...field, options: nazioni.map(n => ({ value: n.id, label: n.nome })) };
      } else if (field.name === 'regioneId') {
        return { ...field, options: regioni.map(r => ({ value: r.id, label: r.nome })) };
      } else if (field.name === 'zonaId') {
        return { ...field, options: zone.map(z => ({ value: z.id, label: z.nome })) };
      }
      return field;
    });
    
    // Configurazione actionNav per questa pagina
    const actionNavConfig = actionNavConfigs['vini.new'];
    
    res.render('pages/ristorante-menu/vini/new', {
      title: 'Nuovo Vino',
      description: 'Aggiungi un nuovo vino al menu',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionIcons,
      currentPath,
      formData,
      isEdit: false,
      scripts: scriptManager.getScriptsForPage('form'),
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Vini', href: '/ristorante-menu/vini' },
        { label: 'Nuovo Vino', href: '/ristorante-menu/vini/nuovo' }
      ],
      actionNavConfig
    });
  } catch (error) {
    console.error('Errore nel caricamento del form vino:', error);
    res.status(500).send('Errore interno del server');
  }
});

// Route per form modifica vino
router.get('/vini/modifica/:id', async (req, res) => {
  try {
    const currentPath = '/ristorante-menu/vini/modifica/' + req.params.id;
    let sectionMenu = ristoranteMenuItems;
    
    const vino = await prisma.vino.findFirst({
      where: { 
        id: req.params.id,
        deletedAt: null
      },
      include: {
        tipologia: true,
        nazione: true,
        regione: true,
        zona: true
      }
    });

    if (!vino) {
      return res.status(404).send('Vino non trovato');
    }

    // Recupera le tipologie per il form
    const tipologie = await prisma.tipologiaVino.findMany({
      where: { deletedAt: null },
      orderBy: { nome: 'asc' }
    });
    
    // Recupera le nazioni per il form
    const nazioni = await prisma.nazione.findMany({
      where: { deletedAt: null },
      orderBy: { nome: 'asc' }
    });
    
    // Recupera le regioni per il form
    const regioni = await prisma.regione.findMany({
      where: { deletedAt: null },
      orderBy: { nome: 'asc' }
    });
    
    // Recupera le zone per il form
    const zone = await prisma.zona.findMany({
      where: { deletedAt: null },
      orderBy: { nome: 'asc' }
    });
    
    // Prepara i dati del form
    const formData = vinoFormData.getFormData(vinoFormData, true, vino);
    
    // Popola le opzioni dei select
    formData.fields = formData.fields.map(field => {
      if (field.name === 'tipologiaId') {
        return { ...field, options: tipologie.map(t => ({ value: t.id, label: t.nome })) };
      } else if (field.name === 'nazioneId') {
        return { ...field, options: nazioni.map(n => ({ value: n.id, label: n.nome })) };
      } else if (field.name === 'regioneId') {
        return { ...field, options: regioni.map(r => ({ value: r.id, label: r.nome })) };
      } else if (field.name === 'zonaId') {
        return { ...field, options: zone.map(z => ({ value: z.id, label: z.nome })) };
      }
      return field;
    });
    
    // Configurazione actionNav per questa pagina
    const actionNavConfig = actionNavConfigs['vini.edit'];
    
    res.render('pages/ristorante-menu/vini/edit', {
      title: 'Modifica Vino',
      description: `Modifica il vino ${vino.nome}`,
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionIcons,
      currentPath,
      formData,
      isEdit: true,
      item: vino,
      scripts: scriptManager.getScriptsForPage('form'),
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Vini', href: '/ristorante-menu/vini' },
        { label: vino.nome, href: `/ristorante-menu/vini/dettagli/${vino.id}` },
        { label: 'Modifica', href: `/ristorante-menu/vini/modifica/${vino.id}` }
      ],
      actionNavConfig
    });
  } catch (error) {
    console.error('Errore nel caricamento del form vino:', error);
    res.status(500).send('Errore interno del server');
  }
});

// Route per visualizzare vino
router.get('/vini/dettagli/:id', async (req, res) => {
  try {
    const currentPath = '/ristorante-menu/vini/dettagli/' + req.params.id;
    let sectionMenu = ristoranteMenuItems;
    
    const vino = await prisma.vino.findFirst({
      where: { 
        id: req.params.id,
        deletedAt: null
      },
      include: {
        tipologia: true,
        nazione: true,
        regione: true,
        zona: true
      }
    });

    if (!vino) {
      return res.status(404).send('Vino non trovato');
    }

    // Trasforma i dati per la vista
    const item = {
      ...vino,
      tipologia_nome: vino.tipologia.nome,
      nazione_nome: vino.nazione.nome,
      regione_nome: vino.regione?.nome || '',
      zona_nome: vino.zona?.nome || ''
    };

    const actionNavConfig = { ...actionNavConfigs['vini.view'] };
    // Sostituisci :id con l'ID effettivo del vino
    if (actionNavConfig.actions) {
      actionNavConfig.actions = actionNavConfig.actions.map(action => {
        if (action.type === 'link' && action.href?.includes(':id')) {
          return {
            ...action,
            href: action.href.replace(':id', vino.id)
          };
        }
        return action;
      });
    }

    res.render('pages/ristorante-menu/vini/view', {
      title: 'Dettagli Vino',
      description: 'Informazioni dettagliate del vino',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionIcons,
      currentPath,
      item,
      itemType: 'Vino',
      backUrl: '/ristorante-menu/vini',
      actionNavConfig,
      detailViewConfig: viniDetailViewConfig,
      scripts: scriptManager.getScriptsForPage('dashboard'),
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Vini', href: '/ristorante-menu/vini' },
        { label: vino.nome, href: `/ristorante-menu/vini/dettagli/${vino.id}` }
      ]
    });
  } catch (error) {
    console.error('Errore nel recupero del vino:', error);
    res.status(500).send('Errore interno del server');
  }
});

// Route per modifica massiva vini
router.get('/vini/modifica-massa', async (req, res) => {
  try {
    const currentPath = '/ristorante-menu/vini/modifica-massa';
    let sectionMenu = ristoranteMenuItems;
    
    const selectedIds = req.query.ids as string;
    
    if (!selectedIds) {
      return res.redirect('/ristorante-menu/vini');
    }
    
    const ids = selectedIds.split(',');
    
    // Recupera i vini selezionati
    const vini = await prisma.vino.findMany({
      where: { 
        id: { in: ids },
        deletedAt: null
      },
      include: {
        tipologia: true,
        nazione: true,
        regione: true,
        zona: true
      }
    });
    
    if (vini.length === 0) {
      return res.redirect('/ristorante-menu/vini');
    }
    
    // Recupera le tipologie per il form
    const tipologie = await prisma.tipologiaVino.findMany({
      where: { deletedAt: null },
      orderBy: { nome: 'asc' }
    });
    
    // Recupera le nazioni per il form
    const nazioni = await prisma.nazione.findMany({
      where: { deletedAt: null },
      orderBy: { nome: 'asc' }
    });
    
    // Recupera le regioni per il form
    const regioni = await prisma.regione.findMany({
      where: { deletedAt: null },
      orderBy: { nome: 'asc' }
    });
    
    // Recupera le zone per il form
    const zone = await prisma.zona.findMany({
      where: { deletedAt: null },
      orderBy: { nome: 'asc' }
    });
    
    // Prepara i dati del form per la modifica massiva
    const formData = vinoFormData.getFormData(vinoFormData, false, undefined, undefined, true, vini);
    
    // Popola le opzioni dei select
    formData.fields = formData.fields.map(field => {
      if (field.name === 'tipologiaId') {
        return { ...field, options: tipologie.map(t => ({ value: t.id, label: t.nome })) };
      } else if (field.name === 'nazioneId') {
        return { ...field, options: nazioni.map(n => ({ value: n.id, label: n.nome })) };
      } else if (field.name === 'regioneId') {
        return { ...field, options: regioni.map(r => ({ value: r.id, label: r.nome })) };
      } else if (field.name === 'zonaId') {
        return { ...field, options: zone.map(z => ({ value: z.id, label: z.nome })) };
      }
      return field;
    });
    
    // Configurazione actionNav per questa pagina
    const actionNavConfig = actionNavConfigs['vini.editBulk'];
    
    res.render('pages/ristorante-menu/vini/editBulk', {
      title: 'Modifica Massiva Vini',
      description: `Modifica ${vini.length} vini selezionati`,
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionIcons,
      currentPath,
      formData,
      selectedItems: vini,
      selectedCount: vini.length,
      scripts: scriptManager.getScriptsForPage('form'),
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Vini', href: '/ristorante-menu/vini' },
        { label: 'Modifica Massiva', href: '/ristorante-menu/vini/modifica-massa' }
      ],
      actionNavConfig
    });
  } catch (error) {
    console.error('Errore nel caricamento della modifica massiva vini:', error);
    res.status(500).send('Errore interno del server');
  }
});

// === SEZIONE BIRRE ===

// Route per visualizzare lista birre
router.get('/birre', async (req, res) => {
  try {
    const currentPath = '/ristorante-menu/birre';
    let sectionMenu = ristoranteMenuItems;
    
    // Filtro per tipologia
    const tipologiaFilter = req.query.tipologia as string;
    
    // Parametri di paginazione
    const { page, limit, offset } = getPaginationParams(req);
    
    // Costruisci la clausola WHERE
    const whereClause: any = {
      deletedAt: null
    };
    
    if (tipologiaFilter && tipologiaFilter.trim() !== '') {
      whereClause.tipologiaId = tipologiaFilter;
    }
    
    // Recupera le birre con le relazioni
    const birre = await prisma.birra.findMany({
      where: whereClause,
      include: {
        tipologia: true,
        nazione: true
      },
      orderBy: {
        nome: 'asc'
      },
      skip: offset,
      take: limit
    });
    
    // Trasforma i dati per la tabella
    const items = birre.map(birra => ({
      ...birra,
      tipologia_nome: birra.tipologia.nome,
      nazione_nome: birra.nazione.nome
    }));
    
    // Calcola paginazione
    const totalItems = await prisma.birra.count({
      where: whereClause
    });
    
    // Calcola il totale di birre nel sistema (senza filtri)
    const totalItemsInSystem = await prisma.birra.count({
      where: { deletedAt: null }
    });
    
    // Determina gli stati vuoti
    const isSectionEmpty = totalItemsInSystem === 0;
    const isFilteredEmpty = totalItemsInSystem > 0 && totalItems === 0;
    const hasItems = items.length > 0;
    
    const pagination = calculatePagination(page, limit, totalItems);
    
    // Recupera le tipologie per il filtro
    const tipologie = await prisma.tipologiaBirra.findMany({
      where: { deletedAt: null },
      orderBy: { nome: 'asc' }
    });
    
    // Configurazione actionNav per questa pagina
    const actionNavConfig = actionNavConfigs['birre.index'];
    
    res.render('pages/ristorante-menu/birre/index', {
      title: 'Birre',
      description: 'Gestione birre del menu',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionIcons,
      currentPath,
      tableData: birreTableData,
      items,
      hasItems,
      isSectionEmpty,
      isFilteredEmpty,
      pagination,
      currentTipologiaFilter: tipologiaFilter,
      tipologie,
      scripts: scriptManager.getScriptsForPage('table'),
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Birre', href: '/ristorante-menu/birre' }
      ],
      actionNavConfig,
      emptyState: {
        title: 'Nessuna birra disponibile',
        description: 'Non ci sono birre configurate nel sistema. Aggiungi la prima birra per iniziare.',
        buttonText: 'Aggiungi birra',
        buttonHref: '/ristorante-menu/birre/nuovo',
        iconName: 'menu',
        icon: sectionIcons['menu'],
        buttonIconName: 'piu',
        buttonIcon: uiIcons['piu']
      }
    });
  } catch (error) {
    console.error('Errore nel recupero delle birre:', error);
    res.status(500).send('Errore interno del server');
  }
});

// Route per visualizzare form nuovo birra
router.get('/birre/nuovo', async (req, res) => {
  try {
    const currentPath = '/ristorante-menu/birre/nuovo';
    let sectionMenu = ristoranteMenuItems;
    
    // Recupera le tipologie per il form
    const tipologie = await prisma.tipologiaBirra.findMany({
      where: { deletedAt: null },
      orderBy: { nome: 'asc' }
    });
    
    // Recupera le nazioni per il form
    const nazioni = await prisma.nazione.findMany({
      where: { deletedAt: null },
      orderBy: { nome: 'asc' }
    });
    
    // Prepara i dati del form
    const formData = birraFormData.getFormData(birraFormData, false);
    
    // Popola le opzioni dei select
    formData.fields.forEach(field => {
      if (field.name === 'tipologiaId') {
        field.options = tipologie.map(tipologia => ({
          value: tipologia.id,
          label: tipologia.nome
        }));
      } else if (field.name === 'nazioneId') {
        field.options = nazioni.map(nazione => ({
          value: nazione.id,
          label: nazione.nome
        }));
      }
    });
    
    // Configurazione actionNav per questa pagina
    const actionNavConfig = actionNavConfigs['birre.new'];
    
    res.render('pages/ristorante-menu/birre/new', {
      title: 'Nuova Birra',
      description: 'Aggiungi una nuova birra al menu',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionIcons,
      currentPath,
      formData,
      isEdit: false,
      scripts: scriptManager.getScriptsForPage('form'),
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Birre', href: '/ristorante-menu/birre' },
        { label: 'Nuova Birra', href: '/ristorante-menu/birre/nuovo' }
      ],
      actionNavConfig
    });
  } catch (error) {
    console.error('Errore nel caricamento del form birra:', error);
    res.status(500).send('Errore interno del server');
  }
});

// Route per visualizzare form modifica birra
router.get('/birre/modifica/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const currentPath = `/ristorante-menu/birre/modifica/${id}`;
    let sectionMenu = ristoranteMenuItems;
    
    // Recupera la birra con le relazioni
    const birra = await prisma.birra.findUnique({
      where: { id },
      include: {
        tipologia: true,
        nazione: true
      }
    });
    
    if (!birra) {
      return res.status(404).send('Birra non trovata');
    }
    
    // Recupera le tipologie per il form
    const tipologie = await prisma.tipologiaBirra.findMany({
      where: { deletedAt: null },
      orderBy: { nome: 'asc' }
    });
    
    // Recupera le nazioni per il form
    const nazioni = await prisma.nazione.findMany({
      where: { deletedAt: null },
      orderBy: { nome: 'asc' }
    });
    
    // Prepara i dati del form
    const formData = birraFormData.getFormData(birraFormData, true, birra);
    
    // Popola le opzioni dei select
    formData.fields.forEach(field => {
      if (field.name === 'tipologiaId') {
        field.options = tipologie.map(tipologia => ({
          value: tipologia.id,
          label: tipologia.nome
        }));
      } else if (field.name === 'nazioneId') {
        field.options = nazioni.map(nazione => ({
          value: nazione.id,
          label: nazione.nome
        }));
      }
    });
    
    // Configurazione actionNav per questa pagina
    const actionNavConfig = actionNavConfigs['birre.edit'];
    
    res.render('pages/ristorante-menu/birre/edit', {
      title: 'Modifica Birra',
      description: `Modifica la birra ${birra.nome}`,
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionIcons,
      currentPath,
      formData,
      isEdit: true,
      item: birra,
      scripts: scriptManager.getScriptsForPage('form'),
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Birre', href: '/ristorante-menu/birre' },
        { label: birra.nome, href: `/ristorante-menu/birre/dettagli/${birra.id}` },
        { label: 'Modifica', href: `/ristorante-menu/birre/modifica/${birra.id}` }
      ],
      actionNavConfig
    });
  } catch (error) {
    console.error('Errore nel caricamento del form birra:', error);
    res.status(500).send('Errore interno del server');
  }
});

// Route per visualizzare dettagli birra
router.get('/birre/dettagli/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const currentPath = `/ristorante-menu/birre/dettagli/${id}`;
    let sectionMenu = ristoranteMenuItems;
    
    // Recupera la birra con le relazioni
    const birra = await prisma.birra.findUnique({
      where: { id },
      include: {
        tipologia: true,
        nazione: true
      }
    });
    
    if (!birra) {
      return res.status(404).send('Birra non trovata');
    }
    
    // Trasforma i dati per la vista dettaglio
    const item = {
      ...birra,
      tipologia_nome: birra.tipologia.nome,
      nazione_nome: birra.nazione.nome
    };
    
    // Configurazione actionNav per questa pagina
    const actionNavConfig = { ...actionNavConfigs['birre.view'] };
    // Sostituisci :id con l'ID effettivo della birra
    if (actionNavConfig.actions) {
      actionNavConfig.actions = actionNavConfig.actions.map(action => {
        if (action.type === 'link' && action.href?.includes(':id')) {
          return {
            ...action,
            href: action.href.replace(':id', birra.id)
          };
        }
        return action;
      });
    }
    
    res.render('pages/ristorante-menu/birre/view', {
      title: birra.nome,
      description: `Dettagli della birra ${birra.nome}`,
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionIcons,
      currentPath,
      item,
      detailViewConfig: birreDetailViewConfig,
      scripts: scriptManager.getScriptsForPage('detail'),
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Birre', href: '/ristorante-menu/birre' },
        { label: birra.nome, href: `/ristorante-menu/birre/dettagli/${birra.id}` }
      ],
      actionNavConfig
    });
  } catch (error) {
    console.error('Errore nel recupero della birra:', error);
    res.status(500).send('Errore interno del server');
  }
});

// Route per visualizzare modifica massiva birre
router.get('/birre/modifica-massa', async (req, res) => {
  try {
    const currentPath = '/ristorante-menu/birre/modifica-massa';
    let sectionMenu = ristoranteMenuItems;
    
    // Recupera gli ID delle birre selezionate dalla query string
    const selectedIds = req.query.ids as string;
    
    if (!selectedIds) {
      return res.redirect('/ristorante-menu/birre');
    }
    
    const ids = selectedIds.split(',');
    
    // Recupera le birre selezionate con le relazioni
    const birre = await prisma.birra.findMany({
      where: {
        id: { in: ids },
        deletedAt: null
      },
      include: {
        tipologia: true,
        nazione: true
      },
      orderBy: {
        nome: 'asc'
      }
    });
    
    if (birre.length === 0) {
      return res.redirect('/ristorante-menu/birre');
    }
    
    // Recupera le tipologie per il form
    const tipologie = await prisma.tipologiaBirra.findMany({
      where: { deletedAt: null },
      orderBy: { nome: 'asc' }
    });
    
    // Recupera le nazioni per il form
    const nazioni = await prisma.nazione.findMany({
      where: { deletedAt: null },
      orderBy: { nome: 'asc' }
    });
    
    // Prepara i dati del form per la modifica massiva
    const formData = birraFormData.getFormData(birraFormData, false, undefined, undefined, true, birre);
    
    // Popola le opzioni dei select
    formData.fields.forEach(field => {
      if (field.name === 'tipologiaId') {
        field.options = tipologie.map(tipologia => ({
          value: tipologia.id,
          label: tipologia.nome
        }));
      } else if (field.name === 'nazioneId') {
        field.options = nazioni.map(nazione => ({
          value: nazione.id,
          label: nazione.nome
        }));
      }
    });
    
    // Configurazione actionNav per questa pagina
    const actionNavConfig = actionNavConfigs['birre.editBulk'];
    
    res.render('pages/ristorante-menu/birre/editBulk', {
      title: 'Modifica Massiva Birre',
      description: `Modifica ${birre.length} birre selezionate`,
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionIcons,
      currentPath,
      formData,
      selectedItems: birre,
      selectedCount: birre.length,
      scripts: scriptManager.getScriptsForPage('form'),
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Birre', href: '/ristorante-menu/birre' },
        { label: 'Modifica Massiva', href: '/ristorante-menu/birre/modifica-massa' }
      ],
      actionNavConfig
    });
  } catch (error) {
    console.error('Errore nel caricamento della modifica massiva birre:', error);
    res.status(500).send('Errore interno del server');
  }
});

// === ROUTE PER MENU FISSI ===

// Route per visualizzare lista menu fissi
router.get('/menu-fissi', async (req, res) => {
  try {
    const currentPath = '/ristorante-menu/menu-fissi';
    let sectionMenu = ristoranteMenuItems;
    
    // Filtro per categoria
    const categoriaFilter = req.query.categoria as string;
    
    const { page, limit, offset } = getPaginationParams(req);
    
    // Costruisci la clausola WHERE
    const whereClause: any = {
      deletedAt: null
    };
    
    if (categoriaFilter && categoriaFilter.trim() !== '') {
      whereClause.categoriaId = categoriaFilter;
    }
    
    const menuFissi = await prisma.menuFisso.findMany({
      where: whereClause,
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
      where: whereClause
    });
    
    // Calcola il totale di menu fissi nel sistema (senza filtri)
    const totalItemsInSystem = await prisma.menuFisso.count({
      where: { deletedAt: null }
    });
    
    // Determina gli stati vuoti
    const isSectionEmpty = totalItemsInSystem === 0;
    const isFilteredEmpty = totalItemsInSystem > 0 && totalItems === 0;
    const hasItems = items.length > 0;
    
    const pagination = calculatePagination(page, limit, totalItems);
    
    // Recupera le categorie per il filtro
    const categorie = await prisma.categoriaMenuFisso.findMany({
      where: { deletedAt: null },
      orderBy: { nome: 'asc' }
    });
    
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
      hasItems,
      isSectionEmpty,
      isFilteredEmpty,
      pagination,
      currentCategoriaFilter: categoriaFilter,
      categorie,
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

        case 'nazione':
          const existingNazioni = await prisma.nazione.findMany({
            where: { 
              id: { in: ids as string[] },
              deletedAt: { not: null }
            }
          });
          if (existingNazioni.length > 0) {
            const validIds = existingNazioni.map(item => item.id);
            await prisma.nazione.updateMany({
              where: { id: { in: validIds } },
              data: { deletedAt: null }
            });
            restored = validIds.length;
            skipped = (ids as string[]).length - validIds.length;
          } else {
            skipped = (ids as string[]).length;
          }
          break;

        case 'regione':
          const existingRegioni = await prisma.regione.findMany({
            where: { 
              id: { in: ids as string[] },
              deletedAt: { not: null }
            }
          });
          if (existingRegioni.length > 0) {
            const validIds = existingRegioni.map(item => item.id);
            await prisma.regione.updateMany({
              where: { id: { in: validIds } },
              data: { deletedAt: null }
            });
            restored = validIds.length;
            skipped = (ids as string[]).length - validIds.length;
          } else {
            skipped = (ids as string[]).length;
          }
          break;

        case 'zona':
          const existingZone = await prisma.zona.findMany({
            where: { 
              id: { in: ids as string[] },
              deletedAt: { not: null }
            }
          });
          if (existingZone.length > 0) {
            const validIds = existingZone.map(item => item.id);
            await prisma.zona.updateMany({
              where: { id: { in: validIds } },
              data: { deletedAt: null }
            });
            restored = validIds.length;
            skipped = (ids as string[]).length - validIds.length;
          } else {
            skipped = (ids as string[]).length;
          }
          break;
        case 'tipologia-vino':
          const existingTipologieVino = await prisma.tipologiaVino.findMany({
            where: { 
              id: { in: ids as string[] },
              deletedAt: { not: null }
            }
          });
          if (existingTipologieVino.length > 0) {
            const validIds = existingTipologieVino.map(item => item.id);
            await prisma.tipologiaVino.updateMany({
              where: { id: { in: validIds } },
              data: { deletedAt: null }
            });
            restored = validIds.length;
            skipped = (ids as string[]).length - validIds.length;
          } else {
            skipped = (ids as string[]).length;
          }
          break;
        case 'tipologia-birra':
          const existingTipologieBirra = await prisma.tipologiaBirra.findMany({
            where: { 
              id: { in: ids as string[] },
              deletedAt: { not: null }
            }
          });
          if (existingTipologieBirra.length > 0) {
            const validIds = existingTipologieBirra.map(item => item.id);
            await prisma.tipologiaBirra.updateMany({
              where: { id: { in: validIds } },
              data: { deletedAt: null }
            });
            restored = validIds.length;
            skipped = (ids as string[]).length - validIds.length;
          } else {
            skipped = (ids as string[]).length;
          }
          break;
        case 'tipologia-liquore':
          const existingTipologieLiquore = await prisma.tipologiaLiquore.findMany({
            where: { 
              id: { in: ids as string[] },
              deletedAt: { not: null }
            }
          });
          if (existingTipologieLiquore.length > 0) {
            const validIds = existingTipologieLiquore.map(item => item.id);
            await prisma.tipologiaLiquore.updateMany({
              where: { id: { in: validIds } },
              data: { deletedAt: null }
            });
            restored = validIds.length;
            skipped = (ids as string[]).length - validIds.length;
          } else {
            skipped = (ids as string[]).length;
          }
          break;
        case 'tipologia-cocktail':
          const existingTipologieCocktail = await prisma.tipologiaCocktail.findMany({
            where: { 
              id: { in: ids as string[] },
              deletedAt: { not: null }
            }
          });
          if (existingTipologieCocktail.length > 0) {
            const validIds = existingTipologieCocktail.map(item => item.id);
            await prisma.tipologiaCocktail.updateMany({
              where: { id: { in: validIds } },
              data: { deletedAt: null }
            });
            restored = validIds.length;
            skipped = (ids as string[]).length - validIds.length;
          } else {
            skipped = (ids as string[]).length;
          }
          break;
        case 'tipologia-bevanda':
          const existingTipologieBevanda = await prisma.tipologiaBevanda.findMany({
            where: { 
              id: { in: ids as string[] },
              deletedAt: { not: null }
            }
          });
          if (existingTipologieBevanda.length > 0) {
            const validIds = existingTipologieBevanda.map(item => item.id);
            await prisma.tipologiaBevanda.updateMany({
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

        case 'nazione':
          // Verifica che non ci siano regioni associate
          const regioniAssociate = await prisma.regione.findMany({
            where: { 
              nazioneId: { in: ids as string[] },
              deletedAt: null
            }
          });
          
          if (regioniAssociate.length > 0) {
            skipped = (ids as string[]).length;
            results.push({ 
              type, 
              deleted: 0, 
              skipped: (ids as string[]).length,
              error: 'Impossibile eliminare nazioni con regioni associate'
            });
            continue;
          }
          
          const deletedNazioni = await prisma.nazione.deleteMany({
            where: { 
              id: { in: ids as string[] },
              deletedAt: { not: null }
            }
          });
          deleted = deletedNazioni.count;
          skipped = (ids as string[]).length - deleted;
          break;

        case 'regione':
          // Verifica che non ci siano zone associate
          const zoneAssociate = await prisma.zona.findMany({
            where: { 
              regioneId: { in: ids as string[] },
              deletedAt: null
            }
          });
          
          if (zoneAssociate.length > 0) {
            skipped = (ids as string[]).length;
            results.push({ 
              type, 
              deleted: 0, 
              skipped: (ids as string[]).length,
              error: 'Impossibile eliminare regioni con zone associate'
            });
            continue;
          }
          
          const deletedRegioni = await prisma.regione.deleteMany({
            where: { 
              id: { in: ids as string[] },
              deletedAt: { not: null }
            }
          });
          deleted = deletedRegioni.count;
          skipped = (ids as string[]).length - deleted;
          break;

        case 'zona':
          const deletedZone = await prisma.zona.deleteMany({
            where: { 
              id: { in: ids as string[] },
              deletedAt: { not: null }
            }
          });
          deleted = deletedZone.count;
          skipped = (ids as string[]).length - deleted;
          break;
        case 'tipologia-vino':
          // Verifica se ci sono vini associati
          const viniAssociati = await prisma.vino.findMany({
            where: {
              tipologiaId: { in: ids as string[] },
              deletedAt: null
            }
          });
          
          if (viniAssociati.length > 0) {
            skipped = (ids as string[]).length;
            results.push({ 
              type, 
              deleted: 0, 
              skipped: (ids as string[]).length,
              error: 'Impossibile eliminare tipologie vino con vini associati'
            });
            continue;
          }
          
          const deletedTipologieVino = await prisma.tipologiaVino.deleteMany({
            where: { 
              id: { in: ids as string[] },
              deletedAt: { not: null }
            }
          });
          deleted = deletedTipologieVino.count;
          skipped = (ids as string[]).length - deleted;
          break;
        case 'tipologia-birra':
          // Verifica se ci sono birre associate
          const birreAssociate = await prisma.birra.findMany({
            where: {
              tipologiaId: { in: ids as string[] },
              deletedAt: null
            }
          });
          
          if (birreAssociate.length > 0) {
            skipped = (ids as string[]).length;
            results.push({ 
              type, 
              deleted: 0, 
              skipped: (ids as string[]).length,
              error: 'Impossibile eliminare tipologie birra con birre associate'
            });
            continue;
          }
          
          const deletedTipologieBirra = await prisma.tipologiaBirra.deleteMany({
            where: { 
              id: { in: ids as string[] },
              deletedAt: { not: null }
            }
          });
          deleted = deletedTipologieBirra.count;
          skipped = (ids as string[]).length - deleted;
          break;
        case 'tipologia-liquore':
          // Verifica se ci sono liquori associati
          const liquoriAssociati = await prisma.liquore.findMany({
            where: {
              tipologiaId: { in: ids as string[] },
              deletedAt: null
            }
          });
          
          if (liquoriAssociati.length > 0) {
            skipped = (ids as string[]).length;
            results.push({ 
              type, 
              deleted: 0, 
              skipped: (ids as string[]).length,
              error: 'Impossibile eliminare tipologie liquore con liquori associati'
            });
            continue;
          }
          
          const deletedTipologieLiquore = await prisma.tipologiaLiquore.deleteMany({
            where: { 
              id: { in: ids as string[] },
              deletedAt: { not: null }
            }
          });
          deleted = deletedTipologieLiquore.count;
          skipped = (ids as string[]).length - deleted;
          break;
        case 'tipologia-cocktail':
          // Verifica se ci sono cocktail associati
          const cocktailAssociati = await prisma.cocktail.findMany({
            where: {
              tipologiaId: { in: ids as string[] },
              deletedAt: null
            }
          });
          
          if (cocktailAssociati.length > 0) {
            skipped = (ids as string[]).length;
            results.push({ 
              type, 
              deleted: 0, 
              skipped: (ids as string[]).length,
              error: 'Impossibile eliminare tipologie cocktail con cocktail associati'
            });
            continue;
          }
          
          const deletedTipologieCocktail = await prisma.tipologiaCocktail.deleteMany({
            where: { 
              id: { in: ids as string[] },
              deletedAt: { not: null }
            }
          });
          deleted = deletedTipologieCocktail.count;
          skipped = (ids as string[]).length - deleted;
          break;
        case 'tipologia-bevanda':
          // Verifica se ci sono bevande associate
          const bevandeAssociate = await prisma.bevanda.findMany({
            where: {
              tipologiaId: { in: ids as string[] },
              deletedAt: null
            }
          });
          
          if (bevandeAssociate.length > 0) {
            skipped = (ids as string[]).length;
            results.push({ 
              type, 
              deleted: 0, 
              skipped: (ids as string[]).length,
              error: 'Impossibile eliminare tipologie bevanda con bevande associate'
            });
            continue;
          }
          
          const deletedTipologieBevanda = await prisma.tipologiaBevanda.deleteMany({
            where: { 
              id: { in: ids as string[] },
              deletedAt: { not: null }
            }
          });
          deleted = deletedTipologieBevanda.count;
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

// === ROUTE NAZIONI ===

// Route per visualizzare lista nazioni
router.get('/impostazioni/nazioni', async (req, res) => {
  try {
    const currentPath = '/ristorante-menu/impostazioni/nazioni';
    let sectionMenu = ristoranteMenuItems;
    let sectionTabs = ristoranteMenuImpostazioniSubItems;
    
    // Gestione paginazione
    const paginationConfig = getPaginationParams(req, 20);
    
    // Conta totale elementi
    const totalItems = await prisma.nazione.count({
      where: {
        deletedAt: null
      }
    });
    
    // Recuperare le nazioni dal database con paginazione e conteggio regioni
    const nazioni = await prisma.nazione.findMany({
      where: {
        deletedAt: null
      },
      include: {
        _count: {
          select: {
            regioni: true
          }
        }
      },
      orderBy: {
        nome: 'asc'
      },
      skip: paginationConfig.offset,
      take: paginationConfig.limit
    });
    
    // Trasforma i dati per la tabella
    const items = nazioni.map(nazione => ({
      ...nazione,
      regioni: nazione._count.regioni
    }));
    
    // Calcola informazioni di paginazione
    const pagination = calculatePagination(
      totalItems,
      paginationConfig.page,
      paginationConfig.limit
    );
    
    const config = { ...nazioniConfig };
    config.hasItems = totalItems > 0;
    config.items = items;
    
    // Gestire messaggi di successo/errore
    const successMessage = req.query.success ? decodeURIComponent(req.query.success as string) : undefined;
    const errorMessage = req.query.error ? decodeURIComponent(req.query.error as string) : undefined;
    
    // Configurazione actionNav per questa sottosezione
    const actionNavConfig = createSubSectionActionNav('nazioni', 'index');
    
    res.render('pages/ristorante-menu/impostazioni/subSection', {
      title: 'Nazioni',
      description: 'Gestisci le nazioni per la classificazione geografica',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionTabs,
      sectionIcons,
      currentPath,
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
        { label: 'Nazioni', href: '/ristorante-menu/impostazioni/nazioni' }
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
    console.error('Errore nel recupero delle nazioni:', error);
    res.status(500).send('Errore interno del server');
  }
});

// Route per visualizzare nazione 
router.get('/impostazioni/nazioni/dettagli/:id', async (req, res) => {
  try {
    const currentPath = '/ristorante-menu/impostazioni/nazioni/dettagli/' + req.params.id;
    let sectionMenu = ristoranteMenuItems;
    let sectionTabs = ristoranteMenuImpostazioniSubItems;
    
    const nazione = await prisma.nazione.findFirst({
      where: { 
        id: req.params.id,
        deletedAt: null
      },
      include: {
        _count: {
          select: {
            regioni: true
          }
        }
      }
    });

    if (!nazione) {
      return res.status(404).send('Nazione non trovata');
    }

    // Trasforma i dati per la vista
    const nazioneData = {
      ...nazione,
      regioni: nazione._count.regioni
    };

    const actionNavConfig = createSubSectionActionNav('nazioni', 'view', nazione.id);
    const customTitle = generatePageTitle(nazioniConfig, 'view', nazione);

    res.render('pages/ristorante-menu/impostazioni/view', {
      title: 'Dettagli Nazione',
      customTitle,
      description: 'Informazioni dettagliate della nazione',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionTabs,
      sectionIcons,
      currentPath,
      item: nazioneData,
      itemType: 'Nazione',
      backUrl: '/ristorante-menu/impostazioni/nazioni',
      actionNavConfig,
      detailViewConfig: nazioniDetailViewConfig,
      isInternalPage: true,
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
        { label: 'Nazioni', href: '/ristorante-menu/impostazioni/nazioni' },
        { label: nazione.nome, href: `/ristorante-menu/impostazioni/nazioni/dettagli/${nazione.id}` }
      ]
    });
  } catch (error) {
    console.error('Errore nel recupero della nazione:', error);
    res.status(500).send('Errore interno del server');
  }
});

// Route per nuovo nazione
router.get('/impostazioni/nazioni/nuovo', async (req, res) => {
  try {
    const currentPath = '/ristorante-menu/impostazioni/nazioni/nuovo';
    let sectionMenu = ristoranteMenuItems;
    let sectionTabs = ristoranteMenuImpostazioniSubItems;
    
    const formConfig = nazioneFormData.getFormData ? nazioneFormData.getFormData(nazioneFormData, false, null, req.body) : nazioneFormData;
    
    // Configurazione actionNav per questa pagina
    const actionNavConfig = createSubSectionActionNav('nazioni', 'new');
    
    res.render('pages/ristorante-menu/servizi/new', {
      title: 'Nuova Nazione',
      description: 'Crea una nuova nazione per la classificazione geografica',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionTabs,
      sectionIcons,
      currentPath,
      formConfig,
      itemType: 'Nazione',
      backUrl: '/ristorante-menu/impostazioni/nazioni',
      actionNavConfig, // Passa la configurazione actionNav
      isInternalPage: true, // Aggiunto parametro mancante
      scripts: scriptManager.getScriptsForPage('form'), // Aggiunto script per validazione form
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
        { label: 'Nazioni', href: '/ristorante-menu/impostazioni/nazioni' },
        { label: 'Nuova Nazione', href: '/ristorante-menu/impostazioni/nazioni/nuovo' }
      ]
    });
  } catch (error) {
    console.error('Errore nel caricamento del form nuova nazione:', error);
    res.status(500).send('Errore interno del server');
  }
});

// Route per modifica nazione
router.get('/impostazioni/nazioni/modifica/:id', async (req, res) => {
  try {
    const currentPath = '/ristorante-menu/impostazioni/nazioni/modifica/' + req.params.id;
    let sectionMenu = ristoranteMenuItems;
    let sectionTabs = ristoranteMenuImpostazioniSubItems;
    
    const nazione = await prisma.nazione.findFirst({
      where: { 
        id: req.params.id,
        deletedAt: null
      }
    });

    if (!nazione) {
      return res.status(404).send('Nazione non trovata');
    }

    const formConfig = nazioneFormData.getFormData ? nazioneFormData.getFormData(nazioneFormData, true, nazione, req.body) : nazioneFormData;
    
    // Configurazione actionNav per questa pagina
    const actionNavConfig = createSubSectionActionNav('nazioni', 'edit', nazione.id);
    const customTitle = generatePageTitle(nazioniConfig, 'edit', nazione);

    res.render('pages/ristorante-menu/servizi/edit', {
      title: 'Modifica Nazione',
      customTitle,
      description: 'Modifica le informazioni della nazione',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionTabs,
      sectionIcons,
      currentPath,
      formConfig,
      item: nazione,
      itemType: 'Nazione',
      backUrl: `/ristorante-menu/impostazioni/nazioni/dettagli/${nazione.id}`,
      actionNavConfig, // Passa la configurazione actionNav
      isInternalPage: true, // Aggiunto parametro mancante
      scripts: scriptManager.getScriptsForPage('form'), // Aggiunto script per validazione form
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
        { label: 'Nazioni', href: '/ristorante-menu/impostazioni/nazioni' },
        { label: nazione.nome, href: `/ristorante-menu/impostazioni/nazioni/dettagli/${nazione.id}` },
        { label: 'Modifica', href: `/ristorante-menu/impostazioni/nazioni/modifica/${nazione.id}` }
      ]
    });
  } catch (error) {
    console.error('Errore nel caricamento del form modifica nazione:', error);
    res.status(500).send('Errore interno del server');
  }
});

// Route per eliminazione singola nazione
router.delete('/impostazioni/nazioni/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.nazione.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    });
    
    res.json({ success: true, message: 'Nazione eliminata con successo' });
  } catch (error) {
    console.error('Errore nell\'eliminazione della nazione:', error);
    res.status(500).json({ success: false, message: 'Errore nell\'eliminazione' });
  }
});

// Route per eliminazione multipla nazioni
router.delete('/impostazioni/nazioni', async (req, res) => {
  const { itemIds } = req.body;
  
  if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
    return res.status(400).json({ 
      success: false, 
      message: 'Nessuna nazione selezionata per la cancellazione' 
    });
  }
  
  try {
    // Verifica che tutte le nazioni esistano e non siano già cancellate
    const existingNazioni = await prisma.nazione.findMany({
      where: { 
        id: { in: itemIds },
        deletedAt: null
      }
    });

    if (existingNazioni.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Nessuna nazione valida trovata per la cancellazione' 
      });
    }

    // Esegui soft delete per tutte le nazioni valide
    const validNazioneIds = existingNazioni.map(nazione => nazione.id);
    await prisma.nazione.updateMany({
      where: { 
        id: { in: validNazioneIds }
      },
      data: { 
        deletedAt: new Date() 
      }
    });

    const deletedCount = validNazioneIds.length;
    const skippedCount = itemIds.length - validNazioneIds.length;
    
    let message = `Eliminate ${deletedCount} nazione/i con successo`;
    if (skippedCount > 0) {
      message += `. ${skippedCount} nazione/i già cancellate o non trovate.`;
    }

    res.json({ 
      success: true, 
      message,
      deletedCount,
      skippedCount
    });
  } catch (error) {
    console.error('Errore nella cancellazione delle nazioni:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Si è verificato un errore durante la cancellazione' 
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

// Route AJAX per creazione nazione
router.post('/impostazioni/nazioni/nuovo/ajax', async (req, res) => {
  const { nome, sigla } = req.body;
  
  try {
    // Verifica se esiste già una nazione con lo stesso nome o sigla
    const existingNazione = await prisma.nazione.findFirst({
      where: {
        OR: [
          { nome },
          { sigla: sigla.toUpperCase() }
        ]
      }
    });

    if (existingNazione) {
      return res.json({ 
        success: false, 
        message: existingNazione.nome === nome 
          ? 'Una nazione con questo nome esiste già' 
          : 'Una nazione con questa sigla esiste già'
      });
    }

    const nazione = await prisma.nazione.create({
      data: {
        nome,
        sigla: sigla.toUpperCase()
      }
    });

    res.json({ 
      success: true, 
      message: 'Nazione creata con successo',
      data: { id: nazione.id }
    });
  } catch (error) {
    console.error('Errore nella creazione della nazione:', error);
    res.json({ 
      success: false, 
      message: 'Si è verificato un errore durante la creazione della nazione' 
    });
  }
});

// Route AJAX per modifica nazione
router.post('/impostazioni/nazioni/modifica/:id/ajax', async (req, res) => {
  const { nome, sigla } = req.body;
  const nazioneId = req.params.id;
  
  try {
    const existingNazione = await prisma.nazione.findUnique({
      where: { id: nazioneId }
    });

    if (!existingNazione) {
      return res.json({ 
        success: false, 
        message: 'La nazione richiesta non esiste' 
      });
    }

    // Verifica se esiste già un'altra nazione con lo stesso nome o sigla
    if (nome !== existingNazione.nome || sigla.toUpperCase() !== existingNazione.sigla) {
      const duplicateNazione = await prisma.nazione.findFirst({
        where: {
          AND: [
            { id: { not: nazioneId } },
            {
              OR: [
                { nome },
                { sigla: sigla.toUpperCase() }
              ]
            }
          ]
        }
      });

      if (duplicateNazione) {
        return res.json({ 
          success: false, 
          message: duplicateNazione.nome === nome 
            ? 'Un\'altra nazione con questo nome esiste già' 
            : 'Un\'altra nazione con questa sigla esiste già'
        });
      }
    }

    const updatedNazione = await prisma.nazione.update({
      where: { id: nazioneId },
      data: {
        nome,
        sigla: sigla.toUpperCase()
      }
    });

    res.json({ 
      success: true, 
      message: 'Nazione aggiornata con successo',
      data: { id: updatedNazione.id }
    });
  } catch (error) {
    console.error('Errore nell\'aggiornamento della nazione:', error);
    res.json({ 
      success: false, 
      message: 'Si è verificato un errore durante l\'aggiornamento della nazione' 
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

// === ROUTE AJAX PER VINI ===

// Route AJAX per creazione vino
router.post('/vini/nuovo/ajax', async (req, res) => {
  const { 
    nome, 
    descrizione, 
    cantina, 
    grado, 
    certificazione, 
    capacita, 
    tipologiaId, 
    nazioneId, 
    regioneId, 
    zonaId, 
    prezzo, 
    prezzoCalice, 
    inLista 
  } = req.body;
  
  try {
    // Verifica se esiste già un vino con lo stesso nome
    const existingVino = await prisma.vino.findFirst({
      where: { 
        nome,
        deletedAt: null
      }
    });

    if (existingVino) {
      return res.json({ 
        success: false, 
        message: 'Un vino con questo nome esiste già' 
      });
    }

    // Crea il vino
    const vino = await prisma.vino.create({
      data: {
        nome,
        descrizione: descrizione || null,
        cantina: cantina || null,
        grado: grado || null,
        certificazione: certificazione || null,
        capacita: capacita || null,
        tipologiaId,
        nazioneId,
        regioneId: regioneId || null,
        zonaId: zonaId || null,
        prezzo: parseFloat(prezzo),
        prezzoCalice: prezzoCalice ? parseFloat(prezzoCalice) : null,
        inLista: inLista === 'on' || inLista === true
      }
    });

    res.json({ 
      success: true, 
      message: 'Vino creato con successo',
      data: { id: vino.id }
    });
  } catch (error) {
    console.error('Errore nella creazione del vino:', error);
    res.json({ 
      success: false, 
      message: 'Si è verificato un errore durante la creazione del vino' 
    });
  }
});

// Route AJAX per modifica vino
router.post('/vini/modifica/:id/ajax', async (req, res) => {
  const { 
    nome, 
    descrizione, 
    cantina, 
    grado, 
    certificazione, 
    capacita, 
    tipologiaId, 
    nazioneId, 
    regioneId, 
    zonaId, 
    prezzo, 
    prezzoCalice, 
    inLista 
  } = req.body;
  const vinoId = req.params.id;
  
  try {
    const existingVino = await prisma.vino.findUnique({
      where: { id: vinoId }
    });

    if (!existingVino) {
      return res.json({
        success: false,
        message: 'Vino non trovato'
      });
    }

    // Verifica se esiste già un altro vino con lo stesso nome
    const duplicateVino = await prisma.vino.findFirst({
      where: { 
        nome,
        deletedAt: null,
        id: { not: vinoId }
      }
    });

    if (duplicateVino) {
      return res.json({
        success: false,
        message: 'Un altro vino con questo nome esiste già'
      });
    }

    // Aggiorna il vino
    const updatedVino = await prisma.vino.update({
      where: { id: vinoId },
      data: {
        nome,
        descrizione: descrizione || null,
        cantina: cantina || null,
        grado: grado || null,
        certificazione: certificazione || null,
        capacita: capacita || null,
        tipologiaId,
        nazioneId,
        regioneId: regioneId || null,
        zonaId: zonaId || null,
        prezzo: parseFloat(prezzo),
        prezzoCalice: prezzoCalice ? parseFloat(prezzoCalice) : null,
        inLista: inLista === 'on' || inLista === true
      }
    });

    res.json({ 
      success: true, 
      message: 'Vino aggiornato con successo',
      data: { id: updatedVino.id }
    });
  } catch (error) {
    console.error('Errore nell\'aggiornamento del vino:', error);
    res.json({ 
      success: false, 
      message: 'Si è verificato un errore durante l\'aggiornamento del vino' 
    });
  }
});

// Route AJAX per modifica massiva vini
router.post('/vini/modifica-massa/ajax', async (req, res) => {
  const { 
    itemIds, 
    tipologiaId, 
    nazioneId, 
    regioneId, 
    zonaId, 
    cantina, 
    grado, 
    certificazione, 
    capacita, 
    prezzo, 
    prezzoCalice, 
    inLista 
  } = req.body;
  
  try {
    if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
      return res.json({ 
        success: false, 
        message: 'Nessun vino selezionato' 
      });
    }

    const updateData: any = {};
    
    if (tipologiaId) {
      updateData.tipologiaId = tipologiaId;
    }
    
    if (nazioneId) {
      updateData.nazioneId = nazioneId;
    }
    
    if (regioneId) {
      updateData.regioneId = regioneId;
    }
    
    if (zonaId) {
      updateData.zonaId = zonaId;
    }
    
    if (cantina !== undefined && cantina !== '') {
      updateData.cantina = cantina;
    }
    
    if (grado !== undefined && grado !== '') {
      updateData.grado = grado;
    }
    
    if (certificazione !== undefined && certificazione !== '') {
      updateData.certificazione = certificazione;
    }
    
    if (capacita !== undefined && capacita !== '') {
      updateData.capacita = capacita;
    }
    
    if (prezzo !== undefined && prezzo !== '') {
      updateData.prezzo = parseFloat(prezzo);
    }
    
    if (prezzoCalice !== undefined && prezzoCalice !== '') {
      updateData.prezzoCalice = parseFloat(prezzoCalice);
    }
    
    if (inLista !== undefined && inLista !== null) {
      updateData.inLista = inLista === 'on' || inLista === true;
    }

    // Aggiorna i vini
    const result = await prisma.vino.updateMany({
      where: {
        id: { in: itemIds },
        deletedAt: null
      },
      data: updateData
    });

    res.json({ 
      success: true, 
      message: `${result.count} vino/i aggiornato/i con successo`,
      data: { updatedCount: result.count }
    });
  } catch (error) {
    console.error('Errore nella modifica massiva dei vini:', error);
    res.json({ 
      success: false, 
      message: 'Si è verificato un errore durante la modifica massiva dei vini' 
    });
  }
});

// === ROUTE AJAX PER BIRRE ===

// Route AJAX per creare nuova birra
router.post('/birre/nuovo/ajax', async (req, res) => {
  try {
    const { nome, descrizione, grado, capacita, tipologiaId, nazioneId, prezzo, inLista } = req.body;
    
    // Validazione
    if (!nome || !tipologiaId || !nazioneId || !prezzo) {
      return res.json({
        success: false,
        message: 'Nome, tipologia, nazione e prezzo sono obbligatori'
      });
    }
    
    // Crea la birra
    const birra = await prisma.birra.create({
      data: {
        nome: nome.trim(),
        descrizione: descrizione?.trim() || null,
        grado: grado?.trim() || null,
        capacita: capacita?.trim() || null,
        tipologiaId,
        nazioneId,
        prezzo: parseFloat(prezzo),
        inLista: inLista === 'on' || inLista === true
      }
    });
    
    res.json({
      success: true,
      message: 'Birra creata con successo',
      data: { id: birra.id }
    });
  } catch (error) {
    console.error('Errore nella creazione della birra:', error);
    res.json({ 
      success: false, 
      message: 'Si è verificato un errore durante la creazione della birra' 
    });
  }
});

// Route AJAX per modificare birra
router.post('/birre/modifica/:id/ajax', async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, descrizione, grado, capacita, tipologiaId, nazioneId, prezzo, inLista } = req.body;
    
    // Validazione
    if (!nome || !tipologiaId || !nazioneId || !prezzo) {
      return res.json({
        success: false,
        message: 'Nome, tipologia, nazione e prezzo sono obbligatori'
      });
    }
    
    // Verifica che la birra esista
    const existingBirra = await prisma.birra.findUnique({
      where: { id }
    });
    
    if (!existingBirra) {
      return res.json({
        success: false,
        message: 'Birra non trovata'
      });
    }
    
    // Aggiorna la birra
    const birra = await prisma.birra.update({
      where: { id },
      data: {
        nome: nome.trim(),
        descrizione: descrizione?.trim() || null,
        grado: grado?.trim() || null,
        capacita: capacita?.trim() || null,
        tipologiaId,
        nazioneId,
        prezzo: parseFloat(prezzo),
        inLista: inLista === 'on' || inLista === true
      }
    });
    
    res.json({
      success: true,
      message: 'Birra aggiornata con successo',
      data: { id: birra.id }
    });
  } catch (error) {
    console.error('Errore nell\'aggiornamento della birra:', error);
    res.json({ 
      success: false, 
      message: 'Si è verificato un errore durante l\'aggiornamento della birra' 
    });
  }
});

// Route AJAX per modifica massiva birre
router.post('/birre/modifica-massa/ajax', async (req, res) => {
  try {
    const { itemIds, tipologiaId, nazioneId, grado, capacita, prezzo, inLista } = req.body;
    
    if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
      return res.json({
        success: false,
        message: 'Nessuna birra selezionata'
      });
    }
    
    // Prepara i dati da aggiornare
    const updateData: any = {};
    
    if (tipologiaId !== undefined && tipologiaId !== '') {
      updateData.tipologiaId = tipologiaId;
    }
    
    if (nazioneId !== undefined && nazioneId !== '') {
      updateData.nazioneId = nazioneId;
    }
    
    if (grado !== undefined && grado !== '') {
      updateData.grado = grado.trim();
    }
    
    if (capacita !== undefined && capacita !== '') {
      updateData.capacita = capacita.trim();
    }
    
    if (prezzo !== undefined && prezzo !== '') {
      updateData.prezzo = parseFloat(prezzo);
    }
    
    if (inLista !== undefined && inLista !== null) {
      updateData.inLista = inLista === 'on' || inLista === true;
    }

    // Aggiorna le birre
    const result = await prisma.birra.updateMany({
      where: {
        id: { in: itemIds },
        deletedAt: null
      },
      data: updateData
    });
    
    res.json({
      success: true,
      message: `${result.count} birra aggiornata/e con successo`,
      data: { count: result.count }
    });
  } catch (error) {
    console.error('Errore nella modifica massiva delle birre:', error);
    res.json({ 
      success: false, 
      message: 'Si è verificato un errore durante la modifica massiva delle birre' 
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

// === ROUTE CRUD REGIONI ===

// Route per visualizzare lista regioni
router.get('/impostazioni/regioni', async (req, res) => {
  try {
    const currentPath = '/ristorante-menu/impostazioni/regioni';
    let sectionMenu = ristoranteMenuItems;
    let sectionTabs = ristoranteMenuImpostazioniSubItems;

    const paginationConfig = getPaginationParams(req, 20);
    const totalItems = await prisma.regione.count({ where: { deletedAt: null } });
    const regioni = await prisma.regione.findMany({
      where: { deletedAt: null },
      include: { 
        nazione: true
      },
      orderBy: { nome: 'asc' },
      skip: paginationConfig.offset,
      take: paginationConfig.limit
    });

    const items = regioni.map(regione => ({ 
      ...regione, 
      nazione_nome: regione.nazione.nome
    }));
    const pagination = calculatePagination(totalItems, paginationConfig.page, paginationConfig.limit);

    const config = { ...regioniConfig };
    config.hasItems = totalItems > 0;
    config.items = items;

    const successMessage = req.query.success ? decodeURIComponent(req.query.success as string) : undefined;
    const errorMessage = req.query.error ? decodeURIComponent(req.query.error as string) : undefined;
    const actionNavConfig = createSubSectionActionNav('regioni', 'index');

    res.render('pages/ristorante-menu/impostazioni/subSection', {
      title: 'Regioni',
      description: 'Gestisci le regioni per la classificazione geografica',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionTabs,
      sectionIcons,
      currentPath,
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
        { label: 'Regioni', href: '/ristorante-menu/impostazioni/regioni' }
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
    console.error('Errore nel recupero delle regioni:', error);
    res.status(500).send('Errore interno del server');
  }
});

// Route per visualizzare dettagli regione
router.get('/impostazioni/regioni/dettagli/:id', async (req, res) => {
  try {
    const currentPath = '/ristorante-menu/impostazioni/regioni/dettagli/' + req.params.id;
    let sectionMenu = ristoranteMenuItems;
    let sectionTabs = ristoranteMenuImpostazioniSubItems;

    const regione = await prisma.regione.findFirst({
      where: { 
        id: req.params.id,
        deletedAt: null
      },
      include: { 
        nazione: true
      }
    });

    if (!regione) {
      return res.status(404).send('Regione non trovata');
    }

    // Trasforma i dati per la vista
    const item = {
      ...regione,
      nazione_nome: regione.nazione.nome
    };

    const actionNavConfig = createSubSectionActionNav('regioni', 'view', regione.id);
    const customTitle = generatePageTitle(regioniConfig, 'view', regione);

    res.render('pages/ristorante-menu/impostazioni/view', {
      title: 'Dettagli Regione',
      customTitle,
      description: 'Informazioni dettagliate della regione',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionTabs,
      sectionIcons,
      currentPath,
      item,
      itemType: 'Regione',
      backUrl: '/ristorante-menu/impostazioni/regioni',
      actionNavConfig,
      detailViewConfig: regioniDetailViewConfig,
      scripts: scriptManager.getScriptsForPage('dashboard'),
      isInternalPage: true,
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
        { label: 'Regioni', href: '/ristorante-menu/impostazioni/regioni' },
        { label: regione.nome, href: `/ristorante-menu/impostazioni/regioni/dettagli/${regione.id}` }
      ]
    });
  } catch (error) {
    console.error('Errore nel caricamento dei dettagli regione:', error);
    res.status(500).send('Errore interno del server');
  }
});

// Route per form nuova regione
router.get('/impostazioni/regioni/nuovo', async (req, res) => {
  try {
    const currentPath = '/ristorante-menu/impostazioni/regioni/nuovo';
    let sectionMenu = ristoranteMenuItems;
    let sectionTabs = ristoranteMenuImpostazioniSubItems;

    // Recupera le nazioni per il select
    const nazioni = await prisma.nazione.findMany({
      where: { deletedAt: null },
      orderBy: { nome: 'asc' }
    });

    // Configura il form
    const formConfig = regioneFormData.getFormData ? 
      regioneFormData.getFormData(regioneFormData, false, null, req.body) : 
      regioneFormData;
    
    // Popola le opzioni del select nazione
    formConfig.fields.forEach((field: any) => {
      if (field.name === 'nazioneId') {
        field.options = nazioni.map(nazione => ({
          value: nazione.id,
          label: nazione.nome
        }));
      }
    });

    // Configurazione actionNav per questa pagina
    const actionNavConfig = createSubSectionActionNav('regioni', 'new');
    
    res.render('pages/ristorante-menu/servizi/new', {
      title: 'Nuova Regione',
      description: 'Crea una nuova regione per la classificazione geografica',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionTabs,
      sectionIcons,
      currentPath,
      formConfig,
      itemType: 'Regione',
      backUrl: '/ristorante-menu/impostazioni/regioni',
      actionNavConfig, // Passa la configurazione actionNav
      isInternalPage: true, // Aggiunto parametro mancante
      scripts: scriptManager.getScriptsForPage('form'), // Aggiunto script per validazione form
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
        { label: 'Regioni', href: '/ristorante-menu/impostazioni/regioni' },
        { label: 'Nuova Regione', href: '/ristorante-menu/impostazioni/regioni/nuovo' }
      ]
    });
  } catch (error) {
    console.error('Errore nel caricamento del form nuova regione:', error);
    res.status(500).send('Errore interno del server');
  }
});

// Route per form modifica regione
router.get('/impostazioni/regioni/modifica/:id', async (req, res) => {
  try {
    const currentPath = '/ristorante-menu/impostazioni/regioni/modifica/' + req.params.id;
    let sectionMenu = ristoranteMenuItems;
    let sectionTabs = ristoranteMenuImpostazioniSubItems;

    const regione = await prisma.regione.findFirst({
      where: { 
        id: req.params.id,
        deletedAt: null
      },
      include: { nazione: true }
    });

    if (!regione) {
      return res.status(404).send('Regione non trovata');
    }

    // Recupera le nazioni per il select
    const nazioni = await prisma.nazione.findMany({
      where: { deletedAt: null },
      orderBy: { nome: 'asc' }
    });

    // Configura il form
    const formConfig = regioneFormData.getFormData ? 
      regioneFormData.getFormData(regioneFormData, true, regione, req.body) : 
      regioneFormData;
    
    // Popola le opzioni del select nazione
    formConfig.fields.forEach((field: any) => {
      if (field.name === 'nazioneId') {
        field.options = nazioni.map(nazione => ({
          value: nazione.id,
          label: nazione.nome
        }));
      }
    });
    
    // Configurazione actionNav per questa pagina
    const actionNavConfig = createSubSectionActionNav('regioni', 'edit', regione.id);
    const customTitle = generatePageTitle(regioniConfig, 'edit', regione);

    res.render('pages/ristorante-menu/servizi/edit', {
      title: 'Modifica Regione',
      customTitle,
      description: 'Modifica le informazioni della regione',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionTabs,
      sectionIcons,
      currentPath,
      formConfig,
      item: regione,
      itemType: 'Regione',
      backUrl: `/ristorante-menu/impostazioni/regioni/dettagli/${regione.id}`,
      actionNavConfig, // Passa la configurazione actionNav
      isInternalPage: true, // Aggiunto parametro mancante
      scripts: scriptManager.getScriptsForPage('form'), // Aggiunto script per validazione form
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
        { label: 'Regioni', href: '/ristorante-menu/impostazioni/regioni' },
        { label: regione.nome, href: `/ristorante-menu/impostazioni/regioni/dettagli/${regione.id}` },
        { label: 'Modifica', href: `/ristorante-menu/impostazioni/regioni/modifica/${regione.id}` }
      ]
    });
  } catch (error) {
    console.error('Errore nel caricamento del form modifica regione:', error);
    res.status(500).send('Errore interno del server');
  }
});

// Route AJAX per creare nuova regione
router.post('/impostazioni/regioni/nuovo/ajax', async (req, res) => {
  const { nome, nazioneId } = req.body;

  try {
    // Verifica che la nazione esista
    const nazione = await prisma.nazione.findFirst({
      where: { id: nazioneId, deletedAt: null }
    });

    if (!nazione) {
      return res.json({
        success: false,
        message: 'Nazione non trovata'
      });
    }

    // Verifica che non esista già una regione con lo stesso nome nella stessa nazione
    const existingRegione = await prisma.regione.findFirst({
      where: {
        nome,
        nazioneId,
        deletedAt: null
      }
    });

    if (existingRegione) {
      return res.json({
        success: false,
        message: 'Una regione con questo nome esiste già in questa nazione'
      });
    }

    const regione = await prisma.regione.create({
      data: {
        nome,
        nazioneId
      }
    });

    res.json({
      success: true,
      message: 'Regione creata con successo',
      data: { id: regione.id }
    });
  } catch (error) {
    console.error('Errore nella creazione della regione:', error);
    res.json({
      success: false,
      message: 'Si è verificato un errore durante la creazione della regione'
    });
  }
});

// Route AJAX per modificare regione
router.post('/impostazioni/regioni/modifica/:id/ajax', async (req, res) => {
  const { nome, nazioneId } = req.body;
  const { id } = req.params;

  try {
    // Verifica che la regione esista
    const existingRegione = await prisma.regione.findFirst({
      where: { id, deletedAt: null }
    });

    if (!existingRegione) {
      return res.json({
        success: false,
        message: 'Regione non trovata'
      });
    }

    // Verifica che la nazione esista
    const nazione = await prisma.nazione.findFirst({
      where: { id: nazioneId, deletedAt: null }
    });

    if (!nazione) {
      return res.json({
        success: false,
        message: 'Nazione non trovata'
      });
    }

    // Verifica che non esista già una regione con lo stesso nome nella stessa nazione (escludendo quella corrente)
    const duplicateRegione = await prisma.regione.findFirst({
      where: {
        nome,
        nazioneId,
        id: { not: id },
        deletedAt: null
      }
    });

    if (duplicateRegione) {
      return res.json({
        success: false,
        message: 'Una regione con questo nome esiste già in questa nazione'
      });
    }

    const regione = await prisma.regione.update({
      where: { id },
      data: {
        nome,
        nazioneId
      }
    });

    res.json({
      success: true,
      message: 'Regione aggiornata con successo',
      data: { id: regione.id }
    });
  } catch (error) {
    console.error('Errore nell\'aggiornamento della regione:', error);
    res.json({
      success: false,
      message: 'Si è verificato un errore durante l\'aggiornamento della regione'
    });
  }
});

// Route per eliminazione singola regione
router.delete('/impostazioni/regioni/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.regione.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    });

    res.json({ 
      success: true, 
      message: 'Regione eliminata con successo' 
    });
  } catch (error) {
    console.error('Errore nell\'eliminazione della regione:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Errore nell\'eliminazione' 
    });
  }
});

// Route per eliminazione multipla regioni
router.delete('/impostazioni/regioni', async (req, res) => {
  const { itemIds } = req.body;
  
  if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
    return res.status(400).json({ 
      success: false, 
      message: 'Nessuna regione selezionata per la cancellazione' 
    });
  }
  
  try {
    // Verifica che tutte le regioni esistano e non siano già cancellate
    const existingRegioni = await prisma.regione.findMany({
      where: { 
        id: { in: itemIds },
        deletedAt: null
      }
    });

    if (existingRegioni.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Nessuna regione valida trovata per la cancellazione' 
      });
    }

    // Esegui soft delete per tutte le regioni valide
    const validRegioneIds = existingRegioni.map(regione => regione.id);
    await prisma.regione.updateMany({
      where: { 
        id: { in: validRegioneIds }
      },
      data: { 
        deletedAt: new Date() 
      }
    });

    const deletedCount = validRegioneIds.length;
    const skippedCount = itemIds.length - validRegioneIds.length;
    
    let message = `Eliminate ${deletedCount} regione/i con successo`;
    if (skippedCount > 0) {
      message += `. ${skippedCount} regione/i già cancellate o non trovate.`;
    }

    res.json({ 
      success: true, 
      message,
      deletedCount,
      skippedCount
    });
  } catch (error) {
    console.error('Errore nella cancellazione delle regioni:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Si è verificato un errore durante la cancellazione' 
    });
  }
});

// === ROUTE CRUD ZONE ===

// Route per visualizzare lista zone
router.get('/impostazioni/zone', async (req, res) => {
  try {
    const currentPath = '/ristorante-menu/impostazioni/zone';
    let sectionMenu = ristoranteMenuItems;
    let sectionTabs = ristoranteMenuImpostazioniSubItems;

    const paginationConfig = getPaginationParams(req, 20);
    const totalItems = await prisma.zona.count({ where: { deletedAt: null } });
    const zone = await prisma.zona.findMany({
      where: { deletedAt: null },
      include: { 
        regione: true,
        nazione: true
      },
      orderBy: { nome: 'asc' },
      skip: paginationConfig.offset,
      take: paginationConfig.limit
    });

    const items = zone.map(zona => ({ 
      ...zona, 
      regione_nome: zona.regione.nome,
      nazione_nome: zona.nazione.nome
    }));
    const pagination = calculatePagination(totalItems, paginationConfig.page, paginationConfig.limit);

    const config = { ...zoneConfig };
    config.hasItems = totalItems > 0;
    config.items = items;

    const successMessage = req.query.success ? decodeURIComponent(req.query.success as string) : undefined;
    const errorMessage = req.query.error ? decodeURIComponent(req.query.error as string) : undefined;
    const actionNavConfig = createSubSectionActionNav('zone', 'index');

    res.render('pages/ristorante-menu/impostazioni/subSection', {
      title: 'Zone',
      description: 'Gestisci le zone per la classificazione geografica',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionTabs,
      sectionIcons,
      currentPath,
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
        { label: 'Zone', href: '/ristorante-menu/impostazioni/zone' }
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
    console.error('Errore nel recupero delle zone:', error);
    res.status(500).send('Errore interno del server');
  }
});

// Route per visualizzare dettagli zona
router.get('/impostazioni/zone/dettagli/:id', async (req, res) => {
  try {
    const currentPath = '/ristorante-menu/impostazioni/zone/dettagli/' + req.params.id;
    let sectionMenu = ristoranteMenuItems;
    let sectionTabs = ristoranteMenuImpostazioniSubItems;

    const zona = await prisma.zona.findFirst({
      where: { 
        id: req.params.id,
        deletedAt: null
      },
      include: { 
        regione: true,
        nazione: true
      }
    });

    if (!zona) {
      return res.status(404).send('Zona non trovata');
    }

    // Trasforma i dati per la vista
    const item = {
      ...zona,
      regione_nome: zona.regione.nome,
      nazione_nome: zona.nazione.nome
    };

    const actionNavConfig = createSubSectionActionNav('zone', 'view', zona.id);
    const customTitle = generatePageTitle(zoneConfig, 'view', zona);

    res.render('pages/ristorante-menu/impostazioni/view', {
      title: 'Dettagli Zona',
      customTitle,
      description: 'Informazioni dettagliate della zona',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionTabs,
      sectionIcons,
      currentPath,
      item,
      itemType: 'Zona',
      backUrl: '/ristorante-menu/impostazioni/zone',
      actionNavConfig,
      detailViewConfig: zoneDetailViewConfig,
      scripts: scriptManager.getScriptsForPage('dashboard'),
      isInternalPage: true,
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
        { label: 'Zone', href: '/ristorante-menu/impostazioni/zone' },
        { label: zona.nome, href: `/ristorante-menu/impostazioni/zone/dettagli/${zona.id}` }
      ]
    });
  } catch (error) {
    console.error('Errore nel caricamento dei dettagli zona:', error);
    res.status(500).send('Errore interno del server');
  }
});

// Route per form nuova zona
router.get('/impostazioni/zone/nuovo', async (req, res) => {
  try {
    const currentPath = '/ristorante-menu/impostazioni/zone/nuovo';
    let sectionMenu = ristoranteMenuItems;
    let sectionTabs = ristoranteMenuImpostazioniSubItems;

    // Recupera le regioni e nazioni per i select
    const regioni = await prisma.regione.findMany({
      where: { deletedAt: null },
      include: { nazione: true },
      orderBy: { nome: 'asc' }
    });

    const nazioni = await prisma.nazione.findMany({
      where: { deletedAt: null },
      orderBy: { nome: 'asc' }
    });

    // Configura il form
    const formConfig = zonaFormData.getFormData ? 
      zonaFormData.getFormData(zonaFormData, false, null, req.body) : 
      zonaFormData;
    
    // Popola le opzioni dei select
    formConfig.fields.forEach((field: any) => {
      if (field.name === 'regioneId') {
        field.options = regioni.map(regione => ({
          value: regione.id,
          label: regione.nome,
          data: { nazioneId: regione.nazioneId, nazioneNome: regione.nazione.nome }
        }));
      } else if (field.name === 'nazioneId') {
        field.options = nazioni.map(nazione => ({
          value: nazione.id,
          label: nazione.nome
        }));
      }
    });

    // Configurazione actionNav per questa pagina
    const actionNavConfig = createSubSectionActionNav('zone', 'new');
    
    res.render('pages/ristorante-menu/servizi/new', {
      title: 'Nuova Zona',
      description: 'Crea una nuova zona per la classificazione geografica',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionTabs,
      sectionIcons,
      currentPath,
      formConfig,
      itemType: 'Zona',
      backUrl: '/ristorante-menu/impostazioni/zone',
      actionNavConfig, // Passa la configurazione actionNav
      isInternalPage: true, // Aggiunto parametro mancante
      scripts: scriptManager.getScriptsForPage('form'), // Aggiunto script per validazione form
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
        { label: 'Zone', href: '/ristorante-menu/impostazioni/zone' },
        { label: 'Nuova Zona', href: '/ristorante-menu/impostazioni/zone/nuovo' }
      ]
    });
  } catch (error) {
    console.error('Errore nel caricamento del form nuova zona:', error);
    res.status(500).send('Errore interno del server');
  }
});

// Route per form modifica zona
router.get('/impostazioni/zone/modifica/:id', async (req, res) => {
  try {
    const currentPath = '/ristorante-menu/impostazioni/zone/modifica/' + req.params.id;
    let sectionMenu = ristoranteMenuItems;
    let sectionTabs = ristoranteMenuImpostazioniSubItems;

    const zona = await prisma.zona.findFirst({
      where: { 
        id: req.params.id,
        deletedAt: null
      },
      include: { 
        regione: true,
        nazione: true
      }
    });

    if (!zona) {
      return res.status(404).send('Zona non trovata');
    }

    // Recupera le regioni e nazioni per i select
    const regioni = await prisma.regione.findMany({
      where: { deletedAt: null },
      include: { nazione: true },
      orderBy: { nome: 'asc' }
    });

    const nazioni = await prisma.nazione.findMany({
      where: { deletedAt: null },
      orderBy: { nome: 'asc' }
    });

    // Configura il form
    const formConfig = zonaFormData.getFormData ? 
      zonaFormData.getFormData(zonaFormData, true, zona, req.body) : 
      zonaFormData;
    
    // Popola le opzioni dei select
    formConfig.fields.forEach((field: any) => {
      if (field.name === 'regioneId') {
        field.options = regioni.map(regione => ({
          value: regione.id,
          label: regione.nome,
          data: { nazioneId: regione.nazioneId, nazioneNome: regione.nazione.nome }
        }));
      } else if (field.name === 'nazioneId') {
        field.options = nazioni.map(nazione => ({
          value: nazione.id,
          label: nazione.nome
        }));
      }
    });
    
    // Configurazione actionNav per questa pagina
    const actionNavConfig = createSubSectionActionNav('zone', 'edit', zona.id);
    const customTitle = generatePageTitle(zoneConfig, 'edit', zona);

    res.render('pages/ristorante-menu/servizi/edit', {
      title: 'Modifica Zona',
      customTitle,
      description: 'Modifica le informazioni della zona',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionTabs,
      sectionIcons,
      currentPath,
      formConfig,
      item: zona,
      itemType: 'Zona',
      backUrl: `/ristorante-menu/impostazioni/zone/dettagli/${zona.id}`,
      actionNavConfig, // Passa la configurazione actionNav
      isInternalPage: true, // Aggiunto parametro mancante
      scripts: scriptManager.getScriptsForPage('form'), // Aggiunto script per validazione form
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
        { label: 'Zone', href: '/ristorante-menu/impostazioni/zone' },
        { label: zona.nome, href: `/ristorante-menu/impostazioni/zone/dettagli/${zona.id}` },
        { label: 'Modifica', href: `/ristorante-menu/impostazioni/zone/modifica/${zona.id}` }
      ]
    });
  } catch (error) {
    console.error('Errore nel caricamento del form modifica zona:', error);
    res.status(500).send('Errore interno del server');
  }
});

// Route AJAX per creare nuova zona
router.post('/impostazioni/zone/nuovo/ajax', async (req, res) => {
  const { nome, regioneId, nazioneId } = req.body;

  try {
    // Verifica che la regione esista
    const regione = await prisma.regione.findFirst({
      where: { id: regioneId, deletedAt: null },
      include: { nazione: true }
    });

    if (!regione) {
      return res.json({
        success: false,
        message: 'Regione non trovata'
      });
    }

    // Verifica che la nazione esista
    const nazione = await prisma.nazione.findFirst({
      where: { id: nazioneId, deletedAt: null }
    });

    if (!nazione) {
      return res.json({
        success: false,
        message: 'Nazione non trovata'
      });
    }

    // Nota: regioneId e nazioneId sono campi indipendenti nel modello Zona

    // Verifica che non esista già una zona con lo stesso nome nella stessa regione
    const existingZona = await prisma.zona.findFirst({
      where: {
        nome,
        regioneId,
        deletedAt: null
      }
    });

    if (existingZona) {
      return res.json({
        success: false,
        message: 'Una zona con questo nome esiste già in questa regione'
      });
    }

    const zona = await prisma.zona.create({
      data: {
        nome,
        regioneId,
        nazioneId
      }
    });

    res.json({
      success: true,
      message: 'Zona creata con successo',
      data: { id: zona.id }
    });
  } catch (error) {
    console.error('Errore nella creazione della zona:', error);
    res.json({
      success: false,
      message: 'Si è verificato un errore durante la creazione della zona'
    });
  }
});

// Route AJAX per modificare zona
router.post('/impostazioni/zone/modifica/:id/ajax', async (req, res) => {
  const { nome, regioneId, nazioneId } = req.body;
  const { id } = req.params;

  try {
    // Verifica che la zona esista
    const existingZona = await prisma.zona.findFirst({
      where: { id, deletedAt: null }
    });

    if (!existingZona) {
      return res.json({
        success: false,
        message: 'Zona non trovata'
      });
    }

    // Verifica che la regione esista
    const regione = await prisma.regione.findFirst({
      where: { id: regioneId, deletedAt: null },
      include: { nazione: true }
    });

    if (!regione) {
      return res.json({
        success: false,
        message: 'Regione non trovata'
      });
    }

    // Verifica che la nazione esista
    const nazione = await prisma.nazione.findFirst({
      where: { id: nazioneId, deletedAt: null }
    });

    if (!nazione) {
      return res.json({
        success: false,
        message: 'Nazione non trovata'
      });
    }

    // Nota: regioneId e nazioneId sono campi indipendenti nel modello Zona

    // Verifica che non esista già una zona con lo stesso nome nella stessa regione (escludendo quella corrente)
    const duplicateZona = await prisma.zona.findFirst({
      where: {
        nome,
        regioneId,
        id: { not: id },
        deletedAt: null
      }
    });

    if (duplicateZona) {
      return res.json({
        success: false,
        message: 'Una zona con questo nome esiste già in questa regione'
      });
    }

    const zona = await prisma.zona.update({
      where: { id },
      data: {
        nome,
        regioneId,
        nazioneId
      }
    });

    res.json({
      success: true,
      message: 'Zona aggiornata con successo',
      data: { id: zona.id }
    });
  } catch (error) {
    console.error('Errore nell\'aggiornamento della zona:', error);
    res.json({
      success: false,
      message: 'Si è verificato un errore durante l\'aggiornamento della zona'
    });
  }
});

// Route per eliminazione singola zona
router.delete('/impostazioni/zone/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.zona.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    });

    res.json({ 
      success: true, 
      message: 'Zona eliminata con successo' 
    });
  } catch (error) {
    console.error('Errore nell\'eliminazione della zona:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Errore nell\'eliminazione' 
    });
  }
});

// Route per eliminazione multipla zone
router.delete('/impostazioni/zone', async (req, res) => {
  const { itemIds } = req.body;
  
  if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
    return res.status(400).json({ 
      success: false, 
      message: 'Nessuna zona selezionata per la cancellazione' 
    });
  }
  
  try {
    // Verifica che tutte le zone esistano e non siano già cancellate
    const existingZone = await prisma.zona.findMany({
      where: { 
        id: { in: itemIds },
        deletedAt: null
      }
    });

    if (existingZone.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Nessuna zona valida trovata per la cancellazione' 
      });
    }

    // Esegui soft delete per tutte le zone valide
    const validZonaIds = existingZone.map(zona => zona.id);
    await prisma.zona.updateMany({
      where: { 
        id: { in: validZonaIds }
      },
      data: { 
        deletedAt: new Date() 
      }
    });

    const deletedCount = validZonaIds.length;
    const skippedCount = itemIds.length - validZonaIds.length;
    
    let message = `Eliminate ${deletedCount} zona/e con successo`;
    if (skippedCount > 0) {
      message += `. ${skippedCount} zona/e già cancellate o non trovate.`;
    }

    res.json({ 
      success: true, 
      message,
      deletedCount,
      skippedCount
    });
  } catch (error) {
    console.error('Errore nella cancellazione delle zone:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Si è verificato un errore durante la cancellazione' 
    });
  }
});

// === ROUTE CRUD TIPOLOGIE VINO ===

// Route per visualizzare lista tipologie vino
router.get('/impostazioni/tipologie-vino', async (req, res) => {
  try {
    const currentPath = '/ristorante-menu/impostazioni/tipologie-vino';
    let sectionMenu = ristoranteMenuItems;
    let sectionTabs = ristoranteMenuImpostazioniSubItems;

    const paginationConfig = getPaginationParams(req, 20);
    const totalItems = await prisma.tipologiaVino.count({ where: { deletedAt: null } });
    const tipologieVino = await prisma.tipologiaVino.findMany({
      where: { deletedAt: null },
      orderBy: { nome: 'asc' },
      skip: paginationConfig.offset,
      take: paginationConfig.limit
    });

    const pagination = calculatePagination(totalItems, paginationConfig.page, paginationConfig.limit);

    const config = { ...tipologieVinoConfig };
    config.hasItems = totalItems > 0;
    config.items = tipologieVino;

    const successMessage = req.query.success ? decodeURIComponent(req.query.success as string) : undefined;
    const errorMessage = req.query.error ? decodeURIComponent(req.query.error as string) : undefined;
    const actionNavConfig = createSubSectionActionNav('tipologie-vino', 'index');

    res.render('pages/ristorante-menu/impostazioni/subSection', {
      title: 'Tipologie Vino',
      description: 'Gestisci le tipologie vino per la classificazione',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionTabs,
      sectionIcons,
      currentPath,
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
        { label: 'Tipologie Vino', href: '/ristorante-menu/impostazioni/tipologie-vino' }
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
    console.error('Errore nel recupero delle tipologie vino:', error);
    res.status(500).send('Errore interno del server');
  }
});

// Route per visualizzare dettagli tipologia vino
router.get('/impostazioni/tipologie-vino/dettagli/:id', async (req, res) => {
  try {
    const currentPath = '/ristorante-menu/impostazioni/tipologie-vino/dettagli/' + req.params.id;
    let sectionMenu = ristoranteMenuItems;
    let sectionTabs = ristoranteMenuImpostazioniSubItems;

    const tipologiaVino = await prisma.tipologiaVino.findFirst({
      where: { 
        id: req.params.id,
        deletedAt: null
      }
    });

    if (!tipologiaVino) {
      return res.status(404).send('Tipologia vino non trovata');
    }

    const actionNavConfig = createSubSectionActionNav('tipologie-vino', 'view', tipologiaVino.id);
    const customTitle = generatePageTitle(tipologieVinoConfig, 'view', tipologiaVino);

    res.render('pages/ristorante-menu/impostazioni/view', {
      title: 'Dettagli Tipologia Vino',
      customTitle,
      description: 'Informazioni dettagliate della tipologia vino',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionTabs,
      sectionIcons,
      currentPath,
      item: tipologiaVino,
      itemType: 'Tipologia Vino',
      backUrl: '/ristorante-menu/impostazioni/tipologie-vino',
      actionNavConfig,
      detailViewConfig: tipologieVinoDetailViewConfig,
      scripts: scriptManager.getScriptsForPage('dashboard'),
      isInternalPage: true,
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
        { label: 'Tipologie Vino', href: '/ristorante-menu/impostazioni/tipologie-vino' },
        { label: tipologiaVino.nome, href: `/ristorante-menu/impostazioni/tipologie-vino/dettagli/${tipologiaVino.id}` }
      ]
    });
  } catch (error) {
    console.error('Errore nel caricamento dei dettagli tipologia vino:', error);
    res.status(500).send('Errore interno del server');
  }
});

// Route per form nuova tipologia vino
router.get('/impostazioni/tipologie-vino/nuovo', async (req, res) => {
  try {
    const currentPath = '/ristorante-menu/impostazioni/tipologie-vino/nuovo';
    let sectionMenu = ristoranteMenuItems;
    let sectionTabs = ristoranteMenuImpostazioniSubItems;

    // Configura il form
    const formConfig = tipologiaVinoFormData.getFormData ? 
      tipologiaVinoFormData.getFormData(tipologiaVinoFormData, false, null, req.body) : 
      tipologiaVinoFormData;

    // Configurazione actionNav per questa pagina
    const actionNavConfig = createSubSectionActionNav('tipologie-vino', 'new');
    
    res.render('pages/ristorante-menu/servizi/new', {
      title: 'Nuova Tipologia Vino',
      description: 'Crea una nuova tipologia vino per la classificazione',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionTabs,
      sectionIcons,
      currentPath,
      formConfig,
      itemType: 'Tipologia Vino',
      backUrl: '/ristorante-menu/impostazioni/tipologie-vino',
      actionNavConfig,
      isInternalPage: true,
      scripts: scriptManager.getScriptsForPage('form'),
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
        { label: 'Tipologie Vino', href: '/ristorante-menu/impostazioni/tipologie-vino' },
        { label: 'Nuova Tipologia Vino', href: '/ristorante-menu/impostazioni/tipologie-vino/nuovo' }
      ]
    });
  } catch (error) {
    console.error('Errore nel caricamento del form nuova tipologia vino:', error);
    res.status(500).send('Errore interno del server');
  }
});

// Route per form modifica tipologia vino
router.get('/impostazioni/tipologie-vino/modifica/:id', async (req, res) => {
  try {
    const currentPath = '/ristorante-menu/impostazioni/tipologie-vino/modifica/' + req.params.id;
    let sectionMenu = ristoranteMenuItems;
    let sectionTabs = ristoranteMenuImpostazioniSubItems;

    const tipologiaVino = await prisma.tipologiaVino.findFirst({
      where: { 
        id: req.params.id,
        deletedAt: null
      }
    });

    if (!tipologiaVino) {
      return res.status(404).send('Tipologia vino non trovata');
    }

    // Configura il form
    const formConfig = tipologiaVinoFormData.getFormData ? 
      tipologiaVinoFormData.getFormData(tipologiaVinoFormData, true, tipologiaVino, req.body) : 
      tipologiaVinoFormData;
    
    // Configurazione actionNav per questa pagina
    const actionNavConfig = createSubSectionActionNav('tipologie-vino', 'edit', tipologiaVino.id);
    const customTitle = generatePageTitle(tipologieVinoConfig, 'edit', tipologiaVino);

    res.render('pages/ristorante-menu/servizi/edit', {
      title: 'Modifica Tipologia Vino',
      customTitle,
      description: 'Modifica le informazioni della tipologia vino',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionTabs,
      sectionIcons,
      currentPath,
      formConfig,
      item: tipologiaVino,
      itemType: 'Tipologia Vino',
      backUrl: `/ristorante-menu/impostazioni/tipologie-vino/dettagli/${tipologiaVino.id}`,
      actionNavConfig,
      isInternalPage: true,
      scripts: scriptManager.getScriptsForPage('form'),
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
        { label: 'Tipologie Vino', href: '/ristorante-menu/impostazioni/tipologie-vino' },
        { label: tipologiaVino.nome, href: `/ristorante-menu/impostazioni/tipologie-vino/dettagli/${tipologiaVino.id}` },
        { label: 'Modifica', href: `/ristorante-menu/impostazioni/tipologie-vino/modifica/${tipologiaVino.id}` }
      ]
    });
  } catch (error) {
    console.error('Errore nel caricamento del form modifica tipologia vino:', error);
    res.status(500).send('Errore interno del server');
  }
});

// Route AJAX per creare nuova tipologia vino
router.post('/impostazioni/tipologie-vino/nuovo/ajax', async (req, res) => {
  const { nome, descrizione } = req.body;

  try {
    // Verifica che non esista già una tipologia vino con lo stesso nome
    const existingTipologiaVino = await prisma.tipologiaVino.findFirst({
      where: {
        nome,
        deletedAt: null
      }
    });

    if (existingTipologiaVino) {
      return res.json({
        success: false,
        message: 'Una tipologia vino con questo nome esiste già'
      });
    }

    const tipologiaVino = await prisma.tipologiaVino.create({
      data: {
        nome,
        descrizione: descrizione || null
      }
    });

    res.json({
      success: true,
      message: 'Tipologia vino creata con successo',
      data: { id: tipologiaVino.id }
    });
  } catch (error) {
    console.error('Errore nella creazione della tipologia vino:', error);
    res.json({
      success: false,
      message: 'Si è verificato un errore durante la creazione della tipologia vino'
    });
  }
});

// Route AJAX per modificare tipologia vino
router.post('/impostazioni/tipologie-vino/modifica/:id/ajax', async (req, res) => {
  const { nome, descrizione } = req.body;
  const { id } = req.params;

  try {
    // Verifica che la tipologia vino esista
    const existingTipologiaVino = await prisma.tipologiaVino.findFirst({
      where: { id, deletedAt: null }
    });

    if (!existingTipologiaVino) {
      return res.json({
        success: false,
        message: 'Tipologia vino non trovata'
      });
    }

    // Verifica che non esista già una tipologia vino con lo stesso nome (escludendo quella corrente)
    const duplicateTipologiaVino = await prisma.tipologiaVino.findFirst({
      where: {
        nome,
        id: { not: id },
        deletedAt: null
      }
    });

    if (duplicateTipologiaVino) {
      return res.json({
        success: false,
        message: 'Una tipologia vino con questo nome esiste già'
      });
    }

    const tipologiaVino = await prisma.tipologiaVino.update({
      where: { id },
      data: {
        nome,
        descrizione: descrizione || null
      }
    });

    res.json({
      success: true,
      message: 'Tipologia vino aggiornata con successo',
      data: { id: tipologiaVino.id }
    });
  } catch (error) {
    console.error('Errore nell\'aggiornamento della tipologia vino:', error);
    res.json({
      success: false,
      message: 'Si è verificato un errore durante l\'aggiornamento della tipologia vino'
    });
  }
});

// Route per eliminazione singola tipologia vino
router.delete('/impostazioni/tipologie-vino/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.tipologiaVino.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    });

    res.json({ 
      success: true, 
      message: 'Tipologia vino eliminata con successo' 
    });
  } catch (error) {
    console.error('Errore nell\'eliminazione della tipologia vino:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Errore nell\'eliminazione' 
    });
  }
});

// Route per eliminazione multipla tipologie vino
router.delete('/impostazioni/tipologie-vino', async (req, res) => {
  const { itemIds } = req.body;
  
  if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
    return res.status(400).json({ 
      success: false, 
      message: 'Nessuna tipologia vino selezionata per la cancellazione' 
    });
  }
  
  try {
    // Verifica che tutte le tipologie vino esistano e non siano già cancellate
    const existingTipologieVino = await prisma.tipologiaVino.findMany({
      where: { 
        id: { in: itemIds },
        deletedAt: null
      }
    });

    if (existingTipologieVino.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Nessuna tipologia vino valida trovata per la cancellazione' 
      });
    }

    // Esegui soft delete per tutte le tipologie vino valide
    const validTipologiaVinoIds = existingTipologieVino.map(tipologiaVino => tipologiaVino.id);
    await prisma.tipologiaVino.updateMany({
      where: { 
        id: { in: validTipologiaVinoIds }
      },
      data: { 
        deletedAt: new Date() 
      }
    });

    const deletedCount = validTipologiaVinoIds.length;
    const skippedCount = itemIds.length - validTipologiaVinoIds.length;
    
    let message = `Eliminate ${deletedCount} tipologia/e vino con successo`;
    if (skippedCount > 0) {
      message += `. ${skippedCount} tipologia/e vino già cancellate o non trovate.`;
    }

    res.json({ 
      success: true, 
      message,
      deletedCount,
      skippedCount
    });
  } catch (error) {
    console.error('Errore nella cancellazione delle tipologie vino:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Si è verificato un errore durante la cancellazione' 
    });
  }
});

// === ROUTE CRUD TIPOLOGIE BIRRA ===

// Route per visualizzare lista tipologie birra
router.get('/impostazioni/tipologie-birra', async (req, res) => {
  try {
    const currentPath = '/ristorante-menu/impostazioni/tipologie-birra';
    let sectionMenu = ristoranteMenuItems;
    let sectionTabs = ristoranteMenuImpostazioniSubItems;

    const paginationConfig = getPaginationParams(req, 20);
    const totalItems = await prisma.tipologiaBirra.count({ where: { deletedAt: null } });
    const tipologieBirra = await prisma.tipologiaBirra.findMany({
      where: { deletedAt: null },
      orderBy: { nome: 'asc' },
      skip: paginationConfig.offset,
      take: paginationConfig.limit
    });

    const pagination = calculatePagination(totalItems, paginationConfig.page, paginationConfig.limit);

    const config = { ...tipologieBirraConfig };
    config.hasItems = totalItems > 0;
    config.items = tipologieBirra;

    const successMessage = req.query.success ? decodeURIComponent(req.query.success as string) : undefined;
    const errorMessage = req.query.error ? decodeURIComponent(req.query.error as string) : undefined;
    const actionNavConfig = createSubSectionActionNav('tipologie-birra', 'index');

    res.render('pages/ristorante-menu/impostazioni/subSection', {
      title: 'Tipologie Birra',
      description: 'Gestisci le tipologie birra per la classificazione',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionTabs,
      sectionIcons,
      currentPath,
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
        { label: 'Tipologie Birra', href: '/ristorante-menu/impostazioni/tipologie-birra' }
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
    console.error('Errore nel recupero delle tipologie birra:', error);
    res.status(500).send('Errore interno del server');
  }
});

// Route per visualizzare dettagli tipologia birra
router.get('/impostazioni/tipologie-birra/dettagli/:id', async (req, res) => {
  try {
    const currentPath = '/ristorante-menu/impostazioni/tipologie-birra/dettagli/' + req.params.id;
    let sectionMenu = ristoranteMenuItems;
    let sectionTabs = ristoranteMenuImpostazioniSubItems;

    const tipologiaBirra = await prisma.tipologiaBirra.findFirst({
      where: { 
        id: req.params.id,
        deletedAt: null
      }
    });

    if (!tipologiaBirra) {
      return res.status(404).send('Tipologia birra non trovata');
    }

    const actionNavConfig = createSubSectionActionNav('tipologie-birra', 'view', tipologiaBirra.id);
    const customTitle = generatePageTitle(tipologieBirraConfig, 'view', tipologiaBirra);

    res.render('pages/ristorante-menu/impostazioni/view', {
      title: 'Dettagli Tipologia Birra',
      customTitle,
      description: 'Informazioni dettagliate della tipologia birra',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionTabs,
      sectionIcons,
      currentPath,
      item: tipologiaBirra,
      itemType: 'Tipologia Birra',
      backUrl: '/ristorante-menu/impostazioni/tipologie-birra',
      actionNavConfig,
      detailViewConfig: tipologieBirraDetailViewConfig,
      scripts: scriptManager.getScriptsForPage('dashboard'),
      isInternalPage: true,
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
        { label: 'Tipologie Birra', href: '/ristorante-menu/impostazioni/tipologie-birra' },
        { label: tipologiaBirra.nome, href: `/ristorante-menu/impostazioni/tipologie-birra/dettagli/${tipologiaBirra.id}` }
      ]
    });
  } catch (error) {
    console.error('Errore nel caricamento dei dettagli tipologia birra:', error);
    res.status(500).send('Errore interno del server');
  }
});

// Route per form nuova tipologia birra
router.get('/impostazioni/tipologie-birra/nuovo', async (req, res) => {
  try {
    const currentPath = '/ristorante-menu/impostazioni/tipologie-birra/nuovo';
    let sectionMenu = ristoranteMenuItems;
    let sectionTabs = ristoranteMenuImpostazioniSubItems;

    // Configura il form
    const formConfig = tipologiaBirraFormData.getFormData ? 
      tipologiaBirraFormData.getFormData(tipologiaBirraFormData, false, null, req.body) : 
      tipologiaBirraFormData;

    // Configurazione actionNav per questa pagina
    const actionNavConfig = createSubSectionActionNav('tipologie-birra', 'new');
    
    res.render('pages/ristorante-menu/servizi/new', {
      title: 'Nuova Tipologia Birra',
      description: 'Crea una nuova tipologia birra per la classificazione',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionTabs,
      sectionIcons,
      currentPath,
      formConfig,
      itemType: 'Tipologia Birra',
      backUrl: '/ristorante-menu/impostazioni/tipologie-birra',
      actionNavConfig,
      isInternalPage: true,
      scripts: scriptManager.getScriptsForPage('form'),
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
        { label: 'Tipologie Birra', href: '/ristorante-menu/impostazioni/tipologie-birra' },
        { label: 'Nuova Tipologia Birra', href: '/ristorante-menu/impostazioni/tipologie-birra/nuovo' }
      ]
    });
  } catch (error) {
    console.error('Errore nel caricamento del form nuova tipologia birra:', error);
    res.status(500).send('Errore interno del server');
  }
});

// Route per form modifica tipologia birra
router.get('/impostazioni/tipologie-birra/modifica/:id', async (req, res) => {
  try {
    const currentPath = '/ristorante-menu/impostazioni/tipologie-birra/modifica/' + req.params.id;
    let sectionMenu = ristoranteMenuItems;
    let sectionTabs = ristoranteMenuImpostazioniSubItems;

    const tipologiaBirra = await prisma.tipologiaBirra.findFirst({
      where: { 
        id: req.params.id,
        deletedAt: null
      }
    });

    if (!tipologiaBirra) {
      return res.status(404).send('Tipologia birra non trovata');
    }

    // Configura il form
    const formConfig = tipologiaBirraFormData.getFormData ? 
      tipologiaBirraFormData.getFormData(tipologiaBirraFormData, true, tipologiaBirra, req.body) : 
      tipologiaBirraFormData;
    
    // Configurazione actionNav per questa pagina
    const actionNavConfig = createSubSectionActionNav('tipologie-birra', 'edit', tipologiaBirra.id);
    const customTitle = generatePageTitle(tipologieBirraConfig, 'edit', tipologiaBirra);

    res.render('pages/ristorante-menu/servizi/edit', {
      title: 'Modifica Tipologia Birra',
      customTitle,
      description: 'Modifica le informazioni della tipologia birra',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionTabs,
      sectionIcons,
      currentPath,
      formConfig,
      item: tipologiaBirra,
      itemType: 'Tipologia Birra',
      backUrl: `/ristorante-menu/impostazioni/tipologie-birra/dettagli/${tipologiaBirra.id}`,
      actionNavConfig,
      isInternalPage: true,
      scripts: scriptManager.getScriptsForPage('form'),
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
        { label: 'Tipologie Birra', href: '/ristorante-menu/impostazioni/tipologie-birra' },
        { label: tipologiaBirra.nome, href: `/ristorante-menu/impostazioni/tipologie-birra/dettagli/${tipologiaBirra.id}` },
        { label: 'Modifica', href: `/ristorante-menu/impostazioni/tipologie-birra/modifica/${tipologiaBirra.id}` }
      ]
    });
  } catch (error) {
    console.error('Errore nel caricamento del form modifica tipologia birra:', error);
    res.status(500).send('Errore interno del server');
  }
});

// Route AJAX per creare nuova tipologia birra
router.post('/impostazioni/tipologie-birra/nuovo/ajax', async (req, res) => {
  const { nome, descrizione } = req.body;

  try {
    // Verifica che non esista già una tipologia birra con lo stesso nome
    const existingTipologiaBirra = await prisma.tipologiaBirra.findFirst({
      where: {
        nome,
        deletedAt: null
      }
    });

    if (existingTipologiaBirra) {
      return res.json({
        success: false,
        message: 'Una tipologia birra con questo nome esiste già'
      });
    }

    const tipologiaBirra = await prisma.tipologiaBirra.create({
      data: {
        nome,
        descrizione: descrizione || null
      }
    });

    res.json({
      success: true,
      message: 'Tipologia birra creata con successo',
      data: { id: tipologiaBirra.id }
    });
  } catch (error) {
    console.error('Errore nella creazione della tipologia birra:', error);
    res.json({
      success: false,
      message: 'Si è verificato un errore durante la creazione della tipologia birra'
    });
  }
});

// Route AJAX per modificare tipologia birra
router.post('/impostazioni/tipologie-birra/modifica/:id/ajax', async (req, res) => {
  const { nome, descrizione } = req.body;
  const { id } = req.params;

  try {
    // Verifica che la tipologia birra esista
    const existingTipologiaBirra = await prisma.tipologiaBirra.findFirst({
      where: { id, deletedAt: null }
    });

    if (!existingTipologiaBirra) {
      return res.json({
        success: false,
        message: 'Tipologia birra non trovata'
      });
    }

    // Verifica che non esista già una tipologia birra con lo stesso nome (escludendo quella corrente)
    const duplicateTipologiaBirra = await prisma.tipologiaBirra.findFirst({
      where: {
        nome,
        id: { not: id },
        deletedAt: null
      }
    });

    if (duplicateTipologiaBirra) {
      return res.json({
        success: false,
        message: 'Una tipologia birra con questo nome esiste già'
      });
    }

    const tipologiaBirra = await prisma.tipologiaBirra.update({
      where: { id },
      data: {
        nome,
        descrizione: descrizione || null
      }
    });

    res.json({
      success: true,
      message: 'Tipologia birra aggiornata con successo',
      data: { id: tipologiaBirra.id }
    });
  } catch (error) {
    console.error('Errore nell\'aggiornamento della tipologia birra:', error);
    res.json({
      success: false,
      message: 'Si è verificato un errore durante l\'aggiornamento della tipologia birra'
    });
  }
});

// Route per eliminazione singola tipologia birra
router.delete('/impostazioni/tipologie-birra/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.tipologiaBirra.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    });

    res.json({ 
      success: true, 
      message: 'Tipologia birra eliminata con successo' 
    });
  } catch (error) {
    console.error('Errore nell\'eliminazione della tipologia birra:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Errore nell\'eliminazione' 
    });
  }
});

// Route per eliminazione multipla tipologie birra
router.delete('/impostazioni/tipologie-birra', async (req, res) => {
  const { itemIds } = req.body;
  
  if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
    return res.status(400).json({ 
      success: false, 
      message: 'Nessuna tipologia birra selezionata per la cancellazione' 
    });
  }
  
  try {
    // Verifica che tutte le tipologie birra esistano e non siano già cancellate
    const existingTipologieBirra = await prisma.tipologiaBirra.findMany({
      where: { 
        id: { in: itemIds },
        deletedAt: null
      }
    });

    if (existingTipologieBirra.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Nessuna tipologia birra valida trovata per la cancellazione' 
      });
    }

    // Esegui soft delete per tutte le tipologie birra valide
    const validTipologiaBirraIds = existingTipologieBirra.map(tipologiaBirra => tipologiaBirra.id);
    await prisma.tipologiaBirra.updateMany({
      where: { 
        id: { in: validTipologiaBirraIds }
      },
      data: { 
        deletedAt: new Date() 
      }
    });

    const deletedCount = validTipologiaBirraIds.length;
    const skippedCount = itemIds.length - validTipologiaBirraIds.length;
    
    let message = `Eliminate ${deletedCount} tipologia/e birra con successo`;
    if (skippedCount > 0) {
      message += `. ${skippedCount} tipologia/e birra già cancellate o non trovate.`;
    }

    res.json({ 
      success: true, 
      message,
      deletedCount,
      skippedCount
    });
  } catch (error) {
    console.error('Errore nella cancellazione delle tipologie birra:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Si è verificato un errore durante la cancellazione' 
    });
  }
});

// === ROUTE CRUD TIPOLOGIE LIQUORE ===

// Route per visualizzare lista tipologie liquore
router.get('/impostazioni/tipologie-liquore', async (req, res) => {
  try {
    const currentPath = '/ristorante-menu/impostazioni/tipologie-liquore';
    let sectionMenu = ristoranteMenuItems;
    let sectionTabs = ristoranteMenuImpostazioniSubItems;

    const paginationConfig = getPaginationParams(req, 20);
    const totalItems = await prisma.tipologiaLiquore.count({ where: { deletedAt: null } });
    const tipologieLiquore = await prisma.tipologiaLiquore.findMany({
      where: { deletedAt: null },
      orderBy: { nome: 'asc' },
      skip: paginationConfig.offset,
      take: paginationConfig.limit
    });

    const pagination = calculatePagination(totalItems, paginationConfig.page, paginationConfig.limit);

    const config = { ...tipologieLiquoreConfig };
    config.hasItems = totalItems > 0;
    config.items = tipologieLiquore;

    const successMessage = req.query.success ? decodeURIComponent(req.query.success as string) : undefined;
    const errorMessage = req.query.error ? decodeURIComponent(req.query.error as string) : undefined;
    const actionNavConfig = createSubSectionActionNav('tipologie-liquore', 'index');

    res.render('pages/ristorante-menu/impostazioni/subSection', {
      title: 'Tipologie Liquore',
      description: 'Gestisci le tipologie liquore per la classificazione',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionTabs,
      sectionIcons,
      currentPath,
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
        { label: 'Tipologie Liquore', href: '/ristorante-menu/impostazioni/tipologie-liquore' }
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
    console.error('Errore nel recupero delle tipologie liquore:', error);
    res.status(500).send('Errore interno del server');
  }
});

// Route per visualizzare dettagli tipologia liquore
router.get('/impostazioni/tipologie-liquore/dettagli/:id', async (req, res) => {
  try {
    const currentPath = '/ristorante-menu/impostazioni/tipologie-liquore/dettagli/' + req.params.id;
    let sectionMenu = ristoranteMenuItems;
    let sectionTabs = ristoranteMenuImpostazioniSubItems;

    const tipologiaLiquore = await prisma.tipologiaLiquore.findFirst({
      where: { 
        id: req.params.id,
        deletedAt: null
      }
    });

    if (!tipologiaLiquore) {
      return res.status(404).send('Tipologia liquore non trovata');
    }

    const actionNavConfig = createSubSectionActionNav('tipologie-liquore', 'view', tipologiaLiquore.id);
    const customTitle = generatePageTitle(tipologieLiquoreConfig, 'view', tipologiaLiquore);

    res.render('pages/ristorante-menu/impostazioni/view', {
      title: 'Dettagli Tipologia Liquore',
      customTitle,
      description: 'Informazioni dettagliate della tipologia liquore',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionTabs,
      sectionIcons,
      currentPath,
      item: tipologiaLiquore,
      itemType: 'Tipologia Liquore',
      backUrl: '/ristorante-menu/impostazioni/tipologie-liquore',
      actionNavConfig,
      detailViewConfig: tipologieLiquoreDetailViewConfig,
      scripts: scriptManager.getScriptsForPage('dashboard'),
      isInternalPage: true,
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
        { label: 'Tipologie Liquore', href: '/ristorante-menu/impostazioni/tipologie-liquore' },
        { label: tipologiaLiquore.nome, href: `/ristorante-menu/impostazioni/tipologie-liquore/dettagli/${tipologiaLiquore.id}` }
      ]
    });
  } catch (error) {
    console.error('Errore nel caricamento dei dettagli tipologia liquore:', error);
    res.status(500).send('Errore interno del server');
  }
});

// Route per form nuova tipologia liquore
router.get('/impostazioni/tipologie-liquore/nuovo', async (req, res) => {
  try {
    const currentPath = '/ristorante-menu/impostazioni/tipologie-liquore/nuovo';
    let sectionMenu = ristoranteMenuItems;
    let sectionTabs = ristoranteMenuImpostazioniSubItems;

    // Configura il form
    const formConfig = tipologiaLiquoreFormData.getFormData ? 
      tipologiaLiquoreFormData.getFormData(tipologiaLiquoreFormData, false, null, req.body) : 
      tipologiaLiquoreFormData;

    // Configurazione actionNav per questa pagina
    const actionNavConfig = createSubSectionActionNav('tipologie-liquore', 'new');
    
    res.render('pages/ristorante-menu/servizi/new', {
      title: 'Nuova Tipologia Liquore',
      description: 'Crea una nuova tipologia liquore per la classificazione',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionTabs,
      sectionIcons,
      currentPath,
      formConfig,
      itemType: 'Tipologia Liquore',
      backUrl: '/ristorante-menu/impostazioni/tipologie-liquore',
      actionNavConfig,
      isInternalPage: true,
      scripts: scriptManager.getScriptsForPage('form'),
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
        { label: 'Tipologie Liquore', href: '/ristorante-menu/impostazioni/tipologie-liquore' },
        { label: 'Nuova Tipologia Liquore', href: '/ristorante-menu/impostazioni/tipologie-liquore/nuovo' }
      ]
    });
  } catch (error) {
    console.error('Errore nel caricamento del form nuova tipologia liquore:', error);
    res.status(500).send('Errore interno del server');
  }
});

// Route per form modifica tipologia liquore
router.get('/impostazioni/tipologie-liquore/modifica/:id', async (req, res) => {
  try {
    const currentPath = '/ristorante-menu/impostazioni/tipologie-liquore/modifica/' + req.params.id;
    let sectionMenu = ristoranteMenuItems;
    let sectionTabs = ristoranteMenuImpostazioniSubItems;

    const tipologiaLiquore = await prisma.tipologiaLiquore.findFirst({
      where: { 
        id: req.params.id,
        deletedAt: null
      }
    });

    if (!tipologiaLiquore) {
      return res.status(404).send('Tipologia liquore non trovata');
    }

    // Configura il form
    const formConfig = tipologiaLiquoreFormData.getFormData ? 
      tipologiaLiquoreFormData.getFormData(tipologiaLiquoreFormData, true, tipologiaLiquore, req.body) : 
      tipologiaLiquoreFormData;
    
    // Configurazione actionNav per questa pagina
    const actionNavConfig = createSubSectionActionNav('tipologie-liquore', 'edit', tipologiaLiquore.id);
    const customTitle = generatePageTitle(tipologieLiquoreConfig, 'edit', tipologiaLiquore);

    res.render('pages/ristorante-menu/servizi/edit', {
      title: 'Modifica Tipologia Liquore',
      customTitle,
      description: 'Modifica le informazioni della tipologia liquore',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionTabs,
      sectionIcons,
      currentPath,
      formConfig,
      item: tipologiaLiquore,
      itemType: 'Tipologia Liquore',
      backUrl: `/ristorante-menu/impostazioni/tipologie-liquore/dettagli/${tipologiaLiquore.id}`,
      actionNavConfig,
      isInternalPage: true,
      scripts: scriptManager.getScriptsForPage('form'),
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
        { label: 'Tipologie Liquore', href: '/ristorante-menu/impostazioni/tipologie-liquore' },
        { label: tipologiaLiquore.nome, href: `/ristorante-menu/impostazioni/tipologie-liquore/dettagli/${tipologiaLiquore.id}` },
        { label: 'Modifica', href: `/ristorante-menu/impostazioni/tipologie-liquore/modifica/${tipologiaLiquore.id}` }
      ]
    });
  } catch (error) {
    console.error('Errore nel caricamento del form modifica tipologia liquore:', error);
    res.status(500).send('Errore interno del server');
  }
});

// Route AJAX per creare nuova tipologia liquore
router.post('/impostazioni/tipologie-liquore/nuovo/ajax', async (req, res) => {
  const { nome, descrizione } = req.body;

  try {
    // Verifica che non esista già una tipologia liquore con lo stesso nome
    const existingTipologiaLiquore = await prisma.tipologiaLiquore.findFirst({
      where: {
        nome,
        deletedAt: null
      }
    });

    if (existingTipologiaLiquore) {
      return res.json({
        success: false,
        message: 'Una tipologia liquore con questo nome esiste già'
      });
    }

    const tipologiaLiquore = await prisma.tipologiaLiquore.create({
      data: {
        nome,
        descrizione: descrizione || null
      }
    });

    res.json({
      success: true,
      message: 'Tipologia liquore creata con successo',
      data: { id: tipologiaLiquore.id }
    });
  } catch (error) {
    console.error('Errore nella creazione della tipologia liquore:', error);
    res.json({
      success: false,
      message: 'Si è verificato un errore durante la creazione della tipologia liquore'
    });
  }
});

// Route AJAX per modificare tipologia liquore
router.post('/impostazioni/tipologie-liquore/modifica/:id/ajax', async (req, res) => {
  const { nome, descrizione } = req.body;
  const { id } = req.params;

  try {
    // Verifica che la tipologia liquore esista
    const existingTipologiaLiquore = await prisma.tipologiaLiquore.findFirst({
      where: { id, deletedAt: null }
    });

    if (!existingTipologiaLiquore) {
      return res.json({
        success: false,
        message: 'Tipologia liquore non trovata'
      });
    }

    // Verifica che non esista già una tipologia liquore con lo stesso nome (escludendo quella corrente)
    const duplicateTipologiaLiquore = await prisma.tipologiaLiquore.findFirst({
      where: {
        nome,
        id: { not: id },
        deletedAt: null
      }
    });

    if (duplicateTipologiaLiquore) {
      return res.json({
        success: false,
        message: 'Una tipologia liquore con questo nome esiste già'
      });
    }

    const tipologiaLiquore = await prisma.tipologiaLiquore.update({
      where: { id },
      data: {
        nome,
        descrizione: descrizione || null
      }
    });

    res.json({
      success: true,
      message: 'Tipologia liquore aggiornata con successo',
      data: { id: tipologiaLiquore.id }
    });
  } catch (error) {
    console.error('Errore nell\'aggiornamento della tipologia liquore:', error);
    res.json({
      success: false,
      message: 'Si è verificato un errore durante l\'aggiornamento della tipologia liquore'
    });
  }
});

// Route per eliminazione singola tipologia liquore
router.delete('/impostazioni/tipologie-liquore/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.tipologiaLiquore.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    });

    res.json({ 
      success: true, 
      message: 'Tipologia liquore eliminata con successo' 
    });
  } catch (error) {
    console.error('Errore nell\'eliminazione della tipologia liquore:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Errore nell\'eliminazione' 
    });
  }
});

// Route per eliminazione multipla tipologie liquore
router.delete('/impostazioni/tipologie-liquore', async (req, res) => {
  const { itemIds } = req.body;
  
  if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
    return res.status(400).json({ 
      success: false, 
      message: 'Nessuna tipologia liquore selezionata per la cancellazione' 
    });
  }
  
  try {
    // Verifica che tutte le tipologie liquore esistano e non siano già cancellate
    const existingTipologieLiquore = await prisma.tipologiaLiquore.findMany({
      where: { 
        id: { in: itemIds },
        deletedAt: null
      }
    });

    if (existingTipologieLiquore.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Nessuna tipologia liquore valida trovata per la cancellazione' 
      });
    }

    // Esegui soft delete per tutte le tipologie liquore valide
    const validTipologiaLiquoreIds = existingTipologieLiquore.map(tipologiaLiquore => tipologiaLiquore.id);
    await prisma.tipologiaLiquore.updateMany({
      where: { 
        id: { in: validTipologiaLiquoreIds }
      },
      data: { 
        deletedAt: new Date() 
      }
    });

    const deletedCount = validTipologiaLiquoreIds.length;
    const skippedCount = itemIds.length - validTipologiaLiquoreIds.length;
    
    let message = `Eliminate ${deletedCount} tipologia/e liquore con successo`;
    if (skippedCount > 0) {
      message += `. ${skippedCount} tipologia/e liquore già cancellate o non trovate.`;
    }

    res.json({ 
      success: true, 
      message,
      deletedCount,
      skippedCount
    });
  } catch (error) {
    console.error('Errore nella cancellazione delle tipologie liquore:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Si è verificato un errore durante la cancellazione' 
    });
  }
});

// === ROUTE CRUD TIPOLOGIE COCKTAIL ===

// Route per visualizzare lista tipologie cocktail
router.get('/impostazioni/tipologie-cocktail', async (req, res) => {
  try {
    const currentPath = '/ristorante-menu/impostazioni/tipologie-cocktail';
    let sectionMenu = ristoranteMenuItems;
    let sectionTabs = ristoranteMenuImpostazioniSubItems;

    const paginationConfig = getPaginationParams(req, 20);
    const totalItems = await prisma.tipologiaCocktail.count({ where: { deletedAt: null } });
    const tipologieCocktail = await prisma.tipologiaCocktail.findMany({
      where: { deletedAt: null },
      orderBy: { nome: 'asc' },
      skip: paginationConfig.offset,
      take: paginationConfig.limit
    });

    const pagination = calculatePagination(totalItems, paginationConfig.page, paginationConfig.limit);

    const config = { ...tipologieCocktailConfig };
    config.hasItems = totalItems > 0;
    config.items = tipologieCocktail;

    const successMessage = req.query.success ? decodeURIComponent(req.query.success as string) : undefined;
    const errorMessage = req.query.error ? decodeURIComponent(req.query.error as string) : undefined;
    const actionNavConfig = createSubSectionActionNav('tipologie-cocktail', 'index');

    res.render('pages/ristorante-menu/impostazioni/subSection', {
      title: 'Tipologie Cocktail',
      description: 'Gestisci le tipologie cocktail per la classificazione',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionTabs,
      sectionIcons,
      currentPath,
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
        { label: 'Tipologie Cocktail', href: '/ristorante-menu/impostazioni/tipologie-cocktail' }
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
    console.error('Errore nel recupero delle tipologie cocktail:', error);
    res.status(500).send('Errore interno del server');
  }
});

// Route per visualizzare dettagli tipologia cocktail
router.get('/impostazioni/tipologie-cocktail/dettagli/:id', async (req, res) => {
  try {
    const currentPath = '/ristorante-menu/impostazioni/tipologie-cocktail/dettagli/' + req.params.id;
    let sectionMenu = ristoranteMenuItems;
    let sectionTabs = ristoranteMenuImpostazioniSubItems;

    const tipologiaCocktail = await prisma.tipologiaCocktail.findFirst({
      where: { 
        id: req.params.id,
        deletedAt: null
      }
    });

    if (!tipologiaCocktail) {
      return res.status(404).send('Tipologia cocktail non trovata');
    }

    const actionNavConfig = createSubSectionActionNav('tipologie-cocktail', 'view', tipologiaCocktail.id);
    const customTitle = generatePageTitle(tipologieCocktailConfig, 'view', tipologiaCocktail);

    res.render('pages/ristorante-menu/impostazioni/view', {
      title: 'Dettagli Tipologia Cocktail',
      customTitle,
      description: 'Informazioni dettagliate della tipologia cocktail',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionTabs,
      sectionIcons,
      currentPath,
      item: tipologiaCocktail,
      itemType: 'Tipologia Cocktail',
      backUrl: '/ristorante-menu/impostazioni/tipologie-cocktail',
      actionNavConfig,
      detailViewConfig: tipologieCocktailDetailViewConfig,
      scripts: scriptManager.getScriptsForPage('dashboard'),
      isInternalPage: true,
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
        { label: 'Tipologie Cocktail', href: '/ristorante-menu/impostazioni/tipologie-cocktail' },
        { label: tipologiaCocktail.nome, href: `/ristorante-menu/impostazioni/tipologie-cocktail/dettagli/${tipologiaCocktail.id}` }
      ]
    });
  } catch (error) {
    console.error('Errore nel caricamento dei dettagli tipologia cocktail:', error);
    res.status(500).send('Errore interno del server');
  }
});

// Route per form nuova tipologia cocktail
router.get('/impostazioni/tipologie-cocktail/nuovo', async (req, res) => {
  try {
    const currentPath = '/ristorante-menu/impostazioni/tipologie-cocktail/nuovo';
    let sectionMenu = ristoranteMenuItems;
    let sectionTabs = ristoranteMenuImpostazioniSubItems;

    // Configura il form
    const formConfig = tipologiaCocktailFormData.getFormData ? 
      tipologiaCocktailFormData.getFormData(tipologiaCocktailFormData, false, null, req.body) : 
      tipologiaCocktailFormData;

    // Configurazione actionNav per questa pagina
    const actionNavConfig = createSubSectionActionNav('tipologie-cocktail', 'new');
    
    res.render('pages/ristorante-menu/servizi/new', {
      title: 'Nuova Tipologia Cocktail',
      description: 'Crea una nuova tipologia cocktail per la classificazione',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionTabs,
      sectionIcons,
      currentPath,
      formConfig,
      itemType: 'Tipologia Cocktail',
      backUrl: '/ristorante-menu/impostazioni/tipologie-cocktail',
      actionNavConfig,
      isInternalPage: true,
      scripts: scriptManager.getScriptsForPage('form'),
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
        { label: 'Tipologie Cocktail', href: '/ristorante-menu/impostazioni/tipologie-cocktail' },
        { label: 'Nuova Tipologia Cocktail', href: '/ristorante-menu/impostazioni/tipologie-cocktail/nuovo' }
      ]
    });
  } catch (error) {
    console.error('Errore nel caricamento del form nuova tipologia cocktail:', error);
    res.status(500).send('Errore interno del server');
  }
});

// Route per form modifica tipologia cocktail
router.get('/impostazioni/tipologie-cocktail/modifica/:id', async (req, res) => {
  try {
    const currentPath = '/ristorante-menu/impostazioni/tipologie-cocktail/modifica/' + req.params.id;
    let sectionMenu = ristoranteMenuItems;
    let sectionTabs = ristoranteMenuImpostazioniSubItems;

    const tipologiaCocktail = await prisma.tipologiaCocktail.findFirst({
      where: { 
        id: req.params.id,
        deletedAt: null
      }
    });

    if (!tipologiaCocktail) {
      return res.status(404).send('Tipologia cocktail non trovata');
    }

    // Configura il form
    const formConfig = tipologiaCocktailFormData.getFormData ? 
      tipologiaCocktailFormData.getFormData(tipologiaCocktailFormData, true, tipologiaCocktail, req.body) : 
      tipologiaCocktailFormData;
    
    // Configurazione actionNav per questa pagina
    const actionNavConfig = createSubSectionActionNav('tipologie-cocktail', 'edit', tipologiaCocktail.id);
    const customTitle = generatePageTitle(tipologieCocktailConfig, 'edit', tipologiaCocktail);

    res.render('pages/ristorante-menu/servizi/edit', {
      title: 'Modifica Tipologia Cocktail',
      customTitle,
      description: 'Modifica le informazioni della tipologia cocktail',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionTabs,
      sectionIcons,
      currentPath,
      formConfig,
      item: tipologiaCocktail,
      itemType: 'Tipologia Cocktail',
      backUrl: `/ristorante-menu/impostazioni/tipologie-cocktail/dettagli/${tipologiaCocktail.id}`,
      actionNavConfig,
      isInternalPage: true,
      scripts: scriptManager.getScriptsForPage('form'),
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
        { label: 'Tipologie Cocktail', href: '/ristorante-menu/impostazioni/tipologie-cocktail' },
        { label: tipologiaCocktail.nome, href: `/ristorante-menu/impostazioni/tipologie-cocktail/dettagli/${tipologiaCocktail.id}` },
        { label: 'Modifica', href: `/ristorante-menu/impostazioni/tipologie-cocktail/modifica/${tipologiaCocktail.id}` }
      ]
    });
  } catch (error) {
    console.error('Errore nel caricamento del form modifica tipologia cocktail:', error);
    res.status(500).send('Errore interno del server');
  }
});

// Route AJAX per creare nuova tipologia cocktail
router.post('/impostazioni/tipologie-cocktail/nuovo/ajax', async (req, res) => {
  const { nome, descrizione } = req.body;

  try {
    // Verifica che non esista già una tipologia cocktail con lo stesso nome
    const existingTipologiaCocktail = await prisma.tipologiaCocktail.findFirst({
      where: {
        nome,
        deletedAt: null
      }
    });

    if (existingTipologiaCocktail) {
      return res.json({
        success: false,
        message: 'Una tipologia cocktail con questo nome esiste già'
      });
    }

    const tipologiaCocktail = await prisma.tipologiaCocktail.create({
      data: {
        nome,
        descrizione: descrizione || null
      }
    });

    res.json({
      success: true,
      message: 'Tipologia cocktail creata con successo',
      data: { id: tipologiaCocktail.id }
    });
  } catch (error) {
    console.error('Errore nella creazione della tipologia cocktail:', error);
    res.json({
      success: false,
      message: 'Si è verificato un errore durante la creazione della tipologia cocktail'
    });
  }
});

// Route AJAX per modificare tipologia cocktail
router.post('/impostazioni/tipologie-cocktail/modifica/:id/ajax', async (req, res) => {
  const { nome, descrizione } = req.body;
  const { id } = req.params;

  try {
    // Verifica che la tipologia cocktail esista
    const existingTipologiaCocktail = await prisma.tipologiaCocktail.findFirst({
      where: { id, deletedAt: null }
    });

    if (!existingTipologiaCocktail) {
      return res.json({
        success: false,
        message: 'Tipologia cocktail non trovata'
      });
    }

    // Verifica che non esista già una tipologia cocktail con lo stesso nome (escludendo quella corrente)
    const duplicateTipologiaCocktail = await prisma.tipologiaCocktail.findFirst({
      where: {
        nome,
        id: { not: id },
        deletedAt: null
      }
    });

    if (duplicateTipologiaCocktail) {
      return res.json({
        success: false,
        message: 'Una tipologia cocktail con questo nome esiste già'
      });
    }

    const tipologiaCocktail = await prisma.tipologiaCocktail.update({
      where: { id },
      data: {
        nome,
        descrizione: descrizione || null
      }
    });

    res.json({
      success: true,
      message: 'Tipologia cocktail aggiornata con successo',
      data: { id: tipologiaCocktail.id }
    });
  } catch (error) {
    console.error('Errore nell\'aggiornamento della tipologia cocktail:', error);
    res.json({
      success: false,
      message: 'Si è verificato un errore durante l\'aggiornamento della tipologia cocktail'
    });
  }
});

// Route per eliminazione singola tipologia cocktail
router.delete('/impostazioni/tipologie-cocktail/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.tipologiaCocktail.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    });

    res.json({ 
      success: true, 
      message: 'Tipologia cocktail eliminata con successo' 
    });
  } catch (error) {
    console.error('Errore nell\'eliminazione della tipologia cocktail:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Errore nell\'eliminazione' 
    });
  }
});

// Route per eliminazione multipla tipologie cocktail
router.delete('/impostazioni/tipologie-cocktail', async (req, res) => {
  const { itemIds } = req.body;
  
  if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
    return res.status(400).json({ 
      success: false, 
      message: 'Nessuna tipologia cocktail selezionata per la cancellazione' 
    });
  }
  
  try {
    // Verifica che tutte le tipologie cocktail esistano e non siano già cancellate
    const existingTipologieCocktail = await prisma.tipologiaCocktail.findMany({
      where: { 
        id: { in: itemIds },
        deletedAt: null
      }
    });

    if (existingTipologieCocktail.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Nessuna tipologia cocktail valida trovata per la cancellazione' 
      });
    }

    // Esegui soft delete per tutte le tipologie cocktail valide
    const validTipologiaCocktailIds = existingTipologieCocktail.map(tipologiaCocktail => tipologiaCocktail.id);
    await prisma.tipologiaCocktail.updateMany({
      where: { 
        id: { in: validTipologiaCocktailIds }
      },
      data: { 
        deletedAt: new Date() 
      }
    });

    const deletedCount = validTipologiaCocktailIds.length;
    const skippedCount = itemIds.length - validTipologiaCocktailIds.length;
    
    let message = `Eliminate ${deletedCount} tipologia/e cocktail con successo`;
    if (skippedCount > 0) {
      message += `. ${skippedCount} tipologia/e cocktail già cancellate o non trovate.`;
    }

    res.json({ 
      success: true, 
      message,
      deletedCount,
      skippedCount
    });
  } catch (error) {
    console.error('Errore nella cancellazione delle tipologie cocktail:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Si è verificato un errore durante la cancellazione' 
    });
  }
});

// === ROUTE CRUD TIPOLOGIE BEVANDA ===

// Route per visualizzare lista tipologie bevanda
router.get('/impostazioni/tipologie-bevanda', async (req, res) => {
  try {
    const currentPath = '/ristorante-menu/impostazioni/tipologie-bevanda';
    let sectionMenu = ristoranteMenuItems;
    let sectionTabs = ristoranteMenuImpostazioniSubItems;

    const paginationConfig = getPaginationParams(req, 20);
    const totalItems = await prisma.tipologiaBevanda.count({ where: { deletedAt: null } });
    const tipologieBevanda = await prisma.tipologiaBevanda.findMany({
      where: { deletedAt: null },
      orderBy: { nome: 'asc' },
      skip: paginationConfig.offset,
      take: paginationConfig.limit
    });

    const pagination = calculatePagination(totalItems, paginationConfig.page, paginationConfig.limit);

    const config = { ...tipologieBevandaConfig };
    config.hasItems = totalItems > 0;
    config.items = tipologieBevanda;

    const successMessage = req.query.success ? decodeURIComponent(req.query.success as string) : undefined;
    const errorMessage = req.query.error ? decodeURIComponent(req.query.error as string) : undefined;
    const actionNavConfig = createSubSectionActionNav('tipologie-bevanda', 'index');

    res.render('pages/ristorante-menu/impostazioni/subSection', {
      title: 'Tipologie Bevanda',
      description: 'Gestisci le tipologie bevanda per la classificazione',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionTabs,
      sectionIcons,
      currentPath,
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
        { label: 'Tipologie Bevanda', href: '/ristorante-menu/impostazioni/tipologie-bevanda' }
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
    console.error('Errore nel recupero delle tipologie bevanda:', error);
    res.status(500).send('Errore interno del server');
  }
});

// Route per visualizzare dettagli tipologia bevanda
router.get('/impostazioni/tipologie-bevanda/dettagli/:id', async (req, res) => {
  try {
    const currentPath = '/ristorante-menu/impostazioni/tipologie-bevanda/dettagli/' + req.params.id;
    let sectionMenu = ristoranteMenuItems;
    let sectionTabs = ristoranteMenuImpostazioniSubItems;

    const tipologiaBevanda = await prisma.tipologiaBevanda.findFirst({
      where: { 
        id: req.params.id,
        deletedAt: null
      }
    });

    if (!tipologiaBevanda) {
      return res.status(404).send('Tipologia bevanda non trovata');
    }

    const actionNavConfig = createSubSectionActionNav('tipologie-bevanda', 'view', tipologiaBevanda.id);
    const customTitle = generatePageTitle(tipologieBevandaConfig, 'view', tipologiaBevanda);

    res.render('pages/ristorante-menu/impostazioni/view', {
      title: 'Dettagli Tipologia Bevanda',
      customTitle,
      description: 'Informazioni dettagliate della tipologia bevanda',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionTabs,
      sectionIcons,
      currentPath,
      item: tipologiaBevanda,
      itemType: 'Tipologia Bevanda',
      backUrl: '/ristorante-menu/impostazioni/tipologie-bevanda',
      actionNavConfig,
      detailViewConfig: tipologieBevandaDetailViewConfig,
      scripts: scriptManager.getScriptsForPage('dashboard'),
      isInternalPage: true,
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
        { label: 'Tipologie Bevanda', href: '/ristorante-menu/impostazioni/tipologie-bevanda' },
        { label: tipologiaBevanda.nome, href: `/ristorante-menu/impostazioni/tipologie-bevanda/dettagli/${tipologiaBevanda.id}` }
      ]
    });
  } catch (error) {
    console.error('Errore nel caricamento dei dettagli tipologia bevanda:', error);
    res.status(500).send('Errore interno del server');
  }
});

// Route per form nuova tipologia bevanda
router.get('/impostazioni/tipologie-bevanda/nuovo', async (req, res) => {
  try {
    const currentPath = '/ristorante-menu/impostazioni/tipologie-bevanda/nuovo';
    let sectionMenu = ristoranteMenuItems;
    let sectionTabs = ristoranteMenuImpostazioniSubItems;

    // Configura il form
    const formConfig = tipologiaBevandaFormData.getFormData ? 
      tipologiaBevandaFormData.getFormData(tipologiaBevandaFormData, false, null, req.body) : 
      tipologiaBevandaFormData;

    // Configurazione actionNav per questa pagina
    const actionNavConfig = createSubSectionActionNav('tipologie-bevanda', 'new');
    
    res.render('pages/ristorante-menu/servizi/new', {
      title: 'Nuova Tipologia Bevanda',
      description: 'Crea una nuova tipologia bevanda per la classificazione',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionTabs,
      sectionIcons,
      currentPath,
      formConfig,
      itemType: 'Tipologia Bevanda',
      backUrl: '/ristorante-menu/impostazioni/tipologie-bevanda',
      actionNavConfig,
      isInternalPage: true,
      scripts: scriptManager.getScriptsForPage('form'),
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
        { label: 'Tipologie Bevanda', href: '/ristorante-menu/impostazioni/tipologie-bevanda' },
        { label: 'Nuova Tipologia Bevanda', href: '/ristorante-menu/impostazioni/tipologie-bevanda/nuovo' }
      ]
    });
  } catch (error) {
    console.error('Errore nel caricamento del form nuova tipologia bevanda:', error);
    res.status(500).send('Errore interno del server');
  }
});

// Route per form modifica tipologia bevanda
router.get('/impostazioni/tipologie-bevanda/modifica/:id', async (req, res) => {
  try {
    const currentPath = '/ristorante-menu/impostazioni/tipologie-bevanda/modifica/' + req.params.id;
    let sectionMenu = ristoranteMenuItems;
    let sectionTabs = ristoranteMenuImpostazioniSubItems;

    const tipologiaBevanda = await prisma.tipologiaBevanda.findFirst({
      where: { 
        id: req.params.id,
        deletedAt: null
      }
    });

    if (!tipologiaBevanda) {
      return res.status(404).send('Tipologia bevanda non trovata');
    }

    // Configura il form
    const formConfig = tipologiaBevandaFormData.getFormData ? 
      tipologiaBevandaFormData.getFormData(tipologiaBevandaFormData, true, tipologiaBevanda, req.body) : 
      tipologiaBevandaFormData;
    
    // Configurazione actionNav per questa pagina
    const actionNavConfig = createSubSectionActionNav('tipologie-bevanda', 'edit', tipologiaBevanda.id);
    const customTitle = generatePageTitle(tipologieBevandaConfig, 'edit', tipologiaBevanda);

    res.render('pages/ristorante-menu/servizi/edit', {
      title: 'Modifica Tipologia Bevanda',
      customTitle,
      description: 'Modifica le informazioni della tipologia bevanda',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionTabs,
      sectionIcons,
      currentPath,
      formConfig,
      item: tipologiaBevanda,
      itemType: 'Tipologia Bevanda',
      backUrl: `/ristorante-menu/impostazioni/tipologie-bevanda/dettagli/${tipologiaBevanda.id}`,
      actionNavConfig,
      isInternalPage: true,
      scripts: scriptManager.getScriptsForPage('form'),
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
        { label: 'Tipologie Bevanda', href: '/ristorante-menu/impostazioni/tipologie-bevanda' },
        { label: tipologiaBevanda.nome, href: `/ristorante-menu/impostazioni/tipologie-bevanda/dettagli/${tipologiaBevanda.id}` },
        { label: 'Modifica', href: `/ristorante-menu/impostazioni/tipologie-bevanda/modifica/${tipologiaBevanda.id}` }
      ]
    });
  } catch (error) {
    console.error('Errore nel caricamento del form modifica tipologia bevanda:', error);
    res.status(500).send('Errore interno del server');
  }
});

// Route AJAX per creare nuova tipologia bevanda
router.post('/impostazioni/tipologie-bevanda/nuovo/ajax', async (req, res) => {
  const { nome, descrizione } = req.body;

  try {
    // Verifica che non esista già una tipologia bevanda con lo stesso nome
    const existingTipologiaBevanda = await prisma.tipologiaBevanda.findFirst({
      where: {
        nome,
        deletedAt: null
      }
    });

    if (existingTipologiaBevanda) {
      return res.json({
        success: false,
        message: 'Una tipologia bevanda con questo nome esiste già'
      });
    }

    const tipologiaBevanda = await prisma.tipologiaBevanda.create({
      data: {
        nome,
        descrizione: descrizione || null
      }
    });

    res.json({
      success: true,
      message: 'Tipologia bevanda creata con successo',
      data: { id: tipologiaBevanda.id }
    });
  } catch (error) {
    console.error('Errore nella creazione della tipologia bevanda:', error);
    res.json({
      success: false,
      message: 'Si è verificato un errore durante la creazione della tipologia bevanda'
    });
  }
});

// Route AJAX per modificare tipologia bevanda
router.post('/impostazioni/tipologie-bevanda/modifica/:id/ajax', async (req, res) => {
  const { nome, descrizione } = req.body;
  const { id } = req.params;

  try {
    // Verifica che la tipologia bevanda esista
    const existingTipologiaBevanda = await prisma.tipologiaBevanda.findFirst({
      where: { id, deletedAt: null }
    });

    if (!existingTipologiaBevanda) {
      return res.json({
        success: false,
        message: 'Tipologia bevanda non trovata'
      });
    }

    // Verifica che non esista già una tipologia bevanda con lo stesso nome (escludendo quella corrente)
    const duplicateTipologiaBevanda = await prisma.tipologiaBevanda.findFirst({
      where: {
        nome,
        id: { not: id },
        deletedAt: null
      }
    });

    if (duplicateTipologiaBevanda) {
      return res.json({
        success: false,
        message: 'Una tipologia bevanda con questo nome esiste già'
      });
    }

    const tipologiaBevanda = await prisma.tipologiaBevanda.update({
      where: { id },
      data: {
        nome,
        descrizione: descrizione || null
      }
    });

    res.json({
      success: true,
      message: 'Tipologia bevanda aggiornata con successo',
      data: { id: tipologiaBevanda.id }
    });
  } catch (error) {
    console.error('Errore nell\'aggiornamento della tipologia bevanda:', error);
    res.json({
      success: false,
      message: 'Si è verificato un errore durante l\'aggiornamento della tipologia bevanda'
    });
  }
});

// Route per eliminazione singola tipologia bevanda
router.delete('/impostazioni/tipologie-bevanda/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.tipologiaBevanda.update({
      where: { id },
      data: {
        deletedAt: new Date()
      }
    });

    res.json({ 
      success: true, 
      message: 'Tipologia bevanda eliminata con successo' 
    });
  } catch (error) {
    console.error('Errore nell\'eliminazione della tipologia bevanda:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Errore nell\'eliminazione' 
    });
  }
});

// Route per eliminazione multipla tipologie bevanda
router.delete('/impostazioni/tipologie-bevanda', async (req, res) => {
  const { itemIds } = req.body;
  
  if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
    return res.status(400).json({ 
      success: false, 
      message: 'Nessuna tipologia bevanda selezionata per la cancellazione' 
    });
  }
  
  try {
    // Verifica che tutte le tipologie bevanda esistano e non siano già cancellate
    const existingTipologieBevanda = await prisma.tipologiaBevanda.findMany({
      where: { 
        id: { in: itemIds },
        deletedAt: null
      }
    });

    if (existingTipologieBevanda.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Nessuna tipologia bevanda valida trovata per la cancellazione' 
      });
    }

    // Esegui soft delete per tutte le tipologie bevanda valide
    const validTipologiaBevandaIds = existingTipologieBevanda.map(tipologiaBevanda => tipologiaBevanda.id);
    await prisma.tipologiaBevanda.updateMany({
      where: { 
        id: { in: validTipologiaBevandaIds }
      },
      data: { 
        deletedAt: new Date() 
      }
    });

    const deletedCount = validTipologiaBevandaIds.length;
    const skippedCount = itemIds.length - validTipologiaBevandaIds.length;
    
    let message = `Eliminate ${deletedCount} tipologia/e bevanda con successo`;
    if (skippedCount > 0) {
      message += `. ${skippedCount} tipologia/e bevanda già cancellate o non trovate.`;
    }

    res.json({ 
      success: true, 
      message,
      deletedCount,
      skippedCount
    });
  } catch (error) {
    console.error('Errore nella cancellazione delle tipologie bevanda:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Si è verificato un errore durante la cancellazione' 
    });
  }
});

export default router; 