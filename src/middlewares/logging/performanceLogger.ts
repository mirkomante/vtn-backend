import { Request, Response, NextFunction } from 'express';
import DatabaseLogger from '../../utils/dbLogger';

/**
 * Middleware per monitoring delle performance
 */
export const performanceLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime.bigint();
  
  // Intercetta le query Prisma per monitoring
  const originalQuery = (req as any).prisma?.$queryRaw;
  if (originalQuery) {
    (req as any).prisma.$queryRaw = async (...args: any[]) => {
      const queryStart = process.hrtime.bigint();
      try {
        const result = await originalQuery.apply((req as any).prisma, args);
        const queryEnd = process.hrtime.bigint();
        const queryDuration = Number(queryEnd - queryStart) / 1_000_000;
        
        // Log database operation
        DatabaseLogger.debug('Database Query', {
          requestId: (req as any).requestId,
          operation: 'queryRaw',
          duration: queryDuration,
          url: req.originalUrl,
          method: req.method,
          resultCount: Array.isArray(result) ? result.length : 1
        });
        
        return result;
      } catch (error) {
        const queryEnd = process.hrtime.bigint();
        const queryDuration = Number(queryEnd - queryStart) / 1_000_000;
        
        // Log database error
        const err = error as Error;
        DatabaseLogger.error('Database Query Error', {
          requestId: (req as any).requestId,
          operation: 'queryRaw',
          duration: queryDuration,
          url: req.originalUrl,
          method: req.method,
          error: err.message
        });
        
        throw error;
      }
    };
  }

  res.on('finish', () => {
    const end = process.hrtime.bigint();
    const duration = Number(end - start) / 1_000_000;
    
    // Log performance per endpoint specifici
    if (req.originalUrl.startsWith('/api/')) {
      const perfData = {
        url: req.originalUrl,
        method: req.method,
        statusCode: res.statusCode,
        requestId: (req as any).requestId,
        duration
      };
      
      DatabaseLogger.debug('API Performance', perfData);
    }
  });

  next();
};

