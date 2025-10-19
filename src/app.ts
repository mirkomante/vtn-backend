import express from 'express';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import expressLayouts from 'express-ejs-layouts';
import session from 'express-session';
import pgSession from 'connect-pg-simple';
import passport from 'passport';
import { configurePassport } from './config/passport';
import { flashMessages as customFlashMessages } from './middlewares/flashMessages';
import { userToLocals } from './middlewares/global';
import { jsonErrorHandler } from './middlewares/api/errorHandler';
import DatabaseLogger from './utils/dbLogger';
import { EnvironmentValidator } from './config/env';
import DatabaseSetup from './setup/databaseSetup';
import FirstRunSetup from './setup/firstRunSetup';
import HealthCheckMiddleware from './middlewares/healthCheck';

const app = express();

// Validazione configurazione ambiente
let config;
try {
  console.log('🔄 Validazione configurazione ambiente...');
  config = EnvironmentValidator.validate();
  console.log('✅ Configurazione ambiente validata');
} catch (error) {
  console.error('❌ Errore configurazione ambiente:', error);
  console.error('💡 Verifica che tutte le variabili d\'ambiente siano configurate correttamente');
  process.exit(1);
}

export const prisma = new PrismaClient();

// Configurazione del session store
const PgSession = pgSession(session);

// Configurazione delle sessioni (condizionale per ambiente)
const sessionConfig: any = {
  secret: config.session.secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: config.session.maxAge,
    secure: config.session.secure,
    httpOnly: true,
    sameSite: 'lax' // Aggiunto per Cloud Run
  }
};

// Solo in produzione usa PostgreSQL per le sessioni
if (config.server.nodeEnv === 'production') {
  sessionConfig.store = new PgSession({
    conString: config.database.url,
    tableName: 'session'
  });
}

app.use(session(sessionConfig));


// Configurazione di Passport
app.use(passport.initialize());
app.use(passport.session());
configurePassport(passport);

// Middleware globali
app.use(customFlashMessages);
app.use(userToLocals);

// Configurazione EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configurazione Layout
app.use(expressLayouts);
app.set('layout', 'layouts/default');
app.set('layout extractStyles', true);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Middleware per gestione errori JSON (deve essere dopo express.json())
app.use(jsonErrorHandler);

// Routes
console.log('🔍 [APP DEBUG] Inizio importazione routes...');
import indexRoutes from './routes/index';
console.log('🔍 [APP DEBUG] indexRoutes importato');
import adminRoutes from './routes/admin';
console.log('🔍 [APP DEBUG] adminRoutes importato');
import authRoutes from './routes/auth';
console.log('🔍 [APP DEBUG] authRoutes importato');
import ristoranteMenuRoutes from './routes/ristoranteMenu';
console.log('🔍 [APP DEBUG] ristoranteMenuRoutes importato');
console.log('🔍 [APP DEBUG] Importazione apiV1Routes...');
import apiV1Routes from './routes/api/v1';
console.log('🔍 [APP DEBUG] apiV1Routes importato con successo');
import apiV1MinimalRoutes from './routes/api/v1/minimal';
console.log('🔍 [APP DEBUG] apiV1MinimalRoutes importato');
console.log('🔍 [APP DEBUG] Tutte le routes importate con successo');

// Health Check Endpoints (prima di tutto)
app.get('/health', HealthCheckMiddleware.healthCheck);
app.get('/health/ready', HealthCheckMiddleware.readinessCheck);
app.get('/health/live', HealthCheckMiddleware.livenessCheck);

// Endpoint di test semplice
app.get('/test', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    port: config.server.port,
    environment: config.server.nodeEnv
  });
});

// API Routes (senza autenticazione)
console.log('🔍 [APP DEBUG] Importazione router API v1 completata');
console.log('🔍 [APP DEBUG] Mounting router API v1 su /api/v1');
app.use('/api/v1', apiV1Routes);
console.log('🔍 [APP DEBUG] Router API v1 montato con successo');
console.log('🔍 [APP DEBUG] Mounting router API v1-minimal su /api/v1-minimal');
app.use('/api/v1-minimal', apiV1MinimalRoutes);
console.log('🔍 [APP DEBUG] Router API v1-minimal montato con successo');

// Le rotte di autenticazione devono essere definite prima delle rotte protette
app.use('/auth', authRoutes);

// Rotte protette
app.use('/', indexRoutes);
app.use('/admin', adminRoutes);
app.use('/ristorante-menu', ristoranteMenuRoutes);

// Setup automatico (async, non blocca l'avvio)
(async () => {
  try {
    console.log('🔄 Avviando setup automatico...');
    
    // 1. Setup database
    await DatabaseSetup.ensureDatabaseReady();
    
    // 2. Setup primo avvio se necessario
    await FirstRunSetup.performSetupIfNeeded();
    
    console.log('✅ Setup automatico completato');
    
    // 3. Log database (dopo setup)
    DatabaseLogger.info('VTN Backend started successfully', {
      environment: config.server.nodeEnv,
      port: config.server.port,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Errore durante setup automatico:', error);
    // Non blocca l'avvio, ma logga l'errore
    console.error('⚠️ L\'applicazione continuerà senza setup automatico');
  }
})();

console.log('🚀 VTN Backend started successfully!');
console.log(`📊 Logging system activated - Environment: ${config.server.nodeEnv}`);

export default app; 