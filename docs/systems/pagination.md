# Guida alla Paginazione

## Panoramica

Il sistema di paginazione implementato permette di gestire grandi quantità di dati nelle tabelle in modo efficiente, migliorando le performance e l'esperienza utente.

## Caratteristiche

- **Limite di 20 elementi per pagina**: Ottimale per performance e usabilità
- **Responsive**: Funziona perfettamente su mobile e desktop
- **AJAX**: Navigazione fluida senza ricaricamento della pagina
- **Integrazione con filtri**: I filtri si integrano perfettamente con la paginazione
- **URL persistente**: L'URL viene aggiornato per supportare bookmark e navigazione browser

## Implementazione

### 1. Backend (Route)

```typescript
import { getPaginationParams, calculatePagination } from '../config/paginationHelper';

router.get('/impostazioni/categoria-menu-fisso', async (req, res) => {
  try {
    // Gestione paginazione
    const paginationConfig = getPaginationParams(req, 20);
    
    // Conta totale elementi
    const totalItems = await prisma.categoriaMenuFisso.count({
      where: { deletedAt: null }
    });
    
    // Recupera dati con paginazione
    const items = await prisma.categoriaMenuFisso.findMany({
      where: { deletedAt: null },
      orderBy: { nome: 'asc' },
      skip: paginationConfig.offset,
      take: paginationConfig.limit
    });
    
    // Calcola informazioni di paginazione
    const pagination = calculatePagination(
      totalItems,
      paginationConfig.page,
      paginationConfig.limit
    );
    
    res.render('page', {
      items,
      pagination,
      // ... altri dati
    });
  } catch (error) {
    // Gestione errori
  }
});
```

### 2. Frontend (Template)

La paginazione viene automaticamente inclusa nel template `selectableTable.ejs`:

```ejs
<%- include('../../../ui/tables/selectableTable', {
  tableId: 'my-table',
  tableData: tableData,
  items: items,
  tableConfig: tableConfig,
  pagination: pagination // Passa i dati di paginazione
}) %>
```

### 3. JavaScript

Il JavaScript viene caricato automaticamente per le pagine con tabelle:

```javascript
// Inizializzazione automatica
document.addEventListener('DOMContentLoaded', function() {
  // La paginazione viene inizializzata automaticamente
  // per tutte le tabelle che hanno paginazione
});
```

## Struttura dei Dati

### Pagination Object

```typescript
interface PaginationResult {
  currentPage: number;      // Pagina corrente
  totalPages: number;       // Numero totale di pagine
  totalItems: number;       // Numero totale di elementi
  itemsPerPage: number;     // Elementi per pagina
  hasNextPage: boolean;     // Se c'è una pagina successiva
  hasPrevPage: boolean;     // Se c'è una pagina precedente
}
```

### Esempio di Output

```json
{
  "currentPage": 2,
  "totalPages": 5,
  "totalItems": 87,
  "itemsPerPage": 20,
  "hasNextPage": true,
  "hasPrevPage": true
}
```

## Funzionalità

### Navigazione

- **Pulsanti Precedente/Successiva**: Per navigare tra le pagine
- **Numeri di pagina**: Per saltare direttamente a una pagina specifica
- **Ellipsis (...)**: Per gestire molte pagine in modo pulito
- **Mobile**: Informazioni di paginazione ottimizzate per mobile

### Integrazione con Filtri

```javascript
// I filtri si integrano automaticamente con la paginazione
// Quando si applica un filtro, si torna alla prima pagina
async applyFilters(form) {
  this.currentPage = 1; // Reset alla prima pagina
  // ... applica filtri
  await this.loadData();
}
```

### Gestione URL

```javascript
// L'URL viene aggiornato automaticamente
updateURL(url) {
  window.history.pushState({}, '', url.toString());
}
```

## Personalizzazione

### Modificare il Limite per Pagina

```typescript
// Nel backend
const paginationConfig = getPaginationParams(req, 50); // 50 elementi per pagina
```

### Stile Personalizzato

La paginazione usa Tailwind CSS e può essere personalizzata modificando le classi in `paginationContent.ejs`.

### Comportamento AJAX

```javascript
// Personalizzare il comportamento AJAX
class CustomTablePagination extends TablePagination {
  async loadData() {
    // Logica personalizzata
  }
}
```

## Best Practices

### Performance

1. **Usa sempre `skip` e `take`** nelle query Prisma
2. **Conta solo quando necessario** usando `count()`
3. **Limita il numero di elementi** per pagina (20 è ottimale)

### UX

