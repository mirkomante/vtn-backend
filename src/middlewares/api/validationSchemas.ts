const { body: _body, query, param } = require('express-validator');

/**
 * Schemi di validazione specifici per ogni endpoint API
 */

// Validazione per endpoint Menu Fissi
export const menuFissoValidation = {
  // GET /api/v1/menu-fisso - Lista menu fissi
  list: [
    query('page').optional().isInt({ min: 1 }).withMessage('Page deve essere un numero >= 1'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit deve essere tra 1 e 100'),
    query('sortBy').optional().isIn(['nome', 'prezzo', 'createdAt']).withMessage('SortBy non valido'),
    query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('SortOrder deve essere asc o desc'),
    query('categoriaId').optional().isUUID().withMessage('CategoriaId deve essere un UUID valido'),
    query('inLista').optional().isBoolean().withMessage('InLista deve essere un valore booleano'),
    query('all').optional().isIn(['true', 'false']).withMessage('All deve essere true o false')
  ],
  
  // GET /api/v1/menu-fisso/:id - Dettagli menu fisso
  getById: [
    param('id').isUUID().withMessage('ID deve essere un UUID valido')
  ],
  
  // GET /api/v1/menu-fisso/categoria/:categoriaId - Menu fissi per categoria
  getByCategory: [
    param('categoriaId').isUUID().withMessage('CategoriaId deve essere un UUID valido'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page deve essere un numero >= 1'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit deve essere tra 1 e 100')
  ]
};

// Validazione per endpoint Categorie Menu Fisso
export const categoriaMenuFissoValidation = {
  // GET /api/v1/categoria-menu-fisso - Lista categorie menu fisso
  list: [
    query('page').optional().isInt({ min: 1 }).withMessage('Page deve essere un numero >= 1'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit deve essere tra 1 e 100'),
    query('sortBy').optional().isIn(['nome', 'createdAt']).withMessage('SortBy non valido'),
    query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('SortOrder deve essere asc o desc'),
    query('inLista').optional().isBoolean().withMessage('InLista deve essere un valore booleano'),
    query('all').optional().isIn(['true', 'false']).withMessage('All deve essere true o false')
  ],
  
  // GET /api/v1/categoria-menu-fisso/:id - Dettagli categoria menu fisso
  getById: [
    param('id').isUUID().withMessage('ID deve essere un UUID valido')
  ]
};

// Validazione per endpoint Piatti
export const piattiValidation = {
  // GET /api/v1/piatti - Lista piatti
  list: [
    query('page').optional().isInt({ min: 1 }).withMessage('Page deve essere un numero >= 1'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit deve essere tra 1 e 100'),
    query('sortBy').optional().isIn(['nome', 'prezzo', 'createdAt']).withMessage('SortBy non valido'),
    query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('SortOrder deve essere asc o desc'),
    query('categoriaId').optional().isUUID().withMessage('CategoriaId deve essere un UUID valido'),
    query('allergeneId').optional().isUUID().withMessage('AllergeneId deve essere un UUID valido'),
    query('inLista').optional().isBoolean().withMessage('InLista deve essere un valore booleano'),
    query('soloMenuFissi').optional().isBoolean().withMessage('SoloMenuFissi deve essere un valore booleano'),
    query('all').optional().isIn(['true', 'false']).withMessage('All deve essere true o false')
  ],
  
  // GET /api/v1/piatti/:id - Dettagli piatto
  getById: [
    param('id').isUUID().withMessage('ID deve essere un UUID valido')
  ],
  
  // GET /api/v1/piatti/categoria/:categoriaId - Piatti per categoria
  getByCategory: [
    param('categoriaId').isUUID().withMessage('CategoriaId deve essere un UUID valido'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page deve essere un numero >= 1'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit deve essere tra 1 e 100')
  ],
  
  // GET /api/v1/piatti/allergene/:allergeneId - Piatti per allergene
  getByAllergen: [
    param('allergeneId').isUUID().withMessage('AllergeneId deve essere un UUID valido'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page deve essere un numero >= 1'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit deve essere tra 1 e 100')
  ]
};

// Validazione per endpoint Vini
export const viniValidation = {
  // GET /api/v1/vini - Lista vini
  list: [
    query('page').optional().isInt({ min: 1 }).withMessage('Page deve essere un numero >= 1'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit deve essere tra 1 e 100'),
    query('sortBy').optional().isIn(['nome', 'prezzo', 'prezzoCalice', 'createdAt']).withMessage('SortBy non valido'),
    query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('SortOrder deve essere asc o desc'),
    query('nazioneId').optional().isUUID().withMessage('NazioneId deve essere un UUID valido'),
    query('regioneId').optional().isUUID().withMessage('RegioneId deve essere un UUID valido'),
    query('zonaId').optional().isUUID().withMessage('ZonaId deve essere un UUID valido'),
    query('tipologiaId').optional().isUUID().withMessage('TipologiaId deve essere un UUID valido'),
    query('inLista').optional().isBoolean().withMessage('InLista deve essere un valore booleano'),
    query('all').optional().isIn(['true', 'false']).withMessage('All deve essere true o false')
  ],
  
  // GET /api/v1/vini/:id - Dettagli vino
  getById: [
    param('id').isUUID().withMessage('ID deve essere un UUID valido')
  ],
  
  // GET /api/v1/vini/nazione/:nazioneId - Vini per nazione
  getByNation: [
    param('nazioneId').isUUID().withMessage('NazioneId deve essere un UUID valido'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page deve essere un numero >= 1'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit deve essere tra 1 e 100')
  ],
  
  // GET /api/v1/vini/tipologia/:tipologiaId - Vini per tipologia
  getByType: [
    param('tipologiaId').isUUID().withMessage('TipologiaId deve essere un UUID valido'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page deve essere un numero >= 1'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit deve essere tra 1 e 100')
  ]
};

// Validazione per endpoint Birre
export const birreValidation = {
  // GET /api/v1/birre - Lista birre
  list: [
    query('page').optional().isInt({ min: 1 }).withMessage('Page deve essere un numero >= 1'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit deve essere tra 1 e 100'),
    query('sortBy').optional().isIn(['nome', 'prezzo', 'createdAt']).withMessage('SortBy non valido'),
    query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('SortOrder deve essere asc o desc'),
    query('nazioneId').optional().isUUID().withMessage('NazioneId deve essere un UUID valido'),
    query('tipologiaId').optional().isUUID().withMessage('TipologiaId deve essere un UUID valido'),
    query('inLista').optional().isBoolean().withMessage('InLista deve essere un valore booleano'),
    query('all').optional().isIn(['true', 'false']).withMessage('All deve essere true o false')
  ],
  
  // GET /api/v1/birre/:id - Dettagli birra
  getById: [
    param('id').isUUID().withMessage('ID deve essere un UUID valido')
  ],
  
  // GET /api/v1/birre/nazione/:nazioneId - Birre per nazione
  getByNation: [
    param('nazioneId').isUUID().withMessage('NazioneId deve essere un UUID valido'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page deve essere un numero >= 1'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit deve essere tra 1 e 100')
  ],
  
  // GET /api/v1/birre/tipologia/:tipologiaId - Birre per tipologia
  getByType: [
    param('tipologiaId').isUUID().withMessage('TipologiaId deve essere un UUID valido'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page deve essere un numero >= 1'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit deve essere tra 1 e 100')
  ]
};

// Validazione per endpoint Liquori
export const liquoriValidation = {
  // GET /api/v1/liquori - Lista liquori
  list: [
    query('page').optional().isInt({ min: 1 }).withMessage('Page deve essere un numero >= 1'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit deve essere tra 1 e 100'),
    query('sortBy').optional().isIn(['nome', 'prezzo', 'createdAt']).withMessage('SortBy non valido'),
    query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('SortOrder deve essere asc o desc'),
    query('nazioneId').optional().isUUID().withMessage('NazioneId deve essere un UUID valido'),
    query('tipologiaId').optional().isUUID().withMessage('TipologiaId deve essere un UUID valido'),
    query('inLista').optional().isBoolean().withMessage('InLista deve essere un valore booleano'),
    query('all').optional().isIn(['true', 'false']).withMessage('All deve essere true o false')
  ],
  
  // GET /api/v1/liquori/:id - Dettagli liquore
  getById: [
    param('id').isUUID().withMessage('ID deve essere un UUID valido')
  ],
  
  // GET /api/v1/liquori/nazione/:nazioneId - Liquori per nazione
  getByNation: [
    param('nazioneId').isUUID().withMessage('NazioneId deve essere un UUID valido'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page deve essere un numero >= 1'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit deve essere tra 1 e 100')
  ],
  
  // GET /api/v1/liquori/tipologia/:tipologiaId - Liquori per tipologia
  getByType: [
    param('tipologiaId').isUUID().withMessage('TipologiaId deve essere un UUID valido'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page deve essere un numero >= 1'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit deve essere tra 1 e 100')
  ]
};

// Validazione per endpoint Cocktails
export const cocktailsValidation = {
  // GET /api/v1/cocktails - Lista cocktails
  list: [
    query('page').optional().isInt({ min: 1 }).withMessage('Page deve essere un numero >= 1'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit deve essere tra 1 e 100'),
    query('sortBy').optional().isIn(['nome', 'prezzo', 'createdAt']).withMessage('SortBy non valido'),
    query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('SortOrder deve essere asc o desc'),
    query('nazioneId').optional().isUUID().withMessage('NazioneId deve essere un UUID valido'),
    query('tipologiaId').optional().isUUID().withMessage('TipologiaId deve essere un UUID valido'),
    query('inLista').optional().isBoolean().withMessage('InLista deve essere un valore booleano'),
    query('all').optional().isIn(['true', 'false']).withMessage('All deve essere true o false')
  ],
  
  // GET /api/v1/cocktails/:id - Dettagli cocktail
  getById: [
    param('id').isUUID().withMessage('ID deve essere un UUID valido')
  ],
  
  // GET /api/v1/cocktails/nazione/:nazioneId - Cocktails per nazione
  getByNation: [
    param('nazioneId').isUUID().withMessage('NazioneId deve essere un UUID valido'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page deve essere un numero >= 1'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit deve essere tra 1 e 100')
  ],
  
  // GET /api/v1/cocktails/tipologia/:tipologiaId - Cocktails per tipologia
  getByType: [
    param('tipologiaId').isUUID().withMessage('TipologiaId deve essere un UUID valido'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page deve essere un numero >= 1'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit deve essere tra 1 e 100')
  ]
};

// Validazione per endpoint Bevande
export const bevandeValidation = {
  // GET /api/v1/bevande - Lista bevande
  list: [
    query('page').optional().isInt({ min: 1 }).withMessage('Page deve essere un numero >= 1'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit deve essere tra 1 e 100'),
    query('sortBy').optional().isIn(['nome', 'prezzo', 'createdAt']).withMessage('SortBy non valido'),
    query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('SortOrder deve essere asc o desc'),
    query('nazioneId').optional().isUUID().withMessage('NazioneId deve essere un UUID valido'),
    query('tipologiaId').optional().isUUID().withMessage('TipologiaId deve essere un UUID valido'),
    query('inLista').optional().isBoolean().withMessage('InLista deve essere un valore booleano'),
    query('all').optional().isIn(['true', 'false']).withMessage('All deve essere true o false')
  ],
  
  // GET /api/v1/bevande/:id - Dettagli bevanda
  getById: [
    param('id').isUUID().withMessage('ID deve essere un UUID valido')
  ],
  
  // GET /api/v1/bevande/nazione/:nazioneId - Bevande per nazione
  getByNation: [
    param('nazioneId').isUUID().withMessage('NazioneId deve essere un UUID valido'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page deve essere un numero >= 1'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit deve essere tra 1 e 100')
  ],
  
  // GET /api/v1/bevande/tipologia/:tipologiaId - Bevande per tipologia
  getByType: [
    param('tipologiaId').isUUID().withMessage('TipologiaId deve essere un UUID valido'),
    query('page').optional().isInt({ min: 1 }).withMessage('Page deve essere un numero >= 1'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit deve essere tra 1 e 100')
  ]
};

// Validazione per endpoint Servizi Accessori
export const serviziValidation = {
  // GET /api/v1/servizi - Lista servizi accessori
  list: [
    query('page').optional().isInt({ min: 1 }).withMessage('Page deve essere un numero >= 1'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit deve essere tra 1 e 100'),
    query('sortBy').optional().isIn(['nome', 'prezzo', 'createdAt']).withMessage('SortBy non valido'),
    query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('SortOrder deve essere asc o desc'),
    query('inLista').optional().isBoolean().withMessage('InLista deve essere un valore booleano'),
    query('all').optional().isIn(['true', 'false']).withMessage('All deve essere true o false')
  ],
  
  // GET /api/v1/servizi/:id - Dettagli servizio accessorio
  getById: [
    param('id').isUUID().withMessage('ID deve essere un UUID valido')
  ]
};

// Validazione per endpoint Allergeni
export const allergeniValidation = {
  // GET /api/v1/allergeni - Lista allergeni
  list: [
    query('page').optional().isInt({ min: 1 }).withMessage('Page deve essere un numero >= 1'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit deve essere tra 1 e 100'),
    query('sortBy').optional().isIn(['nome', 'createdAt']).withMessage('SortBy non valido'),
    query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('SortOrder deve essere asc o desc')
  ],
  
  // GET /api/v1/allergeni/:id - Dettagli allergene
  getById: [
    param('id').isUUID().withMessage('ID deve essere un UUID valido')
  ]
};

// Validazione per endpoint Nazioni
export const nazioniValidation = {
  // GET /api/v1/nazioni - Lista nazioni
  list: [
    query('page').optional().isInt({ min: 1 }).withMessage('Page deve essere un numero >= 1'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit deve essere tra 1 e 100'),
    query('sortBy').optional().isIn(['nome', 'sigla', 'createdAt']).withMessage('SortBy non valido'),
    query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('SortOrder deve essere asc o desc')
  ],
  
  // GET /api/v1/nazioni/:id - Dettagli nazione
  getById: [
    param('id').isUUID().withMessage('ID deve essere un UUID valido')
  ]
};

// Validazione per endpoint Regioni
export const regioniValidation = {
  // GET /api/v1/regioni - Lista regioni
  list: [
    query('page').optional().isInt({ min: 1 }).withMessage('Page deve essere un numero >= 1'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit deve essere tra 1 e 100'),
    query('sortBy').optional().isIn(['nome', 'createdAt']).withMessage('SortBy non valido'),
    query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('SortOrder deve essere asc o desc'),
    query('nazioneId').optional().isUUID().withMessage('NazioneId deve essere un UUID valido')
  ],
  
  // GET /api/v1/regioni/:id - Dettagli regione
  getById: [
    param('id').isUUID().withMessage('ID deve essere un UUID valido')
  ]
};

// Validazione per endpoint Zone
export const zoneValidation = {
  // GET /api/v1/zone - Lista zone
  list: [
    query('page').optional().isInt({ min: 1 }).withMessage('Page deve essere un numero >= 1'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit deve essere tra 1 e 100'),
    query('sortBy').optional().isIn(['nome', 'createdAt']).withMessage('SortBy non valido'),
    query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('SortOrder deve essere asc o desc'),
    query('regioneId').optional().isUUID().withMessage('RegioneId deve essere un UUID valido'),
    query('nazioneId').optional().isUUID().withMessage('NazioneId deve essere un UUID valido')
  ],
  
  // GET /api/v1/zone/:id - Dettagli zona
  getById: [
    param('id').isUUID().withMessage('ID deve essere un UUID valido')
  ]
};

// Validazione per endpoint Tipologie Vino
export const tipologieVinoValidation = {
  // GET /api/v1/tipologie-vino - Lista tipologie vino
  list: [
    query('page').optional().isInt({ min: 1 }).withMessage('Page deve essere un numero >= 1'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit deve essere tra 1 e 100'),
    query('sortBy').optional().isIn(['nome', 'createdAt']).withMessage('SortBy non valido'),
    query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('SortOrder deve essere asc o desc')
  ],
  
  // GET /api/v1/tipologie-vino/:id - Dettagli tipologia vino
  getById: [
    param('id').isUUID().withMessage('ID deve essere un UUID valido')
  ]
};

// Validazione per endpoint Tipologie Birra
export const tipologieBirraValidation = {
  // GET /api/v1/tipologie-birra - Lista tipologie birra
  list: [
    query('page').optional().isInt({ min: 1 }).withMessage('Page deve essere un numero >= 1'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit deve essere tra 1 e 100'),
    query('sortBy').optional().isIn(['nome', 'createdAt']).withMessage('SortBy non valido'),
    query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('SortOrder deve essere asc o desc')
  ],
  
  // GET /api/v1/tipologie-birra/:id - Dettagli tipologia birra
  getById: [
    param('id').isUUID().withMessage('ID deve essere un UUID valido')
  ]
};

// Validazione per endpoint Tipologie Liquore
export const tipologieLiquoreValidation = {
  // GET /api/v1/tipologie-liquore - Lista tipologie liquore
  list: [
    query('page').optional().isInt({ min: 1 }).withMessage('Page deve essere un numero >= 1'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit deve essere tra 1 e 100'),
    query('sortBy').optional().isIn(['nome', 'createdAt']).withMessage('SortBy non valido'),
    query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('SortOrder deve essere asc o desc')
  ],
  
  // GET /api/v1/tipologie-liquore/:id - Dettagli tipologia liquore
  getById: [
    param('id').isUUID().withMessage('ID deve essere un UUID valido')
  ]
};

// Validazione per endpoint Tipologie Cocktail
export const tipologieCocktailValidation = {
  // GET /api/v1/tipologie-cocktail - Lista tipologie cocktail
  list: [
    query('page').optional().isInt({ min: 1 }).withMessage('Page deve essere un numero >= 1'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit deve essere tra 1 e 100'),
    query('sortBy').optional().isIn(['nome', 'createdAt']).withMessage('SortBy non valido'),
    query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('SortOrder deve essere asc o desc')
  ],
  
  // GET /api/v1/tipologie-cocktail/:id - Dettagli tipologia cocktail
  getById: [
    param('id').isUUID().withMessage('ID deve essere un UUID valido')
  ]
};

// Validazione per endpoint Tipologie Bevanda
export const tipologieBevandaValidation = {
  // GET /api/v1/tipologie-bevanda - Lista tipologie bevanda
  list: [
    query('page').optional().isInt({ min: 1 }).withMessage('Page deve essere un numero >= 1'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit deve essere tra 1 e 100'),
    query('sortBy').optional().isIn(['nome', 'createdAt']).withMessage('SortBy non valido'),
    query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('SortOrder deve essere asc o desc')
  ],
  
  // GET /api/v1/tipologie-bevanda/:id - Dettagli tipologia bevanda
  getById: [
    param('id').isUUID().withMessage('ID deve essere un UUID valido')
  ]
};

// Validazione per endpoint Categorie Piatti
export const categoriePiattiValidation = {
  // GET /api/v1/categorie-piatti - Lista categorie piatti
  list: [
    query('page').optional().isInt({ min: 1 }).withMessage('Page deve essere un numero >= 1'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit deve essere tra 1 e 100'),
    query('sortBy').optional().isIn(['nome', 'createdAt']).withMessage('SortBy non valido'),
    query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('SortOrder deve essere asc o desc'),
    query('inLista').optional().isBoolean().withMessage('InLista deve essere un valore booleano'),
    query('all').optional().isIn(['true', 'false']).withMessage('All deve essere true o false')
  ],
  
  // GET /api/v1/categorie-piatti/:id - Dettagli categoria piatti
  getById: [
    param('id').isUUID().withMessage('ID deve essere un UUID valido')
  ]
};
