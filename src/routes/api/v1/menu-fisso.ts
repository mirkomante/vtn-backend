import express, { Request, Response } from 'express';
import { prisma } from '../../../app';
import { handleValidationErrors } from '../../../middlewares/api/validation';
import { menuFissoValidation } from '../../../middlewares/api/validationSchemas';
import { createNotFoundError } from '../../../middlewares/api/errorHandler';

const router = express.Router();

// GET /api/v1/menu-fisso - Lista tutti i menu fissi
router.get('/', menuFissoValidation.list, handleValidationErrors, async (_req: Request, res: Response) => {
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
router.get('/:id', menuFissoValidation.getById, handleValidationErrors, async (req: Request, res: Response) => {
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
router.get('/categoria/:categoriaId', menuFissoValidation.getByCategory, handleValidationErrors, async (req: Request, res: Response) => {
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

// GET /api/v1/menu-fisso/categoria/:categoriaId/dettagli - Menu fissi per categoria con allergeni
router.get('/categoria/:categoriaId/dettagli', menuFissoValidation.getByCategory, handleValidationErrors, async (req: Request, res: Response) => {
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
                prezzo: true,
                glutenFree: true,
                noLatticini: true,
                vegan: true,
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

    // Trasformazione dei dati per includere allergeni unici
    const menuFissiTrasformati = menuFissi.map(menuFisso => {
      // Raccogli tutti gli allergeni unici dai piatti del menu
      const allergeniUnici = new Map();
      
      menuFisso.piatti.forEach(menuPiatto => {
        menuPiatto.piatto.allergeni.forEach(piattoAllergene => {
          const allergene = piattoAllergene.allergene;
          if (!allergeniUnici.has(allergene.id)) {
            allergeniUnici.set(allergene.id, {
              id: allergene.id,
              nome: allergene.nome,
              descrizione: allergene.descrizione
            });
          }
        });
      });

      return {
        id: menuFisso.id,
        nome: menuFisso.nome,
        descrizione: menuFisso.descrizione,
        prezzo: menuFisso.prezzo,
        categoria: menuFisso.categoria,
        piatti: menuFisso.piatti.map(menuPiatto => ({
          id: menuPiatto.piatto.id,
          nome: menuPiatto.piatto.nome,
          descrizione: menuPiatto.piatto.descrizione,
          prezzo: menuPiatto.piatto.prezzo,
          glutenFree: menuPiatto.piatto.glutenFree,
          noLatticini: menuPiatto.piatto.noLatticini,
          vegan: menuPiatto.piatto.vegan
        })),
        allergeni: Array.from(allergeniUnici.values()),
        servizi: menuFisso.servizi.map(menuServizio => ({
          id: menuServizio.servizioAccessorio.id,
          nome: menuServizio.servizioAccessorio.nome,
          descrizione: menuServizio.servizioAccessorio.descrizione,
          prezzo: menuServizio.servizioAccessorio.prezzo
        }))
      };
    });

    res.json({
      success: true,
      data: menuFissiTrasformati,
      meta: {
        count: menuFissiTrasformati.length,
        categoriaId: req.params.categoriaId,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Errore nel recupero dei menu fissi dettagliati per categoria:', error);
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
