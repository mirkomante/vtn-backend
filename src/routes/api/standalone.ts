import express from 'express';

const router = express.Router();

// Endpoint di test completamente isolato
router.get('/test', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Standalone API test endpoint working',
    timestamp: new Date().toISOString(),
    version: 'standalone'
  });
});

// Endpoint di health check completamente isolato
router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'healthy',
      version: 'standalone',
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
      version: 'standalone'
    }
  });
});

export default router;
