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

## Sistema di Gestione Cancellazioni

### Architettura Soft Delete

Il sistema implementa un **soft delete** completo per tutti gli elementi del ristorante menu. Ogni modello nel database include un campo `deletedAt` di tipo `DateTime?`:

```typescript
model ServizioAccessorio {
  id          String   @id @default(uuid())
  nome        String
  descrizione String?
  prezzo      Decimal  @db.Decimal(10, 2)
  inLista     Boolean  @default(true)
  deletedAt   DateTime?  // ← Campo per soft delete
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

### Cancellazione Soft (Soft Delete)

#### Funzionamento
La cancellazione soft **non elimina fisicamente** i record dal database, ma imposta il campo `deletedAt` con la data/ora corrente.

#### Implementazione
```typescript
// Cancellazione singola
await prisma.servizioAccessorio.update({
  where: { id },
  data: {
    deletedAt: new Date()  // ← Imposta la data di cancellazione
  }
});

// Cancellazione multipla
await prisma.servizioAccessorio.updateMany({
  where: { 
    id: { in: validIds }
  },
  data: { 
    deletedAt: new Date() 
  }
});
```

#### Endpoint per Cancellazione Soft
- `DELETE /ristorante-menu/servizi/:id` - Cancellazione singola servizio
- `DELETE /ristorante-menu/servizi` - Cancellazione multipla servizi
- `DELETE /ristorante-menu/impostazioni/allergeni/:id` - Cancellazione allergene
- `DELETE /ristorante-menu/impostazioni/allergeni` - Cancellazione multipla allergeni
- `DELETE /ristorante-menu/impostazioni/categoria-menu-fisso/:id` - Cancellazione categoria
- `DELETE /ristorante-menu/impostazioni/categoria-menu-fisso` - Cancellazione multipla categorie
- `DELETE /ristorante-menu/impostazioni/categoria-piatti/:id` - Cancellazione categoria piatti
- `DELETE /ristorante-menu/impostazioni/categoria-piatti` - Cancellazione multipla categorie piatti

#### Filtri nelle Query
Tutte le query per recuperare dati attivi includono il filtro `deletedAt: null`:

```typescript
// Esempio: recupero servizi attivi
const servizi = await prisma.servizioAccessorio.findMany({
  where: {
    deletedAt: null  // ← Solo elementi non cancellati
  },
  orderBy: {
    nome: 'asc'
  }
});
```

### Pagina "/ristorante-menu/cancellati"

#### Funzionalità
La pagina `/ristorante-menu/cancellati` è una **vista unificata** di tutti gli elementi cancellati del sistema.

#### Database View
Utilizza una **view SQL** chiamata `ElementiCancellati` che unisce tutti i modelli cancellati:

```sql
CREATE OR REPLACE VIEW "ElementiCancellati" AS
SELECT 
  id, nome, descrizione, "deletedAt", "createdAt", "updatedAt",
  'categoria-piatti' as type,
  'Categoria Piatti' as type_label,
  NULL as categoria_nome
FROM "categoria_piatti" 
WHERE "deletedAt" IS NOT NULL

UNION ALL

SELECT 
  id, nome, descrizione, "deletedAt", "createdAt", "updatedAt",
  'categoria-menu-fisso' as type,
  'Categoria Menu Fisso' as type_label,
  NULL as categoria_nome
FROM "categoria_menu_fisso" 
WHERE "deletedAt" IS NOT NULL

