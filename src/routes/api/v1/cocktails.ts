import express from 'express';
import { prisma } from '../../../app';
import { handleValidationErrors } from '../../../middlewares/api/validation';
import { cocktailsValidation } from '../../../middlewares/api/validationSchemas';
import { createNotFoundError } from '../../../middlewares/api/errorHandler';

const router = express.Router();

// GET /api/v1/cocktails - Lista tutti i cocktails
router.get('/', cocktailsValidation.list, handleValidationErrors, async (_req, res) => {
  try {
    const cocktails = await prisma.cocktail.findMany({
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
      data: cocktails.map(cocktail => ({
        id: cocktail.id,
        nome: cocktail.nome,
        descrizione: cocktail.descrizione,
        prezzo: cocktail.prezzo.toString(),
        inLista: cocktail.inLista,
        nazione: cocktail.nazione ? {
          id: cocktail.nazione.id,
          nome: cocktail.nazione.nome,
          sigla: cocktail.nazione.sigla
        } : null,
        tipologia: cocktail.tipologia ? {
          id: cocktail.tipologia.id,
          nome: cocktail.tipologia.nome,
          descrizione: cocktail.tipologia.descrizione
        } : null
      })),
      meta: {
        count: cocktails.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Errore nel recupero dei cocktails:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Errore interno del server'
      }
    });
  }
});

// GET /api/v1/cocktails/raggruppati-per-tipologia - Cocktails raggruppati per tipologia
router.get('/raggruppati-per-tipologia', cocktailsValidation.list, handleValidationErrors, async (_req, res) => {
  try {
    // Recupera tutte le tipologie di cocktails
    const tipologieCocktails = await prisma.tipologiaCocktail.findMany({
      where: {
        deletedAt: null
      },
      orderBy: {
        nome: 'asc'
      }
    });

    // Recupera tutti i cocktails raggruppati per tipologia
    const cocktailsPerTipologia = await Promise.all(
      tipologieCocktails.map(async (tipologia) => {
        const cocktails = await prisma.cocktail.findMany({
          where: {
            tipologiaId: tipologia.id,
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
          cocktails: cocktails.map(cocktail => ({
            id: cocktail.id,
            nome: cocktail.nome,
            descrizione: cocktail.descrizione,
            prezzo: cocktail.prezzo.toString(),
            nazione: cocktail.nazione ? {
              id: cocktail.nazione.id,
              nome: cocktail.nazione.nome,
              sigla: cocktail.nazione.sigla
            } : null
          }))
        };
      })
    );

    // Filtra le tipologie che hanno cocktails
    const tipologieConCocktails = cocktailsPerTipologia.filter(item => item.cocktails.length > 0);

    res.json({
      success: true,
      data: tipologieConCocktails,
      meta: {
        count: tipologieConCocktails.length,
        totalCocktails: tipologieConCocktails.reduce((sum, item) => sum + item.cocktails.length, 0),
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Errore nel recupero dei cocktails raggruppati per tipologia:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Errore interno del server'
      }
    });
  }
});

// GET /api/v1/cocktails/:id - Dettagli di un cocktail specifico
router.get('/:id', cocktailsValidation.getById, handleValidationErrors, async (req, res) => {
  try {
    const cocktail = await prisma.cocktail.findFirst({
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

    if (!cocktail) {
      throw createNotFoundError('Cocktail', req.params.id);
    }

    res.json({
      success: true,
      data: {
        id: cocktail.id,
        nome: cocktail.nome,
        descrizione: cocktail.descrizione,
        prezzo: cocktail.prezzo.toString(),
        inLista: cocktail.inLista,
        nazione: cocktail.nazione ? {
          id: cocktail.nazione.id,
          nome: cocktail.nazione.nome,
          sigla: cocktail.nazione.sigla
        } : null,
        tipologia: cocktail.tipologia ? {
          id: cocktail.tipologia.id,
          nome: cocktail.tipologia.nome,
          descrizione: cocktail.tipologia.descrizione
        } : null
      },
      meta: {
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Errore nel recupero del cocktail:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Errore interno del server'
      }
    });
  }
});

// GET /api/v1/cocktails/nazione/:nazioneId - Cocktails per nazione
router.get('/nazione/:nazioneId', cocktailsValidation.getByNation, handleValidationErrors, async (req, res) => {
  try {
    const cocktails = await prisma.cocktail.findMany({
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
      data: cocktails.map(cocktail => ({
        id: cocktail.id,
        nome: cocktail.nome,
        descrizione: cocktail.descrizione,
        prezzo: cocktail.prezzo.toString(),
        inLista: cocktail.inLista,
        nazione: cocktail.nazione ? {
          id: cocktail.nazione.id,
          nome: cocktail.nazione.nome,
          sigla: cocktail.nazione.sigla
        } : null,
        tipologia: cocktail.tipologia ? {
          id: cocktail.tipologia.id,
          nome: cocktail.tipologia.nome,
          descrizione: cocktail.tipologia.descrizione
        } : null
      })),
      meta: {
        count: cocktails.length,
        nazioneId: req.params.nazioneId,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Errore nel recupero dei cocktails per nazione:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Errore interno del server'
      }
    });
  }
});

// GET /api/v1/cocktails/tipologia/:tipologiaId - Cocktails per tipologia
router.get('/tipologia/:tipologiaId', cocktailsValidation.getByType, handleValidationErrors, async (req, res) => {
  try {
    const cocktails = await prisma.cocktail.findMany({
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
      data: cocktails.map(cocktail => ({
        id: cocktail.id,
        nome: cocktail.nome,
        descrizione: cocktail.descrizione,
        prezzo: cocktail.prezzo.toString(),
        inLista: cocktail.inLista,
        nazione: cocktail.nazione ? {
          id: cocktail.nazione.id,
          nome: cocktail.nazione.nome,
          sigla: cocktail.nazione.sigla
        } : null,
        tipologia: cocktail.tipologia ? {
          id: cocktail.tipologia.id,
          nome: cocktail.tipologia.nome,
          descrizione: cocktail.tipologia.descrizione
        } : null
      })),
      meta: {
        count: cocktails.length,
        tipologiaId: req.params.tipologiaId,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Errore nel recupero dei cocktails per tipologia:', error);
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
