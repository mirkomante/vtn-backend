# VTN Backend - Sistema di Gestione Ristorante

## Panoramica

VTN Backend è un sistema completo per la gestione di un ristorante, sviluppato con Node.js, Express, TypeScript e Prisma. Il sistema include gestione utenti, menu, categorie, allergeni e un'interfaccia moderna con Tailwind CSS.

## Caratteristiche Principali

### 🏗️ Architettura
- **Backend**: Node.js con Express e TypeScript
- **Database**: PostgreSQL con Prisma ORM
- **Frontend**: EJS templates con Tailwind CSS
- **Autenticazione**: Passport.js con strategia locale (email/password) e Google OAuth

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
├── docs/                # Documentazione centralizzata
│   ├── api/             # Documentazione API e middleware
│   ├── systems/         # Documentazione sistemi e componenti
│   └── guides/          # Guide e riferimenti per sviluppatori
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

### Panoramica Schema
Il database utilizza PostgreSQL con Prisma ORM e include:

#### Modelli Base
- **User**: Gestione utenti con autenticazione
- **Session**: Gestione sessioni utente

#### Modelli Ristorante Menu
- **CategoriaPiatti**: Categorie per i piatti
- **CategoriaMenuFisso**: Categorie per i menu fissi
- **Allergene**: Sistema di gestione allergeni
- **Piatto**: Piatti del ristorante
- **ServizioAccessorio**: Servizi accessori del ristorante
- **MenuFisso**: Menu fissi del ristorante

#### Modelli Bevande (Nuovo)
- **Nazione, Regione, Zona**: Struttura geografica gerarchica
- **Tipologie**: TipologiaVino, TipologiaBirra, TipologiaLiquore, TipologiaCocktail, TipologiaBevanda
- **Bevande**: Vino, Birra, Liquore, Cocktail, Bevanda

### Caratteristiche Speciali
- **Soft Delete**: Tutti i modelli supportano cancellazione logica
- **Indicazioni Geografiche**: Sistema completo per vini (Nazione → Regione → Zona)
- **Gestione Prezzi**: Supporto prezzo bottiglia e calice per vini
- **Relazioni Flessibili**: Struttura ottimizzata per query efficienti

### Documentazione Completa
📋 **Per una documentazione dettagliata completa del database**, inclusi tutti i modelli, campi, relazioni ed esempi di utilizzo, consulta il file [DATABASE_SCHEMA.md](./docs/guides/database-schema.md).

### Migrazioni
```bash
# Genera una nuova migrazione
npm run prisma:migrate

# Applica le migrazioni
npx prisma migrate deploy

# Reset del database (sviluppo)
npx prisma migrate reset
```

## Configurazione

### Variabili d'Ambiente
Crea un file `.env` nella root del progetto:

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

#### Configurazioni Raccomandate per Ambiente

**Sviluppo** (entrambe le strategie per testing):
```env
AUTH_LOCAL_ENABLED=true
AUTH_GOOGLE_ENABLED=true
```

**Produzione** (solo Google OAuth per sicurezza):
```env
AUTH_LOCAL_ENABLED=false
AUTH_GOOGLE_ENABLED=true
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

> **Nota**: Per dettagli completi sulla configurazione delle sottosezioni, vedi la sezione [Configurazione Sottosezioni](#configurazione-sottosezioni).

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

## Sistema di Configurazione Viste e Tabelle

### Architettura del Sistema di Configurazione

Il sistema utilizza una **configurazione centralizzata** per definire viste, tabelle e azioni. La configurazione è organizzata in diversi livelli:

#### Schema Base (`tableDataSchema.ts`)
```typescript
export interface TableDataSchema {
  tableHeads: TableHeader[];  // Intestazioni colonne
  fields: TableField[];       // Campi dati
  labels?: TableLabel[];      // Etichette opzionali
}

export interface TableHeader {
  label: string;    // Testo intestazione
  sort: boolean;    // Ordinabile
  name: string;     // Nome campo
  mobile: boolean;  // Visibile su mobile
  icon?: string;    // Icona opzionale
}

