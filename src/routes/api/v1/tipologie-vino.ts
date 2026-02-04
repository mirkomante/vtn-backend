import express, { Request, Response } from 'express';
import { prisma } from '../../../app';
import { handleValidationErrors } from '../../../middlewares/api/validation';
import { tipologieVinoValidation } from '../../../middlewares/api/validationSchemas';
import { createNotFoundError } from '../../../middlewares/api/errorHandler';

const router = express.Router();

// GET /api/v1/tipologie-vino - Lista tutte le tipologie vino
router.get('/', tipologieVinoValidation.list, handleValidationErrors, async (_req: Request, res: Response): Promise<void> => {
  try {
    const tipologie = await prisma.tipologiaVino.findMany({
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
    console.error('Errore nel recupero delle tipologie vino:', error);
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

// GET /api/v1/tipologie-vino/:id - Dettagli di una tipologia vino specifica
router.get('/:id', tipologieVinoValidation.getById, handleValidationErrors, async (req: Request, res: Response): Promise<void> => {
  try {
    const tipologia = await prisma.tipologiaVino.findFirst({
      where: {
        id: req.params.id,
        deletedAt: null
      }
    });

    if (!tipologia) {
      throw createNotFoundError('Tipologia Vino', req.params.id);
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
    console.error('Errore nel recupero della tipologia vino:', error);
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
