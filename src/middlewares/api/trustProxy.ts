import { Request, Response, NextFunction } from 'express';

/**
 * Middleware per configurare il trust proxy e gestire correttamente gli IP dei client
 * Questo è importante per il rate limiting quando l'app è dietro un proxy/load balancer
 */
export const trustProxyMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  // Configura Express per fidarsi del proxy (per ottenere l'IP reale del client)
  // Questo è necessario quando l'app è dietro un reverse proxy, load balancer, o CDN
  
  // Imposta l'IP del client basandosi sui headers del proxy
  if (req.headers['x-forwarded-for']) {
    // X-Forwarded-For può contenere più IP separati da virgola
    // Il primo è l'IP originale del client
    const forwardedFor = req.headers['x-forwarded-for'] as string;
    (req as any).ip = forwardedFor.split(',')[0].trim();
  } else if (req.headers['x-real-ip']) {
    (req as any).ip = req.headers['x-real-ip'] as string;
  } else if (req.headers['x-client-ip']) {
    (req as any).ip = req.headers['x-client-ip'] as string;
  }
  
  next();
};

/**
 * Middleware per logging delle richieste API (utile per debugging del rate limiting)
 */
export const apiRequestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  
  // Log della richiesta in arrivo
  console.log(`[API] ${req.method} ${req.originalUrl} - IP: ${req.ip} - User-Agent: ${req.headers['user-agent'] || 'Unknown'}`);
  
  // Intercetta la risposta per loggare il tempo di risposta
  const originalSend = res.send;
  res.send = function(data) {
    const duration = Date.now() - startTime;
    console.log(`[API] ${req.method} ${req.originalUrl} - Status: ${res.statusCode} - Duration: ${duration}ms - IP: ${req.ip}`);
    return originalSend.call(this, data);
  };
  
  next();
};
