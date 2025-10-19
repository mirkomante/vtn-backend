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
// import { apiRateLimiter } from '../../../middlewares/api/rateLimiter';
import { trustProxyMiddleware, apiRequestLogger } from '../../../middlewares/api/trustProxy';
import { validationLogger } from '../../../middlewares/api/validation';
import { apiErrorHandler, notFoundHandler, jsonErrorHandler } from '../../../middlewares/api/errorHandler';
import { responseHandler } from '../../../middlewares/api/responseHandler';
// import { requestLogger, errorLogger, performanceLogger, auditLogger } from '../../../middlewares/logging';

console.log('🔍 [API DEBUG] Creazione router Express');
const router = express.Router();
console.log('🔍 [API DEBUG] Router Express creato');

// Middleware per trust proxy e logging (deve essere prima del rate limiting)
console.log('🔍 [API DEBUG] Aggiungo trustProxyMiddleware');
router.use(trustProxyMiddleware);
console.log('🔍 [API DEBUG] trustProxyMiddleware aggiunto');

// Middleware di logging avanzato (temporaneamente disabilitato per debug)
// router.use(requestLogger);
// router.use(performanceLogger);
// router.use(auditLogger);

// Middleware legacy (da rimuovere gradualmente)
console.log('🔍 [API DEBUG] Aggiungo apiRequestLogger');
router.use(apiRequestLogger);
console.log('🔍 [API DEBUG] apiRequestLogger aggiunto');

console.log('🔍 [API DEBUG] Aggiungo validationLogger');
router.use(validationLogger);
console.log('🔍 [API DEBUG] validationLogger aggiunto');

// Middleware per gestione errori JSON
console.log('🔍 [API DEBUG] Aggiungo jsonErrorHandler');
router.use(jsonErrorHandler);
console.log('🔍 [API DEBUG] jsonErrorHandler aggiunto');

// Middleware per risposte JSON strutturate
console.log('🔍 [API DEBUG] Aggiungo responseHandler');
router.use(responseHandler);
console.log('🔍 [API DEBUG] responseHandler aggiunto');

// Middleware per rate limiting API v1 (temporaneamente disabilitato per debug)
// router.use(apiRateLimiter);

// Mount delle risorse
console.log('🔍 [API DEBUG] Aggiungo sub-router menu-fisso');
router.use('/menu-fisso', menuFissoRoutes);
console.log('🔍 [API DEBUG] Sub-router menu-fisso aggiunto');

console.log('🔍 [API DEBUG] Aggiungo sub-router piatti');
router.use('/piatti', piattiRoutes);
console.log('🔍 [API DEBUG] Sub-router piatti aggiunto');

console.log('🔍 [API DEBUG] Aggiungo sub-router vini');
router.use('/vini', viniRoutes);
console.log('🔍 [API DEBUG] Sub-router vini aggiunto');

console.log('🔍 [API DEBUG] Aggiungo sub-router birre');
router.use('/birre', birreRoutes);
console.log('🔍 [API DEBUG] Sub-router birre aggiunto');

console.log('🔍 [API DEBUG] Aggiungo sub-router liquori');
router.use('/liquori', liquoriRoutes);
console.log('🔍 [API DEBUG] Sub-router liquori aggiunto');

console.log('🔍 [API DEBUG] Aggiungo sub-router cocktails');
router.use('/cocktails', cocktailsRoutes);
console.log('🔍 [API DEBUG] Sub-router cocktails aggiunto');

console.log('🔍 [API DEBUG] Aggiungo sub-router bevande');
router.use('/bevande', bevandeRoutes);
console.log('🔍 [API DEBUG] Sub-router bevande aggiunto');

console.log('🔍 [API DEBUG] Aggiungo sub-router servizi');
router.use('/servizi', serviziRoutes);
console.log('🔍 [API DEBUG] Sub-router servizi aggiunto');

console.log('🔍 [API DEBUG] Aggiungo sub-router categoria-menu-fisso');
router.use('/categoria-menu-fisso', categoriaMenuFissoRoutes);
console.log('🔍 [API DEBUG] Sub-router categoria-menu-fisso aggiunto');

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

// Endpoint di health check per l'API v1 (con log dettagliati per debug)
router.get('/health', (req, res) => {
  console.log('🔍 [API DEBUG] /health endpoint chiamato');
  console.log('🔍 [API DEBUG] Request headers:', req.headers);
  console.log('🔍 [API DEBUG] Request IP:', req.ip);
  console.log('🔍 [API DEBUG] Request URL:', req.url);
  console.log('🔍 [API DEBUG] Request method:', req.method);
  console.log('🔍 [API DEBUG] Environment:', process.env.NODE_ENV);
  
  try {
    console.log('🔍 [API DEBUG] Inizio elaborazione health check');
    
    const response = {
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
    };
    
    console.log('🔍 [API DEBUG] Response preparata:', JSON.stringify(response, null, 2));
    console.log('🔍 [API DEBUG] Invio risposta 200');
    
    res.status(200).json(response);
    
    console.log('🔍 [API DEBUG] Risposta inviata con successo');
  } catch (error) {
    console.error('❌ [API DEBUG] Errore in /health endpoint:', error);
    console.error('❌ [API DEBUG] Stack trace:', error instanceof Error ? error.stack : 'No stack trace available');
    
    res.status(500).json({
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString()
      }
    });
  }
});

// Middleware per gestione errori (deve essere alla fine)
console.log('🔍 [API DEBUG] Aggiungo notFoundHandler');
router.use(notFoundHandler);
console.log('🔍 [API DEBUG] notFoundHandler aggiunto');

// router.use(errorLogger); // Temporaneamente disabilitato

console.log('🔍 [API DEBUG] Aggiungo apiErrorHandler');
router.use(apiErrorHandler);
console.log('🔍 [API DEBUG] apiErrorHandler aggiunto');

console.log('🔍 [API DEBUG] Export del router completato');
export default router;
