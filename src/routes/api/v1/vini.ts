import express, { Request, Response, NextFunction } from 'express';
import { prisma } from '../../../app';
import { handleValidationErrors } from '../../../middlewares/api/validation';
import { viniValidation } from '../../../middlewares/api/validationSchemas';
import { createNotFoundError } from '../../../middlewares/api/errorHandler';
import { createPaginationOptions, createFilterOptions, createSortingOptions } from '../../../middlewares/api/responseHandler';

const router = express.Router();

// GET /api/v1/vini - Lista tutti i vini
router.get('/', viniValidation.list, handleValidationErrors, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const where: any = { deletedAt: null };
    // Applica filtro inLista solo se all !== 'true'
    if (req.query.all !== 'true') {
      where.inLista = true;
    }

    const vini = await prisma.vino.findMany({
      where,
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

// GET /api/v1/vini/raggruppati-per-tipologia - Vini raggruppati per tipologia
router.get('/raggruppati-per-tipologia', viniValidation.list, handleValidationErrors, async (req: Request, res: Response): Promise<void> => {
  try {
    // Recupera tutte le tipologie di vini
    const tipologieVini = await prisma.tipologiaVino.findMany({
      where: {
        deletedAt: null
      },
      orderBy: {
        nome: 'asc'
      }
    });

    // Costruisci condizione WHERE per vini
    const buildVinoWhere = (tipologiaId: string) => {
      const where: any = { tipologiaId, deletedAt: null };
      if (req.query.all !== 'true') {
        where.inLista = true;
      }
      return where;
    };

    // Recupera tutti i vini raggruppati per tipologia
    const viniPerTipologia = await Promise.all(
      tipologieVini.map(async (tipologia) => {
        const vini = await prisma.vino.findMany({
          where: buildVinoWhere(tipologia.id),
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
            }
          },
          orderBy: {
            nome: 'asc'
          }
        });

        return {
          tipologia: {
            id: tipologia.id,
            nome: tipologia.nome,
            descrizione: tipologia.descrizione
          },
          vini: vini.map(vino => ({
            id: vino.id,
            nome: vino.nome,
            descrizione: vino.descrizione,
            cantina: vino.cantina,
            grado: vino.grado,
            certificazione: vino.certificazione,
            capacita: vino.capacita,
            anno: vino.anno,
            prezzoCalice: vino.prezzoCalice ? vino.prezzoCalice.toString() : null,
            prezzo: vino.prezzo.toString(),
            inLista: vino.inLista,
            nazione: vino.nazione ? {
              id: vino.nazione.id,
              nome: vino.nazione.nome,
              sigla: vino.nazione.sigla
            } : null,
            regione: vino.regione ? {
              id: vino.regione.id,
              nome: vino.regione.nome
            } : null,
            zona: vino.zona ? {
              id: vino.zona.id,
              nome: vino.zona.nome
            } : null
          }))
        };
      })
    );

    // Filtra le tipologie che hanno vini
    const tipologieConVini = viniPerTipologia.filter(item => item.vini.length > 0);

    res.json({
      success: true,
      data: tipologieConVini,
      meta: {
        count: tipologieConVini.length,
        totalVini: tipologieConVini.reduce((sum, item) => sum + item.vini.length, 0),
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Errore nel recupero dei vini raggruppati per tipologia:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Errore interno del server'
      }
    });
  }
});

// GET /api/v1/vini/:id - Dettagli di un vino specifico
router.get('/:id', viniValidation.getById, handleValidationErrors, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
router.get('/nazione/:nazioneId', viniValidation.getByNation, handleValidationErrors, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const where: any = {
      nazioneId: req.params.nazioneId,
      deletedAt: null
    };
    // Applica filtro inLista solo se all !== 'true'
    if (req.query.all !== 'true') {
      where.inLista = true;
    }

    const vini = await prisma.vino.findMany({
      where,
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
router.get('/tipologia/:tipologiaId', viniValidation.getByType, handleValidationErrors, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const where: any = {
      tipologiaId: req.params.tipologiaId,
      deletedAt: null
    };
    // Applica filtro inLista solo se all !== 'true'
    if (req.query.all !== 'true') {
      where.inLista = true;
    }

    const vini = await prisma.vino.findMany({
      where,
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
