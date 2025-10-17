#!/usr/bin/env node

/**
 * Script di setup completo per primo avvio
 * Esegue tutte le operazioni necessarie per configurare il sistema
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Avviando setup completo...');

// Funzioni di utilità
function runCommand(command, description) {
  try {
    console.log(`🔄 ${description}...`);
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ ${description} completato`);
    return true;
  } catch (error) {
    console.error(`❌ Errore durante ${description}:`, error.message);
    return false;
  }
}

function checkFileExists(filePath, description) {
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${description} trovato`);
    return true;
  } else {
    console.log(`❌ ${description} non trovato`);
    return false;
  }
}

// 1. Verifica prerequisiti
console.log('\n📋 Verifica prerequisiti...');

// Verifica Node.js
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
  console.log(`✅ Node.js: ${nodeVersion}`);
} catch (error) {
  console.error('❌ Node.js non trovato');
  process.exit(1);
}

// Verifica npm
try {
  const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
  console.log(`✅ npm: ${npmVersion}`);
} catch (error) {
  console.error('❌ npm non trovato');
  process.exit(1);
}

// Verifica Prisma
try {
  const prismaVersion = execSync('npx prisma --version', { encoding: 'utf8' }).trim();
  console.log(`✅ Prisma: ${prismaVersion}`);
} catch (error) {
  console.error('❌ Prisma non trovato');
  process.exit(1);
}

// 2. Verifica file di configurazione
console.log('\n📋 Verifica file di configurazione...');

if (!checkFileExists('.env', 'File .env')) {
  if (checkFileExists('env.example', 'File env.example')) {
    console.log('💡 Copiando env.example come .env...');
    fs.copyFileSync('env.example', '.env');
    console.log('✅ File .env creato da env.example');
    console.log('⚠️ Ricorda di configurare i valori in .env');
  } else {
    console.error('❌ File env.example non trovato');
    process.exit(1);
  }
}

// 3. Validazione ambiente
console.log('\n📋 Validazione ambiente...');
if (!runCommand('node scripts/validate-env.js', 'Validazione variabili d\'ambiente')) {
  console.error('❌ Validazione ambiente fallita');
  process.exit(1);
}

// 4. Installazione dipendenze
console.log('\n📋 Installazione dipendenze...');
if (!runCommand('npm install', 'Installazione dipendenze npm')) {
  console.error('❌ Installazione dipendenze fallita');
  process.exit(1);
}

// 5. Build del progetto
console.log('\n📋 Build del progetto...');
if (!runCommand('npm run build', 'Build TypeScript')) {
  console.error('❌ Build fallita');
  process.exit(1);
}

// 6. Setup database
console.log('\n📋 Setup database...');
if (!runCommand('npm run prisma:generate', 'Generazione client Prisma')) {
  console.error('❌ Generazione client Prisma fallita');
  process.exit(1);
}

if (!runCommand('npm run prisma:migrate:deploy', 'Applicazione migrazioni database')) {
  console.error('❌ Applicazione migrazioni fallita');
  process.exit(1);
}

// 7. Health check
console.log('\n📋 Health check...');
if (!runCommand('npm run health:check', 'Verifica stato sistema')) {
  console.error('❌ Health check fallito');
  process.exit(1);
}

// 8. Riepilogo
console.log('\n🎉 Setup completato con successo!');
console.log('\n📊 Riepilogo:');
console.log('  ✅ Prerequisiti verificati');
console.log('  ✅ Configurazione validata');
console.log('  ✅ Dipendenze installate');
console.log('  ✅ Progetto compilato');
console.log('  ✅ Database configurato');
console.log('  ✅ Sistema verificato');

console.log('\n🚀 Per avviare il server:');
console.log('  npm start');

console.log('\n🔍 Per verificare lo stato:');
console.log('  npm run health:check');

console.log('\n📚 Per sviluppo:');
console.log('  npm run dev');

console.log('\n💡 Ricorda di:');
console.log('  - Configurare le variabili d\'ambiente in .env');
console.log('  - Configurare Google OAuth se necessario');
console.log('  - Verificare le impostazioni di sicurezza per produzione');
