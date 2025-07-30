import express from 'express';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import expressLayouts from 'express-ejs-layouts';
import session from 'express-session';
import pgSession from 'connect-pg-simple';
import passport from 'passport';
import flash from 'connect-flash';
import { configurePassport } from './config/passport';
import { flashMessages, userToLocals } from './middlewares/global';
import { Pool } from 'pg';

const app = express();
export const prisma = new PrismaClient();

// Configurazione del session store
const PgSession = pgSession(session);
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Configurazione delle sessioni
app.use(session({
  store: new PgSession({
    pool: pool,
    tableName: 'session'
  }),
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 60 * 1000, // 1 ora
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true
  }
}));

// Configurazione di Passport
app.use(passport.initialize());
app.use(passport.session());
configurePassport(passport);

// Configurazione di Flash
app.use(flash());

// Middleware globali
app.use(flashMessages);
app.use(userToLocals);

// Configurazione EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configurazione Layout
app.use(expressLayouts);
app.set('layout', 'layouts/default');
app.set('layout extractScripts', true);
app.set('layout extractStyles', true);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
import indexRoutes from './routes/index';
import adminRoutes from './routes/admin';
import authRoutes from './routes/auth';
import ristoranteMenuRoutes from './routes/ristoranteMenu';

// Le rotte di autenticazione devono essere definite prima delle rotte protette
app.use('/auth', authRoutes);
app.use('/', indexRoutes);
app.use('/admin', adminRoutes);
app.use('/ristorante-menu', ristoranteMenuRoutes);

export default app; 