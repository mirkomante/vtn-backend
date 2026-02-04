import express, { Request, Response } from 'express';
import { prisma } from '../../../app';
import { handleValidationErrors } from '../../../middlewares/api/validation';
import { nazioniValidation } from '../../../middlewares/api/validationSchemas';
import { createNotFoundError } from '../../../middlewares/api/errorHandler';

const router = express.Router();

// GET /api/v1/nazioni - Lista tutte le nazioni
router.get('/', nazioniValidation.list, handleValidationErrors, async (_req: Request, res: Response): Promise<void> => {
  try {
    const nazioni = await prisma.nazione.findMany({
      where: {
        deletedAt: null
      },
      orderBy: {
        nome: 'asc'
      }
    });

    res.json({
      success: true,
      data: nazioni.map(nazione => ({
        id: nazione.id,
        nome: nazione.nome,
        sigla: nazione.sigla,
        createdAt: nazione.createdAt,
        updatedAt: nazione.updatedAt
      })),
      meta: {
        count: nazioni.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Errore nel recupero delle nazioni:', error);
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

// GET /api/v1/nazioni/:id - Dettagli di una nazione specifica
router.get('/:id', nazioniValidation.getById, handleValidationErrors, async (req: Request, res: Response): Promise<void> => {
  try {
    const nazione = await prisma.nazione.findFirst({
      where: {
        id: req.params.id,
        deletedAt: null
      }
    });

    if (!nazione) {
      throw createNotFoundError('Nazione', req.params.id);
    }

    res.json({
      success: true,
      data: {
        id: nazione.id,
        nome: nazione.nome,
        sigla: nazione.sigla,
        createdAt: nazione.createdAt,
        updatedAt: nazione.updatedAt
      },
      meta: {
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Errore nel recupero della nazione:', error);
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
