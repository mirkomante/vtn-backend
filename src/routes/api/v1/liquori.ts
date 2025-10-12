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
      data: liquori.map(liquore => ({
        id: liquore.id,
        nome: liquore.nome,
        descrizione: liquore.descrizione,
        grado: liquore.grado,
        invecchiamento: liquore.invecchiamento,
        capacita: liquore.capacita,
        prezzo: liquore.prezzo.toString(),
        inLista: liquore.inLista,
        nazione: liquore.nazione ? {
          id: liquore.nazione.id,
          nome: liquore.nazione.nome,
          sigla: liquore.nazione.sigla
        } : null,
        tipologia: liquore.tipologia ? {
          id: liquore.tipologia.id,
          nome: liquore.tipologia.nome,
          descrizione: liquore.tipologia.descrizione
        } : null
      })),
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

// GET /api/v1/liquori/raggruppati-per-tipologia - Liquori raggruppati per tipologia
router.get('/raggruppati-per-tipologia', liquoriValidation.list, handleValidationErrors, async (_req, res) => {
  try {
    // Recupera tutte le tipologie di liquori
    const tipologieLiquori = await prisma.tipologiaLiquore.findMany({
      where: {
        deletedAt: null
      },
      orderBy: {
        nome: 'asc'
      }
    });

    // Recupera tutti i liquori raggruppati per tipologia
    const liquoriPerTipologia = await Promise.all(
      tipologieLiquori.map(async (tipologia) => {
        const liquori = await prisma.liquore.findMany({
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
          liquori: liquori.map(liquore => ({
            id: liquore.id,
            nome: liquore.nome,
            descrizione: liquore.descrizione,
            grado: liquore.grado,
            invecchiamento: liquore.invecchiamento,
            capacita: liquore.capacita,
            prezzo: liquore.prezzo.toString(),
            inLista: liquore.inLista,
            nazione: liquore.nazione ? {
              id: liquore.nazione.id,
              nome: liquore.nazione.nome,
              sigla: liquore.nazione.sigla
            } : null
          }))
        };
      })
    );

    // Filtra le tipologie che hanno liquori
    const tipologieConLiquori = liquoriPerTipologia.filter(item => item.liquori.length > 0);

    res.json({
      success: true,
      data: tipologieConLiquori,
      meta: {
        count: tipologieConLiquori.length,
        totalLiquori: tipologieConLiquori.reduce((sum, item) => sum + item.liquori.length, 0),
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Errore nel recupero dei liquori raggruppati per tipologia:', error);
    res.status(500).json({
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
      data: {
        id: liquore.id,
        nome: liquore.nome,
        descrizione: liquore.descrizione,
        grado: liquore.grado,
        invecchiamento: liquore.invecchiamento,
        capacita: liquore.capacita,
        prezzo: liquore.prezzo.toString(),
        inLista: liquore.inLista,
        nazione: liquore.nazione ? {
          id: liquore.nazione.id,
          nome: liquore.nazione.nome,
          sigla: liquore.nazione.sigla
        } : null,
        tipologia: liquore.tipologia ? {
          id: liquore.tipologia.id,
          nome: liquore.tipologia.nome,
          descrizione: liquore.tipologia.descrizione
        } : null
      },
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
      data: liquori.map(liquore => ({
        id: liquore.id,
        nome: liquore.nome,
        descrizione: liquore.descrizione,
        grado: liquore.grado,
        invecchiamento: liquore.invecchiamento,
        capacita: liquore.capacita,
        prezzo: liquore.prezzo.toString(),
        inLista: liquore.inLista,
        nazione: liquore.nazione ? {
          id: liquore.nazione.id,
          nome: liquore.nazione.nome,
          sigla: liquore.nazione.sigla
        } : null,
        tipologia: liquore.tipologia ? {
          id: liquore.tipologia.id,
          nome: liquore.tipologia.nome,
          descrizione: liquore.tipologia.descrizione
        } : null
      })),
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
      data: liquori.map(liquore => ({
        id: liquore.id,
        nome: liquore.nome,
        descrizione: liquore.descrizione,
        grado: liquore.grado,
        invecchiamento: liquore.invecchiamento,
        capacita: liquore.capacita,
        prezzo: liquore.prezzo.toString(),
        inLista: liquore.inLista,
        nazione: liquore.nazione ? {
          id: liquore.nazione.id,
          nome: liquore.nazione.nome,
          sigla: liquore.nazione.sigla
        } : null,
        tipologia: liquore.tipologia ? {
          id: liquore.tipologia.id,
          nome: liquore.tipologia.nome,
          descrizione: liquore.tipologia.descrizione
        } : null
      })),
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
