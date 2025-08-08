# Form Manager - Guida Completa

## Panoramica

Il `FormManager` è un sistema unificato per la gestione di tutti i form nell'applicazione. Sostituisce i vecchi script separati con una soluzione più efficiente e scalabile.

## Caratteristiche Principali

### ✅ Compatibilità Completa
- Funziona con tutti i form che usano `simpleGenericForm.ejs`
- Supporta tutti i tipi di campo definiti in `sectionFormSchema.ts`
- Gestisce automaticamente form normali e bulk edit

### ✅ Validazione Unificata
- Validazione in tempo reale per tutti i tipi di campo
- Gestione errori con toast moderni
- Supporto per validazione personalizzata

### ✅ AJAX Uniforme
- Tutti i form usano AJAX per default
- Fallback automatico per compatibilità
- Gestione errori centralizzata

### ✅ Integrazione Toast
- Comunicazione diretta con il sistema di toast
- Messaggi contestuali e appropriati
- Fallback automatico ad alert se necessario

## Tipi di Campo Supportati

| Tipo | Descrizione | Validazione |
|------|-------------|-------------|
| `text` | Input di testo | Required, pattern |
| `email` | Email | Required, formato email |
| `password` | Password | Required, pattern |
| `number` | Numerico | Required, min, max, step |
| `select` | Dropdown | Required |
| `textarea` | Area di testo | Required |
| `toggle` | Switch on/off | Required |
| `checkbox` | Checkbox | Required |
| `radio` | Radio button | Required |

## Configurazione

### Configurazione Base
```javascript
// Nel layout principale (già fatto)
<script src="/js/formManager.js"></script>
```

### Configurazione Personalizzata
```javascript
// Opzionale: configurazione personalizzata
window.formManager = new FormManager({
  useAjax: true, // Abilita AJAX per tutti i form
  formSelector: 'form', // Selettore per i form
  // ... altre opzioni
});
```

## Utilizzo nelle Pagine

### Form Normali (New/Edit)
```ejs
<!-- Nessun script aggiuntivo necessario -->
<%- include('../../../ui/forms/simpleGenericForm', { ...formConfig, isBulkEdit: false }) %>
```

### Form Bulk Edit
```ejs
<!-- Nessun script aggiuntivo necessario -->
<%- include('../../../ui/forms/simpleGenericForm', { ...formConfig, isBulkEdit: true }) %>
```

## Configurazione dei Form

### Configurazione Standard
```typescript
// In sectionFormData.ts
export const myFormData: FormDataSchema = {
  formConfig: {
    method: 'POST',
    action: '/my-endpoint',
    id: 'myForm',
    novalidate: true
  },
  fields: [
    {
      type: 'text',
      name: 'nome',
      id: 'nome',
      label: 'Nome',
      required: true,
      placeholder: 'Inserisci nome',
      errorMessage: 'Il nome è obbligatorio'
    }
  ],
  buttons: {
    submit: { text: 'Salva' },
    cancel: { text: 'Annulla', href: '/back' }
  }
};
```

### Configurazione Bulk Edit
```typescript
export const myFormData: FormDataSchema = {
  // ... configurazione standard
  bulkEditConfig: {
    title: 'Modifica Massiva',
    description: 'Modifica i campi selezionati',
    action: '/my-endpoint/modifica-massa',
    method: 'POST',
    endpoint: '/my-endpoint/modifica-massa',
    successMessage: 'Aggiornati {count} elementi con successo',
    errorMessage: 'Errore durante l\'aggiornamento',
    requireAtLeastOneField: true, // Almeno un campo deve essere compilato
    allowPartialUpdates: true // Permette aggiornamenti parziali
  }
};
```

## API Pubblica

### Metodi Disponibili
```javascript
// Validazione manuale
window.formManager.validateFormById('formId', showErrors);

// Invio manuale
window.formManager.submitFormById('formId');

// Ottenere dati del form
const data = window.formManager.getFormData('formId');
```

### Eventi Personalizzati
```javascript
// Ascolta eventi del form
document.addEventListener('formValidated', (e) => {
  console.log('Form validato:', e.detail);
});

document.addEventListener('formSubmitted', (e) => {
  console.log('Form inviato:', e.detail);
});
```

## Migrazione dai Vecchi Script

### Cosa Rimuovere
- ❌ Script personalizzati nelle pagine (già rimossi)
- ❌ Riferimenti ai vecchi script nei template

### Cosa Mantenere
- ✅ `toast.js` (migliorato)
- ✅ `formManager.js` (sistema unificato)
- ✅ Configurazioni in `sectionFormData.ts`

### Passi per la Migrazione
1. ✅ Aggiunto `formManager.js` al layout
2. ✅ Rimossi script personalizzati dalle pagine
3. ✅ Eliminati file JavaScript obsoleti
4. ✅ Aggiornato `toast.js` per evitare messaggi non correlati
5. ✅ Creato `ajaxRoutes.ts` per configurazione centralizzata

## Vantaggi del Nuovo Sistema

### 🚀 Performance
- Un solo script invece di tre
- Meno duplicazione di codice
- Caricamento più veloce

### 🔧 Manutenibilità
- Logica centralizzata
- Configurazione unificata
- Meno bug da gestire

### 📈 Scalabilità
- Facile aggiungere nuovi tipi di campo
- Configurazione per nuove sezioni
- API pubblica per estensioni

### 🎯 UX Migliorata
- Toast contestuali
- Validazione in tempo reale
- Feedback immediato

## Troubleshooting

### Form non si valida
- Verifica che i campi abbiano l'attributo `required`
- Controlla che gli ID dei campi siano univoci
- Verifica che il form abbia un ID

### Toast non appaiono
- Verifica che `toast.js` sia caricato prima di `formManager.js`
- Controlla la console per errori JavaScript
- Verifica che il sistema di toast sia inizializzato

### AJAX non funziona
- Verifica che il server restituisca JSON
- Controlla che l'endpoint sia corretto
- Verifica che il metodo HTTP sia supportato

## Estensioni Future

### Validazione Personalizzata
```javascript
// Aggiungere validazione custom
window.formManager.addCustomValidator('email', (value) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
});
```

### Campi Dinamici
```javascript
// Aggiungere campi dinamicamente
window.formManager.addField('formId', {
  type: 'text',
  name: 'nuovoCampo',
  id: 'nuovoCampo',
  label: 'Nuovo Campo'
});
```

### Eventi Personalizzati
```javascript
// Aggiungere eventi custom
window.formManager.on('fieldChanged', (field, value) => {
  console.log('Campo cambiato:', field, value);
});
```