export interface TableField {
  name: string;     // Nome campo
  label: boolean;   // È campo principale
  edit: boolean;    // Modificabile
  type: string;     // Tipo dato (text, currency, boolean, date)
}
```

### Configurazione delle Colonne

#### Sezioni Principali (`sectionTableData.ts`)
Le sezioni principali (come servizi) definiscono le colonne direttamente:

```typescript
export const serviziTableData: TableDataSchema = {
  tableHeads: [
    { label: 'Nome', sort: true, name: 'nome', mobile: true },
    { label: 'Descrizione', sort: false, name: 'descrizione', mobile: false },
    { label: 'Prezzo', sort: true, name: 'prezzo', mobile: false },
    { label: 'In Lista', sort: true, name: 'inLista', mobile: false }
  ],
  fields: [
    { name: 'nome', label: true, edit: false, type: 'text' },
    { name: 'descrizione', label: false, edit: false, type: 'text' },
    { name: 'prezzo', label: false, edit: false, type: 'currency' },
    { name: 'inLista', label: false, edit: false, type: 'boolean' }
  ]
}
```

#### Sottosezioni (`subSectionConfig.ts`)
Le sottosezioni (come allergeni, categorie) definiscono le colonne nella configurazione:

```typescript
export const allergeniConfig: SubSectionConfig = {
  tableData: {
    tableHeads: [
      { label: 'Nome', mobile: true },
      { label: 'Descrizione', mobile: false }
    ],
    fields: [
      { name: 'nome' },
      { name: 'descrizione' }
    ]
  }
}
```

> **Nota**: Per una spiegazione completa della configurazione delle sottosezioni, vedi la sezione [Configurazione Sottosezioni](#configurazione-sottosezioni).

### Configurazione delle Azioni

#### Azioni nelle Sezioni Principali
Le azioni sono definite direttamente nelle viste EJS:

```ejs
<%- include('../../../ui/tables/selectableTable', {
  tableConfig: {
    idField: 'id',
    labelField: 'nome',
    detailUrl: '/ristorante-menu/servizi/dettagli/:id',
    editUrl: '/ristorante-menu/servizi/modifica/:id',
    bulkEditUrl: '/ristorante-menu/servizi/modifica-massa',
    editMultipleButton: {
      text: 'Modifica'
    },
    actionButton: {
      text: 'Elimina',
      classes: 'bg-red-600 text-white ring-red-600 hover:bg-red-700'
    },
    endpoint: '/ristorante-menu/servizi',
    method: 'DELETE',
    confirmMessage: 'Sei sicuro di voler eliminare questo servizio?',
    confirmMessageMultiple: 'Sei sicuro di voler eliminare {count} servizi?',
    successMessage: 'Eliminati {count} servizio/i con successo',
    errorMessage: 'Errore durante l\'eliminazione'
  }
}) %>
```

#### Azioni nelle Sottosezioni
Le azioni sono configurate centralmente in `subSectionConfig.ts`:

```typescript
export const allergeniConfig: SubSectionConfig = {
  tableConfig: {
    tableId: 'allergeni-table',
    idField: 'id',
    labelField: 'nome',
    detailUrl: '/ristorante-menu/impostazioni/allergeni/dettagli/:id',
    editUrl: '/ristorante-menu/impostazioni/allergeni/modifica/:id',
    bulkEditUrl: undefined,  // Nessuna modifica massiva
    actionButton: {
      text: 'Nuovo Allergene',
      href: '/ristorante-menu/impostazioni/allergeni/nuovo'
    },
    editMultipleButton: undefined,
    deleteButton: {
      text: 'Elimina',
      classes: 'bg-red-600 text-white ring-red-600 hover:bg-red-700'
    },
    endpoint: '/ristorante-menu/impostazioni/allergeni',
    method: 'DELETE',
    confirmMessage: 'Sei sicuro di voler eliminare questo allergene?',
    confirmMessageMultiple: 'Sei sicuro di voler eliminare {count} allergeni?',
    successMessage: 'Eliminati {count} allergene/i con successo',
    errorMessage: 'Errore durante l\'eliminazione',
    includeScripts: true
  }
}
```

> **Nota**: Per dettagli completi sulla configurazione delle sottosezioni, vedi la sezione [Configurazione Sottosezioni](#configurazione-sottosezioni).

### Componenti UI Utilizzati

#### Selectable Table (`selectableTable.ejs`)
Il componente principale per le tabelle con selezione multipla:

**Caratteristiche**:
- **Selezione multipla** con checkbox
- **Azioni bulk** (modifica massiva, eliminazione)
- **Paginazione integrata**
- **Filtri personalizzabili**
- **Responsive design**

#### Table Content (`tableContent.ejs`)
Il contenuto effettivo della tabella con:
- **Intestazioni dinamiche** basate su `tableData.tableHeads`
- **Celle dati** configurate tramite `tableData.fields`
- **Link cliccabili** per il campo principale (`labelField`)
- **Checkbox di selezione** per ogni riga
- **Azioni bulk** che appaiono quando elementi sono selezionati

#### Empty States (`simple.ejs`)
Stati vuoti personalizzabili con:
- **Icona personalizzata** con SVG
- **Titolo e descrizione** configurabili
- **Bottone di azione** con link personalizzabile
- **Design responsive** e accessibile

#### Action Navigation (`actionNav.ejs`)
Barra di navigazione con azioni:
- **Link di navigazione** (torna alla lista, nuovo elemento)
- **Bottoni di azione** con ID personalizzabili
- **Spacing automatico** tra elementi
- **Classi CSS configurabili**

#### Filters (`simpleFilter.ejs`)
Sistema di filtri avanzato con:
- **Dropdown personalizzati** con ricerca
- **Input di testo** per filtri liberi
- **Input data** per filtri temporali
- **Bottone "Azzera"** per rimuovere filtri attivi
- **Gestione stato** dei filtri attivi

### Flusso di Configurazione

#### Per Sezioni Principali (es. Servizi)
1. **Definizione colonne** in `sectionTableData.ts`
2. **Configurazione azioni** direttamente nella vista EJS
3. **Rendering** tramite `selectableTable.ejs`

#### Per Sottosezioni (es. Allergeni)
1. **Definizione completa** in `subSectionConfig.ts`:
   - Colonne (`tableData`)
   - Azioni (`tableConfig`)
   - Empty state (`emptyState`)
2. **Rendering** tramite `subSection.ejs` che usa la configurazione

> **Nota**: Per una spiegazione dettagliata della configurazione delle sottosezioni, vedi la sezione [Configurazione Sottosezioni](#configurazione-sottosezioni).

### Tipi di Azioni Supportate

#### Azioni Singole
- **Visualizzazione**: Link al dettaglio
- **Modifica**: Link al form di modifica
- **Eliminazione**: Bottone con conferma

#### Azioni Multiple
- **Modifica Massiva**: Form per modificare più elementi
- **Eliminazione Multipla**: Eliminazione di elementi selezionati
- **Azioni Personalizzate**: Bottoni configurabili

#### Azioni di Navigazione
- **Nuovo Elemento**: Link al form di creazione
- **Torna alla Lista**: Navigazione di ritorno

### Configurazione JavaScript

Ogni tabella genera una configurazione JavaScript per il frontend:

```javascript
window['servizi-table-config'] = {
  tableId: 'servizi-table',
  idField: 'id',
  labelField: 'nome',
  detailUrl: '/ristorante-menu/servizi/dettagli/:id',
  editUrl: '/ristorante-menu/servizi/modifica/:id',
  bulkEditUrl: '/ristorante-menu/servizi/modifica-massa',
  actionButton: {
    text: 'Elimina',
    classes: 'bg-red-600 text-white ring-red-600 hover:bg-red-700'
  },
  endpoint: '/ristorante-menu/servizi',
  method: 'DELETE',
  confirmMessage: 'Sei sicuro di voler eliminare questo servizio?',
  confirmMessageMultiple: 'Sei sicuro di voler eliminare {count} servizi?',
  successMessage: 'Eliminati {count} servizio/i con successo',
  errorMessage: 'Errore durante l\'eliminazione'
};
```

### Vantaggi del Sistema di Configurazione

- **Configurabilità**: Comportamento definito tramite configurazioni
- **Riutilizzabilità**: Componenti UI standardizzati
- **Manutenibilità**: Modifiche centralizzate
- **Flessibilità**: Supporto per diversi tipi di azioni
- **Consistenza**: UI/UX uniforme across tutte le sezioni
- **Responsive**: Ottimizzato per tutti i dispositivi

Questo sistema permette di definire rapidamente nuove viste e tabelle mantenendo un'interfaccia utente coerente e funzionalità avanzate come selezione multipla, filtri e azioni bulk.

## Sistema di Gestione Centralizzata delle Viste in Dettaglio

### Architettura del Sistema

Il sistema implementa una **gestione centralizzata per le viste in dettaglio**, simile a quella esistente per i form, per migliorare la manutenibilità e la consistenza del codice. Questo sistema sostituisce la duplicazione di codice presente nelle viste individuali con un approccio configurabile e riutilizzabile.

> **📋 Documentazione Completa**: Per una spiegazione dettagliata del sistema, vedi il file [DETAIL_VIEW_CENTRALIZATION.md](./DETAIL_VIEW_CENTRALIZATION.md).

### Componenti del Sistema

#### 1. Schema di Configurazione (`detailViewSchema.ts`)
```typescript
export interface DetailViewField {
  name: string;
  label: string;
  type: 'text' | 'currency' | 'boolean' | 'date' | 'email' | 'custom';
  required?: boolean;
  conditional?: string; // campo da controllare per mostrare/nascondere
  format?: {
    currency?: { symbol: string; decimals: number; };
    date?: { locale: string; options?: Intl.DateTimeFormatOptions; };
    boolean?: { trueText: string; falseText: string; showBadge: boolean; };
  };
  customRender?: string; // nome del renderer personalizzato
}

