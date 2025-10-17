import 'dotenv/config';
import './types/express';
import app from './app';
import { prisma } from './app';
import { Pool } from 'pg';
import GracefulShutdown from './utils/gracefulShutdown';
import { EnvironmentValidator } from './config/env';

// Ottieni configurazione validata
const config = EnvironmentValidator.getConfig();
const PORT = config.server.port;

// Configura pool PostgreSQL per graceful shutdown
const pool = new Pool({
  connectionString: config.database.url
});

// Avvia server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🌍 Environment: ${config.server.nodeEnv}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔍 Readiness: http://localhost:${PORT}/health/ready`);
  console.log(`💓 Liveness: http://localhost:${PORT}/health/live`);
});

// Inizializza graceful shutdown
GracefulShutdown.initialize(server, prisma, pool);

// Gestione errori del server
server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT;

  switch (error.code) {
    case 'EACCES':
      console.error(`❌ ${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`❌ ${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

// Log avvio completato
console.log('✅ Server startup completed'); 