# Formato Risposte JSON Strutturate per API v1

## Panoramica

Il sistema di risposte JSON strutturate fornisce un formato consistente e standardizzato per tutte le risposte delle API, migliorando l'esperienza utente e facilitando l'integrazione.

## Formato Base delle Risposte

### Risposta di Successo
```json
{
  "success": true,
  "data": <dati>,
  "meta": {
    "timestamp": "2024-01-01T00:00:00Z",
    "requestId": "req_1704067200000_abc123def",
    "version": "v1"
  }
}
```

### Risposta di Errore
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

## Tipi di Risposta

### 1. Risposta per Collezioni
```json
{
  "success": true,
  "data": [
    { "id": "1", "nome": "Vino 1" },
    { "id": "2", "nome": "Vino 2" }
  ],
  "meta": {
    "timestamp": "2024-01-01T00:00:00Z",
    "requestId": "req_1704067200000_abc123def",
    "version": "v1",
    "count": 2,
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 2,
      "totalPages": 1,
      "hasNext": false,
      "hasPrev": false
    },
    "filters": {
      "applied": {
        "nazioneId": "uuid-123"
      },
      "available": {
        "nazioneId": ["uuid-123", "uuid-456"]
      }
    },
    "sorting": {
      "sortBy": "nome",
      "sortOrder": "asc"
    }
  }
}
```

### 2. Risposta per Singoli Elementi
```json
{
  "success": true,
  "data": {
    "id": "uuid-123",
    "nome": "Chianti Classico",
    "descrizione": "Vino rosso toscano",
    "prezzo": 25.50,
    "nazione": {
      "id": "uuid-456",
      "nome": "Italia"
    }
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00Z",
    "requestId": "req_1704067200000_abc123def",
    "version": "v1"
  }
}
```

### 3. Risposta per Health Check
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "version": "v1",
    "timestamp": "2024-01-01T00:00:00Z",
    "uptime": 3600,
    "memory": {
      "used": 45,
      "total": 128,
      "percentage": 35
    }
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00Z",
    "requestId": "req_1704067200000_abc123def",
    "version": "v1"
  }
}
```

### 4. Risposta per Operazioni CRUD

#### Creazione
```json
{
  "success": true,
  "data": {
    "id": "uuid-123",
    "nome": "Nuovo Vino"
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00Z",
    "requestId": "req_1704067200000_abc123def",
    "version": "v1",
    "resource": "Vino",
    "action": "create",
    "id": "uuid-123"
  }
}
```

#### Aggiornamento
```json
{
  "success": true,
  "data": {
    "id": "uuid-123",
    "nome": "Vino Aggiornato"
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00Z",
    "requestId": "req_1704067200000_abc123def",
    "version": "v1",
    "resource": "Vino",
    "action": "update",
    "id": "uuid-123"
  }
}
```

#### Eliminazione
```json
{
  "success": true,
  "data": null,
  "meta": {
    "timestamp": "2024-01-01T00:00:00Z",
    "requestId": "req_1704067200000_abc123def",
    "version": "v1",
    "resource": "Vino",
    "action": "delete",
    "id": "uuid-123"
  }
}
```

### 5. Risposta per Ricerca
```json
{
  "success": true,
  "data": [
    { "id": "1", "nome": "Vino trovato" }
  ],
  "meta": {
    "timestamp": "2024-01-01T00:00:00Z",
    "requestId": "req_1704067200000_abc123def",
    "version": "v1",
    "count": 1,
    "query": "chianti",
    "searchFields": ["nome", "descrizione"],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 1,
      "totalPages": 1,
      "hasNext": false,
      "hasPrev": false
    }
  }
}
```

### 6. Risposta per Statistiche
```json
{
  "success": true,
  "data": {
    "totalVini": 150,
    "perNazione": {
      "Italia": 80,
      "Francia": 45,
      "Spagna": 25
    }
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00Z",
    "requestId": "req_1704067200000_abc123def",
    "version": "v1",
    "resource": "Vino",
    "period": "2024",
    "granularity": "monthly"
  }
}
```

### 7. Risposta per Esportazione
```json
{
  "success": true,
  "data": {
    "url": "https://api.example.com/exports/export-123.csv",
    "expiresAt": "2024-01-02T00:00:00Z"
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00Z",
    "requestId": "req_1704067200000_abc123def",
    "version": "v1",
    "format": "csv",
    "filename": "vini-export.csv",
    "size": 1024
  }
}
```

### 8. Risposta per Operazioni Batch
```json
{
  "success": true,
  "data": {
    "successful": [
      { "id": "1", "nome": "Vino 1" },
      { "id": "2", "nome": "Vino 2" }
    ],
    "failed": [
      {
        "item": { "nome": "Vino invalido" },
        "error": "Nome già esistente",
        "index": 2
      }
    ],
    "summary": {
      "total": 3,
      "successful": 2,
      "failed": 1
    }
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00Z",
    "requestId": "req_1704067200000_abc123def",
    "version": "v1",
    "resource": "Vino",
    "action": "batch",
    "batchId": "batch-123"
  }
}
```

## Metadati delle Risposte

### Metadati Base
- **timestamp**: Timestamp ISO 8601 della risposta
- **requestId**: ID univoco della richiesta per tracking
- **version**: Versione dell'API (es. "v1")

### Metadati di Paginazione
- **page**: Numero della pagina corrente
- **limit**: Numero di elementi per pagina
- **total**: Numero totale di elementi
- **totalPages**: Numero totale di pagine
- **hasNext**: Indica se ci sono pagine successive
- **hasPrev**: Indica se ci sono pagine precedenti

### Metadati di Filtri
- **applied**: Filtri applicati alla richiesta
- **available**: Filtri disponibili per la risorsa

### Metadati di Ordinamento
- **sortBy**: Campo utilizzato per l'ordinamento
- **sortOrder**: Direzione dell'ordinamento ("asc" o "desc")

## Utilizzo negli Endpoint

### Metodi Disponibili
```typescript
// Risposta generica
res.apiSuccess(data, options);

