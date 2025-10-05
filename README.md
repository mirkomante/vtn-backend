# VTN Backend - Sistema di Gestione Ristorante

## Panoramica

VTN Backend è un sistema completo per la gestione di un ristorante, sviluppato con Node.js, Express, TypeScript e Prisma. Il sistema include gestione utenti, menu, categorie, allergeni e un'interfaccia moderna con Tailwind CSS.

## Caratteristiche Principali

### 🏗️ Architettura
- **Backend**: Node.js con Express e TypeScript
- **Database**: PostgreSQL con Prisma ORM
- **Frontend**: EJS templates con Tailwind CSS
- **Autenticazione**: Passport.js con Google OAuth e strategia locale

### 📋 Moduli Principali
- **Gestione Utenti**: CRUD completo con ruoli e permessi
- **Menu Ristorante**: Gestione menu fissi e categorie
- **Allergeni**: Sistema di gestione allergeni
- **Impostazioni**: Configurazione categorie e sottocategorie

### 🎨 Interfaccia Utente
- **Design Responsive**: Ottimizzato per desktop e mobile
- **Componenti UI**: Sistema di componenti riutilizzabili
- **Toast Messages**: Sistema di notifiche moderno
- **Form Unificati**: Gestione centralizzata dei form

## Struttura del Progetto

```
vtn-backend/
├── src/
│   ├── config/           # Configurazioni centralizzate
│   ├── middlewares/      # Middleware Express
│   ├── public/           # Asset statici (CSS, JS)
│   ├── routes/           # Route handlers
│   ├── types/            # Definizioni TypeScript
│   ├── views/            # Template EJS
│   ├── app.ts           # Configurazione Express
│   └── server.ts        # Entry point
├── prisma/              # Schema database e migrazioni
├── dist/                # Build TypeScript
└── docs/                # Documentazione
```

## Sistema di Form Unificato

### FormManager
Il sistema utilizza un **FormManager** centralizzato che sostituisce i vecchi script separati:

- ✅ **Validazione Unificata**: Tutti i form usano lo stesso sistema di validazione
- ✅ **AJAX Uniforme**: Invio asincrono per tutti i form
- ✅ **Gestione Errori**: Sistema di toast integrato
- ✅ **Modifica Massiva**: Supporto per operazioni bulk

### Tipi di Campo Supportati
- `text` - Input di testo
- `email` - Validazione email
- `password` - Campi password
- `number` - Input numerici
- `select` - Dropdown
- `textarea` - Aree di testo
- `toggle` - Switch on/off
- `checkbox` - Checkbox standard
- `radio` - Radio button

## Sistema di Toast

### Caratteristiche
- **Animazioni Fluide**: Appaiono e scompaiono con transizioni smooth
- **Tipi Multipli**: Success, error, warning, info
- **Auto-dismiss**: Si chiudono automaticamente dopo 5 secondi
- **Responsive**: Ottimizzati per tutti i dispositivi

### Utilizzo
```javascript
// Toast specifici
showSuccessToast('Operazione completata!');
showErrorToast('Si è verificato un errore');
showWarningToast('Attenzione: campo obbligatorio');
showInfoToast('Caricamento in corso...');

// Toast generico
showToast('Messaggio personalizzato', 'info', 3000);
```

## Gestione Database

### Prisma Schema
Il database utilizza Prisma con le seguenti entità principali:

- **User**: Gestione utenti con autenticazione
- **CategoriaMenuFisso**: Categorie per menu fissi
- **CategoriaPiatti**: Categorie per piatti
- **Allergene**: Sistema allergeni
- **MenuFisso**: Menu fissi del ristorante

### Migrazioni
```bash
# Genera una nuova migrazione
npm run prisma:migrate

# Applica le migrazioni
npx prisma migrate deploy
```

## Configurazione

### Variabili d'Ambiente
Crea un file `.env` nella root del progetto:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/vtn_db"
SESSION_SECRET="your-session-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### Installazione
```bash
# Installa dipendenze
npm install

# Genera client Prisma
npm run prisma:generate

# Esegui migrazioni
npm run prisma:migrate

# Avvia in sviluppo
npm run dev

# Build per produzione
npm run build
npm start
```

## Script Disponibili

- `npm run dev` - Avvia in modalità sviluppo con hot reload
- `npm run build` - Compila TypeScript e CSS
- `npm start` - Avvia in produzione
- `npm run prisma:generate` - Genera client Prisma
- `npm run prisma:migrate` - Esegue migrazioni database

## Sistema Ristorante-Menu

### Architettura del Sistema

Il sistema ristorante-menu è organizzato in una gerarchia a tre livelli:

