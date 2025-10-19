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
import indexRoutes from './routes/index';
import adminRoutes from './routes/admin';
import authRoutes from './routes/auth';
import ristoranteMenuRoutes from './routes/ristoranteMenu';
import apiV1Routes from './routes/api/v1';

// Health Check Endpoints (prima di tutto)
app.get('/health', HealthCheckMiddleware.healthCheck);
app.get('/health/ready', HealthCheckMiddleware.readinessCheck);
app.get('/health/live', HealthCheckMiddleware.livenessCheck);

// API Semplice per test (senza middleware API specifici)
app.get('/api-simple/piatti', async (_req, res) => {
  try {
    console.log('[API-SIMPLE] Richiesta piatti ricevuta');
    const piatti = await prisma.piatto.findMany({
      where: { 
        deletedAt: null, 
        inLista: true, 
        soloMenuFissi: false 
      },
      include: { 
        categoria: {
          select: {
            id: true,
            nome: true,
            descrizione: true
          }
        }, 
        allergeni: { 
          include: { 
            allergene: {
              select: {
                id: true,
                nome: true,
                descrizione: true
              }
            } 
          } 
        } 
      },
      orderBy: {
        nome: 'asc'
      }
    });
    
    console.log(`[API-SIMPLE] Trovati ${piatti.length} piatti`);
    res.json({ 
      success: true, 
      data: piatti,
      meta: {
        count: piatti.length,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('[API-SIMPLE] Errore:', error);
    res.status(500).json({ 
      success: false, 
      error: {
        code: 'DATABASE_ERROR',
        message: 'Errore nel recupero dei piatti',
        details: error instanceof Error ? error.message : 'Errore sconosciuto'
      }
    });
  }
});

// API Routes (senza autenticazione)
app.use('/api/v1', apiV1Routes);

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