import express, { Request, Response } from 'express';
import { prisma } from '../../../app';
import { handleValidationErrors } from '../../../middlewares/api/validation';
import { tipologieBirraValidation } from '../../../middlewares/api/validationSchemas';
import { createNotFoundError } from '../../../middlewares/api/errorHandler';

const router = express.Router();

// GET /api/v1/tipologie-birra - Lista tutte le tipologie birra
router.get('/', tipologieBirraValidation.list, handleValidationErrors, async (_req: Request, res: Response): Promise<void> => {
  try {
    const tipologie = await prisma.tipologiaBirra.findMany({
      where: {
        deletedAt: null
      },
      orderBy: {
        nome: 'asc'
      }
    });

    res.json({
      success: true,
      data: tipologie.map(tipologia => ({
        id: tipologia.id,
        nome: tipologia.nome,
        descrizione: tipologia.descrizione,
        createdAt: tipologia.createdAt,
        updatedAt: tipologia.updatedAt
      })),
      meta: {
        count: tipologie.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Errore nel recupero delle tipologie birra:', error);
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

// GET /api/v1/tipologie-birra/:id - Dettagli di una tipologia birra specifica
router.get('/:id', tipologieBirraValidation.getById, handleValidationErrors, async (req: Request, res: Response): Promise<void> => {
  try {
    const tipologia = await prisma.tipologiaBirra.findFirst({
      where: {
        id: req.params.id,
        deletedAt: null
      }
    });

    if (!tipologia) {
      throw createNotFoundError('Tipologia Birra', req.params.id);
    }

    res.json({
      success: true,
      data: {
        id: tipologia.id,
        nome: tipologia.nome,
        descrizione: tipologia.descrizione,
        createdAt: tipologia.createdAt,
        updatedAt: tipologia.updatedAt
      },
      meta: {
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Errore nel recupero della tipologia birra:', error);
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