// Collezione con paginazione
res.apiCollection(data, options);

// Singolo elemento
res.apiSingle(data, options);

// Health check
res.apiHealth('healthy');

// Operazioni CRUD
res.apiCreate(data, 'Vino', id);
res.apiUpdate(data, 'Vino', id);
res.apiDelete('Vino', id);

// Ricerca
res.apiSearch(data, query, searchFields, options);

// Statistiche
res.apiStats(data, 'Vino', options);

// Esportazione
res.apiExport(data, 'csv', 'export.csv');

// Operazioni batch
res.apiBatch(successful, failed, 'Vino', batchId);
```

### Opzioni di Risposta
```typescript
const options = {
  pagination: {
    page: 1,
    limit: 20,
    total: 100
  },
  filters: {
    applied: { nazioneId: 'uuid-123' },
    available: { nazioneId: ['uuid-123', 'uuid-456'] }
  },
  sorting: {
    sortBy: 'nome',
    sortOrder: 'asc'
  },
  version: 'v1',
  requestId: 'custom-request-id'
};
```

## Utility per Opzioni

### Paginazione
```typescript
import { createPaginationOptions } from './responseHandler';

const options = createPaginationOptions(1, 20, 100);
```

### Filtri
```typescript
import { createFilterOptions } from './responseHandler';

const options = createFilterOptions(
  { nazioneId: 'uuid-123' },
  { nazioneId: ['uuid-123', 'uuid-456'] }
);
```

### Ordinamento
```typescript
import { createSortingOptions } from './responseHandler';

const options = createSortingOptions('nome', 'asc');
```

### Combinazione
```typescript
import { combineResponseOptions } from './responseHandler';

const options = combineResponseOptions(
  createPaginationOptions(1, 20, 100),
  createFilterOptions({ nazioneId: 'uuid-123' }),
  createSortingOptions('nome', 'asc')
);
```

## Best Practices

### 1. Consistenza
- Usa sempre i metodi di risposta standardizzati
- Mantieni lo stesso formato per risorse simili
- Includi sempre i metadati richiesti

### 2. Paginazione
- Usa sempre la paginazione per collezioni grandi
- Limita il numero massimo di elementi per pagina
- Fornisci informazioni complete sulla paginazione

### 3. Filtri e Ordinamento
- Documenta i filtri disponibili
- Fornisci opzioni di ordinamento sensate
- Mantieni la coerenza nei nomi dei campi

### 4. Errori
- Usa sempre la gestione errori standardizzata
- Fornisci messaggi di errore chiari
- Includi dettagli utili per il debugging

### 5. Performance
- Evita di includere dati non necessari
- Usa la paginazione per grandi dataset
- Considera l'uso di campi specifici per ridurre il payload
