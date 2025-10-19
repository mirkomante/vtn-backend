import express from 'express';

const router = express.Router();

// Endpoint di test completamente minimale
router.get('/test', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Minimal API v1 working',
    timestamp: new Date().toISOString(),
    version: 'v1-minimal'
  });
});

export default router;
