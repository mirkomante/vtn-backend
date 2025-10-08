# Messaggi Standardizzati per il Sistema di Toast

## Panoramica

Questo documento definisce i messaggi standardizzati per garantire coerenza e professionalità in tutto il progetto.

## Principi Generali

1. **Tono**: Professionale ma amichevole
2. **Lingua**: Italiano
3. **Formato**: Breve e chiaro
4. **Consistenza**: Stessa struttura per azioni simili

## Messaggi di Successo

### Creazione
- ✅ **Utenti**: "Utente creato con successo"
- ✅ **Categorie Menu Fisso**: "Categoria menu fisso creata con successo"
- ✅ **Categorie Piatti**: "Categoria piatti creata con successo"
- ✅ **Allergeni**: "Allergene creato con successo"
- ✅ **Menu Fissi**: "Menu fisso creato con successo"

### Modifica Singola
- ✅ **Utenti**: "Utente aggiornato con successo"
- ✅ **Categorie Menu Fisso**: "Categoria menu fisso aggiornata con successo"
- ✅ **Categorie Piatti**: "Categoria piatti aggiornata con successo"
- ✅ **Allergeni**: "Allergene aggiornato con successo"
- ✅ **Menu Fissi**: "Menu fisso aggiornato con successo"

### Modifica Massiva
- ✅ **Utenti**: "Aggiornati {count} utente{count === 1 ? '' : 'i'} con successo"
- ✅ **Categorie Menu Fisso**: "Aggiornate {count} categoria{count === 1 ? '' : 'e'} con successo"
- ✅ **Categorie Piatti**: "Aggiornate {count} categoria{count === 1 ? '' : 'e'} con successo"
- ✅ **Allergeni**: "Aggiornati {count} allergene{count === 1 ? '' : 'i'} con successo"

### Eliminazione
- ✅ **Utenti**: "Eliminati {count} utente{count === 1 ? '' : 'i'} con successo"
- ✅ **Categorie Menu Fisso**: "Eliminate {count} categoria{count === 1 ? '' : 'e'} con successo"
- ✅ **Categorie Piatti**: "Eliminate {count} categoria{count === 1 ? '' : 'e'} con successo"
- ✅ **Allergeni**: "Eliminati {count} allergene{count === 1 ? '' : 'i'} con successo"
- ✅ **Menu Fissi**: "Eliminati {count} menu fisso/i con successo"

### Ripristino
- ✅ **Utenti**: "Ripristinati {count} utente{count === 1 ? '' : 'i'} con successo"
- ✅ **Generale**: "Ripristinati {count} elemento{count === 1 ? '' : 'i'} con successo"

### Eliminazione Definitiva
- ✅ **Generale**: "Eliminati definitivamente {count} elemento{count === 1 ? '' : 'i'}"

## Messaggi di Errore

### Validazione
- ❌ **Campi Obbligatori**: "Compila tutti i campi obbligatori"
- ❌ **Email Duplicata**: "Un utente con questa email esiste già"
- ❌ **Nome Duplicato**: "Un elemento con questo nome esiste già"

### Operazioni
- ❌ **Creazione**: "Si è verificato un errore durante la creazione"
- ❌ **Modifica**: "Si è verificato un errore durante l'aggiornamento"
- ❌ **Eliminazione**: "Si è verificato un errore durante l'eliminazione"
- ❌ **Ripristino**: "Si è verificato un errore durante il ripristino"
- ❌ **Modifica Massiva**: "Errore interno del server durante la modifica massiva"

### Generici
- ❌ **Server**: "Si è verificato un errore interno del server"
- ❌ **Non Trovato**: "L'elemento richiesto non esiste"
- ❌ **Accesso**: "Devi effettuare il login per accedere a questa pagina"

## Messaggi di Warning

### Attenzioni
- ⚠️ **Eliminazione Definitiva**: "ATTENZIONE: Questa azione è irreversibile!"
- ⚠️ **Elementi Saltati**: "{count} elemento{count === 1 ? '' : 'i'} non trovato{count === 1 ? '' : 'i'} o già cancellato{count === 1 ? '' : 'i'}"
- ⚠️ **Dipendenze**: "Alcuni elementi non possono essere eliminati per dipendenze"

## Messaggi di Info

### Operazioni
- ℹ️ **Caricamento**: "Caricamento in corso..."
- ℹ️ **Salvataggio**: "Salvataggio in corso..."
- ℹ️ **Elaborazione**: "Elaborazione in corso..."

## Implementazione

### File da Aggiornare

1. **Route Files**:
   - `src/routes/admin.ts`
   - `src/routes/ristoranteMenu.ts`

2. **Config Files**:
   - `src/config/subSectionConfig.ts`
   - `src/config/actionNavConfig.ts`

3. **JavaScript Files**:
   - `src/public/js/formManager.js`
   - `src/public/js/selectableTable.js`

### Esempi di Utilizzo

```javascript
// Messaggio di successo con count
const message = `Aggiornati ${updatedCount} utenti con successo`;
if (skippedCount > 0) {
  message += `. ${skippedCount} utenti non trovati o già cancellati.`;
}

// Messaggio di errore
const errorMessage = 'Si è verificato un errore durante l\'aggiornamento';

// Flash message
req.flash('success', message);
req.flash('error', errorMessage);
```

## Note

- I messaggi devono essere sempre in italiano
- Usare il singolare quando count = 1, plurale altrimenti
- Mantenere la coerenza terminologica in tutto il progetto
- Evitare messaggi troppo tecnici per l'utente finale

## Modifiche Implementate

### ✅ File Aggiornati

1. **`src/routes/admin.ts`**:
   - Messaggi di modifica massiva utenti
   - Messaggi di eliminazione utenti
   - Messaggi di ripristino utenti

2. **`src/routes/ristoranteMenu.ts`**:
   - Messaggi di modifica massiva categorie menu fisso
   - Messaggi di modifica massiva categorie piatti
   - Messaggi di eliminazione categorie menu fisso
   - Messaggi di eliminazione categorie piatti

3. **`src/config/subSectionConfig.ts`**:
   - Messaggi di successo per eliminazione categorie menu fisso
   - Messaggi di successo per eliminazione categorie piatti

### ✅ Miglioramenti Implementati

1. **Pluralizzazione Dinamica**: 
   - `{count} utente{count === 1 ? '' : 'i'}`
   - `{count} categoria{count === 1 ? '' : 'e'}`
   - `{count} allergene{count === 1 ? '' : 'i'}`

2. **Consistenza Terminologica**:
   - Tutti i messaggi seguono lo stesso pattern
   - Terminologia uniforme in tutto il progetto

3. **Professionalità**:
   - Messaggi chiari e professionali
   - Tono amichevole ma formale
