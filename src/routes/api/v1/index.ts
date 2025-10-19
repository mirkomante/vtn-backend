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
// FASE 2B: Test individuale dei middleware - Iniziamo con trustProxyMiddleware
import { trustProxyMiddleware } from '../../../middlewares/api/trustProxy';
// RIMOSSI TEMPORANEAMENTE: Altri middleware (da testare uno alla volta)
// import { apiErrorHandler, notFoundHandler, jsonErrorHandler } from '../../../middlewares/api/errorHandler';
// import { apiRequestLogger } from '../../../middlewares/api/trustProxy';
// import { validationLogger } from '../../../middlewares/api/validation';
// import { responseHandler } from '../../../middlewares/api/responseHandler';

const router = express.Router();

// FASE 2B: Test individuale - Solo trustProxyMiddleware
router.use(trustProxyMiddleware);

// RIMOSSI TEMPORANEAMENTE: Altri middleware (da testare uno alla volta)
// router.use(jsonErrorHandler);
// router.use(apiRequestLogger);
// router.use(validationLogger);
// router.use(responseHandler);

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

// RIMOSSI TEMPORANEAMENTE: Middleware per gestione errori (da testare dopo)
// router.use(notFoundHandler);
// router.use(apiErrorHandler);

export default router;
