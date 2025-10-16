import { Request, Response, NextFunction } from 'express';
import DatabaseLogger from '../../utils/dbLogger';

/**
 * Middleware per audit logging delle operazioni sensibili
 */
export const auditLogger = (req: Request, _res: Response, next: NextFunction) => {
  // Log delle operazioni API
  if (req.originalUrl.startsWith('/api/')) {
    const auditData = {
      requestId: (req as any).requestId,
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: (req as any).user?.id
    };
    
    DatabaseLogger.info('API Access', auditData);
  }

  // Log delle operazioni sospette
  if (req.originalUrl.includes('..') || req.originalUrl.includes('//')) {
    const securityData = {
      requestId: (req as any).requestId,
      event: 'path_traversal_attempt',
      severity: 'high',
      url: req.originalUrl,
      method: req.method,
      ip: req.ip
    };
    
    DatabaseLogger.warn('Security Event', securityData);
  }

  next();
};

/**
 * Estrae il nome della risorsa dall'URL
 */
// function _getResourceFromUrl(_url: string): string {
//   const parts = _url.split('/');
//   const apiIndex = parts.findIndex(part => part === 'api');
//   
//   if (apiIndex !== -1 && parts[apiIndex + 2]) {
//     return parts[apiIndex + 2].replace(/[^a-zA-Z0-9]/g, '');
//   }
//   
//   return 'Unknown';
// }

/**
 * Estrae l'ID della risorsa dall'URL
 */
// function _getResourceIdFromUrl(_url: string): string | undefined {
//   const parts = _url.split('/');
//   const lastPart = parts[parts.length - 1];
//   
//   // Controlla se l'ultima parte è un UUID
//   const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
//   
//   if (uuidRegex.test(lastPart)) {
//     return lastPart;
//   }
//   
//   return undefined;
// }

