# Sistema di Toast Message

## Panoramica

Il sistema di toast message è stato generalizzato e integrato in tutto il progetto per fornire feedback all'utente in modo consistente e moderno.

## Caratteristiche

- **Animazioni fluide**: I toast appaiono e scompaiono con animazioni smooth
- **Tipi multipli**: Supporta success, error, warning e info
- **Auto-dismiss**: I toast si chiudono automaticamente dopo 5 secondi
- **Chiusura manuale**: L'utente può chiudere i toast cliccando sulla X
- **Responsive**: Si adatta a tutti i dispositivi
- **Accessibilità**: Include supporto per screen reader

## Utilizzo

### Funzioni Globali

Il sistema fornisce le seguenti funzioni globali:

```javascript
// Toast generico
showToast(message, type, duration)

// Toast specifici per tipo
showSuccessToast(message, duration)
showErrorToast(message, duration)
showWarningToast(message, duration)
showInfoToast(message, duration)

// Funzione di compatibilità con il codice esistente
showMessage(message, type, duration)
```

### Esempi di Utilizzo

```javascript
// Toast di successo
showSuccessToast('Operazione completata con successo!');

// Toast di errore
showErrorToast('Si è verificato un errore durante il salvataggio');

// Toast di warning
showWarningToast('Attenzione: alcuni campi potrebbero essere vuoti');

// Toast informativo
showInfoToast('Caricamento in corso...');

// Toast personalizzato con durata
showToast('Messaggio personalizzato', 'info', 3000);
```

## Integrazione nei Form

### Form di Modifica Singola (edit.ejs)
- Utilizza `subSectionForm.js` o `userForm.js`
- Mostra toast di errore per validazione
- Mostra toast di successo dopo il salvataggio

### Form di Creazione (new.ejs)
- Utilizza `subSectionForm.js`, `userForm.js` o `genericForm.js`
- Mostra toast di errore per validazione
- Mostra toast di successo dopo il salvataggio

### Form di Modifica Massiva (editBulk.ejs)
- Utilizza `bulkEditForm.js`
- Mostra toast di errore per validazione
- Mostra toast di successo dopo il salvataggio
- Reindirizza automaticamente dopo 2 secondi

## Stili

I toast utilizzano le classi Tailwind CSS per lo styling:

- **Success**: Verde (`bg-green-50`, `text-green-800`)
- **Error**: Rosso (`bg-red-50`, `text-red-800`)
- **Warning**: Giallo (`bg-yellow-50`, `text-yellow-800`)
- **Info**: Blu (`bg-blue-50`, `text-blue-800`)

## Posizionamento

I toast appaiono nell'angolo superiore destro dello schermo (`fixed top-4 right-4`) con un z-index alto per essere sempre visibili.

## Compatibilità

Il sistema è compatibile con:
- Tutti i browser moderni
- Dispositivi mobili e desktop
- Screen reader per l'accessibilità
- Il codice esistente (funzione `showMessage`)

## File Coinvolti

- `src/public/js/toast.js` - Sistema principale dei toast
- `src/public/js/bulkEditForm.js` - Integrazione per modifica massiva
- `src/public/js/subSectionForm.js` - Integrazione per form sottosezioni
- `src/public/js/userForm.js` - Integrazione per form utenti
- `src/public/js/genericForm.js` - Integrazione per form generici
- `src/public/js/selectableTable.js` - Integrazione per azioni bulk
- `src/views/layouts/main.ejs` - Inclusione globale del sistema
