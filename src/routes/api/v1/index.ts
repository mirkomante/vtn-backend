import express from 'express';
import menuFissoRoutes from './menu-fisso';
import piattiRoutes from './piatti';
import viniRoutes from './vini';
import birreRoutes from './birre';
import liquoriRoutes from './liquori';
import cocktailsRoutes from './cocktails';
import bevandeRoutes from './bevande';
import serviziRoutes from './servizi';
import { apiRateLimiter, healthCheckRateLimiter } from '../../../middlewares/api/rateLimiter';
import { trustProxyMiddleware, apiRequestLogger } from '../../../middlewares/api/trustProxy';
import { validationLogger } from '../../../middlewares/api/validation';
import { apiErrorHandler, notFoundHandler, jsonErrorHandler } from '../../../middlewares/api/errorHandler';
import { responseHandler } from '../../../middlewares/api/responseHandler';

const router = express.Router();

// Middleware per trust proxy e logging (deve essere prima del rate limiting)
router.use(trustProxyMiddleware);
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

// Endpoint di health check per l'API v1 (con rate limiting specifico)
router.get('/health', healthCheckRateLimiter, (req, res) => {
  res.apiHealth('healthy');
});

// Middleware per gestione errori (deve essere alla fine)
router.use(notFoundHandler);
router.use(apiErrorHandler);

export default router;
