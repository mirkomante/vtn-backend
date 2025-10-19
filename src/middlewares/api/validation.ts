import { Request, Response, NextFunction } from 'express';
const { validationResult, ValidationChain: _ValidationChain } = require('express-validator');

/**
 * Middleware per gestire i risultati della validazione
 * Restituisce errori 400 con dettagli se la validazione fallisce
 */
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Dati di input non validi',
        details: errors.array().map((error: any) => ({
          field: error.type === 'field' ? error.path : 'unknown',
          message: error.msg,
          value: error.type === 'field' ? error.value : undefined
        }))
      },
      meta: {
        timestamp: new Date().toISOString()
      }
    });
  }
  
  return next();
};

/**
 * Middleware per validazione UUID
 * Verifica che un parametro sia un UUID valido
 */
export const validateUUID = (paramName: string): any => {
  const { param } = require('express-validator');
  return param(paramName)
    .isUUID()
    .withMessage(`${paramName} deve essere un UUID valido`);
};

/**
 * Middleware per validazione query parameters
 * Verifica che i parametri query siano validi
 */
export const validateQueryParams = {
  // Validazione per parametri di paginazione
  pagination: () => {
    const { query } = require('express-validator');
    return [
      query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Il parametro page deve essere un numero intero maggiore di 0'),
      query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Il parametro limit deve essere un numero intero tra 1 e 100')
    ];
  },
  
  // Validazione per parametri di ordinamento
  sorting: () => {
    const { query } = require('express-validator');
    return [
      query('sortBy')
        .optional()
        .isAlpha()
        .withMessage('Il parametro sortBy deve contenere solo lettere'),
      query('sortOrder')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('Il parametro sortOrder deve essere "asc" o "desc"')
    ];
  },
  
  // Validazione per parametri di filtro
  filtering: () => {
    const { query } = require('express-validator');
    return [
      query('search')
        .optional()
        .isLength({ min: 1, max: 100 })
        .withMessage('Il parametro search deve essere tra 1 e 100 caratteri')
        .matches(/^[a-zA-Z0-9\s\-_]+$/)
        .withMessage('Il parametro search può contenere solo lettere, numeri, spazi, trattini e underscore'),
      query('category')
        .optional()
        .isUUID()
        .withMessage('Il parametro category deve essere un UUID valido'),
      query('inLista')
        .optional()
        .isBoolean()
        .withMessage('Il parametro inLista deve essere un valore booleano')
    ];
  }
};

/**
 * Middleware per sanitizzazione input
 * Rimuove caratteri potenzialmente pericolosi
 */
export const sanitizeInput = {
  // Sanitizza stringhe rimuovendo caratteri HTML e script
  string: () => {
    const { body, query, param } = require('express-validator');
    return [
      body('*').optional().escape(),
      query('*').optional().escape(),
      param('*').optional().escape()
    ];
  },
  
  // Sanitizza numeri
  numbers: () => {
    const { body, query, param } = require('express-validator');
    return [
      body('*').optional().toInt(),
      query('*').optional().toInt(),
      param('*').optional().toInt()
    ];
  }
};

/**
 * Middleware per validazione specifica per endpoint
 */
export const endpointValidation = {
  // Validazione per endpoint che richiedono un ID
  requireId: () => [
    validateUUID('id'),
    handleValidationErrors
  ],
  
  // Validazione per endpoint di lista con filtri
  listWithFilters: () => [
    ...validateQueryParams.pagination(),
    ...validateQueryParams.sorting(),
    ...validateQueryParams.filtering(),
    handleValidationErrors
  ],
  
  // Validazione per endpoint di ricerca
  search: () => [
    validateQueryParams.filtering()[0], // Solo il parametro search
    handleValidationErrors
  ]
};

/**
 * Middleware per logging delle validazioni (utile per debugging)
 * NOTA: Questo middleware è stato integrato in apiRequestLogger per evitare il doppio override di res.send
 * @deprecated Usare apiRequestLogger che include già la funzionalità di logging delle validazioni
 */
export const validationLogger = (_req: Request, _res: Response, next: NextFunction) => {
  // Middleware deprecato - la funzionalità è ora in apiRequestLogger
  // Mantenuto per compatibilità, ma non fa nulla
  next();
};
