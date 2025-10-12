import rateLimit, { ipKeyGenerator } from 'express-rate-limit';
import { getRateLimitConfig, isWhitelistedIP } from '../../config/rateLimitConfig';

// Configurazione rate limiting per API v1
export const apiRateLimiter = rateLimit({
  // Configurazione dinamica basata sull'ambiente
  ...getRateLimitConfig('api'),
  
  // Headers di risposta per informare il client sui limiti
  standardHeaders: true, // Restituisce rate limit info nei headers `RateLimit-*`
  legacyHeaders: false, // Disabilita i headers `X-RateLimit-*`
  
  // Chiave per identificare il client (default: IP)
  keyGenerator: ipKeyGenerator,
  
  // Skip delle richieste che non dovrebbero essere contate
  skip: (req) => {
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    // Esclude IP whitelistati dal rate limiting
    return isWhitelistedIP(clientIP);
  },
  
  // Handler per quando il limite viene superato
  handler: (req, res) => {
    const config = getRateLimitConfig('api');
    res.status(429).json({
      ...config.message,
      meta: {
        timestamp: new Date().toISOString(),
        ip: req.ip || req.connection.remoteAddress || 'unknown'
      }
    });
  }
});

// Rate limiter più permissivo per endpoint di health check
export const healthCheckRateLimiter = rateLimit({
  ...getRateLimitConfig('healthCheck'),
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: ipKeyGenerator,
  skip: (req) => {
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    return isWhitelistedIP(clientIP);
  },
  handler: (req, res) => {
    const config = getRateLimitConfig('healthCheck');
    res.status(429).json({
      ...config.message,
      meta: {
        timestamp: new Date().toISOString(),
        ip: req.ip || req.connection.remoteAddress || 'unknown'
      }
    });
  }
});

// Rate limiter più restrittivo per endpoint specifici (es. ricerca)
export const strictRateLimiter = rateLimit({
  ...getRateLimitConfig('strict'),
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: ipKeyGenerator,
  skip: (req) => {
    const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
    return isWhitelistedIP(clientIP);
  },
  handler: (req, res) => {
    const config = getRateLimitConfig('strict');
    res.status(429).json({
      ...config.message,
      meta: {
        timestamp: new Date().toISOString(),
        ip: req.ip || req.connection.remoteAddress || 'unknown'
      }
    });
  }
});