export interface DetailViewConfig {
  fields: DetailViewField[];
  layout: 'default' | 'compact' | 'wide';
  showTimestamps?: boolean;
  timestampFields?: { createdAt?: string; updatedAt?: string; };
  customFields?: DetailViewField[];
}
```

#### 2. Configurazioni Specifiche (`detailViewConfig.ts`)
Ogni entità ha la sua configurazione centralizzata:

```typescript
export const serviziDetailViewConfig: DetailViewConfig = {
  fields: [
    { name: 'nome', label: 'Nome', type: 'text', required: true },
    { name: 'descrizione', label: 'Descrizione', type: 'text', conditional: 'descrizione' },
    { 
      name: 'prezzo', 
      label: 'Prezzo', 
      type: 'currency', 
      required: true,
      format: { currency: { symbol: '€', decimals: 2 } }
    },
    { 
      name: 'inLista', 
      label: 'Stato', 
      type: 'boolean',
      format: { boolean: { trueText: 'Attivo', falseText: 'Inattivo', showBadge: true } }
    }
  ],
  layout: 'default',
  showTimestamps: true,
  timestampFields: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
};
```

#### 3. Template Generico (`genericDetailView.ejs`)
Un template unificato che gestisce tutte le viste in dettaglio:

```ejs
<%- include('../alerts/simple', { message: success[0] }) %>
<%- include('../navigation/actionNav', actionNavConfig) %>

