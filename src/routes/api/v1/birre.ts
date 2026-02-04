import express, { Request, Response } from 'express';
import { prisma } from '../../../app';
import { handleValidationErrors } from '../../../middlewares/api/validation';
import { birreValidation } from '../../../middlewares/api/validationSchemas';
import { createNotFoundError } from '../../../middlewares/api/errorHandler';

const router = express.Router();

// GET /api/v1/birre - Lista tutte le birre
router.get('/', birreValidation.list, handleValidationErrors, async (req: Request, res: Response): Promise<void> => {
  try {
    const where: any = { deletedAt: null };
    // Applica filtro inLista solo se all !== 'true'
    if (req.query.all !== 'true') {
      where.inLista = true;
    }

    const birre = await prisma.birra.findMany({
      where,
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
      data: birre.map(birra => ({
        id: birra.id,
        nome: birra.nome,
        descrizione: birra.descrizione,
        grado: birra.grado,
        capacita: birra.capacita,
        prezzo: birra.prezzo.toString(),
        inLista: birra.inLista,
        nazione: birra.nazione ? {
          id: birra.nazione.id,
          nome: birra.nazione.nome,
          sigla: birra.nazione.sigla
        } : null,
        tipologia: birra.tipologia ? {
          id: birra.tipologia.id,
          nome: birra.tipologia.nome,
          descrizione: birra.tipologia.descrizione
        } : null
      })),
      meta: {
        count: birre.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Errore nel recupero delle birre:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Errore interno del server'
      }
    });
    return;
  }
});

// GET /api/v1/birre/raggruppati-per-tipologia - Birre raggruppate per tipologia
router.get('/raggruppati-per-tipologia', birreValidation.list, handleValidationErrors, async (req: Request, res: Response): Promise<void> => {
  try {
    // Recupera tutte le tipologie di birre
    const tipologieBirre = await prisma.tipologiaBirra.findMany({
      where: {
        deletedAt: null
      },
      orderBy: {
        nome: 'asc'
      }
    });

    // Costruisci condizione WHERE per birre
    const buildBirraWhere = (tipologiaId: string) => {
      const where: any = { tipologiaId, deletedAt: null };
      if (req.query.all !== 'true') {
        where.inLista = true;
      }
      return where;
    };

    // Recupera tutte le birre raggruppate per tipologia
    const birrePerTipologia = await Promise.all(
      tipologieBirre.map(async (tipologia) => {
        const birre = await prisma.birra.findMany({
          where: buildBirraWhere(tipologia.id),
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
          birre: birre.map(birra => ({
            id: birra.id,
            nome: birra.nome,
            descrizione: birra.descrizione,
            grado: birra.grado,
            capacita: birra.capacita,
            prezzo: birra.prezzo.toString(),
            inLista: birra.inLista,
            nazione: birra.nazione ? {
              id: birra.nazione.id,
              nome: birra.nazione.nome,
              sigla: birra.nazione.sigla
            } : null
          }))
        };
      })
    );

    // Filtra le tipologie che hanno birre
    const tipologieConBirre = birrePerTipologia.filter(item => item.birre.length > 0);

    res.json({
      success: true,
      data: tipologieConBirre,
      meta: {
        count: tipologieConBirre.length,
        totalBirre: tipologieConBirre.reduce((sum, item) => sum + item.birre.length, 0),
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Errore nel recupero delle birre raggruppate per tipologia:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Errore interno del server'
      }
    });
  }
});

// GET /api/v1/birre/:id - Dettagli di una birra specifica
router.get('/:id', birreValidation.getById, handleValidationErrors, async (req: Request, res: Response): Promise<void> => {
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
      data: {
        id: birra.id,
        nome: birra.nome,
        descrizione: birra.descrizione,
        grado: birra.grado,
        capacita: birra.capacita,
        prezzo: birra.prezzo.toString(),
        inLista: birra.inLista,
        nazione: birra.nazione ? {
          id: birra.nazione.id,
          nome: birra.nazione.nome,
          sigla: birra.nazione.sigla
        } : null,
        tipologia: birra.tipologia ? {
          id: birra.tipologia.id,
          nome: birra.tipologia.nome,
          descrizione: birra.tipologia.descrizione
        } : null
      },
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
router.get('/nazione/:nazioneId', birreValidation.getByNation, handleValidationErrors, async (req: Request, res: Response): Promise<void> => {
  try {
    const where: any = {
      nazioneId: req.params.nazioneId,
      deletedAt: null
    };
    // Applica filtro inLista solo se all !== 'true'
    if (req.query.all !== 'true') {
      where.inLista = true;
    }

    const birre = await prisma.birra.findMany({
      where,
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
      data: birre.map(birra => ({
        id: birra.id,
        nome: birra.nome,
        descrizione: birra.descrizione,
        grado: birra.grado,
        capacita: birra.capacita,
        prezzo: birra.prezzo.toString(),
        inLista: birra.inLista,
        nazione: birra.nazione ? {
          id: birra.nazione.id,
          nome: birra.nazione.nome,
          sigla: birra.nazione.sigla
        } : null,
        tipologia: birra.tipologia ? {
          id: birra.tipologia.id,
          nome: birra.tipologia.nome,
          descrizione: birra.tipologia.descrizione
        } : null
      })),
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
router.get('/tipologia/:tipologiaId', birreValidation.getByType, handleValidationErrors, async (req: Request, res: Response): Promise<void> => {
  try {
    const where: any = {
      tipologiaId: req.params.tipologiaId,
      deletedAt: null
    };
    // Applica filtro inLista solo se all !== 'true'
    if (req.query.all !== 'true') {
      where.inLista = true;
    }

    const birre = await prisma.birra.findMany({
      where,
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
      data: birre.map(birra => ({
        id: birra.id,
        nome: birra.nome,
        descrizione: birra.descrizione,
        grado: birra.grado,
        capacita: birra.capacita,
        prezzo: birra.prezzo.toString(),
        inLista: birra.inLista,
        nazione: birra.nazione ? {
          id: birra.nazione.id,
          nome: birra.nazione.nome,
          sigla: birra.nazione.sigla
        } : null,
        tipologia: birra.tipologia ? {
          id: birra.tipologia.id,
          nome: birra.tipologia.nome,
          descrizione: birra.tipologia.descrizione
        } : null
      })),
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
