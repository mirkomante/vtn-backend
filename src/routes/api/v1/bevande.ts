import express, { Request, Response } from 'express';
import { prisma } from '../../../app';
import { handleValidationErrors } from '../../../middlewares/api/validation';
import { bevandeValidation } from '../../../middlewares/api/validationSchemas';
import { createNotFoundError } from '../../../middlewares/api/errorHandler';

const router = express.Router();

// GET /api/v1/bevande - Lista tutte le bevande
router.get('/', bevandeValidation.list, handleValidationErrors, async (_req: Request, res: Response) => {
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
      data: bevande.map(bevanda => ({
        id: bevanda.id,
        nome: bevanda.nome,
        descrizione: bevanda.descrizione,
        prezzo: bevanda.prezzo.toString(),
        inLista: bevanda.inLista,
        nazione: bevanda.nazione ? {
          id: bevanda.nazione.id,
          nome: bevanda.nazione.nome,
          sigla: bevanda.nazione.sigla
        } : null,
        tipologia: bevanda.tipologia ? {
          id: bevanda.tipologia.id,
          nome: bevanda.tipologia.nome,
          descrizione: bevanda.tipologia.descrizione
        } : null
      })),
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

// GET /api/v1/bevande/raggruppate-per-tipologia - Bevande raggruppate per tipologia
router.get('/raggruppate-per-tipologia', bevandeValidation.list, handleValidationErrors, async (_req: Request, res: Response) => {
  try {
    // Recupera tutte le tipologie di bevande analcoliche
    const tipologieBevande = await prisma.tipologiaBevanda.findMany({
      where: {
        deletedAt: null
      },
      orderBy: {
        nome: 'asc'
      }
    });

    // Recupera tutte le bevande raggruppate per tipologia
    const bevandePerTipologia = await Promise.all(
      tipologieBevande.map(async (tipologia) => {
        const bevande = await prisma.bevanda.findMany({
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
          bevande: bevande.map(bevanda => ({
            id: bevanda.id,
            nome: bevanda.nome,
            descrizione: bevanda.descrizione,
            prezzo: bevanda.prezzo.toString(),
            nazione: bevanda.nazione ? {
              id: bevanda.nazione.id,
              nome: bevanda.nazione.nome,
              sigla: bevanda.nazione.sigla
            } : null
          }))
        };
      })
    );

    // Filtra le tipologie che hanno bevande
    const tipologieConBevande = bevandePerTipologia.filter(item => item.bevande.length > 0);

    res.json({
      success: true,
      data: tipologieConBevande,
      meta: {
        count: tipologieConBevande.length,
        totalBevande: tipologieConBevande.reduce((sum, item) => sum + item.bevande.length, 0),
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Errore nel recupero delle bevande raggruppate per tipologia:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Errore interno del server'
      }
    });
  }
});

// GET /api/v1/bevande/:id - Dettagli di una bevanda specifica
router.get('/:id', bevandeValidation.getById, handleValidationErrors, async (req: Request, res: Response) => {
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
      data: {
        id: bevanda.id,
        nome: bevanda.nome,
        descrizione: bevanda.descrizione,
        prezzo: bevanda.prezzo.toString(),
        inLista: bevanda.inLista,
        nazione: bevanda.nazione ? {
          id: bevanda.nazione.id,
          nome: bevanda.nazione.nome,
          sigla: bevanda.nazione.sigla
        } : null,
        tipologia: bevanda.tipologia ? {
          id: bevanda.tipologia.id,
          nome: bevanda.tipologia.nome,
          descrizione: bevanda.tipologia.descrizione
        } : null
      },
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
router.get('/nazione/:nazioneId', bevandeValidation.getByNation, handleValidationErrors, async (req: Request, res: Response) => {
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
      data: bevande.map(bevanda => ({
        id: bevanda.id,
        nome: bevanda.nome,
        descrizione: bevanda.descrizione,
        prezzo: bevanda.prezzo.toString(),
        inLista: bevanda.inLista,
        nazione: bevanda.nazione ? {
          id: bevanda.nazione.id,
          nome: bevanda.nazione.nome,
          sigla: bevanda.nazione.sigla
        } : null,
        tipologia: bevanda.tipologia ? {
          id: bevanda.tipologia.id,
          nome: bevanda.tipologia.nome,
          descrizione: bevanda.tipologia.descrizione
        } : null
      })),
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
router.get('/tipologia/:tipologiaId', bevandeValidation.getByType, handleValidationErrors, async (req: Request, res: Response) => {
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
      data: bevande.map(bevanda => ({
        id: bevanda.id,
        nome: bevanda.nome,
        descrizione: bevanda.descrizione,
        prezzo: bevanda.prezzo.toString(),
        inLista: bevanda.inLista,
        nazione: bevanda.nazione ? {
          id: bevanda.nazione.id,
          nome: bevanda.nazione.nome,
          sigla: bevanda.nazione.sigla
        } : null,
        tipologia: bevanda.tipologia ? {
          id: bevanda.tipologia.id,
          nome: bevanda.tipologia.nome,
          descrizione: bevanda.tipologia.descrizione
        } : null
      })),
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
