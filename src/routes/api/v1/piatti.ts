import express, { Request, Response } from 'express';
import { prisma } from '../../../app';
import { handleValidationErrors } from '../../../middlewares/api/validation';
import { piattiValidation } from '../../../middlewares/api/validationSchemas';
import { createNotFoundError } from '../../../middlewares/api/errorHandler';

const router = express.Router();

// GET /api/v1/piatti - Lista tutti i piatti
router.get('/', piattiValidation.list, handleValidationErrors, async (req: Request, res: Response) => {
  try {
    // Costruisci la condizione WHERE basata sui filtri di query
    const where: any = {
      deletedAt: null,
      inLista: true,
      soloMenuFissi: false
    };

    // Filtro per categoria
    if (req.query.categoriaId) {
      where.categoriaId = req.query.categoriaId;
    }

    // Filtro per allergene
    if (req.query.allergeneId) {
      where.allergeni = {
        some: {
          allergeneId: req.query.allergeneId
        }
      };
    }

    // Nota: soloMenuFissi è sempre false per escludere i piatti solo per menu fissi

    const piatti = await prisma.piatto.findMany({
      where,
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
router.get('/:id', piattiValidation.getById, handleValidationErrors, async (req: Request, res: Response) => {
  try {
    const piatto = await prisma.piatto.findFirst({
      where: {
        id: req.params.id,
        deletedAt: null,
        soloMenuFissi: false
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
router.get('/categoria/:categoriaId', piattiValidation.getByCategory, handleValidationErrors, async (req: Request, res: Response) => {
  try {
    const piatti = await prisma.piatto.findMany({
      where: {
        categoriaId: req.params.categoriaId,
        deletedAt: null,
        inLista: true,
        soloMenuFissi: false
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
router.get('/allergene/:allergeneId', piattiValidation.getByAllergen, handleValidationErrors, async (req: Request, res: Response) => {
  try {
    const piatti = await prisma.piatto.findMany({
      where: {
        deletedAt: null,
        inLista: true,
        soloMenuFissi: false,
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

// GET /api/v1/piatti/categorie - Piatti raggruppati per categorie
router.get('/categorie', piattiValidation.list, handleValidationErrors, async (req: Request, res: Response) => {
  try {
    // Recupera tutte le categorie attive nell'ordine di creazione
    const categorie = await prisma.categoriaPiatti.findMany({
      where: {
        deletedAt: null,
        inLista: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Recupera tutti i piatti attivi con le loro relazioni
    const piatti = await prisma.piatto.findMany({
      where: {
        deletedAt: null,
        inLista: true,
        soloMenuFissi: false
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

    // Raggruppa i piatti per categoria nell'ordine delle categorie
    const categorieConPiatti = categorie.map(categoria => {
      const piattiCategoria = piatti
        .filter(piatto => piatto.categoriaId === categoria.id)
        .map(piatto => ({
          id: piatto.id,
          nome: piatto.nome,
          descrizione: piatto.descrizione,
          prezzo: piatto.prezzo,
          allergeni: piatto.allergeni.map(piattoAllergene => ({
            id: piattoAllergene.allergene.id,
            nome: piattoAllergene.allergene.nome,
            descrizione: piattoAllergene.allergene.descrizione
          }))
        }));

      return {
        id: categoria.id,
        nome: categoria.nome,
        descrizione: categoria.descrizione,
        piatti: piattiCategoria
      };
    });

    // Filtra solo le categorie che hanno piatti
    const categorieConPiattiFiltrate = categorieConPiatti.filter(categoria => categoria.piatti.length > 0);

    res.json({
      success: true,
      data: categorieConPiattiFiltrate,
      meta: {
        count: categorieConPiattiFiltrate.length,
        totalPiatti: piatti.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Errore nel recupero dei piatti raggruppati per categorie:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Errore interno del server'
      }
    });
  }
});

// GET /api/v1/piatti/categorie/ordine - Piatti raggruppati per categorie con ordine personalizzato
router.get('/categorie/ordine', piattiValidation.list, handleValidationErrors, async (req: Request, res: Response) => {
  try {
    // Recupera gli ID delle categorie dall'query parameter
    const categoriaIds = req.query.categorie as string;
    
    if (!categoriaIds) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_PARAMETER',
          message: 'Parametro "categorie" richiesto. Formato: ?categorie=id1,id2,id3'
        }
      });
    }

    const categoriaIdsArray = categoriaIds.split(',').map(id => id.trim());

    // Recupera le categorie nell'ordine specificato
    const categorie = await prisma.categoriaPiatti.findMany({
      where: {
        id: {
          in: categoriaIdsArray
        },
        deletedAt: null,
        inLista: true
      }
    });

    // Ordina le categorie secondo l'ordine richiesto
    const categorieOrdinate = categoriaIdsArray
      .map(id => categorie.find(cat => cat.id === id))
      .filter(Boolean);

    // Recupera tutti i piatti delle categorie specificate
    const piatti = await prisma.piatto.findMany({
      where: {
        categoriaId: {
          in: categoriaIdsArray
        },
        deletedAt: null,
        inLista: true,
        soloMenuFissi: false
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

    // Raggruppa i piatti per categoria nell'ordine specificato
    const categorieConPiatti = categorieOrdinate.map(categoria => {
      const piattiCategoria = piatti
        .filter(piatto => piatto.categoriaId === categoria.id)
        .map(piatto => ({
          id: piatto.id,
          nome: piatto.nome,
          descrizione: piatto.descrizione,
          prezzo: piatto.prezzo,
          allergeni: piatto.allergeni.map(piattoAllergene => ({
            id: piattoAllergene.allergene.id,
            nome: piattoAllergene.allergene.nome,
            descrizione: piattoAllergene.allergene.descrizione
          }))
        }));

      return {
        id: categoria.id,
        nome: categoria.nome,
        descrizione: categoria.descrizione,
        piatti: piattiCategoria
      };
    });

    res.json({
      success: true,
      data: categorieConPiatti,
      meta: {
        count: categorieConPiatti.length,
        totalPiatti: piatti.length,
        ordineRichiesto: categoriaIdsArray,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Errore nel recupero dei piatti raggruppati per categorie con ordine:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Errore interno del server'
      }
    });
  }
});

// GET /api/v1/piatti/categorie/filtro - Piatti raggruppati per categorie con filtri avanzati
router.get('/categorie/filtro', piattiValidation.list, handleValidationErrors, async (req: Request, res: Response) => {
  try {
    const { escludi, includi, ordine } = req.query;
    
    // Costruisci la condizione WHERE per le categorie
    let categoriaWhere: any = {
      deletedAt: null,
      inLista: true
    };

    // Se specificato "escludi", escludi quelle categorie
    if (escludi) {
      const categorieDaEscludere = (escludi as string).split(',').map(id => id.trim());
      categoriaWhere.id = {
        notIn: categorieDaEscludere
      };
    }
    
    // Se specificato "includi", includi solo quelle categorie
    if (includi) {
      const categorieDaIncludere = (includi as string).split(',').map(id => id.trim());
      categoriaWhere.id = {
        in: categorieDaIncludere
      };
    }

    // Determina l'ordine di ordinamento
    let orderBy: any = { createdAt: 'asc' }; // default
    if (ordine === 'nome') {
      orderBy = { nome: 'asc' };
    } else if (ordine === 'nome_desc') {
      orderBy = { nome: 'desc' };
    } else if (ordine === 'creazione_desc') {
      orderBy = { createdAt: 'desc' };
    }

    // Recupera le categorie con i filtri applicati
    const categorie = await prisma.categoriaPiatti.findMany({
      where: categoriaWhere,
      orderBy
    });

    // Se è specificato un ordine personalizzato, riordina le categorie
    let categorieOrdinate = categorie;
    if (ordine && ordine !== 'nome' && ordine !== 'nome_desc' && ordine !== 'creazione_desc') {
      const ordinePersonalizzato = (ordine as string).split(',').map(id => id.trim());
      categorieOrdinate = ordinePersonalizzato
        .map(id => categorie.find(cat => cat.id === id))
        .filter(Boolean);
    }

    // Recupera tutti i piatti delle categorie filtrate
    const categoriaIds = categorieOrdinate.map(cat => cat.id);
    const piatti = await prisma.piatto.findMany({
      where: {
        categoriaId: {
          in: categoriaIds
        },
        deletedAt: null,
        inLista: true,
        soloMenuFissi: false
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

    // Raggruppa i piatti per categoria nell'ordine specificato
    const categorieConPiatti = categorieOrdinate.map(categoria => {
      const piattiCategoria = piatti
        .filter(piatto => piatto.categoriaId === categoria.id)
        .map(piatto => ({
          id: piatto.id,
          nome: piatto.nome,
          descrizione: piatto.descrizione,
          prezzo: piatto.prezzo,
          allergeni: piatto.allergeni.map(piattoAllergene => ({
            id: piattoAllergene.allergene.id,
            nome: piattoAllergene.allergene.nome,
            descrizione: piattoAllergene.allergene.descrizione
          }))
        }));

      return {
        id: categoria.id,
        nome: categoria.nome,
        descrizione: categoria.descrizione,
        piatti: piattiCategoria
      };
    });

    // Filtra solo le categorie che hanno piatti
    const categorieConPiattiFiltrate = categorieConPiatti.filter(categoria => categoria.piatti.length > 0);

    res.json({
      success: true,
      data: categorieConPiattiFiltrate,
      meta: {
        count: categorieConPiattiFiltrate.length,
        totalPiatti: piatti.length,
        filtri: {
          escludi: escludi ? (escludi as string).split(',') : null,
          includi: includi ? (includi as string).split(',') : null,
          ordine: ordine || 'creazione'
        },
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Errore nel recupero dei piatti raggruppati per categorie con filtri:', error);
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
