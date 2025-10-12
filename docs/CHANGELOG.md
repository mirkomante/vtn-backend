# Changelog VTN Backend

## [1.1.1] - 2024-01-15

### 🔧 Corretto
- **Documentazione API Bevande** completamente rivista
  - Aggiunti tutti gli endpoint mancanti per vini, birre, liquori, cocktail e bevande analcoliche
  - Chiarita la distinzione tra "bevande alcoliche" e "bevande analcoliche"
  - Corretta la confusione terminologica nella documentazione
  - Aggiunti esempi pratici per l'utilizzo delle API bevande
- **Endpoint API Bevande** ora restituiscono tutti i campi
  - Corretto problema per cui `grado`, `invecchiamento`, `capacita` non venivano restituiti
  - Tutti gli endpoint ora mappano correttamente tutti i campi del modello
  - Risolto inconsistenza tra endpoint `/raggruppati-per-tipologia` e altri endpoint

### 📚 Documentazione
- **Endpoint Vini**: Aggiunto supporto paginazione, filtri e ordinamento
- **Endpoint Birre**: Documentati tutti gli endpoint disponibili
- **Endpoint Liquori**: Aggiunta documentazione completa
- **Endpoint Cocktail**: Documentati tutti gli endpoint disponibili
- **Endpoint Bevande Analcoliche**: Chiarita la terminologia e documentati tutti gli endpoint

---

## [1.1.0] - 2024-01-15

### 🆕 Aggiunto
- **Campo `soloMenuFissi`** nel modello `Piatto`
  - Campo booleano opzionale con valore di default `false`
  - Permette di distinguere tra piatti pubblici e piatti solo per menu fissi
  - Integrato in tutti i form di gestione piatti

### 🔄 Modificato
- **Endpoint API Piatti** (`/api/v1/piatti/*`)
  - Escludono automaticamente i piatti con `soloMenuFissi = true`
  - Migliorata la separazione tra menu pubblico e menu fissi
  - Rimosso il parametro `soloMenuFissi` dalle query pubbliche

- **Form di Gestione Piatti**
  - Aggiunto toggle per il campo "Solo Menu Fissi"
  - Integrato nella modifica singola e modifica di massa
  - Supporto per il valore di default `false`

- **Configurazioni Frontend**
  - Aggiornato `sectionFormData.ts` per includere il nuovo campo
  - Aggiornato `sectionTableData.ts` per visualizzare il campo in tabella
  - Aggiornato `detailViewConfig.ts` per i dettagli del piatto

### 🔧 Migliorato
- **Separazione Chiara** tra menu pubblico e menu fissi
- **Sicurezza** dei piatti riservati (non esposti pubblicamente)
- **Flessibilità** nella gestione dei menu fissi
- **Performance** delle query pubbliche (meno dati da processare)

### 📚 Documentazione
- Aggiornata documentazione API con comportamento del campo `soloMenuFissi`
- Aggiunta sezione specifica per gestione piatti "solo menu fissi"
- Aggiornata documentazione del database con nuovi modelli
- Aggiunti esempi di utilizzo e query SQL

### 🔒 Sicurezza
- I piatti con `soloMenuFissi = true` non sono accessibili tramite endpoint pubblici
- Protezione automatica dei piatti riservati
- Controlli di autorizzazione per la gestione menu fissi

### ⚡ Performance
- Query pubbliche più veloci (escludono automaticamente piatti riservati)
- Indici ottimizzati per il campo `soloMenuFissi`
- Separazione logica dei dati per migliori performance

### 🗄️ Database
- Aggiunto campo `soloMenuFissi` alla tabella `piatti`
- Valore di default `false` per compatibilità con dati esistenti
- Nessuna perdita di dati durante l'aggiornamento

### 🧪 Compatibilità
- **Retrocompatibilità**: Tutti i dati esistenti mantengono `soloMenuFissi = false`
- **API**: Nessun breaking change negli endpoint esistenti
- **Frontend**: Interfaccia utente aggiornata senza modifiche drastiche

---

## [1.0.0] - 2024-01-01

### 🆕 Aggiunto
- Sistema completo di gestione ristorante
- Endpoint API per piatti, menu fissi, bevande e servizi
- Sistema di autenticazione e autorizzazione
- Gestione allergeni e categorie
- Soft delete per tutti i modelli
- Rate limiting e gestione errori
- Documentazione completa API e database

### 🔧 Caratteristiche
- **Piatti**: Gestione completa con allergeni e categorie
- **Menu Fissi**: Creazione e gestione menu completi
- **Bevande**: Vini, birre, liquori, cocktail e bevande analcoliche
- **Servizi**: Servizi accessori del ristorante
- **Geolocalizzazione**: Indicazioni geografiche per bevande
- **Tipologie**: Categorizzazione avanzata per bevande

### 🛡️ Sicurezza
- Autenticazione JWT
- Rate limiting per protezione API
- Validazione input completa
- Soft delete per prevenire perdite di dati

### 📊 Performance
- Query ottimizzate con indici
- Paginazione per grandi dataset
- Cache per dati frequenti
- Compressione risposte API

---

## Note per gli Sviluppatori

### Aggiornamento da v1.0.0 a v1.1.0

1. **Database**: Eseguire la migrazione per aggiungere il campo `soloMenuFissi`
2. **Backend**: Nessuna modifica richiesta (già integrato)
3. **Frontend**: Aggiornare le configurazioni se necessario
4. **API**: Nessun breaking change

### Test Consigliati

1. **Test Piatti Pubblici**: Verificare che i piatti con `soloMenuFissi = false` siano visibili negli endpoint pubblici
2. **Test Piatti Riservati**: Verificare che i piatti con `soloMenuFissi = true` NON siano visibili negli endpoint pubblici
3. **Test Menu Fissi**: Verificare che i menu fissi possano includere tutti i tipi di piatti
4. **Test Form**: Verificare che il toggle "Solo Menu Fissi" funzioni correttamente

### Rollback

In caso di problemi, è possibile:
1. Impostare tutti i piatti con `soloMenuFissi = true` a `false`
2. Rimuovere il campo dalla query degli endpoint pubblici
3. Rimuovere il campo dai form di gestione

---

## Supporto

Per domande o problemi relativi a questo aggiornamento:
- Consultare la documentazione API: [API_V1_DOCUMENTATION.md](./api/API_V1_DOCUMENTATION.md)
- Consultare la documentazione database: [database-schema.md](./guides/database-schema.md)
- Aprire una issue su GitHub per supporto tecnico
