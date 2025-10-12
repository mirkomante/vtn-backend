# API v1 - Documentazione Completa

## Panoramica

L'API v1 del sistema VTN Backend fornisce accesso completo ai dati del ristorante tramite endpoint REST. Tutti gli endpoint restituiscono dati in formato JSON e supportano filtri avanzati, ordinamento e paginazione.

## Base URL

```
http://localhost:3000/api/v1
```

## Formato delle Risposte

Tutte le risposte seguono un formato standard:

```json
{
  "success": true,
  "data": [...],
  "meta": {
    "count": 10,
    "timestamp": "2024-01-01T00:00:00.000Z",
    // Altri metadati specifici per endpoint
  }
}
```

## Gestione Errori

### Formato Errori

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Descrizione dell'errore"
  }
}
```

### Codici di Errore Comuni

| Codice | HTTP Status | Descrizione |
|--------|-------------|-------------|
| `MISSING_PARAMETER` | 400 | Parametro richiesto mancante |
| `INVALID_PARAMETER` | 400 | Parametro non valido |
| `NOT_FOUND` | 404 | Risorsa non trovata |
| `INTERNAL_ERROR` | 500 | Errore interno del server |

## Rate Limiting

L'API implementa rate limiting per proteggere contro abusi:

- **Limite generale**: 100 richieste per minuto per IP
- **Health check**: 1000 richieste per minuto per IP
- **Headers di risposta**:
  - `X-RateLimit-Limit`: Limite massimo
  - `X-RateLimit-Remaining`: Richieste rimanenti
  - `X-RateLimit-Reset`: Timestamp di reset

---

## 🍽️ Endpoint Piatti

### `GET /api/v1/piatti`

Lista tutti i piatti attivi del ristorante.

**Parametri**: Nessuno

**Risposta**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-piatto-1",
      "nome": "Spaghetti Carbonara",
      "descrizione": "Pasta con uova e pancetta",
      "prezzo": "14.00",
      "categoriaId": "uuid-categoria-1",
      "categoria": {
        "id": "uuid-categoria-1",
        "nome": "Primi Piatti",
        "descrizione": "Pasta e risotti"
      },
      "allergeni": [
        {
          "id": "uuid-allergene-1",
          "nome": "Glutine",
          "descrizione": "Presente nella pasta"
        },
        {
          "id": "uuid-allergene-2",
          "nome": "Uova",
          "descrizione": "Presente nella carbonara"
        }
      ]
    }
  ],
  "meta": {
    "count": 1,
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

### `GET /api/v1/piatti/:id`

Dettagli di un piatto specifico.

**Parametri**:
- `id` (path): UUID del piatto

**Risposta**: Stesso formato di `/piatti` ma con un singolo oggetto

### `GET /api/v1/piatti/categoria/:categoriaId`

Piatti di una categoria specifica.

**Parametri**:
- `categoriaId` (path): UUID della categoria

**Risposta**: Stesso formato di `/piatti`

### `GET /api/v1/piatti/allergene/:allergeneId`

Piatti che contengono un allergene specifico.

**Parametri**:
- `allergeneId` (path): UUID dell'allergene

**Risposta**: Stesso formato di `/piatti`

### `GET /api/v1/piatti/categorie`

Piatti raggruppati per categorie nell'ordine di creazione.

**Parametri**: Nessuno

**Risposta**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-categoria-1",
      "nome": "Antipasti",
      "descrizione": "Antipasti della casa",
      "piatti": [
        {
          "id": "uuid-piatto-1",
          "nome": "Bruschetta al Pomodoro",
          "descrizione": "Pane tostato con pomodoro fresco",
          "prezzo": "8.00",
          "allergeni": [
            {
              "id": "uuid-allergene-1",
              "nome": "Glutine",
              "descrizione": "Presente nel pane"
            }
          ]
        }
      ]
    }
  ],
  "meta": {
    "count": 1,
    "totalPiatti": 1,
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

### `GET /api/v1/piatti/categorie/ordine`

Piatti raggruppati per categorie con ordine personalizzato.

**Parametri Query**:
- `categorie` (required): Lista di UUID delle categorie separate da virgola

**Esempio**:
```
GET /api/v1/piatti/categorie/ordine?categorie=uuid-1,uuid-2,uuid-3
```

**Risposta**: Stesso formato di `/piatti/categorie` ma con metadati aggiuntivi:
```json
{
  "meta": {
    "count": 3,
    "totalPiatti": 15,
    "ordineRichiesto": ["uuid-1", "uuid-2", "uuid-3"],
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

### `GET /api/v1/piatti/categorie/filtro`

Piatti raggruppati per categorie con filtri avanzati.

**Parametri Query**:
- `escludi` (optional): Lista di UUID delle categorie da escludere
- `includi` (optional): Lista di UUID delle categorie da includere (solo queste)
- `ordine` (optional): Tipo di ordinamento (`nome`, `nome_desc`, `creazione`, `creazione_desc`, o lista UUID personalizzata)

**Esempi**:
```bash
# Escludi categorie specifiche
GET /api/v1/piatti/categorie/filtro?escludi=uuid-dolci,uuid-bevande

# Solo categorie specifiche
GET /api/v1/piatti/categorie/filtro?includi=uuid-antipasti,uuid-primi

# Ordine alfabetico
GET /api/v1/piatti/categorie/filtro?ordine=nome

# Ordine personalizzato
GET /api/v1/piatti/categorie/filtro?ordine=uuid-primi,uuid-secondi,uuid-dolci

# Combinazione di filtri
GET /api/v1/piatti/categorie/filtro?escludi=uuid-dolci&ordine=nome
```

**Risposta**: Stesso formato di `/piatti/categorie` ma con metadati aggiuntivi:
```json
{
  "meta": {
    "count": 2,
    "totalPiatti": 8,
    "filtri": {
      "escludi": ["uuid-dolci", "uuid-bevande"],
      "includi": null,
      "ordine": "nome"
    },
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 🍷 Endpoint Menu Fissi

### `GET /api/v1/menu-fisso`

Lista tutti i menu fissi attivi.

**Parametri**: Nessuno

**Risposta**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-menu-1",
      "nome": "Menu della Casa",
      "descrizione": "Menu completo con antipasto, primo e secondo",
      "prezzo": "25.00",
      "categoriaId": "uuid-categoria-menu-1",
      "categoria": {
        "id": "uuid-categoria-menu-1",
        "nome": "Menu Completi",
        "descrizione": "Menu fissi completi"
      },
      "piatti": [
        {
          "piatto": {
            "id": "uuid-piatto-1",
            "nome": "Spaghetti Carbonara",
            "descrizione": "Pasta con uova e pancetta",
            "prezzo": "12.00"
          }
        }
      ],
      "servizi": [
        {
          "servizioAccessorio": {
            "id": "uuid-servizio-1",
            "nome": "Coperto",
            "descrizione": "Costo del coperto",
            "prezzo": "2.50"
          }
        }
      ]
    }
  ],
  "meta": {
    "count": 1,
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

### `GET /api/v1/menu-fisso/:id`

Dettagli di un menu fisso specifico.

**Parametri**:
- `id` (path): UUID del menu fisso

**Risposta**: Stesso formato di `/menu-fisso` ma con un singolo oggetto

### `GET /api/v1/menu-fisso/categoria/:categoriaId`

Menu fissi di una categoria specifica.

**Parametri**:
- `categoriaId` (path): UUID della categoria

**Risposta**: Stesso formato di `/menu-fisso`

### `GET /api/v1/menu-fisso/categoria/:categoriaId/dettagli`

Menu fissi di una categoria con allergeni unici dei piatti.

**Parametri**:
- `categoriaId` (path): UUID della categoria

**Risposta**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-menu-1",
      "nome": "Menu della Casa",
      "descrizione": "Menu completo con antipasto, primo e secondo",
      "prezzo": "25.00",
      "categoria": {
        "id": "uuid-categoria-menu-1",
        "nome": "Menu Completi",
        "descrizione": "Menu fissi completi"
      },
      "piatti": [
        {
          "id": "uuid-piatto-1",
          "nome": "Spaghetti Carbonara",
          "descrizione": "Pasta con uova e pancetta",
          "prezzo": "12.00"
        },
        {
          "id": "uuid-piatto-2",
          "nome": "Saltimbocca alla Romana",
          "descrizione": "Vitello con prosciutto e salvia",
          "prezzo": "18.00"
        }
      ],
      "allergeni": [
        {
          "id": "uuid-allergene-1",
          "nome": "Glutine",
          "descrizione": "Presente nella pasta"
        },
        {
          "id": "uuid-allergene-2",
          "nome": "Uova",
          "descrizione": "Presente nella carbonara"
        },
        {
          "id": "uuid-allergene-3",
          "nome": "Latte",
          "descrizione": "Presente nel parmigiano"
        }
      ],
      "servizi": [
        {
          "id": "uuid-servizio-1",
          "nome": "Coperto",
          "descrizione": "Costo del coperto",
          "prezzo": "2.50"
        }
      ]
    }
  ],
  "meta": {
    "count": 1,
    "categoriaId": "uuid-categoria-menu-1",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 🍷 Endpoint Bevande

### `GET /api/v1/vini`

Lista tutti i vini attivi.

**Parametri**: Nessuno

**Risposta**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-vino-1",
      "nome": "Chianti Classico",
      "descrizione": "Vino rosso toscano",
      "cantina": "Tenuta San Guido",
      "grado": "13.5%",
      "certificazione": "DOCG",
      "capacita": "750ml",
      "prezzoCalice": "8.00",
      "prezzo": "25.00",
      "nazione": {
        "id": "uuid-nazione-1",
        "nome": "Italia",
        "sigla": "IT"
      },
      "regione": {
        "id": "uuid-regione-1",
        "nome": "Toscana"
      },
      "zona": {
        "id": "uuid-zona-1",
        "nome": "Chianti"
      },
      "tipologia": {
        "id": "uuid-tipologia-1",
        "nome": "Rosso",
        "descrizione": "Vini rossi"
      }
    }
  ],
  "meta": {
    "count": 1,
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

### `GET /api/v1/birre`

Lista tutte le birre attive.

**Parametri**: Nessuno

**Risposta**: Formato simile ai vini ma con campi specifici per birre:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-birra-1",
      "nome": "Peroni Nastro Azzurro",
      "descrizione": "Birra lager italiana",
      "grado": "5.2%",
      "capacita": "33cl",
      "prezzo": "4.50",
      "nazione": {
        "id": "uuid-nazione-1",
        "nome": "Italia",
        "sigla": "IT"
      },
      "tipologia": {
        "id": "uuid-tipologia-birra-1",
        "nome": "Lager",
        "descrizione": "Birre lager"
      }
    }
  ],
  "meta": {
    "count": 1,
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

### `GET /api/v1/liquori`

Lista tutti i liquori attivi.

**Parametri**: Nessuno

**Risposta**: Formato simile con campi specifici per liquori:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-liquore-1",
      "nome": "Grappa di Barolo",
      "descrizione": "Grappa invecchiata",
      "grado": "40%",
      "invecchiamento": "12 anni",
      "capacita": "70cl",
      "prezzo": "45.00",
      "nazione": {
        "id": "uuid-nazione-1",
        "nome": "Italia",
        "sigla": "IT"
      },
      "tipologia": {
        "id": "uuid-tipologia-liquore-1",
        "nome": "Grappa",
        "descrizione": "Distillati di vinacce"
      }
    }
  ],
  "meta": {
    "count": 1,
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

### `GET /api/v1/cocktails`

Lista tutti i cocktail attivi.

**Parametri**: Nessuno

**Risposta**: Formato simile con campi specifici per cocktail:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-cocktail-1",
      "nome": "Negroni",
      "descrizione": "Cocktail classico italiano",
      "prezzo": "12.00",
      "nazione": {
        "id": "uuid-nazione-1",
        "nome": "Italia",
        "sigla": "IT"
      },
      "tipologia": {
        "id": "uuid-tipologia-cocktail-1",
        "nome": "Classico",
        "descrizione": "Cocktail classici"
      }
    }
  ],
  "meta": {
    "count": 1,
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

### `GET /api/v1/bevande`

Lista tutte le bevande analcoliche attive.

**Parametri**: Nessuno

**Risposta**: Formato simile con campi specifici per bevande:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-bevanda-1",
      "nome": "Coca Cola",
      "descrizione": "Bibita gassata",
      "prezzo": "3.50",
      "nazione": {
        "id": "uuid-nazione-2",
        "nome": "Stati Uniti",
        "sigla": "US"
      },
      "tipologia": {
        "id": "uuid-tipologia-bevanda-1",
        "nome": "Cola",
        "descrizione": "Bibite cola"
      }
    }
  ],
  "meta": {
    "count": 1,
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## ⚙️ Endpoint Servizi

### `GET /api/v1/servizi`

Lista tutti i servizi accessori attivi.

**Parametri**: Nessuno

**Risposta**:
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-servizio-1",
      "nome": "Coperto",
      "descrizione": "Costo del coperto per persona",
      "prezzo": "2.50"
    },
    {
      "id": "uuid-servizio-2",
      "nome": "Pane e Grissini",
      "descrizione": "Pane fresco e grissini",
      "prezzo": "3.00"
    }
  ],
  "meta": {
    "count": 2,
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## Health Check

### `GET /api/v1/health`

Verifica lo stato dell'API.

**Parametri**: Nessuno

**Risposta**:
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## Esempi di Utilizzo

### Frontend Headless - Menu Completo

```javascript
// Recupera menu completo con piatti raggruppati per categoria
const response = await fetch('/api/v1/piatti/categorie');
const data = await response.json();

// Stampa il menu
data.data.forEach(categoria => {
  console.log(`\n=== ${categoria.nome} ===`);
  if (categoria.descrizione) {
    console.log(categoria.descrizione);
  }
  
  categoria.piatti.forEach(piatto => {
    console.log(`\n- ${piatto.nome}: €${piatto.prezzo}`);
    if (piatto.descrizione) {
      console.log(`  ${piatto.descrizione}`);
    }
    if (piatto.allergeni.length > 0) {
      console.log(`  Allergeni: ${piatto.allergeni.map(a => a.nome).join(', ')}`);
    }
  });
});
```

### Menu Fissi con Allergeni

```javascript
// Recupera menu fissi di una categoria con allergeni
const categoriaId = 'uuid-categoria-menu-1';
const response = await fetch(`/api/v1/menu-fisso/categoria/${categoriaId}/dettagli`);
const data = await response.json();

// Stampa menu fissi
data.data.forEach(menu => {
  console.log(`\n🍽️ ${menu.nome} - €${menu.prezzo}`);
  if (menu.descrizione) {
    console.log(menu.descrizione);
  }
  
  console.log('\nPiatti inclusi:');
  menu.piatti.forEach(piatto => {
    console.log(`- ${piatto.nome}: €${piatto.prezzo}`);
  });
  
  if (menu.allergeni.length > 0) {
    console.log('\n⚠️ Allergeni presenti:');
    menu.allergeni.forEach(allergene => {
      console.log(`- ${allergene.nome}`);
    });
  }
});
```

### Filtri Avanzati

```javascript
// Escludi dolci e ordina per nome
const response = await fetch('/api/v1/piatti/categorie/filtro?escludi=uuid-dolci&ordine=nome');
const data = await response.json();

// Solo antipasti e primi in ordine specifico
const response2 = await fetch('/api/v1/piatti/categorie/filtro?includi=uuid-antipasti,uuid-primi&ordine=uuid-primi,uuid-antipasti');
const data2 = await response2.json();
```

### Gestione Errori

```javascript
try {
  const response = await fetch('/api/v1/piatti/invalid-id');
  
  if (!response.ok) {
    const error = await response.json();
    console.error(`Errore ${error.error.code}: ${error.error.message}`);
    return;
  }
  
  const data = await response.json();
  // Gestisci i dati...
  
} catch (error) {
  console.error('Errore di rete:', error);
}
```

---

## Best Practices

### 1. Gestione Cache

```javascript
// Implementa cache lato client per ridurre le chiamate API
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minuti

async function getCachedData(url) {
  const cached = cache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  
  const response = await fetch(url);
  const data = await response.json();
  
  cache.set(url, {
    data,
    timestamp: Date.now()
  });
  
  return data;
}
```

### 2. Rate Limiting

```javascript
// Rispetta i limiti di rate limiting
const rateLimiter = {
  requests: 0,
  resetTime: 0,
  
  async makeRequest(url) {
    const now = Date.now();
    
    if (now > this.resetTime) {
      this.requests = 0;
      this.resetTime = now + 60000; // Reset ogni minuto
    }
    
    if (this.requests >= 100) {
      throw new Error('Rate limit exceeded');
    }
    
    this.requests++;
    return fetch(url);
  }
};
```

### 3. Retry Logic

```javascript
async function fetchWithRetry(url, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return response;
      }
      
      if (response.status >= 500 && i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        continue;
      }
      
      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      if (i === maxRetries - 1) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

### 4. Validazione Dati

```javascript
function validateApiResponse(data) {
  if (!data.success) {
    throw new Error(`API Error: ${data.error.message}`);
  }
  
  if (!Array.isArray(data.data)) {
    throw new Error('Invalid response format: data should be an array');
  }
  
  return data;
}
```

---

## Changelog

### v1.0.0 (2024-01-01)
- ✅ Endpoint piatti completi
- ✅ Endpoint menu fissi con allergeni
- ✅ Endpoint bevande (vini, birre, liquori, cocktail, bevande)
- ✅ Endpoint servizi
- ✅ Filtri avanzati per piatti
- ✅ Rate limiting
- ✅ Gestione errori standardizzata
- ✅ Health check endpoint

---

## Supporto

Per supporto tecnico o domande sull'API:

- Apri una issue su GitHub
- Contatta il team di sviluppo
- Consulta la documentazione del database in [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)
