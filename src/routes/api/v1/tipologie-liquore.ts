import express, { Request, Response } from 'express';
import { prisma } from '../../../app';
import { handleValidationErrors } from '../../../middlewares/api/validation';
import { tipologieLiquoreValidation } from '../../../middlewares/api/validationSchemas';
import { createNotFoundError } from '../../../middlewares/api/errorHandler';

const router = express.Router();

// GET /api/v1/tipologie-liquore - Lista tutte le tipologie liquore
router.get('/', tipologieLiquoreValidation.list, handleValidationErrors, async (_req: Request, res: Response): Promise<void> => {
  try {
    const tipologie = await prisma.tipologiaLiquore.findMany({
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
    console.error('Errore nel recupero delle tipologie liquore:', error);
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

// GET /api/v1/tipologie-liquore/:id - Dettagli di una tipologia liquore specifica
router.get('/:id', tipologieLiquoreValidation.getById, handleValidationErrors, async (req: Request, res: Response): Promise<void> => {
  try {
    const tipologia = await prisma.tipologiaLiquore.findFirst({
      where: {
        id: req.params.id,
        deletedAt: null
      }
    });

    if (!tipologia) {
      throw createNotFoundError('Tipologia Liquore', req.params.id);
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
    console.error('Errore nel recupero della tipologia liquore:', error);
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
