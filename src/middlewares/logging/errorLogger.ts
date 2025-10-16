import { Request, Response, NextFunction } from 'express';
import DatabaseLogger from '../../utils/dbLogger';

/**
 * Middleware per logging degli errori con Winston
 */
export const errorLogger = async (error: any, req: Request, _res: Response, next: NextFunction) => {
  const errorData = {
    requestId: (req as any).requestId,
    error: error.message,
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  };

  // Log database
  await DatabaseLogger.error('Unhandled Error', errorData);

  // Log di sicurezza per errori sospetti
  if (error.statusCode === 401 || error.statusCode === 403) {
    const securityData = {
      requestId: (req as any).requestId,
      event: 'unauthorized_access',
      severity: 'medium',
      error: error.message,
      url: req.originalUrl,
      method: req.method,
      ip: req.ip
    };
    
    await DatabaseLogger.warn('Security Event', securityData);
  }

  next(error);
};

