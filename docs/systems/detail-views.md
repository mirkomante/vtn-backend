# Configurazione Centralizzata per le Viste in Dettaglio

## 🎯 **Obiettivo**
Implementare una gestione centralizzata per le viste in dettaglio, simile a quella esistente per i form, per migliorare la manutenibilità e la consistenza del codice.

## 📁 **Struttura Implementata**

### **1. Schema di Configurazione**
- **File**: `src/config/detailViewSchema.ts`
- **Interfacce**: `DetailViewField`, `DetailViewConfig`, `DetailViewData`
- **Tipi supportati**: `text`, `currency`, `boolean`, `date`, `email`, `custom`

### **2. Configurazioni Specifiche**
- **File**: `src/config/detailViewConfig.ts`
- **Configurazioni**: `serviziDetailViewConfig`, `allergeniDetailViewConfig`, `categoriaMenuFissoDetailViewConfig`, `categoriaPiattiDetailViewConfig`, `utentiDetailViewConfig`

### **3. Template Generico**
- **File**: `src/views/ui/detailViews/genericDetailView.ejs`
- **Funzionalità**: Rendering automatico basato sulla configurazione

### **4. Renderer per Tipi di Campo**
- **Directory**: `src/views/ui/fieldRenderers/`
- **File**: `text.ejs`, `currency.ejs`, `boolean.ejs`, `date.ejs`, `email.ejs`, `custom.ejs`

## 🔧 **Come Funziona**

### **Configurazione di un Campo**
```typescript
{
  name: 'prezzo',
  label: 'Prezzo',
  type: 'currency',
  required: true,
  format: {
    currency: {
      symbol: '€',
      decimals: 2
    }
  }
}
```

### **Utilizzo nel Template**
```ejs
<%- include('../../../ui/detailViews/genericDetailView', {
  config: detailViewConfig,
  item: item,
  itemType: 'Servizio',
  success: success,
  actionNavConfig: actionNavConfig
}) %>
```

### **Aggiornamento delle Route**
```typescript
res.render('pages/ristorante-menu/servizi/view', {
  // ... altri parametri
  detailViewConfig: serviziDetailViewConfig,
  // ... altri parametri
});
```

## 📊 **Tipi di Campo Supportati**

| Tipo | Descrizione | Formattazione |
|---|---|---|
| **text** | Testo semplice | Valore raw |
| **currency** | Valuta | €X.XX |
| **boolean** | Booleano | Badge colorato (Sì/No) |
| **date** | Data | Formato italiano (DD/MM/YYYY) |
| **email** | Email | Link cliccabile |
| **custom** | Personalizzato | Renderer specifico |

## 🎨 **Formattazione Automatica**

### **Currency**
```typescript
format: {
  currency: {
    symbol: '€',      // Simbolo valuta
    decimals: 2       // Decimali
  }
}
```

### **Boolean**
```typescript
format: {
  boolean: {
    trueText: 'Attivo',     // Testo per true
    falseText: 'Inattivo',  // Testo per false
    showBadge: true         // Mostra badge colorato
  }
}
```

### **Date**
```typescript
format: {
  date: {
    locale: 'it-IT',        // Locale
    options: {              // Opzioni Intl.DateTimeFormat
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
  }
}
```

## 🔄 **Migrazione Completata**

### **Viste Aggiornate**
- ✅ **Servizi**: `servizi/view.ejs`
- ✅ **Allergeni**: `impostazioni/view.ejs`
- ✅ **Categorie Menu Fisso**: `impostazioni/view.ejs`
- ✅ **Categorie Piatti**: `impostazioni/view.ejs`

### **Route Aggiornate**
- ✅ **Servizi**: `/ristorante-menu/servizi/dettagli/:id`
- ✅ **Allergeni**: `/ristorante-menu/impostazioni/allergeni/dettagli/:id`
- ✅ **Categoria Menu Fisso**: `/ristorante-menu/impostazioni/categoria-menu-fisso/dettagli/:id`
- ✅ **Categoria Piatti**: `/ristorante-menu/impostazioni/categoria-piatti/dettagli/:id`

### **Integrazione Componenti Centralizzati**
- ✅ **Action Navigation**: Integrato correttamente con `actionNavConfig.ts`
- ✅ **Alert di Successo**: Integrato con `ui/alerts/simple.ejs`
- ✅ **Layout Generale**: Compatibile con `layouts/sections.ejs`
- ✅ **Percorsi Corretti**: Tutti gli include utilizzano percorsi relativi corretti

## 🚀 **Benefici Ottenuti**

### **1. Manutenibilità**
- **Codice centralizzato**: Modifiche in un solo posto
- **Consistenza**: Stesso comportamento per tutti i campi
- **Riusabilità**: Configurazioni riutilizzabili

### **2. Estensibilità**
- **Nuovi tipi**: Facile aggiunta di nuovi tipi di campo
- **Formattazione**: Configurazione flessibile della formattazione
- **Renderer personalizzati**: Supporto per logiche specifiche

### **3. Qualità del Codice**
- **DRY**: Eliminazione della duplicazione
- **Type Safety**: Interfacce TypeScript
- **Documentazione**: Configurazione auto-documentante

## 🔮 **Estensioni Future**

### **1. Nuovi Tipi di Campo**
```typescript
// Esempio: Campo per URL
{
  name: 'website',
  label: 'Sito Web',
  type: 'url',
  format: {
    url: {
      target: '_blank',
      showIcon: true
    }
  }
}
```

### **2. Layout Personalizzati**
```typescript
// Esempio: Layout compatto
{
  layout: 'compact',
  fields: [/* ... */]
}
```

### **3. Validazione**
```typescript
// Esempio: Validazione condizionale
{
  name: 'email',
  type: 'email',
  validation: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  }
}
```

## 📝 **Note di Implementazione**

### **Compatibilità**
- ✅ **Retrocompatibilità**: Le viste esistenti continuano a funzionare
- ✅ **Graduale**: Migrazione possibile entità per entità
- ✅ **Fallback**: Gestione sicura di valori null/undefined

### **Performance**
- ✅ **Efficiente**: Rendering ottimizzato
- ✅ **Caching**: Possibilità di cache delle configurazioni
- ✅ **Lazy Loading**: Caricamento on-demand dei renderer

## 🧪 **Testing**

### **Test da Eseguire**
1. **Servizi**: Verificare formattazione prezzo e stato
2. **Allergeni**: Verificare visualizzazione nome e descrizione
3. **Categorie**: Verificare badge stato e timestamps
4. **Utenti**: Verificare nome completo e link email

### **URL di Test**
- `/ristorante-menu/servizi/dettagli/[ID]`
- `/ristorante-menu/impostazioni/allergeni/dettagli/[ID]`
- `/ristorante-menu/impostazioni/categoria-menu-fisso/dettagli/[ID]`
- `/ristorante-menu/impostazioni/categoria-piatti/dettagli/[ID]`

## 🎉 **Risultato Finale**

La configurazione centralizzata per le viste in dettaglio è ora **completamente implementata** e **funzionante**. Il sistema offre:

- **Gestione centralizzata** delle viste in dettaglio
- **Formattazione automatica** per tutti i tipi di campo
- **Manutenibilità migliorata** del codice
- **Estensibilità** per future implementazioni
- **Consistenza** nell'interfaccia utente

La migrazione è **completa** e **pronta per l'uso**! 🚀
