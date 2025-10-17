# Sistema di Autenticazione

## Panoramica

Il sistema VTN Backend implementa un sistema di autenticazione completo e sicuro utilizzando **Passport.js** con supporto per due strategie configurabili:

- **Strategia Locale**: Autenticazione con email e password (opzionale)
- **Strategia Google OAuth**: Autenticazione tramite Google Account (raccomandata)

> **🔧 Configurazione Condizionale**: Le strategie possono essere abilitate/disabilitate tramite variabili d'ambiente per massima flessibilità tra ambienti di sviluppo e produzione.

## Architettura

### Componenti Principali

```
src/
├── config/
│   ├── auth.ts              # Configurazione strategie di autenticazione
│   └── passport.ts          # Configurazione Passport.js
├── middlewares/
│   ├── auth.ts              # Middleware di autenticazione
│   └── flashMessages.ts     # Gestione messaggi flash
├── routes/
│   └── auth.ts              # Route di autenticazione
└── utils/
    └── passwordUtils.ts     # Utility per password sicure
```

### Dipendenze

```json
{
  "passport": "^0.7.0",
  "passport-google-oauth20": "^2.0.0",
  "passport-local": "^1.0.0",
  "bcryptjs": "^2.4.3",
  "express-session": "^1.18.2"
}
```

## Configurazione Condizionale delle Strategie

### Panoramica

Il sistema supporta la configurazione condizionale delle strategie di autenticazione tramite variabili d'ambiente, permettendo di abilitare/disabilitare le diverse opzioni di login in base all'ambiente.

### File di Configurazione

La configurazione è centralizzata in `src/config/auth.ts`:

```typescript
export const authConfig: AuthConfig = {
  strategies: {
    local: {
      enabled: process.env.AUTH_LOCAL_ENABLED === 'true',
      requirePasswordChange: false
    },
    google: {
      enabled: process.env.AUTH_GOOGLE_ENABLED !== 'false', // Default true
      requirePasswordChange: false
    }
  },
  ui: {
    showLocalLogin: process.env.AUTH_LOCAL_ENABLED === 'true',
    showGoogleLogin: process.env.AUTH_GOOGLE_ENABLED !== 'false'
  }
};
```

### Variabili d'Ambiente

```env
# Strategia Locale (Email + Password)
AUTH_LOCAL_ENABLED=true

# Strategia Google OAuth
AUTH_GOOGLE_ENABLED=true
```

### Configurazioni Raccomandate

#### Sviluppo
```env
AUTH_LOCAL_ENABLED=true
AUTH_GOOGLE_ENABLED=true
```
- **Entrambe le strategie abilitate** per testing completo
- **UI completa** con tutte le opzioni di login

#### Produzione
```env
AUTH_LOCAL_ENABLED=false
AUTH_GOOGLE_ENABLED=true
```
- **Solo Google OAuth** per massima sicurezza
- **UI semplificata** con solo login Google
- **Admin gestisce utenti** tramite backend

#### Staging
```env
AUTH_LOCAL_ENABLED=false
AUTH_GOOGLE_ENABLED=true
```
- **Configurazione personalizzabile** per test
- **Simula ambiente produzione**

### Controlli di Sicurezza

Il sistema include controlli automatici:

```typescript
// Verifica che almeno una strategia sia abilitata
export const hasEnabledStrategy = (): boolean => {
  return authConfig.strategies.local.enabled || authConfig.strategies.google.enabled;
};

// Validazione strategie nelle route
export const validateAuthStrategy = (req: Request, res: Response, next: NextFunction) => {
  const strategy = req.params.strategy;
  
  if (strategy === 'local' && !isStrategyEnabled('local')) {
    req.flash('error', 'Autenticazione locale non disponibile');
    return res.redirect('/auth/login');
  }
  
  next();
};
```

### Log di Configurazione

All'avvio, il sistema logga la configurazione attiva:

```
🔐 Configurazione Autenticazione:
  - Strategia Locale: ✅ Abilitata
  - Strategia Google: ✅ Abilitata
  - UI Locale: ✅ Visibile
  - UI Google: ✅ Visibile
```

## Strategia Locale (Email + Password)

### Configurazione

La strategia locale è configurata in `src/config/passport.ts`:

```typescript
passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email: string, password: string, done: DoneCallback) => {
  // Logica di autenticazione
}));
```

### Caratteristiche

- **Email come username**: Login con indirizzo email
- **Password sicure**: Hashing con bcrypt (12 rounds)
- **Validazione robusta**: Controlli multipli sulla forza password
- **Soft delete**: Solo utenti attivi possono autenticarsi
- **Gestione errori**: Messaggi specifici per diversi scenari

