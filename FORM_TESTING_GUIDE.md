# Guida al Testing del FormManager

## Preparazione per il Test

### 1. Console del Browser
Apri la console del browser (F12) per vedere i log dettagliati del FormManager.

### 2. Verifica Caricamento Script
Dovresti vedere questi log all'apertura di ogni pagina:
```
🔧 FormManager: DOM caricato, inizializzazione...
🔧 FormManager: Inizializzazione...
🔧 FormManager: Trovati X form
🔧 FormManager: Registrazione form 1 {id: "...", action: "...", method: "..."}
```

## Test 1: Creazione Nuovo Elemento

### Test Case: Nuovo Allergene
1. Vai a `/ristorante-menu/impostazioni/allergeni/nuovo`
2. **Verifica Console Log**:
   ```
   🔧 FormManager: Configurazione form allergeneForm
   🔧 FormManager: Setup form allergeneForm
   🔧 FormManager: Validazione form allergeneForm {showErrors: false}
   ```

3. **Test Validazione**:
   - Lascia vuoto il campo "Nome" e clicca fuori
   - Dovresti vedere: `🔧 FormManager: Campo nome blur`
   - Il bottone "Salva" dovrebbe essere disabilitato

4. **Test Submit**:
   - Compila il campo "Nome" con "Test Allergene"
   - Clicca "Salva"
   - Dovresti vedere:
   ```
   🔧 FormManager: Submit form allergeneForm
   🔧 FormManager: Gestione submit form allergeneForm {isBulkEdit: false, useAjax: true}
   🔧 FormManager: Invio AJAX per form allergeneForm
   🔧 FormManager: Dati form raccolti {nome: "Test Allergene", descrizione: ""}
   🔧 FormManager: Invio richiesta AJAX {url: ".../ajax", method: "POST", data: {...}}
   ```

5. **Verifica Toast**:
   - Dovrebbe apparire un toast di successo
   - Console: `🔧 FormManager: Mostra toast {message: "Allergene creato con successo", type: "success"}`

## Test 2: Modifica Singolo Elemento

### Test Case: Modifica Allergene
1. Vai a `/ristorante-menu/impostazioni/allergeni/modifica/[ID]`
2. **Verifica Console Log**:
   ```
   🔧 FormManager: Configurazione form allergeneForm
   🔧 FormManager: Determinazione configurazione da path {path: "...", action: ".../ajax"}
   ```

3. **Test Validazione**:
   - Svuota il campo "Nome" e clicca fuori
   - Dovresti vedere l'errore di validazione
   - Console: `🔧 FormManager: Errore campo nome - campo obbligatorio`

4. **Test Submit**:
   - Modifica il nome e clicca "Aggiorna"
   - Verifica i log AJAX come nel test precedente

## Test 3: Modifica Massiva

### Test Case: Modifica Massiva Categorie Menu Fisso
1. Vai a `/ristorante-menu/impostazioni/categoria-menu-fisso`
2. Seleziona alcune categorie e clicca "Modifica Massiva"
3. **Verifica Console Log**:
   ```
   🔧 FormManager: Modifica massiva {entityType: "categoria-menu-fisso", supportsBulkEdit: true}
   🔧 FormManager: Configurazione form categoriaMenuFissoForm {isBulkEdit: true, config: {requireAtLeastOneField: true, allowPartialUpdates: true}}
   ```

4. **Test Toggle a Stati**:
   - Verifica che il toggle "In Lista" abbia tre stati:
     - **Unchecked**: `🔧 FormManager: Toggle inLista stato unchecked`
     - **Indeterminate**: `🔧 FormManager: Toggle inLista stato indeterminate`
     - **Checked**: `🔧 FormManager: Toggle inLista stato checked`

5. **Test Validazione Bulk**:
   - Non selezionare nessun campo e clicca "Salva modifiche"
   - Dovresti vedere: `🔧 FormManager: Errore bulk edit - almeno un campo richiesto`
   - Toast: "Seleziona almeno un campo da modificare"

