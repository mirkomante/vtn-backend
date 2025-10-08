import express from 'express';
import { prisma } from '../../../app';
import { handleValidationErrors } from '../../../middlewares/api/validation';
import { bevandeValidation } from '../../../middlewares/api/validationSchemas';
import { createNotFoundError } from '../../../middlewares/api/errorHandler';

const router = express.Router();

// GET /api/v1/bevande - Lista tutte le bevande
router.get('/', bevandeValidation.list, handleValidationErrors, async (_req, res) => {
  try {
    const bevande = await prisma.bevanda.findMany({
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
      data: bevande,
      meta: {
        count: bevande.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Errore nel recupero delle bevande:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Errore interno del server'
      }
    });
  }
});

// GET /api/v1/bevande/:id - Dettagli di una bevanda specifica
router.get('/:id', bevandeValidation.getById, handleValidationErrors, async (req, res) => {
  try {
    const bevanda = await prisma.bevanda.findFirst({
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

    if (!bevanda) {
      throw createNotFoundError('Bevanda', req.params.id);
    }

    res.json({
      success: true,
      data: bevanda,
      meta: {
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Errore nel recupero della bevanda:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Errore interno del server'
      }
    });
  }
});

// GET /api/v1/bevande/nazione/:nazioneId - Bevande per nazione
router.get('/nazione/:nazioneId', bevandeValidation.getByNation, handleValidationErrors, async (req, res) => {
  try {
    const bevande = await prisma.bevanda.findMany({
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
      data: bevande,
      meta: {
        count: bevande.length,
        nazioneId: req.params.nazioneId,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Errore nel recupero delle bevande per nazione:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Errore interno del server'
      }
    });
  }
});

// GET /api/v1/bevande/tipologia/:tipologiaId - Bevande per tipologia
router.get('/tipologia/:tipologiaId', bevandeValidation.getByType, handleValidationErrors, async (req, res) => {
  try {
    const bevande = await prisma.bevanda.findMany({
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
      data: bevande,
      meta: {
        count: bevande.length,
        tipologiaId: req.params.tipologiaId,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Errore nel recupero delle bevande per tipologia:', error);
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
