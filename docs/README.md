# Documentazione VTN Backend

Questa cartella contiene tutta la documentazione tecnica del progetto VTN Backend, organizzata per categorie per facilitare la navigazione e la manutenzione.

## 📁 Struttura della Documentazione

### 🔌 [API Documentation](./api/)
Documentazione completa delle API e dei middleware associati.

- **[Rate Limiting](./api/rate-limiting.md)** - Sistema di limitazione delle richieste
- **[Response Format](./api/response-format.md)** - Formato standardizzato delle risposte JSON
- **[Error Handling](./api/error-handling.md)** - Gestione centralizzata degli errori
- **[Validation](./api/validation.md)** - Sistema di validazione dei parametri

### ⚙️ [Systems Documentation](./systems/)
Documentazione dei sistemi e componenti principali dell'applicazione.

- **[Authentication](./systems/authentication.md)** - Sistema di autenticazione completo (Locale + Google OAuth)
- **[Toast System](./systems/toast-system.md)** - Sistema di notifiche toast
- **[Form Manager](./systems/form-manager.md)** - Gestione unificata dei form
- **[Pagination](./systems/pagination.md)** - Sistema di paginazione per tabelle
- **[Script Management](./systems/script-management.md)** - Gestione centralizzata degli script JavaScript
- **[Detail Views](./systems/detail-views.md)** - Sistema di viste in dettaglio centralizzate
- **[Logging](./systems/logging.md)** - Sistema di logging avanzato

### 📚 [Guides](./guides/)
Guide e documentazione di riferimento per sviluppatori.

- **[Database Schema](./guides/database-schema.md)** - Schema completo del database
- **[Standard Messages](./guides/standard-messages.md)** - Messaggi standardizzati del sistema

### 👥 [Manuale Utente](./manuale-admin.md)
Manuale completo per amministratori e utenti finali.

- **[Manuale Admin](./manuale-admin.md)** - Guida completa per la gestione del sistema

### 📋 [Changelog](./CHANGELOG.md)
Registro delle modifiche e aggiornamenti del sistema.

- **Versioni**: Storia completa delle release
- **Breaking Changes**: Modifiche che richiedono attenzione
- **Nuove Funzionalità**: Descrizione dettagliata delle nuove feature
- **Guide di Migrazione**: Istruzioni per aggiornamenti

## 🎯 Come Usare Questa Documentazione

### Per Sviluppatori
1. **Inizia con** [Authentication](./systems/authentication.md) per configurare l'accesso
2. **Consulta** [Database Schema](./guides/database-schema.md) per capire la struttura dati
3. **Riferisciti** a [API Documentation](./api/) per integrazioni
4. **Esplora** [Systems Documentation](./systems/) per componenti specifici

### Per Integratori
1. **Leggi** [API Documentation](./api/) per endpoint disponibili
2. **Consulta** [Response Format](./api/response-format.md) per formati dati
3. **Riferisciti** a [Error Handling](./api/error-handling.md) per gestione errori

### Per Amministratori e Utenti Finali
1. **Inizia con** [Manuale Admin](./manuale-admin.md) per la gestione del sistema
2. **Consulta** le sezioni specifiche per le funzionalità che ti interessano
3. **Riferisciti** alla sezione Troubleshooting per problemi comuni

### Per Manutenzione
1. **Aggiorna** la documentazione quando modifichi il codice
2. **Mantieni** la coerenza tra documentazione e implementazione
3. **Usa** i link interni per navigare tra le sezioni correlate

## 📝 Convenzioni

- **Titoli**: Usa emoji per identificare rapidamente le sezioni
- **Link**: Usa percorsi relativi per i link interni
- **Codice**: Usa blocchi di codice con syntax highlighting
- **Aggiornamenti**: Data e versione per ogni modifica significativa

## 🔄 Manutenzione

Questa documentazione viene aggiornata automaticamente quando:
- Vengono aggiunti nuovi endpoint API
- Vengono modificati i sistemi esistenti
- Vengono create nuove guide

Per aggiornamenti manuali, modifica i file nella cartella appropriata e aggiorna questo README se necessario.

---

**Ultimo aggiornamento**: 2024-01-15  
**Versione**: 1.1.1

### 🆕 Novità in v1.1.1
- **Documentazione API Bevande** completamente rivista
- **Tutti gli endpoint** per vini, birre, liquori, cocktail e bevande analcoliche
- **Chiarimento terminologico** tra bevande alcoliche e analcoliche
- **Esempi pratici** per utilizzo API bevande

### 🆕 Novità in v1.1.0
- **Campo "Solo Menu Fissi"** per piatti
- **Separazione automatica** tra menu pubblico e menu fissi
- **Miglioramenti di sicurezza** e performance
- **Documentazione aggiornata** con esempi pratici

Vedi [Changelog](./CHANGELOG.md) per dettagli completi.
