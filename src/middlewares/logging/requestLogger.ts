import { Request, Response, NextFunction } from 'express';
import DatabaseLogger from '../../utils/dbLogger';

/**
 * Middleware per logging delle richieste HTTP con performance monitoring
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime.bigint();
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  (req as any).requestId = requestId;

  res.on('finish', async () => {
    const end = process.hrtime.bigint();
    const duration = Number(end - start) / 1_000_000; // Durata in ms
    
    const logData = {
      requestId,
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      statusCode: res.statusCode,
      duration
    };
    
    // Log database
    await DatabaseLogger.http('API Request', logData);
    
    // Log performance se la richiesta è lenta
    if (duration > 1000) {
      const slowLogData = {
        requestId,
        url: req.originalUrl,
        method: req.method,
        duration,
        threshold: 1000
      };
      
      await DatabaseLogger.warn('Slow API Request', slowLogData);
    }
  });

  // Gestione errori durante la richiesta
  res.on('error', async (error) => {
    const end = process.hrtime.bigint();
    const duration = Number(end - start) / 1_000_000;
    
    const errorLogData = {
      requestId,
      error: error.message,
      duration,
      url: req.originalUrl,
      method: req.method
    };
    
    await DatabaseLogger.error('Response Error', errorLogData);
  });

  next();
};
