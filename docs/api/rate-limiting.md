# Rate Limiting per API v1

## Panoramica

Il sistema di rate limiting è implementato per proteggere le API da abusi e sovraccarichi, limitando il numero di richieste che un client può effettuare in un determinato intervallo di tempo.

## Configurazione

### Limiti per Ambiente

- **Produzione**: 100 richieste per IP ogni 15 minuti
- **Sviluppo**: 1000 richieste per IP ogni minuto (molto permissivo)
- **Health Check**: 10 richieste per IP ogni minuto
- **Endpoint Critici**: 20 richieste per IP ogni 5 minuti

### IP Whitelist

Gli IP seguenti sono esclusi dal rate limiting:
- `127.0.0.1` (localhost IPv4)
- `::1` (localhost IPv6)
- `::ffff:127.0.0.1` (localhost IPv4 mapped)

## Headers di Risposta

Il middleware restituisce i seguenti headers informativi:

- `RateLimit-Limit`: Numero massimo di richieste consentite
- `RateLimit-Remaining`: Numero di richieste rimanenti
- `RateLimit-Reset`: Timestamp di reset del contatore

## Risposta di Errore

Quando il limite viene superato, l'API restituisce:

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Troppe richieste da questo IP, riprova più tardi.",
    "retryAfter": "15 minuti"
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00Z",
    "ip": "192.168.1.1"
  }
}
```

## Trust Proxy

Il middleware gestisce automaticamente gli IP dei client anche quando l'applicazione è dietro un proxy o load balancer, controllando i seguenti headers:

- `X-Forwarded-For`
- `X-Real-IP`
- `X-Client-IP`

## Logging

Tutte le richieste API vengono loggate con:
- Metodo HTTP
- URL richiesto
- IP del client
- User-Agent
- Tempo di risposta
- Status code

## Personalizzazione

Per modificare i limiti, aggiorna il file `src/config/rateLimitConfig.ts`.

Per aggiungere IP alla whitelist, modifica l'array `whitelistedIPs` nello stesso file.
