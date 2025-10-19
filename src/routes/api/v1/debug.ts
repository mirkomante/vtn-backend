import express from 'express';

const router = express.Router();

// Test 1: Nessun middleware
router.get('/test-1', (_req, res) => {
  res.json({
    success: true,
    message: 'Test 1: Nessun middleware',
    timestamp: new Date().toISOString()
  });
});

// Test 2: Solo trustProxyMiddleware
import { trustProxyMiddleware } from '../../../middlewares/api/trustProxy';
router.use(trustProxyMiddleware);

router.get('/test-2', (req, res) => {
  res.json({
    success: true,
    message: 'Test 2: Solo trustProxyMiddleware',
    timestamp: new Date().toISOString(),
    ip: req.ip,
    headers: {
      'x-forwarded-for': req.headers['x-forwarded-for'],
      'x-real-ip': req.headers['x-real-ip']
    }
  });
});

// Test 3: + apiRequestLogger
import { apiRequestLogger } from '../../../middlewares/api/trustProxy';
router.use(apiRequestLogger);

router.get('/test-3', (req, res) => {
  res.json({
    success: true,
    message: 'Test 3: + apiRequestLogger',
    timestamp: new Date().toISOString(),
    ip: req.ip
  });
});

// Test 4: + validationLogger
import { validationLogger } from '../../../middlewares/api/validation';
router.use(validationLogger);

router.get('/test-4', (req, res) => {
  res.json({
    success: true,
    message: 'Test 4: + validationLogger',
    timestamp: new Date().toISOString(),
    ip: req.ip
  });
});

// Test 5: + jsonErrorHandler
import { jsonErrorHandler } from '../../../middlewares/api/errorHandler';
router.use(jsonErrorHandler);

router.get('/test-5', (req, res) => {
  res.json({
    success: true,
    message: 'Test 5: + jsonErrorHandler',
    timestamp: new Date().toISOString(),
    ip: req.ip
  });
});

// Test 6: + responseHandler
import { responseHandler } from '../../../middlewares/api/responseHandler';
router.use(responseHandler);

router.get('/test-6', (req, res) => {
  res.json({
    success: true,
    message: 'Test 6: + responseHandler',
    timestamp: new Date().toISOString(),
    ip: req.ip
  });
});

export default router;