1. **Livello principale**: `/ristorante-menu` - Dashboard principale
2. **Livello sezione**: `/ristorante-menu/servizi` e `/ristorante-menu/impostazioni`
3. **Livello sottosezione**: `/ristorante-menu/impostazioni/{sottosezione}` (solo per impostazioni)

### Sezione Servizi (Livello Singolo)

La sezione servizi gestisce i servizi del ristorante con un'interfaccia CRUD completa.

**Endpoint principali**:
- `GET /ristorante-menu/servizi` - Lista servizi
- `GET /ristorante-menu/servizi/nuovo` - Form creazione
- `POST /ristorante-menu/servizi/nuovo` - Creazione servizio
- `POST /ristorante-menu/servizi/nuovo/ajax` - Creazione AJAX
- `GET /ristorante-menu/servizi/dettagli/:id` - Visualizzazione
- `GET /ristorante-menu/servizi/modifica/:id` - Form modifica
- `POST /ristorante-menu/servizi/modifica/:id` - Modifica servizio
- `POST /ristorante-menu/servizi/modifica/:id/ajax` - Modifica AJAX
- `GET /ristorante-menu/servizi/modifica-massa` - Form modifica massiva
- `POST /ristorante-menu/servizi/modifica-massa` - Modifica massiva
- `POST /ristorante-menu/servizi/modifica-massa/ajax` - Modifica massiva AJAX
- `DELETE /ristorante-menu/servizi/:id` - Eliminazione singola
- `DELETE /ristorante-menu/servizi` - Eliminazione multipla

**Campi del servizio**:
- `nome` - Nome del servizio (obbligatorio)
- `descrizione` - Descrizione opzionale
- `prezzo` - Prezzo in euro (obbligatorio, modificabile in massa)
- `inLista` - Visibilità nel menu (toggle, modificabile in massa)

### Sezione Impostazioni (Livello Doppio)

La sezione impostazioni contiene sottosezioni per la gestione delle configurazioni del ristorante.

#### Sottosezioni Disponibili

**1. Allergeni** (`/ristorante-menu/impostazioni/allergeni`)
- Gestione degli allergeni del ristorante
- Campi: `nome`, `descrizione`
- Operazioni: CRUD completo (senza modifica massiva)

**2. Categoria Menu Fisso** (`/ristorante-menu/impostazioni/categoria-menu-fisso`)
- Categorie per i menu fissi
- Campi: `nome`, `descrizione`, `inLista` (toggle)
- Operazioni: CRUD completo + modifica massiva per `inLista`

**3. Categoria Piatti** (`/ristorante-menu/impostazioni/categoria-piatti`)
- Categorie per i piatti
- Campi: `nome`, `descrizione`, `inLista` (toggle)
- Operazioni: CRUD completo + modifica massiva per `inLista`

**Endpoint per sottosezioni**:
- `GET /impostazioni/{sottosezione}` - Lista elementi
- `GET /impostazioni/{sottosezione}/nuovo` - Form creazione
- `POST /impostazioni/{sottosezione}/nuovo` - Creazione
- `POST /impostazioni/{sottosezione}/nuovo/ajax` - Creazione AJAX
- `GET /impostazioni/{sottosezione}/dettagli/:id` - Visualizzazione
- `GET /impostazioni/{sottosezione}/modifica/:id` - Form modifica
- `POST /impostazioni/{sottosezione}/modifica/:id` - Modifica
- `POST /impostazioni/{sottosezione}/modifica/:id/ajax` - Modifica AJAX
- `GET /impostazioni/{sottosezione}/modifica-massa` - Form modifica massiva (solo categorie)
- `POST /impostazioni/{sottosezione}/modifica-massa` - Modifica massiva (solo categorie)
- `DELETE /impostazioni/{sottosezione}/:id` - Eliminazione singola
- `DELETE /impostazioni/{sottosezione}` - Eliminazione multipla

### Componenti Centralizzati

#### 1. Form Manager (`formManager.js`)
- **Gestione unificata** di tutti i form del sistema
- **Validazione client-side** automatica
- **Supporto AJAX** per operazioni asincrone
- **Modifica massiva** con campi configurabili
- **Integrazione toast** per feedback utente

#### 2. Selectable Table (`selectableTable.js`)
- **Tabelle con selezione multipla** per operazioni bulk
- **Paginazione integrata** con configurazione flessibile
- **Azioni personalizzabili** (eliminazione, modifica massiva)
- **Conferme JavaScript** per azioni distruttive
- **Filtri avanzati** con sistema customFilters

#### 3. Sistema di Configurazione

