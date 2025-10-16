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
    query('inLista').optional().isBoolean().withMessage('InLista deve essere un valore booleano')
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
    query('inLista').optional().isBoolean().withMessage('InLista deve essere un valore booleano')
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
    query('soloMenuFissi').optional().isBoolean().withMessage('SoloMenuFissi deve essere un valore booleano')
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
    query('inLista').optional().isBoolean().withMessage('InLista deve essere un valore booleano')
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
    query('inLista').optional().isBoolean().withMessage('InLista deve essere un valore booleano')
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
    query('inLista').optional().isBoolean().withMessage('InLista deve essere un valore booleano')
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
    query('inLista').optional().isBoolean().withMessage('InLista deve essere un valore booleano')
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
    query('inLista').optional().isBoolean().withMessage('InLista deve essere un valore booleano')
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
    query('inLista').optional().isBoolean().withMessage('InLista deve essere un valore booleano')
  ],
  
  // GET /api/v1/servizi/:id - Dettagli servizio accessorio
  getById: [
    param('id').isUUID().withMessage('ID deve essere un UUID valido')
  ]
};
