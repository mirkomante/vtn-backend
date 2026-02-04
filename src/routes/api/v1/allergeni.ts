import express, { Request, Response } from 'express';
import { prisma } from '../../../app';
import { handleValidationErrors } from '../../../middlewares/api/validation';
import { allergeniValidation } from '../../../middlewares/api/validationSchemas';
import { createNotFoundError } from '../../../middlewares/api/errorHandler';

const router = express.Router();

// GET /api/v1/allergeni - Lista tutti gli allergeni
router.get('/', allergeniValidation.list, handleValidationErrors, async (_req: Request, res: Response): Promise<void> => {
  try {
    const allergeni = await prisma.allergene.findMany({
      where: {
        deletedAt: null
      },
      orderBy: {
        nome: 'asc'
      }
    });

    res.json({
      success: true,
      data: allergeni.map(allergene => ({
        id: allergene.id,
        nome: allergene.nome,
        descrizione: allergene.descrizione,
        createdAt: allergene.createdAt,
        updatedAt: allergene.updatedAt
      })),
      meta: {
        count: allergeni.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Errore nel recupero degli allergeni:', error);
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

// GET /api/v1/allergeni/:id - Dettagli di un allergene specifico
router.get('/:id', allergeniValidation.getById, handleValidationErrors, async (req: Request, res: Response): Promise<void> => {
  try {
    const allergene = await prisma.allergene.findFirst({
      where: {
        id: req.params.id,
        deletedAt: null
      }
    });

    if (!allergene) {
      throw createNotFoundError('Allergene', req.params.id);
    }

    res.json({
      success: true,
      data: {
        id: allergene.id,
        nome: allergene.nome,
        descrizione: allergene.descrizione,
        createdAt: allergene.createdAt,
        updatedAt: allergene.updatedAt
      },
      meta: {
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Errore nel recupero dell\'allergene:', error);
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
