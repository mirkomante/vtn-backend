#!/usr/bin/env node

/**
 * Script di deploy per produzione
 * Esegue il deploy completo con verifiche di sicurezza
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Avviando deploy per produzione...');

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

function checkEnvironment() {
  const nodeEnv = process.env.NODE_ENV;
  if (nodeEnv !== 'production') {
    console.warn(`⚠️ NODE_ENV è "${nodeEnv}", non "production"`);
    console.log('💡 Per deploy produzione, imposta NODE_ENV=production');
  }
  return true;
}

// 1. Verifica ambiente
console.log('\n📋 Verifica ambiente...');
checkEnvironment();

// 2. Validazione configurazione
console.log('\n📋 Validazione configurazione...');
if (!runCommand('node scripts/validate-env.js', 'Validazione variabili d\'ambiente')) {
  console.error('❌ Validazione ambiente fallita');
  process.exit(1);
}

// 3. Verifica file di configurazione
console.log('\n📋 Verifica file di configurazione...');
if (!fs.existsSync('.env')) {
  console.error('❌ File .env non trovato');
  console.log('💡 Crea il file .env con la configurazione di produzione');
  process.exit(1);
}

// 4. Installazione dipendenze di produzione
console.log('\n📋 Installazione dipendenze...');
if (!runCommand('npm ci --only=production', 'Installazione dipendenze produzione')) {
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

// 8. Verifica sicurezza
console.log('\n📋 Verifica sicurezza...');
const envContent = fs.readFileSync('.env', 'utf8');
const securityChecks = [
  { check: envContent.includes('SESSION_SECRET'), message: 'SESSION_SECRET configurato' },
  { check: envContent.includes('DATABASE_URL'), message: 'DATABASE_URL configurato' },
  { check: !envContent.includes('your-secret-key'), message: 'SESSION_SECRET non è il valore di default' },
  { check: !envContent.includes('your-google-client-id'), message: 'Google OAuth configurato correttamente' }
];

let securityPassed = true;
securityChecks.forEach(check => {
  if (check.check) {
    console.log(`✅ ${check.message}`);
  } else {
    console.log(`❌ ${check.message}`);
    securityPassed = false;
  }
});

if (!securityPassed) {
  console.error('❌ Verifica sicurezza fallita');
  console.log('💡 Configura correttamente le variabili d\'ambiente');
  process.exit(1);
}

// 9. Riepilogo
console.log('\n🎉 Deploy completato con successo!');
console.log('\n📊 Riepilogo:');
console.log('  ✅ Ambiente verificato');
console.log('  ✅ Configurazione validata');
console.log('  ✅ Dipendenze installate');
console.log('  ✅ Progetto compilato');
console.log('  ✅ Database configurato');
console.log('  ✅ Sistema verificato');
console.log('  ✅ Sicurezza verificata');

console.log('\n🚀 Per avviare il server:');
console.log('  npm start');

console.log('\n🔍 Per verificare lo stato:');
console.log('  npm run health:check');

console.log('\n📊 Endpoint di monitoraggio:');
console.log('  - Health: /health');
console.log('  - Readiness: /health/ready');
console.log('  - Liveness: /health/live');

console.log('\n💡 Raccomandazioni per produzione:');
console.log('  - Configurare reverse proxy (nginx/Apache)');
console.log('  - Abilitare HTTPS');
console.log('  - Configurare firewall');
console.log('  - Impostare backup automatici');
console.log('  - Configurare monitoraggio e alerting');
console.log('  - Impostare log rotation');
