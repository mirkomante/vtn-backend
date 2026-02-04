import express, { Request, Response } from 'express';
import { prisma } from '../../../app';
import { handleValidationErrors } from '../../../middlewares/api/validation';
import { regioniValidation } from '../../../middlewares/api/validationSchemas';
import { createNotFoundError } from '../../../middlewares/api/errorHandler';

const router = express.Router();

// GET /api/v1/regioni - Lista tutte le regioni
router.get('/', regioniValidation.list, handleValidationErrors, async (req: Request, res: Response): Promise<void> => {
  try {
    const where: any = { deletedAt: null };
    
    // Filtro per nazione
    if (req.query.nazioneId) {
      where.nazioneId = req.query.nazioneId;
    }

    const regioni = await prisma.regione.findMany({
      where,
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

    res.json({
      success: true,
      data: regioni.map(regione => ({
        id: regione.id,
        nome: regione.nome,
        nazioneId: regione.nazioneId,
        nazione: regione.nazione ? {
          id: regione.nazione.id,
          nome: regione.nazione.nome,
          sigla: regione.nazione.sigla
        } : null,
        createdAt: regione.createdAt,
        updatedAt: regione.updatedAt
      })),
      meta: {
        count: regioni.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Errore nel recupero delle regioni:', error);
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

// GET /api/v1/regioni/:id - Dettagli di una regione specifica
router.get('/:id', regioniValidation.getById, handleValidationErrors, async (req: Request, res: Response): Promise<void> => {
  try {
    const regione = await prisma.regione.findFirst({
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
        }
      }
    });

    if (!regione) {
      throw createNotFoundError('Regione', req.params.id);
    }

    res.json({
      success: true,
      data: {
        id: regione.id,
        nome: regione.nome,
        nazioneId: regione.nazioneId,
        nazione: regione.nazione ? {
          id: regione.nazione.id,
          nome: regione.nazione.nome,
          sigla: regione.nazione.sigla
        } : null,
        createdAt: regione.createdAt,
        updatedAt: regione.updatedAt
      },
      meta: {
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Errore nel recupero della regione:', error);
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
