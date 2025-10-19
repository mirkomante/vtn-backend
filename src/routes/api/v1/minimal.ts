import express from 'express';

const router = express.Router();

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

export default router;
