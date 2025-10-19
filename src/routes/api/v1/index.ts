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
import { apiRateLimiter } from '../../../middlewares/api/rateLimiter';
import { trustProxyMiddleware, apiRequestLogger } from '../../../middlewares/api/trustProxy';
import { validationLogger } from '../../../middlewares/api/validation';
import { apiErrorHandler, notFoundHandler, jsonErrorHandler } from '../../../middlewares/api/errorHandler';
import { responseHandler } from '../../../middlewares/api/responseHandler';
// import { requestLogger, errorLogger, performanceLogger, auditLogger } from '../../../middlewares/logging';

const router = express.Router();

// Middleware per trust proxy e logging (deve essere prima del rate limiting)
router.use(trustProxyMiddleware);

// Middleware di logging avanzato (temporaneamente disabilitato per debug)
// router.use(requestLogger);
// router.use(performanceLogger);
// router.use(auditLogger);

// Middleware legacy (da rimuovere gradualmente)
router.use(apiRequestLogger);
router.use(validationLogger);

// Middleware per gestione errori JSON
router.use(jsonErrorHandler);

// Middleware per risposte JSON strutturate
router.use(responseHandler);

// Middleware per rate limiting API v1
router.use(apiRateLimiter);

// Mount delle risorse
router.use('/menu-fisso', menuFissoRoutes);
router.use('/piatti', piattiRoutes);
router.use('/vini', viniRoutes);
router.use('/birre', birreRoutes);
router.use('/liquori', liquoriRoutes);
router.use('/cocktails', cocktailsRoutes);
router.use('/bevande', bevandeRoutes);
router.use('/servizi', serviziRoutes);
router.use('/categoria-menu-fisso', categoriaMenuFissoRoutes);

// Endpoint di debug minimale (prima di tutti i middleware)
router.get('/debug', (_req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Debug endpoint working - no middleware',
      timestamp: new Date().toISOString(),
      version: 'v1-debug',
      environment: process.env.NODE_ENV,
      database: process.env.DATABASE_URL ? 'configured' : 'not configured'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

// Endpoint di test semplice per API v1 (senza middleware per debug)
router.get('/test', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'API v1 test endpoint working',
    timestamp: new Date().toISOString(),
    version: 'v1'
  });
});

// Endpoint di health check per l'API v1 (senza middleware per evitare errori)
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
// router.use(errorLogger); // Temporaneamente disabilitato
router.use(apiErrorHandler);

export default router;
