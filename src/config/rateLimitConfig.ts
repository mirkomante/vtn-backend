/**
 * Configurazione centralizzata per il rate limiting delle API
 */

export const rateLimitConfig = {
  // Configurazione generale per API v1
  api: {
    windowMs: 15 * 60 * 1000, // 15 minuti
    max: 100, // 100 richieste per IP ogni 15 minuti
    message: {
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Troppe richieste da questo IP, riprova più tardi.',
        retryAfter: '15 minuti'
      }
    }
  },
  
  // Configurazione per health check (più permissiva)
  healthCheck: {
    windowMs: 1 * 60 * 1000, // 1 minuto
    max: 10, // 10 richieste per IP al minuto
    message: {
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Troppe richieste per l\'endpoint di health check.',
        retryAfter: '1 minuto'
      }
    }
  },
  
  // Configurazione per endpoint critici (più restrittiva)
  strict: {
    windowMs: 5 * 60 * 1000, // 5 minuti
    max: 20, // 20 richieste per IP ogni 5 minuti
    message: {
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Limite di richieste superato per questo endpoint.',
        retryAfter: '5 minuti'
      }
    }
  },
  
  // Configurazione per ambiente di sviluppo (più permissiva)
  development: {
    windowMs: 1 * 60 * 1000, // 1 minuto
    max: 1000, // 1000 richieste per IP al minuto (molto permissivo)
    message: {
      success: false,
      error: {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Limite di richieste superato (modalità sviluppo).',
        retryAfter: '1 minuto'
      }
    }
  }
};

/**
 * Ottiene la configurazione del rate limiting basata sull'ambiente
 */
export const getRateLimitConfig = (type: 'api' | 'healthCheck' | 'strict' = 'api') => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  if (isDevelopment && type === 'api') {
    return rateLimitConfig.development;
  }
  
  return rateLimitConfig[type];
};

/**
 * IP whitelist per escludere certi IP dal rate limiting
 * (utile per servizi interni, monitoring, etc.)
 */
export const whitelistedIPs = [
  '127.0.0.1',
  '::1',
  '::ffff:127.0.0.1'
  // Aggiungi altri IP che devono essere esclusi dal rate limiting
];

/**
 * Verifica se un IP è nella whitelist
 */
export const isWhitelistedIP = (ip: string): boolean => {
  return whitelistedIPs.includes(ip);
};
