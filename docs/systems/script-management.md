# Guida alla Gestione degli Script JavaScript

## Panoramica

Il sistema di gestione degli script JavaScript è stato completamente ristrutturato per migliorare la coerenza, manutenibilità e scalabilità del codice.

**⚠️ IMPORTANTE**: Il sistema utilizza un approccio personalizzato invece di `express-ejs-layouts` con `layout extractScripts` per garantire maggiore controllo e flessibilità.

## Problemi Risolti

### ❌ Problemi Precedenti
1. **Inconsistenza**: Layout diversi usavano approcci diversi (`defineContent` vs `pageScripts`)
2. **Duplicazione**: Script comuni caricati in più layout
3. **Script Inline**: Script sparsi nelle pagine EJS
4. **Mancanza di Centralizzazione**: Difficile aggiungere nuovi script

### ✅ Soluzioni Implementate
1. **Sistema Centralizzato**: `ScriptManager` per gestire tutti gli script
2. **Configurazione Unificata**: Script comuni e condizionali definiti in un posto
3. **Layout Standardizzati**: Tutti i layout usano lo stesso sistema
4. **Script Condizionali**: Caricamento automatico basato sul tipo di pagina
5. **Approccio Personalizzato**: Non dipende da `express-ejs-layouts` per gli script

## Architettura

### 1. ScriptManager (`src/config/scriptManager.ts`)

```typescript
// Script comuni caricati in tutte le pagine
const commonScripts = [
  '/js/toast.js',
  '/js/sidebar.js'
];

// Script condizionali caricati solo quando necessario
const conditionalScripts = {
  'formManager': '/js/formManager.js',
  'selectableTable': '/js/selectableTable.js',
  'customFilters': '/js/customFilters.js'
};

// Script specifici per tipo di pagina
const pageSpecificScripts = {
  'form': ['formManager'],
  'table': ['selectableTable', 'customFilters'],
  'bulkEdit': ['formManager'],
  'dashboard': []
};
```

### 2. Partial Centralizzato (`src/views/partials/scripts.ejs`)

```ejs
<!-- Script comuni e condizionali -->
<% if (typeof scripts !== 'undefined' && scripts && scripts.length > 0) { %>
  <% scripts.forEach(script => { %>
    <script src="<%= script %>"></script>
  <% }); %>
<% } %>

<!-- Script specifici della pagina -->
<% if (typeof pageScripts !== 'undefined' && pageScripts) { %>
  <%- pageScripts %>
<% } %>

<!-- Configurazione tabella se disponibile -->
<% if (typeof tableConfigJson !== 'undefined' && tableConfigJson) { %>
  <script>
    const tableConfig = <%- tableConfigJson %>;
    window[tableConfig.tableId + '-config'] = tableConfig;
  </script>
<% } %>
```

### 3. Layout Standardizzati

Tutti i layout ora usano:
```ejs
<!-- Scripts centralizzati -->
<%- include('../partials/scripts') %>
```

## Utilizzo

### Nelle Rotte

```typescript
import { scriptManager } from '../config/scriptManager';

// Per pagine con tabelle
res.render('page', {
  // ... altri dati
  scripts: scriptManager.getScriptsForPage('table'),
  tableConfigJson: JSON.stringify(tableConfig),
  tableInitScript: scriptManager.getTableInitScript('table-id')
});

// Per pagine con form
res.render('page', {
  // ... altri dati
  scripts: scriptManager.getScriptsForPage('form')
});

// Per pagine di bulk edit
res.render('page', {
  // ... altri dati
  scripts: scriptManager.getScriptsForPage('bulkEdit'),
  bulkEditConfigScript: scriptManager.getBulkEditConfigScript(formConfig)
});
```

### Tipi di Pagina Supportati

- **`dashboard`**: Pagine dashboard (solo script comuni)
- **`form`**: Pagine con form (formManager)
- **`table`**: Pagine con tabelle (selectableTable + customFilters)
- **`bulkEdit`**: Pagine di modifica massiva (formManager + configurazione speciale)

### Script Condizionali

```typescript
// Aggiungere script per funzionalità specifiche
scripts: scriptManager.getScriptsForPage('table', ['customFeature'])
```

## Vantaggi

### 1. **Manutenibilità**
- Modifiche agli script comuni in un solo posto
- Configurazione centralizzata
- Facile aggiungere nuovi script

### 2. **Performance**
- Script caricati solo quando necessario
- Evita duplicazioni
- Ordine di caricamento controllato

### 3. **Coerenza**
- Approccio uniforme in tutti i layout
- Configurazione standardizzata
- Debugging semplificato

### 4. **Scalabilità**
- Facile aggiungere nuovi tipi di pagina
- Script condizionali flessibili
- Estensibile per nuove funzionalità

## Migrazione

### Script Inline Rimossi

Gli script inline sono stati rimossi dalle pagine:
- `src/views/pages/ristorante-menu/menu-fissi/index.ejs`
- `src/views/pages/ristorante-menu/impostazioni/editBulk.ejs`

### Layout Aggiornati

- `src/views/layouts/default.ejs`
- `src/views/layouts/main.ejs`
- `src/views/layouts/sections.ejs`

### Rotte Aggiornate

- `src/routes/admin.ts` - Tutte le rotte utenti
- `src/routes/ristoranteMenu.ts` - Rotte principali e sottosezioni

## Best Practices

### 1. **Aggiungere Nuovi Script**

```typescript
// In scriptManager.ts
const conditionalScripts = {
  // ... script esistenti
  'newFeature': '/js/newFeature.js'
};

const pageSpecificScripts = {
  // ... tipi esistenti
  'newPageType': ['newFeature']
};
```

### 2. **Configurazione Tabelle**

```typescript
const tableConfig = {
  tableId: 'my-table',
  // ... configurazione
};

res.render('page', {
  scripts: scriptManager.getScriptsForPage('table'),
  tableConfigJson: JSON.stringify(tableConfig),
  tableInitScript: scriptManager.getTableInitScript('my-table')
});
```

### 3. **Script Specifici della Pagina**

```typescript
res.render('page', {
  scripts: scriptManager.getScriptsForPage('form'),
  pageScripts: `
    <script>
      // Script specifico per questa pagina
      window.pageSpecificConfig = ${JSON.stringify(config)};
    </script>
  `
});
```

## Compatibilità

Il sistema è completamente retrocompatibile:
- Le pagine esistenti continuano a funzionare
- Script comuni caricati automaticamente
- Nessuna modifica richiesta alle pagine esistenti

## Test del Sistema

Per testare il sistema, visita:
- `http://localhost:3000/test-scripts` - Pagina di test che verifica il caricamento di tutti gli script
- `http://localhost:3000/admin/utenti` - Pagina con tabella (dovrebbe caricare selectableTable + customFilters)
- `http://localhost:3000/admin/utenti/nuovo` - Pagina con form (dovrebbe caricare formManager)

## Monitoraggio

Per verificare che tutto funzioni correttamente:

1. **Controllare la Console del Browser**: Nessun errore JavaScript
2. **Verificare il Caricamento**: Script caricati nell'ordine corretto
3. **Testare le Funzionalità**: Form, tabelle, bulk edit funzionano
4. **Controllare le Performance**: Nessuna duplicazione di script
