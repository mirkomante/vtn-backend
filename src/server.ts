import 'dotenv/config';
import './types/express';
import app from './app';
import { prisma } from './app';
import { Pool } from 'pg';
import GracefulShutdown from './utils/gracefulShutdown';
import { EnvironmentValidator } from './config/env';

console.log('🔄 Inizializzazione server...');

// Ottieni configurazione validata
let config;
let PORT;

try {
  config = EnvironmentValidator.getConfig();
  PORT = config.server.port;
  console.log(`✅ Configurazione caricata - Porta: ${PORT}, Ambiente: ${config.server.nodeEnv}`);
} catch (error) {
  console.error('❌ Errore caricamento configurazione:', error);
  process.exit(1);
}

// Configura pool PostgreSQL per graceful shutdown
let pool;
try {
  pool = new Pool({
    connectionString: config.database.url
  });
  console.log('✅ Pool PostgreSQL configurato');
} catch (error) {
  console.error('❌ Errore configurazione pool PostgreSQL:', error);
  process.exit(1);
}

// Avvia server
console.log(`🔄 Avvio server sulla porta ${PORT}...`);

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🌍 Environment: ${config.server.nodeEnv}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔍 Readiness: http://localhost:${PORT}/health/ready`);
  console.log(`💓 Liveness: http://localhost:${PORT}/health/live`);
  console.log('✅ Server avviato con successo!');
});

// Inizializza graceful shutdown
GracefulShutdown.initialize(server, prisma, pool);

// Gestione errori del server
server.on('error', (error: NodeJS.ErrnoException) => {
  console.error('❌ Errore server:', error);
  
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
      console.error(`❌ Errore sconosciuto: ${error.code}`);
      throw error;
  }
});

// Timeout per l'avvio del server
const startupTimeout = setTimeout(() => {
  console.error('❌ Timeout avvio server - il server non è riuscito ad avviarsi in tempo');
  process.exit(1);
}, 30000); // 30 secondi

server.on('listening', () => {
  clearTimeout(startupTimeout);
  console.log('✅ Server listening e pronto per ricevere connessioni');
});

// Log avvio completato
console.log('✅ Server startup completed'); 