-- ... altri UNION ALL per allergeni, piatti, servizi, menu fissi
```

#### Caratteristiche della Pagina
- **Filtri per tipo**: Dropdown per filtrare per tipo di elemento
- **Paginazione**: 20 elementi per pagina
- **Azioni disponibili**:
  - **Ripristina** (verde) - Ripristina elementi selezionati
  - **Elimina definitivamente** (rosso) - Eliminazione fisica irreversibile
- **Conferme JavaScript**: Doppia conferma per azioni distruttive

#### Struttura Tabella
```typescript
// Configurazione tabella elementi cancellati
export const elementiCancellatiTableData: TableDataSchema = {
  tableHeads: [
    { label: 'Nome', sort: true, name: 'nome', mobile: true },
    { label: 'Tipo', sort: true, name: 'type_label', mobile: false },
    { label: 'Descrizione', sort: false, name: 'descrizione', mobile: false },
    { label: 'Categoria', sort: false, name: 'categoria_nome', mobile: false },
    { label: 'Data Cancellazione', sort: true, name: 'deletedAt', mobile: false }
  ]
}
```

### Sistema di Ripristino

#### Endpoint
`POST /ristorante-menu/restore`

#### Funzionamento
Il sistema di ripristino **rimuove il campo `deletedAt`** (lo imposta a `null`), rendendo l'elemento nuovamente visibile nelle query normali.

#### Implementazione
```typescript
// Ripristino per tipo di elemento
switch (type) {
  case 'servizio-accessorio':
    await prisma.servizioAccessorio.updateMany({
      where: { id: { in: validIds } },
      data: { deletedAt: null }  // ← Rimuove la cancellazione
    });
    break;
  // ... altri tipi
}
```

#### Caratteristiche
- **Ripristino multiplo**: Supporta ripristino di elementi diversi in un'unica operazione
- **Validazione**: Verifica che gli elementi siano effettivamente cancellati prima del ripristino
- **Raggruppamento per tipo**: Ottimizza le query raggruppando per tipo di elemento
- **Feedback dettagliato**: Restituisce conteggi di elementi ripristinati e saltati

### Cancellazione Definitiva (Hard Delete)

#### Endpoint
`DELETE /ristorante-menu/permanent-delete`

#### Funzionamento
La cancellazione definitiva **elimina fisicamente** i record dal database utilizzando `deleteMany()`.

#### Implementazione
```typescript
// Eliminazione fisica
const deletedServizi = await prisma.servizioAccessorio.deleteMany({
  where: { 
    id: { in: ids as string[] },
    deletedAt: { not: null }  // ← Solo elementi già cancellati
  }
});
```

#### Controlli di Sicurezza
- **Verifica dipendenze**: Per categorie, verifica che non ci siano elementi associati attivi
- **Solo elementi cancellati**: Può eliminare solo elementi con `deletedAt` non null
- **Conferme multiple**: Richiede doppia conferma JavaScript

#### Esempio Controllo Dipendenze
```typescript
case 'categoria-piatti':
  // Verifica che non ci siano piatti associati
  const piattiAssociati = await prisma.piatto.findMany({
    where: { 
      categoriaId: { in: ids as string[] },
      deletedAt: null  // ← Solo piatti attivi
    }
  });
  
  if (piattiAssociati.length > 0) {
    // Non può eliminare categorie con piatti associati
    skipped = (ids as string[]).length;
    continue;
  }
```

### Flusso Completo di Gestione

#### 1. Cancellazione Normale
1. Utente clicca "Elimina" → Conferma JavaScript
2. Invio AJAX a `DELETE /path/:id` o `DELETE /path`
3. Server imposta `deletedAt = new Date()`
4. Elemento scompare dalle liste normali
5. Toast di successo

#### 2. Visualizzazione Elementi Cancellati
1. Utente naviga a `/ristorante-menu/cancellati`
2. Server esegue query sulla view `ElementiCancellati`
3. Visualizzazione tabella con filtri e paginazione
4. Elementi mostrano data di cancellazione e tipo

#### 3. Ripristino
1. Utente seleziona elementi → Clicca "Ripristina"
2. Conferma JavaScript → Invio AJAX a `POST /ristorante-menu/restore`
3. Server imposta `deletedAt = null` per tutti i tipi
4. Elementi tornano visibili nelle liste normali
5. Toast di successo con conteggi

#### 4. Eliminazione Definitiva
1. Utente seleziona elementi → Clicca "Elimina definitivamente"
2. **Doppia conferma** JavaScript con avviso "irreversibile"
3. Invio AJAX a `DELETE /ristorante-menu/permanent-delete`
4. Server verifica dipendenze e elimina fisicamente
5. Elementi rimossi permanentemente dal database

### Vantaggi del Sistema di Cancellazioni

- **Sicurezza**: Doppio livello di protezione (soft delete + conferme)
- **Recuperabilità**: Possibilità di ripristinare elementi cancellati per errore
- **Tracciabilità**: Data di cancellazione sempre disponibile
- **Performance**: Query ottimizzate con filtri `deletedAt`
- **Flessibilità**: Gestione unificata di tutti i tipi di elemento
- **UX**: Interfaccia intuitiva con conferme e feedback chiari

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
