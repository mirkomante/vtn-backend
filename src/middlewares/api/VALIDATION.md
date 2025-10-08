# Validazione Input per API v1

## Panoramica

Il sistema di validazione input è implementato per proteggere le API da input malformati, prevenire SQL injection e garantire la qualità dei dati ricevuti.

## Funzionalità Implementate

### 1. Validazione UUID
- Verifica che i parametri ID siano UUID validi
- Applicata a tutti gli endpoint che richiedono un ID specifico

### 2. Validazione Query Parameters
- **Paginazione**: `page` (>= 1), `limit` (1-100)
- **Ordinamento**: `sortBy` (campi validi), `sortOrder` (asc/desc)
- **Filtri**: `search` (1-100 caratteri), `category`, `inLista` (boolean)

### 3. Sanitizzazione Input
- Escape di caratteri HTML e script
- Conversione automatica di numeri
- Rimozione di caratteri potenzialmente pericolosi

## Schemi di Validazione per Endpoint

### Menu Fissi (`/api/v1/menu-fisso`)
- `GET /` - Lista con filtri e paginazione
- `GET /:id` - Dettagli per ID
- `GET /categoria/:categoriaId` - Filtro per categoria

### Piatti (`/api/v1/piatti`)
- `GET /` - Lista con filtri e paginazione
- `GET /:id` - Dettagli per ID
- `GET /categoria/:categoriaId` - Filtro per categoria
- `GET /allergene/:allergeneId` - Filtro per allergene

### Vini (`/api/v1/vini`)
- `GET /` - Lista con filtri geografici e tipologia
- `GET /:id` - Dettagli per ID
- `GET /nazione/:nazioneId` - Filtro per nazione
- `GET /tipologia/:tipologiaId` - Filtro per tipologia

### Birre, Liquori, Cocktails, Bevande
- Stessa struttura dei vini con filtri per nazione e tipologia

### Servizi Accessori (`/api/v1/servizi`)
- `GET /` - Lista con paginazione
- `GET /:id` - Dettagli per ID

## Risposta di Errore

Quando la validazione fallisce, l'API restituisce:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dati di input non validi",
    "details": [
      {
        "field": "id",
        "message": "ID deve essere un UUID valido",
        "value": "invalid-uuid"
      }
    ]
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

## Esempi di Utilizzo

### Paginazione
```
GET /api/v1/vini?page=2&limit=20
```

### Ordinamento
```
GET /api/v1/piatti?sortBy=nome&sortOrder=asc
```

### Filtri
```
GET /api/v1/vini?nazioneId=uuid&tipologiaId=uuid&inLista=true
```

### Ricerca
```
GET /api/v1/piatti?search=pasta
```

## Logging

Tutte le validazioni fallite vengono loggate per debugging:
- Metodo HTTP e URL
- Parametri body, query e path
- Dettagli degli errori di validazione

## Sicurezza

- **SQL Injection**: Prevenuta tramite validazione e sanitizzazione
- **XSS**: Prevenuta tramite escape di caratteri HTML
- **Input Malformati**: Bloccati prima dell'elaborazione
- **Overflow**: Limitati i parametri numerici a range sicuri
