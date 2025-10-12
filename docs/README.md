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

**Ultimo aggiornamento**: $(date +"%Y-%m-%d")  
**Versione**: 1.0.0