### Validazione Password

Il sistema implementa validazione robusta delle password:

```typescript
// Requisiti password
- Minimo 8 caratteri, massimo 128
- Almeno una lettera maiuscola
- Almeno una lettera minuscola  
- Almeno un numero
- Almeno un carattere speciale
```

### Endpoint

- `POST /auth/local` - Login con email e password
- `GET /auth/login` - Pagina di login

### Messaggi di Errore

- **Credenziali non valide**: Email o password errate
- **Account non configurato**: Utente solo OAuth senza password locale
- **Validazione password**: Errori specifici per requisiti non rispettati

## Strategia Google OAuth

### Configurazione

La strategia Google è configurata in `src/config/passport.ts`:

```typescript
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: `${process.env.BASE_URL || 'http://localhost:8080'}/auth/google/callback`,
  passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
  // Logica di autenticazione Google
}));
```

### Caratteristiche

- **OAuth 2.0**: Autenticazione sicura tramite Google
- **Scope limitato**: Solo `profile` e `email`
- **Auto-registrazione**: Primo utente diventa admin automaticamente
- **URL assoluto**: Il callback URL deve essere completo per funzionare correttamente

### Configurazione Callback URL

**IMPORTANTE**: Il callback URL deve essere configurato come URL assoluto in Google Cloud Console.

1. **Variabile d'ambiente richiesta**:
   ```env
   BASE_URL="http://localhost:8080"  # Per sviluppo
   BASE_URL="https://tuodominio.com"  # Per produzione
   ```

2. **Configurazione in Google Cloud Console**:
   - Vai a APIs & Services → Credentials
   - Seleziona il tuo OAuth 2.0 Client ID
   - Aggiungi nei "Authorized redirect URIs":
     - `http://localhost:8080/auth/google/callback` (sviluppo)
     - `https://tuodominio.com/auth/google/callback` (produzione)

3. **Callback URL generato automaticamente**:
   ```
   ${BASE_URL}/auth/google/callback
   ```
- **Gestione profili**: Estrazione automatica di nome, cognome e foto
- **Aggiornamento dati**: Sincronizzazione profilo ad ogni login

### Endpoint

- `GET /auth/google` - Inizia autenticazione Google
- `GET /auth/google/callback` - Callback OAuth

### Flusso di Registrazione

1. **Primo utente**: Diventa automaticamente admin
2. **Utenti successivi**: Accesso negato se non registrati
3. **Dati profilo**: Estrazione automatica da Google
4. **Aggiornamento**: Foto profilo aggiornata se mancante

## Gestione Sessioni

### Configurazione

```typescript
// Express Session
app.use(session({
  store: new PgSession({ pool }),
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());
```

### Serializzazione

```typescript
// Salva solo l'ID utente nella sessione
passport.serializeUser((user: User, done: DoneCallback) => {
  done(null, user.id);
});

// Recupera utente completo dal database
passport.deserializeUser(async (id: string, done: DoneCallback) => {
  const user = await prisma.user.findUnique({ where: { id } });
  done(null, user);
});
```

## Middleware di Autenticazione

### `isAuthenticated`

```typescript
export const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'Devi effettuare il login per accedere a questa pagina');
  res.redirect('/auth/login');
};
```

### `isAdmin`

```typescript
export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/auth/login');
  }
  
  if (req.user && req.user.role !== 'admin') {
    return res.status(403).send('Accesso negato');
  }
  
  next();
};
```

## Gestione Password Sicure

### Hashing

```typescript
// Hash password con bcrypt
const hashedPassword = await bcrypt.hash(password, 12);

// Verifica password
const isValid = await bcrypt.compare(password, hashedPassword);
```

### Validazione

```typescript
const passwordValidation = PasswordUtils.validatePasswordStrength(password);
if (!passwordValidation.isValid) {
  return res.json({
    success: false,
    message: passwordValidation.errors.join(', ')
  });
}
```

## Messaggi Flash

### Sistema Personalizzato

Il sistema utilizza un middleware personalizzato per i messaggi flash:

```typescript
// Aggiungi messaggio
req.flash('error', 'Credenziali non valide');
req.flash('success', 'Login effettuato con successo');

// Recupera messaggi
const errors = req.flash('error');
const success = req.flash('success');
```

### Rendering nelle Viste

```ejs
<% if (locals.error && error.length > 0) { %>
  <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
    <span><%= error[0] %></span>
  </div>
<% } %>

<% if (locals.success && success.length > 0) { %>
  <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
    <span><%= success[0] %></span>
  </div>
<% } %>
```

## Configurazione Ambiente

