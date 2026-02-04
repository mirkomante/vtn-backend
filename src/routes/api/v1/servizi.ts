import express, { Request, Response } from 'express';
import { prisma } from '../../../app';
import { handleValidationErrors } from '../../../middlewares/api/validation';
import { serviziValidation } from '../../../middlewares/api/validationSchemas';
import { createNotFoundError } from '../../../middlewares/api/errorHandler';

const router = express.Router();

// GET /api/v1/servizi - Lista tutti i servizi accessori
router.get('/', serviziValidation.list, handleValidationErrors, async (req: Request, res: Response): Promise<void> => {
  try {
    const where: any = { deletedAt: null };
    // Applica filtro inLista solo se all !== 'true'
    if (req.query.all !== 'true') {
      where.inLista = true;
    }

    const servizi = await prisma.servizioAccessorio.findMany({
      where,
      orderBy: {
        nome: 'asc'
      }
    });

    res.json({
      success: true,
      data: servizi,
      meta: {
        count: servizi.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Errore nel recupero dei servizi accessori:', error);
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

// GET /api/v1/servizi/:id - Dettagli di un servizio accessorio specifico
router.get('/:id', serviziValidation.getById, handleValidationErrors, async (req: Request, res: Response): Promise<void> => {
  try {
    const servizio = await prisma.servizioAccessorio.findFirst({
      where: {
        id: req.params.id,
        deletedAt: null
      }
    });

    if (!servizio) {
      throw createNotFoundError('Servizio accessorio', req.params.id);
    }

    res.json({
      success: true,
      data: servizio,
      meta: {
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Errore nel recupero del servizio accessorio:', error);
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