<div class="mt-8">
  <div class="mt-6 border-t border-gray-100">
    <dl class="divide-y divide-gray-100">
      <% config.fields.forEach(field => { %>
        <% if (!field.conditional || item[field.conditional]) { %>
          <div class="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt class="text-sm/6 font-medium text-gray-900"><%= field.label %></dt>
            <dd class="mt-1 text-sm/6 text-gray-700 sm:col-span-2 sm:mt-0">
              <%- include('../fieldRenderers/' + field.type, { item, field }) %>
            </dd>
          </div>
        <% } %>
      <% }); %>
    </dl>
  </div>
</div>
```

#### 4. Renderer per Tipi di Campo (`fieldRenderers/`)
Renderer specializzati per ogni tipo di campo:

- **`text.ejs`**: Testo semplice
- **`currency.ejs`**: Formattazione valuta (€X.XX)
- **`boolean.ejs`**: Badge colorato (Sì/No)
- **`date.ejs`**: Formato italiano (DD/MM/YYYY)
- **`email.ejs`**: Link cliccabile
- **`custom.ejs`**: Renderer personalizzati

### Tipi di Campo Supportati

| Tipo | Descrizione | Formattazione |
|---|---|---|
| **text** | Testo semplice | Valore raw |
| **currency** | Valuta | €X.XX |
| **boolean** | Booleano | Badge colorato (Sì/No) |
| **date** | Data | Formato italiano (DD/MM/YYYY) |
| **email** | Email | Link cliccabile |
| **custom** | Personalizzato | Renderer specifico |

### Integrazione con Componenti Esistenti

Il sistema è completamente integrato con i componenti centralizzati esistenti:

- ✅ **Action Navigation**: Integrato con `actionNavConfig.ts`
- ✅ **Alert di Successo**: Integrato con `ui/alerts/simple.ejs`
- ✅ **Layout Generale**: Compatibile con `layouts/sections.ejs`
- ✅ **Percorsi Corretti**: Tutti gli include utilizzano percorsi relativi corretti

### Utilizzo nelle Route

```typescript
// Esempio per servizi
res.render('pages/ristorante-menu/servizi/view', {
  title: 'Dettagli Servizio',
  description: 'Informazioni dettagliate del servizio',
  layout: 'layouts/sections',
  mainMenu: mainMenuItems,
  sectionMenu,
  sectionIcons,
  currentPath,
  item: servizio,
  itemType: 'Servizio',
  actionNavConfig,
  detailViewConfig: serviziDetailViewConfig, // ← Configurazione centralizzata
  scripts: scriptManager.getScriptsForPage('dashboard'),
  breadcrumbs: [/* ... */]
});
```

### Viste Migrate

- ✅ **Servizi**: `servizi/view.ejs` → usa `serviziDetailViewConfig`
- ✅ **Allergeni**: `impostazioni/view.ejs` → usa `allergeniDetailViewConfig`
- ✅ **Categorie Menu Fisso**: `impostazioni/view.ejs` → usa `categoriaMenuFissoDetailViewConfig`
- ✅ **Categorie Piatti**: `impostazioni/view.ejs` → usa `categoriaPiattiDetailViewConfig`

### Vantaggi del Sistema

#### 1. Manutenibilità
- **Codice centralizzato**: Modifiche in un solo posto
- **Consistenza**: Stesso comportamento per tutti i campi
- **Riusabilità**: Configurazioni riutilizzabili

#### 2. Estensibilità
- **Nuovi tipi**: Facile aggiunta di nuovi tipi di campo
- **Formattazione**: Configurazione flessibile della formattazione
- **Renderer personalizzati**: Supporto per logiche specifiche

#### 3. Qualità del Codice
- **DRY**: Eliminazione della duplicazione
- **Type Safety**: Interfacce TypeScript
- **Documentazione**: Configurazione auto-documentante

### Esempi di Configurazione

#### Campo Currency
```typescript
{
  name: 'prezzo',
  label: 'Prezzo',
  type: 'currency',
  format: {
    currency: {
      symbol: '€',
      decimals: 2
    }
  }
}
```

#### Campo Boolean con Badge
```typescript
{
  name: 'inLista',
  label: 'Stato',
  type: 'boolean',
  format: {
    boolean: {
      trueText: 'Attivo',
      falseText: 'Inattivo',
      showBadge: true
    }
  }
}
```

#### Campo Condizionale
```typescript
{
  name: 'descrizione',
  label: 'Descrizione',
  type: 'text',
  conditional: 'descrizione' // Mostra solo se descrizione esiste
}
```

### Estensioni Future

Il sistema è progettato per essere facilmente estendibile:

- **Nuovi tipi di campo**: URL, telefono, indirizzo, etc.
- **Layout personalizzati**: Compact, wide, card-based
- **Validazione**: Controlli di validazione per i campi
- **Internazionalizzazione**: Supporto per multiple lingue

> **📋 Per dettagli completi**: Consulta il file [DETAIL_VIEW_CENTRALIZATION.md](./DETAIL_VIEW_CENTRALIZATION.md) per esempi avanzati, configurazioni complete e guide per l'estensione del sistema.

## Configurazione Sottosezioni

### Architettura delle Sottosezioni

Le sottosezioni sono sezioni di secondo livello che appartengono a sezioni principali. Nel sistema ristorante-menu, la sezione "Impostazioni" contiene tre sottosezioni:

- **Allergeni** (`/ristorante-menu/impostazioni/allergeni`)
- **Categoria Menu Fisso** (`/ristorante-menu/impostazioni/categoria-menu-fisso`)
- **Categoria Piatti** (`/ristorante-menu/impostazioni/categoria-piatti`)

### Configurazione Centralizzata

A differenza delle sezioni principali, le sottosezioni utilizzano una **configurazione completamente centralizzata** in `subSectionConfig.ts`. Ogni sottosezione ha una configurazione che include:

#### Struttura della Configurazione

```typescript
export interface SubSectionConfig {
  hasItems: boolean;           // Se ci sono elementi da mostrare
  items: any[];               // Array degli elementi
  emptyState: {               // Stato vuoto personalizzato
    iconName: string;
    icon: { viewBox: string; path: string; };
    title: string;
    description: string;
    buttonText: string;
    buttonHref: string;
    buttonIconName: string;
    buttonIcon: { viewBox: string; path: string; };
  };
  tableData: {                // Configurazione colonne tabella
    tableHeads: Array<{ label: string; mobile: boolean; }>;
    fields: Array<{ name: string; }>;
  };
  tableConfig: {              // Configurazione azioni e comportamento
    tableId: string;
    idField: string;
    labelField: string;
    detailUrl: string;
    editUrl: string;
    bulkEditUrl?: string;
    actionButton: { text: string; href: string; };
    editMultipleButton?: { text: string; };
    deleteButton: { text: string; classes: string; };
    endpoint: string;
    method: string;
    confirmMessage: string;
    confirmMessageMultiple: string;
    successMessage: string;
    errorMessage: string;
    includeScripts: boolean;
  };
  pageTitles?: {              // Titoli dinamici delle pagine
    view?: { titleField: string; prefix?: string; suffix?: string; };
    edit?: { titleField: string; prefix?: string; suffix?: string; };
  };
}
```

### Configurazioni Specifiche per Sottosezione

#### 1. Allergeni
```typescript
export const allergeniConfig: SubSectionConfig = {
  hasItems: false, // Impostato dinamicamente
  items: [],       // Impostato dinamicamente
  emptyState: {
    iconName: 'exclamation-triangle',
    icon: { viewBox: '0 0 24 24', path: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z' },
    title: 'Nessun allergene',
    description: 'Inizia creando il tuo primo allergene.',
    buttonText: 'Nuovo Allergene',
    buttonHref: '/ristorante-menu/impostazioni/allergeni/nuovo',
    buttonIconName: 'plus',
    buttonIcon: { viewBox: '0 0 20 20', path: 'M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z' }
  },
  tableData: {
    tableHeads: [
      { label: 'Nome', mobile: true },
      { label: 'Descrizione', mobile: false }
    ],
    fields: [
      { name: 'nome' },
      { name: 'descrizione' }
    ]
  },
  tableConfig: {
    tableId: 'allergeni-table',
    idField: 'id',
    labelField: 'nome',
    detailUrl: '/ristorante-menu/impostazioni/allergeni/dettagli/:id',
    editUrl: '/ristorante-menu/impostazioni/allergeni/modifica/:id',
    bulkEditUrl: undefined, // Nessuna modifica massiva
    actionButton: {
      text: 'Nuovo Allergene',
      href: '/ristorante-menu/impostazioni/allergeni/nuovo'
    },
    editMultipleButton: undefined,
    deleteButton: {
      text: 'Elimina',
      classes: 'bg-red-600 text-white ring-red-600 hover:bg-red-700'
    },
    endpoint: '/ristorante-menu/impostazioni/allergeni',
    method: 'DELETE',
    confirmMessage: 'Sei sicuro di voler eliminare questo allergene?',
    confirmMessageMultiple: 'Sei sicuro di voler eliminare {count} allergeni?',
    successMessage: 'Eliminati {count} allergene/i con successo',
    errorMessage: 'Errore durante l\'eliminazione',
    includeScripts: true
  },
  pageTitles: {
    view: { titleField: 'nome', prefix: 'Dettagli' },
    edit: { titleField: 'nome', prefix: 'Modifica' }
  }
};
```

#### 2. Categoria Menu Fisso
```typescript
export const categoriaMenuFissoConfig: SubSectionConfig = {
  // ... configurazione simile ma con:
  tableData: {
    tableHeads: [
      { label: 'Nome', mobile: true },
      { label: 'Descrizione', mobile: false },
      { label: 'Stato', mobile: true }  // ← Colonna aggiuntiva
    ],
    fields: [
      { name: 'nome' },
      { name: 'descrizione' },
      { name: 'inLista' }  // ← Campo aggiuntivo
    ]
  },
  tableConfig: {
    // ... configurazione simile ma con:
    bulkEditUrl: '/ristorante-menu/impostazioni/categoria-menu-fisso/modifica-massa', // ← Modifica massiva abilitata
    editMultipleButton: { text: 'Modifica' }  // ← Bottone modifica massiva
  }
};
```

#### 3. Categoria Piatti
```typescript
export const categoriaPiattiConfig: SubSectionConfig = {
  // Configurazione identica a categoriaMenuFissoConfig
  // ma con URL e ID specifici per categoria-piatti
};
```

### Differenze tra Sottosezioni

| Caratteristica | Allergeni | Categoria Menu Fisso | Categoria Piatti |
|---|---|---|---|
| **Colonne** | Nome, Descrizione | Nome, Descrizione, Stato | Nome, Descrizione, Stato |
| **Modifica Massiva** | ❌ Non supportata | ✅ Supportata | ✅ Supportata |
| **Campo Stato** | ❌ Non presente | ✅ `inLista` | ✅ `inLista` |
| **Bottone Modifica** | ❌ Non presente | ✅ Presente | ✅ Presente |

### Utilizzo della Configurazione

#### Nel Controller (Route)
```typescript
// Esempio per allergeni
router.get('/impostazioni/allergeni', async (req, res) => {
  const config = allergeniConfig;
  
  // Aggiorna dinamicamente
  config.hasItems = allergeni.length > 0;
  config.items = allergeni;
  
  res.render('pages/ristorante-menu/impostazioni/subSection', {
    title: 'Allergeni',
    config,
    tableData: config.tableData,
    tableConfig: config.tableConfig,
    emptyState: config.emptyState
  });
});
```

#### Nella Vista (`subSection.ejs`)
```ejs
<% if (!hasItems || items.length === 0) { %>
  <%- include('../../../ui/emptyStates/simple', emptyState) %>
<% } else { %>
  <%- include('../../../ui/tables/selectableTable', {
    tableId: tableConfig.tableId,
    tableData: tableData,
    items: items,
    tableConfig: {
      idField: tableConfig.idField,
      labelField: tableConfig.labelField,
      detailUrl: tableConfig.detailUrl,
      editUrl: tableConfig.editUrl,
      bulkEditUrl: tableConfig.bulkEditUrl,
      editMultipleButton: tableConfig.editMultipleButton,
      actionButton: tableConfig.deleteButton,
      endpoint: tableConfig.endpoint,
      method: tableConfig.method,
      confirmMessage: tableConfig.confirmMessage,
      confirmMessageMultiple: tableConfig.confirmMessageMultiple,
      successMessage: tableConfig.successMessage,
      errorMessage: tableConfig.errorMessage
    }
  }) %>
<% } %>
```

### Vantaggi della Configurazione Centralizzata

- **Coerenza**: Tutte le sottosezioni seguono lo stesso pattern
- **Manutenibilità**: Modifiche in un solo file per sottosezione
- **Riutilizzabilità**: La vista `subSection.ejs` gestisce tutte le sottosezioni
- **Flessibilità**: Ogni sottosezione può avere configurazioni specifiche
- **Scalabilità**: Facile aggiunta di nuove sottosezioni

### Aggiunta di una Nuova Sottosezione

Per aggiungere una nuova sottosezione:

1. **Definire la configurazione** in `subSectionConfig.ts`
2. **Aggiungere la route** nel controller
3. **Aggiungere al menu** in `subSectionMenu.ts`
4. **Creare i form** in `subSectionFormData.ts` (se necessario)

La vista `subSection.ejs` gestirà automaticamente la nuova sottosezione utilizzando la sua configurazione.

## API Endpoints

Il sistema VTN Backend fornisce un'API REST completa per l'integrazione con frontend headless e applicazioni esterne.

### API v1 - Endpoints Principali

#### 🍽️ **Piatti**
- `GET /api/v1/piatti` - Lista tutti i piatti
- `GET /api/v1/piatti/:id` - Dettagli piatto specifico
- `GET /api/v1/piatti/categoria/:categoriaId` - Piatti per categoria
- `GET /api/v1/piatti/allergene/:allergeneId` - Piatti per allergene
- `GET /api/v1/piatti/categorie` - Piatti raggruppati per categorie
- `GET /api/v1/piatti/categorie/ordine?categorie=id1,id2` - Categorie con ordine personalizzato
- `GET /api/v1/piatti/categorie/filtro?escludi=id1&ordine=nome` - Filtri avanzati

#### 🍷 **Menu Fissi**
- `GET /api/v1/menu-fisso` - Lista tutti i menu fissi
- `GET /api/v1/menu-fisso/:id` - Dettagli menu fisso specifico
- `GET /api/v1/menu-fisso/categoria/:categoriaId` - Menu fissi per categoria
- `GET /api/v1/menu-fisso/categoria/:categoriaId/dettagli` - Menu fissi con allergeni

#### 🍷 **Bevande**
- `GET /api/v1/vini` - Lista vini
- `GET /api/v1/birre` - Lista birre
- `GET /api/v1/liquori` - Lista liquori
- `GET /api/v1/cocktails` - Lista cocktail
- `GET /api/v1/bevande` - Lista bevande analcoliche

#### ⚙️ **Servizi**
- `GET /api/v1/servizi` - Lista servizi accessori

### Caratteristiche API

- **Formato JSON**: Tutte le risposte in formato JSON strutturato
- **Rate Limiting**: Protezione contro abusi con limiti configurabili
- **Validazione**: Validazione completa dei parametri di input
- **Error Handling**: Gestione errori standardizzata con codici HTTP appropriati
- **Soft Delete**: Supporto per cancellazione logica degli elementi
- **Filtri Avanzati**: Supporto per filtri, ordinamento e paginazione

### Documentazione Completa

📋 **Per la documentazione dettagliata completa delle API v1**, inclusi esempi di chiamate, formati di risposta, codici di errore e best practices, consulta il file [API v1 - Documentazione Completa](./docs/api/API_V1_DOCUMENTATION.md).

## 📚 Documentazione Tecnica

Tutta la documentazione tecnica è stata centralizzata nella cartella `docs/` per facilitare la navigazione e la manutenzione:

### 🔌 [API Documentation](./docs/api/)
- **[Rate Limiting](./docs/api/rate-limiting.md)** - Sistema di limitazione delle richieste
- **[Response Format](./docs/api/response-format.md)** - Formato standardizzato delle risposte JSON
- **[Error Handling](./docs/api/error-handling.md)** - Gestione centralizzata degli errori
- **[Validation](./docs/api/validation.md)** - Sistema di validazione dei parametri

### ⚙️ [Systems Documentation](./docs/systems/)
- **[Authentication](./docs/systems/authentication.md)** - Sistema di autenticazione completo (Locale + Google OAuth)
- **[Toast System](./docs/systems/toast-system.md)** - Sistema di notifiche toast
- **[Form Manager](./docs/systems/form-manager.md)** - Gestione unificata dei form
- **[Pagination](./docs/systems/pagination.md)** - Sistema di paginazione per tabelle
- **[Script Management](./docs/systems/script-management.md)** - Gestione centralizzata degli script JavaScript
- **[Detail Views](./docs/systems/detail-views.md)** - Sistema di viste in dettaglio centralizzate
- **[Logging](./docs/systems/logging.md)** - Sistema di logging avanzato

### 📖 [Guides](./docs/guides/)
- **[Database Schema](./docs/guides/database-schema.md)** - Schema completo del database
- **[Standard Messages](./docs/guides/standard-messages.md)** - Messaggi standardizzati del sistema

Per una panoramica completa della documentazione, consulta il [README della documentazione](./docs/README.md).

### Autenticazione Web

Il sistema supporta due strategie di autenticazione:

#### Strategia Locale (Email + Password)
- `GET /auth/login` - Pagina di login
- `POST /auth/local` - Login con email e password
- **Sicurezza**: Password hashate con bcrypt (12 rounds)
- **Validazione**: Requisiti robusti per password sicure

#### Strategia Google OAuth
- `GET /auth/google` - Inizia autenticazione Google
- `GET /auth/google/callback` - Callback OAuth
- **Scope**: Solo profile e email
- **Auto-registrazione**: Primo utente diventa admin

#### Gestione Sessioni
- `GET /auth/logout` - Logout con conferma
- **Sicurezza**: Sessioni sicure con timeout automatico
- **Storage**: Sessioni salvate in database PostgreSQL

> 📋 **Documentazione Completa**: Per dettagli tecnici completi, configurazione e troubleshooting, consulta [Authentication System](./docs/systems/authentication.md).

### Gestione Utenti
- `GET /admin/utenti` - Lista utenti
- `POST /admin/utenti` - Crea utente
- `PUT /admin/utenti/:id` - Modifica utente
- `DELETE /admin/utenti/:id` - Elimina utente
- `POST /admin/utenti/modifica-massa` - Modifica massiva

### Menu Ristorante (Web Interface)
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

- **Autenticazione Multi-Strategia**: Passport.js con strategia locale e Google OAuth
- **Password Sicure**: Hashing bcrypt con 12 rounds di salt e validazione robusta
- **Sessioni Sicure**: Storage database con timeout automatico e protezione CSRF
- **Validazione Completa**: Validazione lato client e server con messaggi specifici
- **SQL Injection**: Prevenuta tramite Prisma ORM
- **Rate Limiting**: Protezione contro attacchi brute force
- **Soft Delete**: Gestione cancellazioni logiche per sicurezza dati

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
