import { RateLimiterMemory } from 'rate-limiter-flexible';
import { Request, Response, NextFunction } from 'express';
import { getRateLimitConfig, isWhitelistedIP } from '../../config/rateLimitConfig';

// Configurazione rate limiting per API v1
const apiLimiter = new RateLimiterMemory({
  keyPrefix: 'api',
  points: 100, // Numero di richieste
  duration: 900, // Per 15 minuti (900 secondi)
  blockDuration: 60, // Blocca per 1 minuto se supera il limite
});

// Rate limiter più permissivo per health check
const healthCheckLimiter = new RateLimiterMemory({
  keyPrefix: 'health',
  points: 20, // Numero di richieste
  duration: 60, // Per 1 minuto
  blockDuration: 30, // Blocca per 30 secondi
});

// Rate limiter più restrittivo per endpoint specifici
const strictLimiter = new RateLimiterMemory({
  keyPrefix: 'strict',
  points: 10, // Numero di richieste
  duration: 60, // Per 1 minuto
  blockDuration: 300, // Blocca per 5 minuti
});

// Middleware per applicare il rate limiting
export const createRateLimitMiddleware = (limiter: RateLimiterMemory, type: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
      
      // Skip delle richieste whitelistate
      if (isWhitelistedIP(clientIP)) {
        return next();
      }

      // Applica il rate limiting
      await limiter.consume(clientIP);
      next();
    } catch (rateLimiterRes: any) {
      const config = getRateLimitConfig(type as any);
      
      res.status(429).json({
        ...config.message,
        meta: {
          timestamp: new Date().toISOString(),
          ip: req.ip || req.connection.remoteAddress || 'unknown',
          retryAfter: Math.round(rateLimiterRes.msBeforeNext / 1000) || 1
        }
      });
    }
  };
};

// Esporta i middleware configurati
export const apiRateLimiterMiddleware = createRateLimitMiddleware(apiLimiter, 'api');
export const healthCheckRateLimiterMiddleware = createRateLimitMiddleware(healthCheckLimiter, 'healthCheck');
export const strictRateLimiterMiddleware = createRateLimitMiddleware(strictLimiter, 'strict');

// Manteniamo le esportazioni per compatibilità
export const apiRateLimiter = apiRateLimiterMiddleware;
export const healthCheckRateLimiter = healthCheckRateLimiterMiddleware;
export const strictRateLimiter = strictRateLimiterMiddleware;