import express from 'express';
import menuFissoRoutes from './menu-fisso';
import piattiRoutes from './piatti';
import viniRoutes from './vini';
import birreRoutes from './birre';
import liquoriRoutes from './liquori';
import cocktailsRoutes from './cocktails';
import bevandeRoutes from './bevande';
import serviziRoutes from './servizi';
import categoriaMenuFissoRoutes from './categoria-menu-fisso';
import debugRoutes from './debug';
import { trustProxyMiddleware, apiRequestLogger } from '../../../middlewares/api/trustProxy';
import { validationLogger } from '../../../middlewares/api/validation';
import { apiErrorHandler, notFoundHandler, jsonErrorHandler } from '../../../middlewares/api/errorHandler';
import { responseHandler } from '../../../middlewares/api/responseHandler';

const router = express.Router();

// Middleware per trust proxy e logging
router.use(trustProxyMiddleware);

// Middleware legacy
router.use(apiRequestLogger);
router.use(validationLogger);

// Middleware per gestione errori JSON
router.use(jsonErrorHandler);

// Middleware per risposte JSON strutturate
router.use(responseHandler);

// Mount delle risorse
router.use('/debug', debugRoutes);
router.use('/menu-fisso', menuFissoRoutes);
router.use('/piatti', piattiRoutes);
router.use('/vini', viniRoutes);
router.use('/birre', birreRoutes);
router.use('/liquori', liquoriRoutes);
router.use('/cocktails', cocktailsRoutes);
router.use('/bevande', bevandeRoutes);
router.use('/servizi', serviziRoutes);
router.use('/categoria-menu-fisso', categoriaMenuFissoRoutes);

// Endpoint di health check per l'API v1
router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'healthy',
      version: 'v1',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        percentage: Math.round((process.memoryUsage().heapUsed / process.memoryUsage().heapTotal) * 100)
      }
    },
    meta: {
      timestamp: new Date().toISOString(),
      version: 'v1'
    }
  });
});

// Middleware per gestione errori (deve essere alla fine)
router.use(notFoundHandler);
router.use(apiErrorHandler);

export default router;
