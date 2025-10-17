#!/usr/bin/env node

/**
 * Script di validazione variabili d'ambiente
 * Verifica che tutte le configurazioni necessarie siano presenti e valide
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Validando configurazione ambiente...');

// Verifica se esiste file .env
const envPath = path.join(process.cwd(), '.env');
if (!fs.existsSync(envPath)) {
  console.error('❌ File .env non trovato');
  console.log('💡 Copia env.example come .env e configura i valori:');
  console.log('   cp env.example .env');
  process.exit(1);
}

// Carica variabili d'ambiente
require('dotenv').config();

// Funzioni di validazione
function validateRequired(key, description) {
  if (!process.env[key]) {
    console.error(`❌ ${key} è obbligatorio: ${description}`);
    return false;
  }
  return true;
}

function validateOptional(key, description) {
  if (process.env[key]) {
    console.log(`✅ ${key}: ${description}`);
  } else {
    console.log(`⚠️ ${key}: ${description} (opzionale)`);
  }
  return true;
}

function validateUrl(key, description) {
  if (!process.env[key]) {
    console.error(`❌ ${key} è obbligatorio: ${description}`);
    return false;
  }
  
  try {
    const url = new URL(process.env[key]);
    if (!['postgresql:', 'postgres:'].includes(url.protocol)) {
      console.error(`❌ ${key} deve essere un URL PostgreSQL valido`);
      return false;
    }
    console.log(`✅ ${key}: URL PostgreSQL valido`);
    return true;
  } catch (error) {
    console.error(`❌ ${key} non è un URL valido: ${error.message}`);
    return false;
  }
}

function validateBoolean(key, description) {
  if (process.env[key] && !['true', 'false'].includes(process.env[key])) {
    console.error(`❌ ${key} deve essere 'true' o 'false'`);
    return false;
  }
  return true;
}

function validateNumber(key, description, min = 1, max = 65535) {
  if (process.env[key]) {
    const num = parseInt(process.env[key], 10);
    if (isNaN(num) || num < min || num > max) {
      console.error(`❌ ${key} deve essere un numero tra ${min} e ${max}`);
      return false;
    }
    console.log(`✅ ${key}: ${num}`);
    return true;
  }
  return true;
}

// Validazioni obbligatorie
let isValid = true;

console.log('\n📋 Validazioni obbligatorie:');
isValid &= validateUrl('DATABASE_URL', 'URL di connessione PostgreSQL');
isValid &= validateRequired('SESSION_SECRET', 'Chiave segreta per le sessioni');

// Validazioni opzionali
console.log('\n📋 Validazioni opzionali:');
validateOptional('AUTH_LOCAL_ENABLED', 'Abilita autenticazione locale');
validateOptional('AUTH_GOOGLE_ENABLED', 'Abilita autenticazione Google');
validateOptional('GOOGLE_CLIENT_ID', 'ID client Google OAuth');
validateOptional('GOOGLE_CLIENT_SECRET', 'Secret client Google OAuth');
validateOptional('PORT', 'Porta del server');
validateOptional('NODE_ENV', 'Ambiente di esecuzione');

// Validazioni specifiche
console.log('\n📋 Validazioni specifiche:');
isValid &= validateBoolean('AUTH_LOCAL_ENABLED', 'AUTH_LOCAL_ENABLED');
isValid &= validateBoolean('AUTH_GOOGLE_ENABLED', 'AUTH_GOOGLE_ENABLED');
isValid &= validateNumber('PORT', 'Porta del server', 1, 65535);

// Verifica Google OAuth se abilitato
if (process.env.AUTH_GOOGLE_ENABLED === 'true') {
  if (!process.env.GOOGLE_CLIENT_ID) {
    console.error('❌ GOOGLE_CLIENT_ID è obbligatorio quando AUTH_GOOGLE_ENABLED=true');
    isValid = false;
  }
  if (!process.env.GOOGLE_CLIENT_SECRET) {
    console.error('❌ GOOGLE_CLIENT_SECRET è obbligatorio quando AUTH_GOOGLE_ENABLED=true');
    isValid = false;
  }
}

// Verifica SESSION_SECRET
if (process.env.SESSION_SECRET && process.env.SESSION_SECRET.length < 32) {
  console.warn('⚠️ SESSION_SECRET dovrebbe essere almeno 32 caratteri per sicurezza');
}

// Verifica NODE_ENV
if (process.env.NODE_ENV && !['development', 'staging', 'production'].includes(process.env.NODE_ENV)) {
  console.warn(`⚠️ NODE_ENV "${process.env.NODE_ENV}" non è un ambiente standard`);
}

// Riepilogo
console.log('\n📊 Riepilogo configurazione:');
console.log(`  - Database: ${process.env.DATABASE_URL ? '✅' : '❌'}`);
console.log(`  - Session: ${process.env.SESSION_SECRET ? '✅' : '❌'}`);
console.log(`  - Auth Locale: ${process.env.AUTH_LOCAL_ENABLED === 'true' ? '✅' : '❌'}`);
console.log(`  - Auth Google: ${process.env.AUTH_GOOGLE_ENABLED === 'true' ? '✅' : '❌'}`);
console.log(`  - Porta: ${process.env.PORT || '8080'}`);
console.log(`  - Ambiente: ${process.env.NODE_ENV || 'development'}`);

// Risultato finale
if (isValid) {
  console.log('\n🎉 Configurazione ambiente valida!');
  process.exit(0);
} else {
  console.log('\n❌ Configurazione ambiente non valida!');
  console.log('💡 Correggi gli errori e riprova');
  process.exit(1);
}
