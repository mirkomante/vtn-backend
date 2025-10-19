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

// Test 2: Trust proxy globale (app.set('trust proxy', true))
router.get('/test-2', (req, res) => {
  res.json({
    success: true,
    message: 'Test 2: Trust proxy globale (app.set)',
    timestamp: new Date().toISOString(),
    ip: req.ip,
    headers: {
      'x-forwarded-for': req.headers['x-forwarded-for'],
      'x-real-ip': req.headers['x-real-ip']
    }
  });
});

// Test 3: Test IP con trust proxy globale
router.get('/test-3', (req, res) => {
  res.json({
    success: true,
    message: 'Test 3: IP con trust proxy globale',
    timestamp: new Date().toISOString(),
    ip: req.ip,
    protocol: req.protocol,
    secure: req.secure
  });
});

// Test 4: Test headers con trust proxy globale
router.get('/test-4', (req, res) => {
  res.json({
    success: true,
    message: 'Test 4: Headers con trust proxy globale',
    timestamp: new Date().toISOString(),
    ip: req.ip,
    host: req.get('host'),
    userAgent: req.get('user-agent'),
    forwardedFor: req.get('x-forwarded-for')
  });
});

// Test 5: Test completo con trust proxy
router.get('/test-5', (req, res) => {
  res.json({
    success: true,
    message: 'Test 5: Test completo con trust proxy',
    timestamp: new Date().toISOString(),
    ip: req.ip,
    method: req.method,
    url: req.url,
    originalUrl: req.originalUrl,
    headers: {
      'x-forwarded-for': req.get('x-forwarded-for'),
      'x-real-ip': req.get('x-real-ip'),
      'x-forwarded-proto': req.get('x-forwarded-proto'),
      'user-agent': req.get('user-agent')
    }
  });
});

// Test 6: Endpoint principale di debug
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Debug endpoint principale',
    timestamp: new Date().toISOString(),
    ip: req.ip,
    environment: process.env.NODE_ENV,
    trustProxy: true,
    availableTests: [
      '/api/v1/debug/test-1',
      '/api/v1/debug/test-2', 
      '/api/v1/debug/test-3',
      '/api/v1/debug/test-4',
      '/api/v1/debug/test-5'
    ]
  });
});

export default router;
