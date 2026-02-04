import express, { Request, Response } from 'express';
import { prisma } from '../../../app';
import { handleValidationErrors } from '../../../middlewares/api/validation';
import { zoneValidation } from '../../../middlewares/api/validationSchemas';
import { createNotFoundError } from '../../../middlewares/api/errorHandler';

const router = express.Router();

// GET /api/v1/zone - Lista tutte le zone
router.get('/', zoneValidation.list, handleValidationErrors, async (req: Request, res: Response): Promise<void> => {
  try {
    const where: any = { deletedAt: null };
    
    // Filtro per regione
    if (req.query.regioneId) {
      where.regioneId = req.query.regioneId;
    }
    
    // Filtro per nazione
    if (req.query.nazioneId) {
      where.nazioneId = req.query.nazioneId;
    }

    const zone = await prisma.zona.findMany({
      where,
      include: {
        regione: {
          select: {
            id: true,
            nome: true
          }
        },
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
      data: zone.map(zona => ({
        id: zona.id,
        nome: zona.nome,
        regioneId: zona.regioneId,
        nazioneId: zona.nazioneId,
        regione: zona.regione ? {
          id: zona.regione.id,
          nome: zona.regione.nome
        } : null,
        nazione: zona.nazione ? {
          id: zona.nazione.id,
          nome: zona.nazione.nome,
          sigla: zona.nazione.sigla
        } : null,
        createdAt: zona.createdAt,
        updatedAt: zona.updatedAt
      })),
      meta: {
        count: zone.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Errore nel recupero delle zone:', error);
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

// GET /api/v1/zone/:id - Dettagli di una zona specifica
router.get('/:id', zoneValidation.getById, handleValidationErrors, async (req: Request, res: Response): Promise<void> => {
  try {
    const zona = await prisma.zona.findFirst({
      where: {
        id: req.params.id,
        deletedAt: null
      },
      include: {
        regione: {
          select: {
            id: true,
            nome: true
          }
        },
        nazione: {
          select: {
            id: true,
            nome: true,
            sigla: true
          }
        }
      }
    });

    if (!zona) {
      throw createNotFoundError('Zona', req.params.id);
    }

    res.json({
      success: true,
      data: {
        id: zona.id,
        nome: zona.nome,
        regioneId: zona.regioneId,
        nazioneId: zona.nazioneId,
        regione: zona.regione ? {
          id: zona.regione.id,
          nome: zona.regione.nome
        } : null,
        nazione: zona.nazione ? {
          id: zona.nazione.id,
          nome: zona.nazione.nome,
          sigla: zona.nazione.sigla
        } : null,
        createdAt: zona.createdAt,
        updatedAt: zona.updatedAt
      },
      meta: {
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Errore nel recupero della zona:', error);
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