**Form Data** (`sectionFormData.ts`, `subSectionFormData.ts`):
- Configurazione centralizzata dei form
- Supporto per tutti i tipi di campo
- Configurazione modifica massiva per campo
- Validazione e messaggi di errore

**SubSection Config** (`subSectionConfig.ts`):
- Configurazione per sottosezioni
- Empty states personalizzabili
- Configurazione tabelle e azioni
- Titoli dinamici delle pagine

**Action Navigation** (`actionNavConfig.ts`):
- Configurazione pulsanti di navigazione
- Supporto per configurazioni statiche e dinamiche
- Contesti specifici per sottosezioni

### Operazioni AJAX

#### Configurazione Centralizzata
Le route AJAX sono configurate in `ajaxRoutes.ts`:

```typescript
'servizio-new': {
  endpoint: '/ristorante-menu/servizi/nuovo/ajax',
  method: 'POST',
  successMessage: 'Servizio creato con successo',
  errorMessage: 'Errore durante la creazione del servizio',
  redirectUrl: '/ristorante-menu/servizi'
}
```

#### Flusso AJAX
1. **Form Manager** intercetta l'invio del form
2. **Validazione client-side** dei campi obbligatori
3. **Invio AJAX** con `fetch()` API
4. **Gestione risposta**:
   - Successo: Toast di successo + redirect (se configurato)
   - Errore: Toast di errore + visualizzazione errori nel form
5. **Aggiornamento UI** senza ricaricamento pagina

### Vantaggi dell'Architettura

- **Modularità**: Ogni componente è indipendente e riutilizzabile
- **Configurabilità**: Comportamento definito tramite configurazioni
- **Consistenza**: UI/UX uniforme across tutte le sezioni
- **Manutenibilità**: Modifiche centralizzate si propagano ovunque
- **Scalabilità**: Facile aggiunta di nuove sezioni/sottosezioni

## API Endpoints

### Autenticazione
- `GET /auth/google` - Login Google OAuth
- `POST /auth/login` - Login locale
- `GET /auth/logout` - Logout

### Utenti
- `GET /admin/utenti` - Lista utenti
- `POST /admin/utenti` - Crea utente
- `PUT /admin/utenti/:id` - Modifica utente
- `DELETE /admin/utenti/:id` - Elimina utente
- `POST /admin/utenti/modifica-massa` - Modifica massiva

### Menu Ristorante
- `GET /ristorante-menu/menu-fissi` - Lista menu fissi
- `POST /ristorante-menu/menu-fissi` - Crea menu fisso
- `GET /ristorante-menu/impostazioni/*` - Gestione categorie e allergeni

## Componenti UI

### Layout
- **default.ejs** - Layout base
- **main.ejs** - Layout con sidebar
- **sections.ejs** - Layout per sezioni

### Form
- **simpleGenericForm.ejs** - Form generico unificato
- Supporto per tutti i tipi di campo
- Validazione integrata
- Gestione errori

### Tabelle
- **selectableTable.ejs** - Tabelle con selezione multipla
- **stickyHeader.ejs** - Tabelle con header fisso

### Navigazione
- **actionNav.ejs** - Barra azioni
- **sidebar.ejs** - Sidebar responsive

## Sicurezza

- **Autenticazione**: Passport.js con sessioni
- **Validazione**: Validazione lato client e server
- **CSRF Protection**: Protezione CSRF integrata
- **SQL Injection**: Prevenuta tramite Prisma ORM

## Performance

- **Hot Reload**: Sviluppo con ts-node-dev
- **CSS Ottimizzato**: Tailwind CSS con PostCSS
- **Bundle Minimizzato**: Build ottimizzata per produzione
- **Caching**: Cache per asset statici

## Sviluppo

### Struttura Codice
- **TypeScript**: Tipizzazione completa
- **ESLint**: Linting del codice
- **Prettier**: Formattazione automatica
- **Git Hooks**: Pre-commit hooks

### Testing
- **Unit Tests**: Jest per logica business
- **Integration Tests**: Test API endpoints
- **E2E Tests**: Test interfaccia utente

## Deployment

### Produzione
```bash
# Build
npm run build

# Avvia server
npm start
```

### Docker (Opzionale)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["npm", "start"]
```

## Contribuire

1. Fork del repository
2. Crea un branch per la feature
3. Commit delle modifiche
4. Push al branch
5. Crea una Pull Request

## Licenza

Questo progetto è sotto licenza MIT. Vedi il file `LICENSE` per i dettagli.

## Supporto

Per supporto tecnico o domande:
- Apri una issue su GitHub
- Contatta il team di sviluppo
- Consulta la documentazione tecnica