6. **Test Submit Bulk**:
   - Seleziona il toggle "In Lista" e clicca "Salva modifiche"
   - Verifica i log:
   ```
   🔧 FormManager: Dati form raccolti {inLista: true, itemIds: [...]}
   🔧 FormManager: ID elementi selezionati [...]
   ```

## Test 4: Caso Speciale - Allergeni senza Modifica Massiva

### Test Case: Verifica Gestione Allergeni
1. Vai a `/ristorante-menu/impostazioni/allergeni`
2. **Verifica che non ci sia il bottone "Modifica Massiva"**
3. Se per errore si accede a una URL di modifica massiva per allergeni:
   - Console: `⚠️ FormManager: Modifica massiva non supportata per allergene`

## Test 5: Gestione Errori

### Test Case: Errore di Connessione
1. Disconnetti internet
2. Prova a salvare un form
3. **Verifica Console Log**:
   ```
   🔧 FormManager: Errore durante l'invio AJAX Error: Failed to fetch
   🔧 FormManager: Mostra toast {message: "Errore di connessione. Riprova.", type: "error"}
   ```

### Test Case: Errore Server
1. Prova a creare un allergene con un nome già esistente
2. **Verifica Console Log**:
   ```
   🔧 FormManager: Risposta ricevuta {status: 200}
   🔧 FormManager: Risultato {success: false, message: "Un allergene con questo nome esiste già"}
   🔧 FormManager: Errore {message: "Un allergene con questo nome esiste già"}
   ```

## Test 6: Integrazione Toast

### Test Case: Toast Contestuali
1. Crea un nuovo elemento con successo
2. **Verifica che il toast appaia solo per l'azione corrente**
3. **Verifica che non ci siano toast non correlati**

### Test Case: Fallback Toast
1. Temporaneamente disabilita `toast.js`
2. Prova a salvare un form
3. **Verifica Console Log**:
   ```
   🔧 FormManager: Sistema toast non disponibile, uso alert
   ```

## Checklist di Verifica

### ✅ Funzionalità Base
- [ ] FormManager si carica correttamente
- [ ] Validazione in tempo reale funziona
- [ ] Bottone submit si abilita/disabilita correttamente
- [ ] Invio AJAX funziona
- [ ] Toast di successo/errore appaiono

### ✅ Gestione Toggle
- [ ] Toggle standard funziona (ON/OFF)
- [ ] Toggle a stati funziona (unchecked/indeterminate/checked)
- [ ] Stati visuali si aggiornano correttamente

### ✅ Modifica Massiva
- [ ] Solo entità supportate hanno modifica massiva
- [ ] Validazione "almeno un campo" funziona
- [ ] Raccolta ID elementi selezionati funziona
- [ ] Toggle a stati per bulk edit funziona

### ✅ Gestione Errori
- [ ] Errori di validazione mostrati correttamente
- [ ] Errori di connessione gestiti
- [ ] Errori server gestiti
- [ ] Fallback ad alert se toast non disponibile

### ✅ Integrazione
- [ ] Toast contestuali (solo per azioni correnti)
- [ ] Redirect dopo successo
- [ ] Nessun conflitto con script esistenti

## Debugging

### Problemi Comuni

1. **FormManager non si carica**:
   - Verifica che `formManager.js` sia incluso nel layout
   - Controlla errori JavaScript nella console

2. **Validazione non funziona**:
   - Verifica che i campi abbiano `required`
   - Controlla che gli ID siano univoci

3. **AJAX non funziona**:
   - Verifica che le route AJAX esistano
   - Controlla che il server restituisca JSON

4. **Toast non appaiono**:
   - Verifica che `toast.js` sia caricato prima di `formManager.js`
   - Controlla che il sistema toast sia inizializzato

### Log Utili per Debug

```javascript
// Verifica configurazione form
console.log(window.formManager.forms);

// Verifica configurazione specifica
console.log(window.formManager.forms.get('formId'));

// Test validazione manuale
window.formManager.validateFormById('formId', true);

// Test invio manuale
window.formManager.submitFormById('formId');
```
