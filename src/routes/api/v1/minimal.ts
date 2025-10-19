import express from 'express';
import menuFissoRoutes from './menu-fisso';
import piattiRoutes from './piatti'; // Added for Step 2
import viniRoutes from './vini';
import birreRoutes from './birre';
import liquoriRoutes from './liquori';
import cocktailsRoutes from './cocktails';
import bevandeRoutes from './bevande';
import serviziRoutes from './servizi';
import categoriaMenuFissoRoutes from './categoria-menu-fisso';
import { trustProxyMiddleware, apiRequestLogger } from '../../../middlewares/api/trustProxy';
import { validationLogger } from '../../../middlewares/api/validation';
import { apiErrorHandler, notFoundHandler, jsonErrorHandler } from '../../../middlewares/api/errorHandler';
import { responseHandler } from '../../../middlewares/api/responseHandler';

const router = express.Router();

// STEP 3: Aggiungiamo i middleware del router principale GRADUALMENTE
// Prima solo trustProxyMiddleware
router.use(trustProxyMiddleware);

// Test 2: Aggiungiamo apiRequestLogger
router.use(apiRequestLogger);

// Test 3: Aggiungiamo validationLogger
router.use(validationLogger);

// Test 4: Aggiungiamo jsonErrorHandler
router.use(jsonErrorHandler);

// Test 5: Aggiungiamo responseHandler
router.use(responseHandler);

// Endpoint di test completamente minimale
router.get('/test', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Minimal API v1 working',
    timestamp: new Date().toISOString(),
    version: 'v1-minimal',
    environment: process.env.NODE_ENV,
    ip: _req.ip,
    headers: {
      'x-forwarded-for': _req.headers['x-forwarded-for'],
      'x-real-ip': _req.headers['x-real-ip']
    }
  });
});

// Endpoint per testare il rate limiting
router.get('/rate-test', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Rate limiting test',
    timestamp: new Date().toISOString(),
    ip: _req.ip,
    userAgent: _req.headers['user-agent']
  });
});

// Endpoint per testare la configurazione del rate limiting
router.get('/rate-config', (_req, res) => {
  try {
    const { getRateLimitConfig } = require('../../../config/rateLimitConfig');
    const config = getRateLimitConfig('api');
    
    res.status(200).json({
      success: true,
      message: 'Rate limiting config test',
      timestamp: new Date().toISOString(),
      config: config,
      environment: process.env.NODE_ENV,
      ip: _req.ip || 'undefined',
      connectionRemoteAddress: _req.connection?.remoteAddress || 'undefined'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

// STEP 1: Test import menu-fisso
router.get('/test-step1', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Step 1: menu-fisso import test',
    timestamp: new Date().toISOString(),
    step: 1,
    imported: 'menu-fisso',
    environment: process.env.NODE_ENV
  });
});

// STEP 2: Test import piatti
router.get('/test-step2', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Step 2: piatti import test',
    timestamp: new Date().toISOString(),
    step: 2,
    imported: 'piatti',
    environment: process.env.NODE_ENV
  });
});

// Test 6: Aggiungiamo i sub-router
router.use('/menu-fisso', menuFissoRoutes);
router.use('/piatti', piattiRoutes);
router.use('/vini', viniRoutes);
router.use('/birre', birreRoutes);
router.use('/liquori', liquoriRoutes);
router.use('/cocktails', cocktailsRoutes);
router.use('/bevande', bevandeRoutes);
router.use('/servizi', serviziRoutes);
router.use('/categoria-menu-fisso', categoriaMenuFissoRoutes);

// STEP 3: Test endpoint semplice
router.get('/test-simple', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Simple test endpoint',
    timestamp: new Date().toISOString(),
    step: 3
  });
});

// Test 9: Aggiungiamo l'endpoint /status
router.get('/status', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Status endpoint working',
    timestamp: new Date().toISOString(),
    step: 9
  });
});

// Test 7: Aggiungiamo i middleware di gestione errori
router.use(notFoundHandler);
router.use(apiErrorHandler);

export default router;
