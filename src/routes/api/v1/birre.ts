import express from 'express';
import { prisma } from '../../../app';
import { handleValidationErrors } from '../../../middlewares/api/validation';
import { birreValidation } from '../../../middlewares/api/validationSchemas';
import { createNotFoundError } from '../../../middlewares/api/errorHandler';

const router = express.Router();

// GET /api/v1/birre - Lista tutte le birre
router.get('/', birreValidation.list, handleValidationErrors, async (_req, res) => {
  try {
    const birre = await prisma.birra.findMany({
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
      data: birre,
      meta: {
        count: birre.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Errore nel recupero delle birre:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Errore interno del server'
      }
    });
  }
});

// GET /api/v1/birre/:id - Dettagli di una birra specifica
router.get('/:id', birreValidation.getById, handleValidationErrors, async (req, res) => {
  try {
    const birra = await prisma.birra.findFirst({
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

    if (!birra) {
      throw createNotFoundError('Birra', req.params.id);
    }

    res.json({
      success: true,
      data: birra,
      meta: {
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Errore nel recupero della birra:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Errore interno del server'
      }
    });
  }
});

// GET /api/v1/birre/nazione/:nazioneId - Birre per nazione
router.get('/nazione/:nazioneId', birreValidation.getByNation, handleValidationErrors, async (req, res) => {
  try {
    const birre = await prisma.birra.findMany({
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
      data: birre,
      meta: {
        count: birre.length,
        nazioneId: req.params.nazioneId,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Errore nel recupero delle birre per nazione:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Errore interno del server'
      }
    });
  }
});

// GET /api/v1/birre/tipologia/:tipologiaId - Birre per tipologia
router.get('/tipologia/:tipologiaId', birreValidation.getByType, handleValidationErrors, async (req, res) => {
  try {
    const birre = await prisma.birra.findMany({
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
      data: birre,
      meta: {
        count: birre.length,
        tipologiaId: req.params.tipologiaId,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Errore nel recupero delle birre per tipologia:', error);
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
