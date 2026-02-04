import express, { Request, Response } from 'express';
import { prisma } from '../../../app';
import { handleValidationErrors } from '../../../middlewares/api/validation';
import { categoriePiattiValidation } from '../../../middlewares/api/validationSchemas';
import { createNotFoundError } from '../../../middlewares/api/errorHandler';

const router = express.Router();

// GET /api/v1/categorie-piatti - Lista tutte le categorie piatti
router.get('/', categoriePiattiValidation.list, handleValidationErrors, async (req: Request, res: Response): Promise<void> => {
  try {
    const where: any = { deletedAt: null };
    
    // Applica filtro inLista solo se all !== 'true'
    if (req.query.all !== 'true') {
      where.inLista = true;
    }

    const categorie = await prisma.categoriaPiatti.findMany({
      where,
      include: {
        _count: {
          select: {
            piatti: {
              where: {
                deletedAt: null
              }
            }
          }
        }
      },
      orderBy: {
        nome: 'asc'
      }
    });

    res.json({
      success: true,
      data: categorie.map(categoria => ({
        id: categoria.id,
        nome: categoria.nome,
        descrizione: categoria.descrizione,
        inLista: categoria.inLista,
        piattiCount: categoria._count.piatti,
        createdAt: categoria.createdAt,
        updatedAt: categoria.updatedAt
      })),
      meta: {
        count: categorie.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Errore nel recupero delle categorie piatti:', error);
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

// GET /api/v1/categorie-piatti/:id - Dettagli di una categoria piatti specifica
router.get('/:id', categoriePiattiValidation.getById, handleValidationErrors, async (req: Request, res: Response): Promise<void> => {
  try {
    const categoria = await prisma.categoriaPiatti.findFirst({
      where: {
        id: req.params.id,
        deletedAt: null
      },
      include: {
        _count: {
          select: {
            piatti: {
              where: {
                deletedAt: null
              }
            }
          }
        }
      }
    });

    if (!categoria) {
      throw createNotFoundError('Categoria Piatti', req.params.id);
    }

    res.json({
      success: true,
      data: {
        id: categoria.id,
        nome: categoria.nome,
        descrizione: categoria.descrizione,
        inLista: categoria.inLista,
        piattiCount: categoria._count.piatti,
        createdAt: categoria.createdAt,
        updatedAt: categoria.updatedAt
      },
      meta: {
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Errore nel recupero della categoria piatti:', error);
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
