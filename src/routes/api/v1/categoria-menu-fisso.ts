import express from 'express';
import { prisma } from '../../../app';
import { handleValidationErrors } from '../../../middlewares/api/validation';
import { categoriaMenuFissoValidation } from '../../../middlewares/api/validationSchemas';
import { createNotFoundError } from '../../../middlewares/api/errorHandler';

const router = express.Router();

// GET /api/v1/categoria-menu-fisso - Lista tutte le categorie menu fisso
router.get('/', categoriaMenuFissoValidation.list, handleValidationErrors, async (req, res) => {
  try {
    // Costruisci la condizione WHERE basata sui filtri di query
    const where: any = {
      deletedAt: null
    };

    // Filtro per inLista
    if (req.query.inLista !== undefined) {
      where.inLista = req.query.inLista === 'true';
    }

    // Parametri di ordinamento
    const sortBy = (req.query.sortBy as string) || 'nome';
    const sortOrder = (req.query.sortOrder as string) || 'asc';

    // Parametri di paginazione
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    // Recupera le categorie con conteggio dei menu fissi
    const [categorie, totalCount] = await Promise.all([
      prisma.categoriaMenuFisso.findMany({
        where,
        include: {
          _count: {
            select: {
              menuFissi: {
                where: {
                  deletedAt: null,
                  inLista: true
                }
              }
            }
          }
        },
        orderBy: {
          [sortBy]: sortOrder
        },
        skip: offset,
        take: limit
      }),
      prisma.categoriaMenuFisso.count({ where })
    ]);

    // Trasforma i dati per includere il conteggio dei menu fissi
    const categorieConConteggio = categorie.map(categoria => ({
      id: categoria.id,
      nome: categoria.nome,
      descrizione: categoria.descrizione,
      inLista: categoria.inLista,
      createdAt: categoria.createdAt,
      updatedAt: categoria.updatedAt,
      menuFissiCount: categoria._count.menuFissi
    }));

    res.json({
      success: true,
      data: categorieConConteggio,
      meta: {
        count: categorieConConteggio.length,
        totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
        sortBy,
        sortOrder,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Errore nel recupero delle categorie menu fisso:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Errore interno del server'
      }
    });
  }
});

// GET /api/v1/categoria-menu-fisso/:id - Dettagli di una categoria menu fisso specifica
router.get('/:id', categoriaMenuFissoValidation.getById, handleValidationErrors, async (req, res) => {
  try {
    const categoria = await prisma.categoriaMenuFisso.findFirst({
      where: {
        id: req.params.id,
        deletedAt: null
      },
      include: {
        menuFissi: {
          where: {
            deletedAt: null,
            inLista: true
          },
          select: {
            id: true,
            nome: true,
            descrizione: true,
            prezzo: true,
            createdAt: true,
            updatedAt: true
          },
          orderBy: {
            nome: 'asc'
          }
        },
        _count: {
          select: {
            menuFissi: {
              where: {
                deletedAt: null,
                inLista: true
              }
            }
          }
        }
      }
    });

    if (!categoria) {
      throw createNotFoundError('Categoria Menu Fisso', req.params.id);
    }

    // Trasforma i dati per includere il conteggio dei menu fissi
    const categoriaConDettagli = {
      id: categoria.id,
      nome: categoria.nome,
      descrizione: categoria.descrizione,
      inLista: categoria.inLista,
      createdAt: categoria.createdAt,
      updatedAt: categoria.updatedAt,
      menuFissi: categoria.menuFissi,
      menuFissiCount: categoria._count.menuFissi
    };

    res.json({
      success: true,
      data: categoriaConDettagli,
      meta: {
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Errore nel recupero della categoria menu fisso:', error);
    
    if (error.name === 'NotFoundError') {
      return res.status(404).json({
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: error.message
        }
      });
    }

    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Errore interno del server'
      }
    });
  }
});

export default router;
