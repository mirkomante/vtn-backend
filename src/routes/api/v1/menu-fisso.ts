import express from 'express';
import { prisma } from '../../../app';
import { handleValidationErrors } from '../../../middlewares/api/validation';
import { menuFissoValidation } from '../../../middlewares/api/validationSchemas';
import { createNotFoundError } from '../../../middlewares/api/errorHandler';

const router = express.Router();

// GET /api/v1/menu-fisso - Lista tutti i menu fissi
router.get('/', menuFissoValidation.list, handleValidationErrors, async (_req, res) => {
  try {
    const menuFissi = await prisma.menuFisso.findMany({
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
        piatti: {
          include: {
            piatto: {
              select: {
                id: true,
                nome: true,
                descrizione: true,
                prezzo: true
              }
            }
          }
        },
        servizi: {
          include: {
            servizioAccessorio: {
              select: {
                id: true,
                nome: true,
                descrizione: true,
                prezzo: true
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
      data: menuFissi,
      meta: {
        count: menuFissi.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Errore nel recupero dei menu fissi:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Errore interno del server'
      }
    });
  }
});

// GET /api/v1/menu-fisso/:id - Dettagli di un menu fisso specifico
router.get('/:id', menuFissoValidation.getById, handleValidationErrors, async (req, res) => {
  try {
    const menuFisso = await prisma.menuFisso.findFirst({
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
        piatti: {
          include: {
            piatto: {
              select: {
                id: true,
                nome: true,
                descrizione: true,
                prezzo: true,
                categoria: {
                  select: {
                    id: true,
                    nome: true
                  }
                }
              }
            }
          }
        },
        servizi: {
          include: {
            servizioAccessorio: {
              select: {
                id: true,
                nome: true,
                descrizione: true,
                prezzo: true
              }
            }
          }
        }
      }
    });

    if (!menuFisso) {
      throw createNotFoundError('Menu fisso', req.params.id);
    }

    res.json({
      success: true,
      data: menuFisso,
      meta: {
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Errore nel recupero del menu fisso:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Errore interno del server'
      }
    });
  }
});

// GET /api/v1/menu-fisso/categoria/:categoriaId - Menu fissi per categoria
router.get('/categoria/:categoriaId', menuFissoValidation.getByCategory, handleValidationErrors, async (req, res) => {
  try {
    const menuFissi = await prisma.menuFisso.findMany({
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
        piatti: {
          include: {
            piatto: {
              select: {
                id: true,
                nome: true,
                descrizione: true,
                prezzo: true
              }
            }
          }
        },
        servizi: {
          include: {
            servizioAccessorio: {
              select: {
                id: true,
                nome: true,
                descrizione: true,
                prezzo: true
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
      data: menuFissi,
      meta: {
        count: menuFissi.length,
        categoriaId: req.params.categoriaId,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Errore nel recupero dei menu fissi per categoria:', error);
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
