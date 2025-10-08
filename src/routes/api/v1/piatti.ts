import express from 'express';
import { prisma } from '../../../app';
import { handleValidationErrors } from '../../../middlewares/api/validation';
import { piattiValidation } from '../../../middlewares/api/validationSchemas';
import { createNotFoundError } from '../../../middlewares/api/errorHandler';

const router = express.Router();

// GET /api/v1/piatti - Lista tutti i piatti
router.get('/', piattiValidation.list, handleValidationErrors, async (_req, res) => {
  try {
    const piatti = await prisma.piatto.findMany({
      where: {
        deletedAt: null,
        inLista: true
      },
      include: {
        categoria: {
          select: {
            id: true,
            nome: true,
            descrizione: true
          }
        },
        allergeni: {
          include: {
            allergene: {
              select: {
                id: true,
                nome: true,
                descrizione: true
              }
            }
          }
        }
      },
      orderBy: {
        nome: 'asc'
      }
    });

    res.json({
      success: true,
      data: piatti,
      meta: {
        count: piatti.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Errore nel recupero dei piatti:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Errore interno del server'
      }
    });
  }
});

// GET /api/v1/piatti/:id - Dettagli di un piatto specifico
router.get('/:id', piattiValidation.getById, handleValidationErrors, async (req, res) => {
  try {
    const piatto = await prisma.piatto.findFirst({
      where: {
        id: req.params.id,
        deletedAt: null
      },
      include: {
        categoria: {
          select: {
            id: true,
            nome: true,
            descrizione: true
          }
        },
        allergeni: {
          include: {
            allergene: {
              select: {
                id: true,
                nome: true,
                descrizione: true
              }
            }
          }
        }
      }
    });

    if (!piatto) {
      throw createNotFoundError('Piatto', req.params.id);
    }

    res.json({
      success: true,
      data: piatto,
      meta: {
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Errore nel recupero del piatto:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Errore interno del server'
      }
    });
  }
});

// GET /api/v1/piatti/categoria/:categoriaId - Piatti per categoria
router.get('/categoria/:categoriaId', piattiValidation.getByCategory, handleValidationErrors, async (req, res) => {
  try {
    const piatti = await prisma.piatto.findMany({
      where: {
        categoriaId: req.params.categoriaId,
        deletedAt: null,
        inLista: true
      },
      include: {
        categoria: {
          select: {
            id: true,
            nome: true,
            descrizione: true
          }
        },
        allergeni: {
          include: {
            allergene: {
              select: {
                id: true,
                nome: true,
                descrizione: true
              }
            }
          }
        }
      },
      orderBy: {
        nome: 'asc'
      }
    });

    res.json({
      success: true,
      data: piatti,
      meta: {
        count: piatti.length,
        categoriaId: req.params.categoriaId,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Errore nel recupero dei piatti per categoria:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Errore interno del server'
      }
    });
  }
});

// GET /api/v1/piatti/allergene/:allergeneId - Piatti per allergene
router.get('/allergene/:allergeneId', piattiValidation.getByAllergen, handleValidationErrors, async (req, res) => {
  try {
    const piatti = await prisma.piatto.findMany({
      where: {
        deletedAt: null,
        inLista: true,
        allergeni: {
          some: {
            allergeneId: req.params.allergeneId
          }
        }
      },
      include: {
        categoria: {
          select: {
            id: true,
            nome: true,
            descrizione: true
          }
        },
        allergeni: {
          include: {
            allergene: {
              select: {
                id: true,
                nome: true,
                descrizione: true
              }
            }
          }
        }
      },
      orderBy: {
        nome: 'asc'
      }
    });

    res.json({
      success: true,
      data: piatti,
      meta: {
        count: piatti.length,
        allergeneId: req.params.allergeneId,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Errore nel recupero dei piatti per allergene:', error);
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
