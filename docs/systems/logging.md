# Sistema di Logging Avanzato

## Panoramica

Sistema di logging completo basato su Prisma + PostgreSQL per monitoraggio, debugging e audit delle operazioni dell'applicazione.

## Architettura

### Database
- **Tabella**: `logs` con partizionamento mensile
- **Indici**: Ottimizzati per performance
- **Retention**: Configurabile per categoria
- **Cleanup**: Automatico con scheduler

### Livelli di Log
- `ERROR` (0) - Errori critici
- `WARN` (1) - Warning
- `INFO` (2) - Informazioni generali
- `HTTP` (3) - Richieste HTTP
- `DEBUG` (4) - Debug dettagliato

### Categorie
- `app` - Log generali dell'applicazione
- `error` - Errori e eccezioni
- `access` - Richieste HTTP e accessi
- `performance` - Metriche di performance

## Configurazione

### Variabili d'Ambiente
```env
# Database (necessario per logging)
DATABASE_URL=postgresql://user:password@localhost:5432/database
NODE_ENV=production
```

### Schema Database
```sql
CREATE TABLE logs (
  id BIGSERIAL,
  level VARCHAR(10) NOT NULL,
  message TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  category VARCHAR(20) NOT NULL,
  request_id VARCHAR(100),
  user_id VARCHAR(100),
  ip_address INET,
  user_agent TEXT,
  method VARCHAR(10),
  url TEXT,
  status_code INTEGER,
  duration INTEGER,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id, timestamp)
) PARTITION BY RANGE (timestamp);
```

## Utilizzo

### DatabaseLogger
```typescript
import DatabaseLogger from '../utils/dbLogger';

// Log generale
DatabaseLogger.info('User logged in', { userId: '123' });

// Log di errore
DatabaseLogger.error('Database error', { error: err.message });

// Log di accesso
DatabaseLogger.http('API Request', { method: 'GET', url: '/api/v1/vini' });

// Log di performance
DatabaseLogger.warn('Slow query', { duration: 2500, threshold: 1000 });
```

### Utility di Logging
```typescript
import { 
  logRequest, 
  logError, 
  logPerformance, 
  logDatabaseOperation,
  logBusinessOperation,
  logSecurityEvent 
} from '../utils/logger';

// Log richiesta HTTP
logRequest(req, res, duration);

// Log errore
logError(error, req, { context: 'user_creation' });

// Log performance
logPerformance('database_query', 1500, 1000);

// Log operazione database
logDatabaseOperation('findMany', 'users', 500, 'SELECT * FROM users');

// Log operazione business
logBusinessOperation('CREATE', 'User', 'user_123', 'admin_456', {
  before: null,
  after: { name: 'John', email: 'john@example.com' }
});

// Log evento sicurezza
logSecurityEvent('unauthorized_access', 'high', {
  ip: '192.168.1.1',
  attempt: 'admin_panel_access'
});
```

## Middleware

### Request Logger
```typescript
import { requestLogger } from '../middlewares/logging/requestLogger';

app.use(requestLogger);
```

### Error Logger
```typescript
import { errorLogger } from '../middlewares/logging/errorLogger';

app.use(errorLogger);
```

### Performance Logger
```typescript
import { performanceLogger } from '../middlewares/logging/performanceLogger';

app.use(performanceLogger);
```

### Audit Logger
```typescript
import { auditLogger } from '../middlewares/logging/auditLogger';

app.use(auditLogger);
```

## Query Utili

### Statistiche Logs
```sql
-- Logs per categoria (ultime 24 ore)
SELECT * FROM get_logs_stats();

-- Logs per categoria specifica
SELECT * FROM get_logs_stats('error', 24);

-- Richieste lente
SELECT * FROM get_slow_requests(24, 1000);
```

### Dashboard
```sql
-- Vista dashboard (ultimi 7 giorni)
SELECT * FROM logs_dashboard 
WHERE category = 'access' 
ORDER BY timestamp DESC 
LIMIT 100;
```

### Analisi Errori
```sql
-- Errori per endpoint
SELECT 
  url,
  COUNT(*) as error_count,
  MAX(timestamp) as last_error
FROM logs 
WHERE level = 'error' 
  AND timestamp >= NOW() - INTERVAL '24 hours'
GROUP BY url
ORDER BY error_count DESC;
```

### Performance Monitoring
```sql
-- Endpoint più lenti
SELECT 
  url,
  AVG(duration) as avg_duration,
  MAX(duration) as max_duration,
  COUNT(*) as request_count
FROM logs 
WHERE category = 'access' 
  AND timestamp >= NOW() - INTERVAL '1 hour'
GROUP BY url
ORDER BY avg_duration DESC;
```

## Cleanup Automatico

### Configurazione Retention
- **App logs**: 30 giorni
- **Error logs**: 90 giorni
- **Access logs**: 30 giorni
- **Performance logs**: 14 giorni

### Scheduler
```typescript
import { startCleanupScheduler, startPartitionScheduler } from '../utils/cleanup';

// Avvia cleanup automatico
startCleanupScheduler();

// Avvia creazione partizioni
startPartitionScheduler();
```

### Cleanup Manuale
```typescript
import { cleanupOldLogs, createMonthlyPartition } from '../utils/cleanup';

// Cleanup manuale
await cleanupOldLogs();

// Crea partizione per mese specifico
await createMonthlyPartition(2024, 12);
```

## Monitoring e Alerting

### Metriche Automatiche
- Conteggio richieste per endpoint
- Tempo di risposta medio
- Tasso di errori
- Utilizzo memoria

### Alerting
- Errori critici → Log ERROR
- Performance degradata → Log WARN
- Volume anomalo → Log INFO

## Best Practices

### 1. Livelli di Log
- Usa `ERROR` solo per errori critici
- Usa `WARN` per situazioni anomale
- Usa `INFO` per eventi importanti
- Usa `DEBUG` per informazioni dettagliate

### 2. Context
- Includi sempre `requestId` per correlazione
- Aggiungi `userId` per operazioni utente
- Usa `metadata` per informazioni aggiuntive

### 3. Performance
- Usa batch processing per inserimenti
- Evita log eccessivi in produzione
- Monitora le performance del database

### 4. Sicurezza
- Non loggare password o token
- Usa `[REDACTED]` per dati sensibili
- Logga tentativi di accesso sospetti

## Troubleshooting

### Problemi Comuni
1. **Logs non salvati**: Verifica connessione database
2. **Performance lente**: Controlla indici e partizioni
3. **Spazio disco**: Esegui cleanup manuale
4. **Errori batch**: Verifica configurazione batch size

### Debug
```typescript
// Abilita debug logging
// Debug logging (se necessario)
process.env.DEBUG = 'app:*';

// Verifica configurazione
console.log(logger.transports);
```

## Estensibilità

### Nuove Categorie
```typescript
export const customLogger = logger.child({ category: 'custom' });
```

### Nuovi Middleware
```typescript
export const customLogger = (req: Request, res: Response, next: NextFunction) => {
  // Logica personalizzata
  next();
};
```

### Nuove Utility
```typescript
export const logCustomEvent = (event: string, data: any) => {
  appLogger.info('Custom Event', { event, data });
};
```

