#!/usr/bin/env node

const { execSync } = require('child_process');
const { spawn } = require('child_process');

console.log('🔄 Eseguendo migrazioni database...');
console.log(`📊 Porta: ${process.env.PORT || '8080'}`);
console.log(`🌍 Ambiente: ${process.env.NODE_ENV || 'production'}`);
console.log(`🗄️ Database URL: ${process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 20) + '...' : 'Non configurato'}`);

async function runMigrations() {
  try {
    console.log('🔄 Tentativo migrate deploy...');
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    console.log('✅ Migrazioni completate con successo');
    return true;
  } catch (error) {
    console.log('❌ Errore durante migrate deploy');
    try {
      console.log('🔄 Tentativo db push...');
      execSync('npx prisma db push', { stdio: 'inherit' });
      console.log('✅ Database sincronizzato con successo');
      return true;
    } catch (pushError) {
      console.log('❌ Errore critico: impossibile sincronizzare il database');
      console.log('🔄 Tentativo di avvio senza migrazioni...');
      return false;
    }
  }
}

async function startApp() {
  console.log('🚀 Avviando applicazione...');
  
  const app = spawn('node', ['dist/server.js'], {
    stdio: 'inherit',
    env: process.env
  });

  app.on('error', (error) => {
    console.error('❌ Errore avvio applicazione:', error);
    process.exit(1);
  });

  app.on('exit', (code) => {
    console.log(`📊 Applicazione terminata con codice: ${code}`);
    process.exit(code);
  });

  // Gestione segnali per graceful shutdown
  process.on('SIGTERM', () => {
    console.log('🔄 Ricevuto SIGTERM, terminando applicazione...');
    app.kill('SIGTERM');
  });

  process.on('SIGINT', () => {
    console.log('🔄 Ricevuto SIGINT, terminando applicazione...');
    app.kill('SIGINT');
  });
}

async function main() {
  try {
    await runMigrations();
    await startApp();
  } catch (error) {
    console.error('❌ Errore critico:', error);
    process.exit(1);
  }
}

main();