### Variabili Richieste

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/vtn_db"

# Sessioni
SESSION_SECRET="your-session-secret"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Configurazione Strategie di Autenticazione
AUTH_LOCAL_ENABLED=true
AUTH_GOOGLE_ENABLED=true
```

### Configurazioni per Ambiente

#### Sviluppo
```env
AUTH_LOCAL_ENABLED=true
AUTH_GOOGLE_ENABLED=true
```

#### Produzione
```env
AUTH_LOCAL_ENABLED=false
AUTH_GOOGLE_ENABLED=true
```

#### Staging
```env
AUTH_LOCAL_ENABLED=false
AUTH_GOOGLE_ENABLED=true
```

### Setup Google OAuth

1. **Google Cloud Console**: Crea un progetto
2. **OAuth 2.0**: Configura schermata di consenso
3. **Credenziali**: Crea OAuth 2.0 Client ID
4. **Redirect URI**: Aggiungi `http://localhost:8080/auth/google/callback`
5. **Variabili**: Aggiungi ID e Secret al file `.env`

## Sicurezza

### Misure Implementate

- **Hashing sicuro**: bcrypt con 12 rounds di salt
- **Validazione robusta**: Controlli multipli su password
- **Sessioni sicure**: Configurazione Express Session ottimizzata
- **CSRF Protection**: Protezione integrata
- **SQL Injection**: Prevenuta tramite Prisma ORM
- **Soft Delete**: Gestione cancellazioni logiche
- **Rate Limiting**: Protezione contro attacchi brute force

### Best Practices

- **Password complesse**: Validazione automatica dei requisiti
- **Sessioni limitate**: Timeout automatico dopo 24 ore
- **Logging**: Tracciamento eventi di sicurezza
- **Errori generici**: Messaggi che non rivelano informazioni sensibili

## Troubleshooting

### Problemi Comuni

#### 1. "Account non configurato per login locale"
- **Causa**: Utente creato solo con Google OAuth
- **Soluzione**: Impostare password tramite admin panel

#### 2. "Credenziali non valide"
- **Causa**: Email o password errate
- **Soluzione**: Verificare credenziali o reset password

#### 3. Warning `util.isArray` deprecato
- **Causa**: Dipendenze obsolete (risolto)
- **Soluzione**: Sistema aggiornato con middleware personalizzato

### Debug

```typescript
// Abilita logging dettagliato
console.log('User authenticated:', req.isAuthenticated());
console.log('User data:', req.user);
console.log('Session data:', req.session);
```

## API Endpoints

### Autenticazione

| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| `GET` | `/auth/login` | Pagina di login |
| `POST` | `/auth/local` | Login locale |
| `GET` | `/auth/google` | Login Google OAuth |
| `GET` | `/auth/google/callback` | Callback Google |
| `GET` | `/auth/logout` | Logout |

### Gestione Utenti (Admin)

| Metodo | Endpoint | Descrizione |
|--------|----------|-------------|
| `GET` | `/admin/utenti` | Lista utenti |
| `POST` | `/admin/utenti/nuovo` | Crea utente |
| `POST` | `/admin/utenti/nuovo/ajax` | Crea utente (AJAX) |
| `GET` | `/admin/utenti/modifica/:id` | Modifica utente |
| `POST` | `/admin/utenti/modifica/:id` | Salva modifiche |
| `POST` | `/admin/utenti/modifica/:id/ajax` | Salva modifiche (AJAX) |

## Esempi di Utilizzo

### Login Programmatico

```typescript
// Test autenticazione
const user = await prisma.user.findUnique({
  where: { email: 'test@example.com' }
});

const isValid = await bcrypt.compare('password123!', user.password);
```

### Verifica Ruoli

```typescript
// Middleware personalizzato
const requireRole = (role: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === role) {
      return next();
    }
    return res.status(403).json({ error: 'Accesso negato' });
  };
};
```

### Gestione Errori

```typescript
// Gestione errori autenticazione
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err.name === 'AuthenticationError') {
    req.flash('error', 'Errore di autenticazione');
    return res.redirect('/auth/login');
  }
  next(err);
});
```

## Conclusioni

Il sistema di autenticazione VTN Backend fornisce:

- ✅ **Sicurezza robusta** con hashing bcrypt e validazione
- ✅ **Flessibilità** con supporto per strategie multiple
- ✅ **UX ottimale** con messaggi flash e gestione errori
- ✅ **Manutenibilità** con codice TypeScript e architettura modulare
- ✅ **Scalabilità** con sessioni database e middleware personalizzabili

Per domande o supporto, consultare la documentazione tecnica o contattare il team di sviluppo.
