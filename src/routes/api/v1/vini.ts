import express from 'express';
import { prisma } from '../../../app';
import { handleValidationErrors } from '../../../middlewares/api/validation';
import { viniValidation } from '../../../middlewares/api/validationSchemas';
import { createNotFoundError } from '../../../middlewares/api/errorHandler';
import { createPaginationOptions, createFilterOptions, createSortingOptions } from '../../../middlewares/api/responseHandler';

const router = express.Router();

// GET /api/v1/vini - Lista tutti i vini
router.get('/', viniValidation.list, handleValidationErrors, async (req, res, next) => {
  try {
    const vini = await prisma.vino.findMany({
      where: {
        deletedAt: null,
        inLista: true
      },
      include: {
        nazione: {
          select: {
            id: true,
            nome: true,
            sigla: true
          }
        },
        regione: {
          select: {
            id: true,
            nome: true
          }
        },
        zona: {
          select: {
            id: true,
            nome: true
          }
        },
        tipologia: {
          select: {
            id: true,
            nome: true,
            descrizione: true
          }
        }
      },
      orderBy: {
        nome: 'asc'
      }
    });

    // Crea opzioni di risposta con paginazione e filtri
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const total = vini.length;
    
    const options = createPaginationOptions(page, limit, total);
    
    // Aggiungi filtri se presenti
    const appliedFilters: Record<string, any> = {};
    if (req.query.nazioneId) appliedFilters.nazioneId = req.query.nazioneId;
    if (req.query.regioneId) appliedFilters.regioneId = req.query.regioneId;
    if (req.query.zonaId) appliedFilters.zonaId = req.query.zonaId;
    if (req.query.tipologiaId) appliedFilters.tipologiaId = req.query.tipologiaId;
    if (req.query.inLista !== undefined) appliedFilters.inLista = req.query.inLista;
    
    if (Object.keys(appliedFilters).length > 0) {
      options.filters = createFilterOptions(appliedFilters).filters;
    }
    
    // Aggiungi ordinamento se presente
    if (req.query.sortBy && req.query.sortOrder) {
      options.sorting = createSortingOptions(
        req.query.sortBy as string, 
        req.query.sortOrder as 'asc' | 'desc'
      ).sorting;
    }
    
    res.apiCollection(vini, options);
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/vini/:id - Dettagli di un vino specifico
router.get('/:id', viniValidation.getById, handleValidationErrors, async (req, res, next) => {
  try {
    const vino = await prisma.vino.findFirst({
      where: {
        id: req.params.id,
        deletedAt: null
      },
      include: {
        nazione: {
          select: {
            id: true,
            nome: true,
            sigla: true
          }
        },
        regione: {
          select: {
            id: true,
            nome: true
          }
        },
        zona: {
          select: {
            id: true,
            nome: true
          }
        },
        tipologia: {
          select: {
            id: true,
            nome: true,
            descrizione: true
          }
        }
      }
    });

    if (!vino) {
      throw createNotFoundError('Vino', req.params.id);
    }

    res.apiSingle(vino);
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/vini/nazione/:nazioneId - Vini per nazione
router.get('/nazione/:nazioneId', viniValidation.getByNation, handleValidationErrors, async (req, res, next) => {
  try {
    const vini = await prisma.vino.findMany({
      where: {
        nazioneId: req.params.nazioneId,
        deletedAt: null,
        inLista: true
      },
      include: {
        nazione: {
          select: {
            id: true,
            nome: true,
            sigla: true
          }
        },
        regione: {
          select: {
            id: true,
            nome: true
          }
        },
        zona: {
          select: {
            id: true,
            nome: true
          }
        },
        tipologia: {
          select: {
            id: true,
            nome: true,
            descrizione: true
          }
        }
      },
      orderBy: {
        nome: 'asc'
      }
    });

    const options = createPaginationOptions(
      parseInt(req.query.page as string) || 1,
      parseInt(req.query.limit as string) || 20,
      vini.length
    );
    
    options.filters = createFilterOptions({
      nazioneId: req.params.nazioneId
    }).filters;
    
    res.apiCollection(vini, options);
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/vini/tipologia/:tipologiaId - Vini per tipologia
router.get('/tipologia/:tipologiaId', viniValidation.getByType, handleValidationErrors, async (req, res, next) => {
  try {
    const vini = await prisma.vino.findMany({
      where: {
        tipologiaId: req.params.tipologiaId,
        deletedAt: null,
        inLista: true
      },
      include: {
        nazione: {
          select: {
            id: true,
            nome: true,
            sigla: true
          }
        },
        regione: {
          select: {
            id: true,
            nome: true
          }
        },
        zona: {
          select: {
            id: true,
            nome: true
          }
        },
        tipologia: {
          select: {
            id: true,
            nome: true,
            descrizione: true
          }
        }
      },
      orderBy: {
        nome: 'asc'
      }
    });

    const options = createPaginationOptions(
      parseInt(req.query.page as string) || 1,
      parseInt(req.query.limit as string) || 20,
      vini.length
    );
    
    options.filters = createFilterOptions({
      tipologiaId: req.params.tipologiaId
    }).filters;
    
    res.apiCollection(vini, options);
  } catch (error) {
    next(error);
  }
});

export default router;
