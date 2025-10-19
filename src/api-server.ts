import express from 'express';
import { PrismaClient } from '@prisma/client';

const app = express();

// Middleware base
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS per le API
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Endpoint di test
app.get('/test', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'API Server test endpoint working',
    timestamp: new Date().toISOString(),
    version: 'api-server'
  });
});

// Endpoint di health check
app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'healthy',
      version: 'api-server',
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
      version: 'api-server'
    }
  });
});

// Endpoint per testare il database
app.get('/db-test', async (_req, res) => {
  try {
    const prisma = new PrismaClient();
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    await prisma.$disconnect();
    
    res.status(200).json({
      success: true,
      message: 'Database connection test successful',
      data: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection test failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
});

export default app;
