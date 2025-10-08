import express from 'express';
import { prisma } from '../../../app';
import { handleValidationErrors } from '../../../middlewares/api/validation';
import { liquoriValidation } from '../../../middlewares/api/validationSchemas';
import { createNotFoundError } from '../../../middlewares/api/errorHandler';

const router = express.Router();

// GET /api/v1/liquori - Lista tutti i liquori
router.get('/', liquoriValidation.list, handleValidationErrors, async (_req, res) => {
  try {
    const liquori = await prisma.liquore.findMany({
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

    res.json({
      success: true,
      data: liquori,
      meta: {
        count: liquori.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Errore nel recupero dei liquori:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Errore interno del server'
      }
    });
  }
});

// GET /api/v1/liquori/:id - Dettagli di un liquore specifico
router.get('/:id', liquoriValidation.getById, handleValidationErrors, async (req, res) => {
  try {
    const liquore = await prisma.liquore.findFirst({
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
        tipologia: {
          select: {
            id: true,
            nome: true,
            descrizione: true
          }
        }
      }
    });

    if (!liquore) {
      throw createNotFoundError('Liquore', req.params.id);
    }

    res.json({
      success: true,
      data: liquore,
      meta: {
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Errore nel recupero del liquore:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Errore interno del server'
      }
    });
  }
});

// GET /api/v1/liquori/nazione/:nazioneId - Liquori per nazione
router.get('/nazione/:nazioneId', liquoriValidation.getByNation, handleValidationErrors, async (req, res) => {
  try {
    const liquori = await prisma.liquore.findMany({
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

    res.json({
      success: true,
      data: liquori,
      meta: {
        count: liquori.length,
        nazioneId: req.params.nazioneId,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Errore nel recupero dei liquori per nazione:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Errore interno del server'
      }
    });
  }
});

// GET /api/v1/liquori/tipologia/:tipologiaId - Liquori per tipologia
router.get('/tipologia/:tipologiaId', liquoriValidation.getByType, handleValidationErrors, async (req, res) => {
  try {
    const liquori = await prisma.liquore.findMany({
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

    res.json({
      success: true,
      data: liquori,
      meta: {
        count: liquori.length,
        tipologiaId: req.params.tipologiaId,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Errore nel recupero dei liquori per tipologia:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Errore interno del server'
      }
    });
  }
});

export default router;