1. **Mostra indicatori di caricamento** durante le richieste AJAX
2. **Mantieni lo stato dei filtri** durante la navigazione
3. **Aggiorna l'URL** per supportare bookmark

### Mobile

1. **Nascondi i numeri di pagina** su mobile (solo Precedente/Successiva)
2. **Mostra informazioni di paginazione** in formato compatto
3. **Ottimizza i touch target** per i pulsanti

## Troubleshooting

### Problemi Comuni

1. **Paginazione non appare**: Verifica che `pagination.totalPages > 1`
2. **AJAX non funziona**: Controlla che il file `pagination.js` sia caricato
3. **Filtri non si integrano**: Assicurati che i form abbiano `data-filter-form`

### Debug

```javascript
// Abilita il debug
console.log('Pagination config:', this.config);
console.log('Current page:', this.currentPage);
console.log('Current filters:', this.currentFilters);
```

## Esempi Completi

### Route Completa

```typescript
router.get('/impostazioni/categoria-menu-fisso', async (req, res) => {
  try {
    const currentPath = '/ristorante-menu/impostazioni/categoria-menu-fisso';
    let sectionMenu = ristoranteMenuItems;
    let sectionTabs = ristoranteMenuImpostazioniSubItems;
    
    // Gestione paginazione
    const paginationConfig = getPaginationParams(req, 20);
    
    // Conta totale elementi
    const totalItems = await prisma.categoriaMenuFisso.count({
      where: { deletedAt: null }
    });
    
    // Recupera dati con paginazione
    const categorieMenuFisso = await prisma.categoriaMenuFisso.findMany({
      where: { deletedAt: null },
      orderBy: { nome: 'asc' },
      skip: paginationConfig.offset,
      take: paginationConfig.limit
    });
    
    // Calcola informazioni di paginazione
    const pagination = calculatePagination(
      totalItems,
      paginationConfig.page,
      paginationConfig.limit
    );
    
    const config = { ...categoriaMenuFissoConfig };
    config.hasItems = totalItems > 0;
    config.items = categorieMenuFisso;
    
    res.render('pages/ristorante-menu/impostazioni/subSection', {
      title: 'Categoria Menu Fisso',
      description: 'Gestisci le categorie per i menu fissi del ristorante',
      layout: 'layouts/sections',
      mainMenu: mainMenuItems,
      sectionMenu,
      sectionTabs,
      sectionIcons,
      currentPath,
      breadcrumbs: [
        { label: 'Menu Ristorante', href: '/ristorante-menu' },
        { label: 'Impostazioni', href: '/ristorante-menu/impostazioni' },
        { label: 'Categoria Menu Fisso', href: '/ristorante-menu/impostazioni/categoria-menu-fisso' }
      ],
      scripts: scriptManager.getScriptsForPage('table'),
      tableConfigJson: JSON.stringify(config.tableConfig),
      tableInitScript: scriptManager.getTableInitScript(config.tableConfig.tableId),
      actionNavConfig,
      isInternalPage: false,
      pagination, // Importante: passa i dati di paginazione
      ...config
    });
  } catch (error) {
    console.error('Errore nel recupero delle categorie menu fisso:', error);
    res.status(500).send('Errore interno del server');
  }
});
```

### Template Completo

```ejs
<%- include('../../../ui/tables/selectableTable', {
  tableId: 'categoria-menu-fisso-table',
  tableData: tableData,
  items: items,
  tableConfig: {
    idField: 'id',
    labelField: 'nome',
    detailUrl: '/ristorante-menu/impostazioni/categoria-menu-fisso/dettagli/:id',
    editUrl: '/ristorante-menu/impostazioni/categoria-menu-fisso/modifica/:id',
    bulkEditUrl: '/ristorante-menu/impostazioni/categoria-menu-fisso/modifica-massa',
    editMultipleButton: { text: 'Modifica' },
    actionButton: {
      text: 'Elimina',
      classes: 'bg-red-600 text-white ring-red-600 hover:bg-red-700 disabled:hover:bg-red-600'
    },
    endpoint: '/ristorante-menu/impostazioni/categoria-menu-fisso',
    method: 'DELETE',
    confirmMessage: 'Sei sicuro di voler eliminare questa categoria?',
    confirmMessageMultiple: 'Sei sicuro di voler eliminare {count} categorie?',
    successMessage: 'Eliminate {count} categoria/e con successo',
    errorMessage: 'Errore durante l\'eliminazione'
  },
  pagination: pagination // Passa i dati di paginazione
}) %>
```

## Conclusione

La paginazione implementata offre un'esperienza utente fluida e performante, mantenendo la coerenza con il resto del sistema. È facilmente estendibile e personalizzabile per esigenze specifiche.
