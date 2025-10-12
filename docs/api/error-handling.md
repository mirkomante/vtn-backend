# Gestione Errori Standardizzata per API v1

## Panoramica

Il sistema di gestione errori fornisce una risposta standardizzata e consistente per tutti gli errori che possono verificarsi nelle API, garantendo un'esperienza utente uniforme e facilitando il debugging.

## Architettura

### 1. Tipi di Errore Standardizzati
- **ErrorCode**: Enum con tutti i codici di errore possibili
- **HttpStatusCode**: Mappatura dei codici di errore ai codici HTTP
- **ERROR_MESSAGES**: Messaggi utente-friendly per ogni tipo di errore

### 2. Middleware di Gestione Errori
- **apiErrorHandler**: Middleware principale per la gestione degli errori
- **notFoundHandler**: Gestisce le rotte non trovate
- **jsonErrorHandler**: Gestisce errori di parsing JSON

### 3. Utility per Creazione Errori
- **createApiError**: Crea errori API personalizzati
- **createValidationError**: Crea errori di validazione
- **createNotFoundError**: Crea errori di risorsa non trovata

## Codici di Errore Supportati

### Errori di Validazione
- `VALIDATION_ERROR`: Dati di input non validi
- `INVALID_INPUT`: Input non valido
- `MISSING_REQUIRED_FIELD`: Campo obbligatorio mancante
- `INVALID_FORMAT`: Formato non valido

### Errori di Autenticazione
- `UNAUTHORIZED`: Autenticazione richiesta
- `FORBIDDEN`: Accesso negato
- `TOKEN_EXPIRED`: Token scaduto
- `INVALID_TOKEN`: Token non valido

### Errori di Risorsa
- `NOT_FOUND`: Risorsa non trovata
- `RESOURCE_CONFLICT`: Conflitto nella risorsa
- `RESOURCE_LOCKED`: Risorsa bloccata

### Errori di Rate Limiting
- `TOO_MANY_REQUESTS`: Troppe richieste
- `RATE_LIMIT_EXCEEDED`: Limite di richieste superato

### Errori di Database
- `DATABASE_ERROR`: Errore del database
- `CONNECTION_ERROR`: Errore di connessione
- `QUERY_ERROR`: Errore nella query
- `CONSTRAINT_ERROR`: Violazione di vincolo

### Errori di Sistema
- `INTERNAL_ERROR`: Errore interno del server
- `SERVICE_UNAVAILABLE`: Servizio non disponibile
- `TIMEOUT`: Timeout della richiesta
- `EXTERNAL_SERVICE_ERROR`: Errore del servizio esterno

## Formato della Risposta di Errore

```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Vino non trovato con ID: 123",
    "details": {
      "resource": "Vino",
      "id": "123"
    },
    "field": "id",
    "timestamp": "2024-01-01T00:00:00Z",
    "requestId": "req_1704067200000_abc123def"
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00Z",
    "requestId": "req_1704067200000_abc123def",
    "version": "v1"
  }
}
```

## Gestione Automatica degli Errori

### Errori Prisma
Il sistema gestisce automaticamente tutti gli errori Prisma:
- **P2002**: Risorsa già esistente → `RESOURCE_CONFLICT`
- **P2025**: Risorsa non trovata → `NOT_FOUND`
- **P2003**: Violazione vincolo chiave esterna → `CONSTRAINT_ERROR`
- **P2014**: Violazione vincolo relazione → `CONSTRAINT_ERROR`

### Errori di Validazione
- Errori di express-validator → `VALIDATION_ERROR`
- Errori di parsing JSON → `INVALID_INPUT`
- Errori di cast → `INVALID_FORMAT`

### Errori di Rate Limiting
- Errori di express-rate-limit → `TOO_MANY_REQUESTS`

### Errori di Autenticazione
- JWT non valido → `INVALID_TOKEN`
- JWT scaduto → `TOKEN_EXPIRED`

## Logging degli Errori

### Livelli di Log
- **ERROR** (500+): Errori critici del server
- **WARN** (400-499): Errori del client

### Informazioni Loggate
- Request ID univoco
- Metodo HTTP e URL
- IP del client
- User-Agent
- Dettagli dell'errore
- Stack trace (per errori 500+)
- Timestamp

## Esempi di Utilizzo

### Creazione di Errori Personalizzati
```typescript
import { createApiError, createNotFoundError, createValidationError } from './errorHandler';

// Errore generico
throw createApiError(
  ErrorCode.BUSINESS_RULE_VIOLATION,
  'Operazione non consentita',
  HttpStatusCode.UNPROCESSABLE_ENTITY,
  { rule: 'max_quantity_exceeded' }
);

// Risorsa non trovata
throw createNotFoundError('Vino', '123');

// Errore di validazione
throw createValidationError('email', 'Email non valida');
```

### Gestione negli Endpoint
```typescript
router.get('/:id', async (req, res, next) => {
  try {
    const vino = await prisma.vino.findUnique({
      where: { id: req.params.id }
    });
    
    if (!vino) {
      throw createNotFoundError('Vino', req.params.id);
    }
    
    res.json({ success: true, data: vino });
  } catch (error) {
    next(error); // L'errore viene gestito automaticamente
  }
});
```

## Best Practices

### 1. Utilizzo delle Utility
- Usa sempre le utility `create*Error` invece di creare errori manualmente
- Specifica sempre il tipo di risorsa e l'ID per errori NOT_FOUND

### 2. Gestione degli Errori
- Lascia che il middleware gestisca gli errori automaticamente
- Non gestire manualmente le risposte di errore negli endpoint

### 3. Logging
- Il logging è automatico, non aggiungere log manuali per errori
- Usa il requestId per tracciare le richieste

### 4. Testing
- Testa tutti i tipi di errore possibili
- Verifica che i codici HTTP siano corretti
- Controlla che i messaggi siano utente-friendly

## Configurazione

### Variabili d'Ambiente
- `NODE_ENV`: Controlla il livello di dettaglio degli errori
  - `production`: Messaggi generici per sicurezza
  - `development`: Dettagli completi per debugging

### Personalizzazione
- Modifica `ERROR_MESSAGES` per personalizzare i messaggi
- Aggiungi nuovi codici di errore in `ErrorCode`
- Estendi `ERROR_HTTP_STATUS` per nuove mappature
