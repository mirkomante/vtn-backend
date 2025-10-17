/**
 * Middleware di health check per monitoraggio sistema
 * Fornisce endpoint per verificare stato applicazione e database
 */

import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import DatabaseSetup from '../setup/databaseSetup';
import FirstRunSetup from '../setup/firstRunSetup';
import { EnvironmentValidator } from '../config/env';

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  environment: string;
  database: {
    connected: boolean;
    configured: boolean;
    hasTables: boolean;
    hasUsers: boolean;
    hasAdmin: boolean;
  };
  setup: {
    isFirstRun: boolean;
    setupCompleted: boolean;
    hasBaseData: boolean;
  };
  auth: {
    localEnabled: boolean;
    googleEnabled: boolean;
    hasValidConfig: boolean;
  };
  menu: {
    ristorante: { enabled: boolean };
    admin: { enabled: boolean };
  };
  errors?: string[];
}

export class HealthCheckMiddleware {
  private static prisma = new PrismaClient();
  private static startTime = Date.now();

  /**
   * Middleware per endpoint health check
   */
  static async healthCheck(_req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const healthStatus = await HealthCheckMiddleware.getHealthStatus();
      
      // Determina status code HTTP
      const statusCode = HealthCheckMiddleware.getStatusCode(healthStatus.status);
      
      res.status(statusCode).json(healthStatus);
    } catch (error) {
      const errorStatus: HealthStatus = {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        uptime: Date.now() - HealthCheckMiddleware.startTime,
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        database: {
          connected: false,
          configured: false,
          hasTables: false,
          hasUsers: false,
          hasAdmin: false
        },
        setup: {
          isFirstRun: true,
          setupCompleted: false,
          hasBaseData: false
        },
        auth: {
          localEnabled: false,
          googleEnabled: false,
          hasValidConfig: false
        },
        menu: {
          ristorante: { enabled: false },
          admin: { enabled: false }
        },
        errors: [error instanceof Error ? error.message : String(error)]
      };

      res.status(500).json(errorStatus);
    }
  }

  /**
   * Middleware per endpoint readiness check
   */
  static async readinessCheck(_req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      const healthStatus = await HealthCheckMiddleware.getHealthStatus();
      
      // Readiness richiede database configurato e setup completato
      const isReady = healthStatus.database.configured && 
                     healthStatus.setup.setupCompleted &&
                     healthStatus.auth.hasValidConfig;

      if (isReady) {
        res.status(200).json({
          status: 'ready',
          timestamp: healthStatus.timestamp,
          message: 'Sistema pronto per ricevere traffico'
        });
      } else {
        res.status(503).json({
          status: 'not_ready',
          timestamp: healthStatus.timestamp,
          message: 'Sistema non pronto',
          details: healthStatus
        });
      }
    } catch (error) {
      res.status(503).json({
        status: 'not_ready',
        timestamp: new Date().toISOString(),
        message: 'Sistema non pronto',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * Middleware per endpoint liveness check
   */
  static async livenessCheck(_req: Request, res: Response, _next: NextFunction): Promise<void> {
    try {
      // Liveness richiede solo che l'applicazione risponda
      res.status(200).json({
        status: 'alive',
        timestamp: new Date().toISOString(),
        uptime: Date.now() - HealthCheckMiddleware.startTime,
        message: 'Applicazione in esecuzione'
      });
    } catch (error) {
      res.status(500).json({
        status: 'dead',
        timestamp: new Date().toISOString(),
        message: 'Applicazione non risponde',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  }

  /**
   * Ottiene lo stato completo del sistema
   */
  static async getHealthStatus(): Promise<HealthStatus> {
    const errors: string[] = [];
    let overallStatus: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

    try {
      // 1. Verifica configurazione ambiente
      let config;
      try {
        config = EnvironmentValidator.getConfig();
      } catch (error) {
        errors.push(`Configurazione ambiente: ${error instanceof Error ? error.message : String(error)}`);
        overallStatus = 'unhealthy';
      }

      // 2. Verifica database
      let databaseStatus;
      try {
        databaseStatus = await DatabaseSetup.getDatabaseStatus();
        if (!databaseStatus.connected) {
          errors.push('Database non connesso');
          overallStatus = 'unhealthy';
        } else if (!databaseStatus.configured) {
          errors.push('Database non configurato');
          overallStatus = 'degraded';
        }
      } catch (error) {
        errors.push(`Database: ${error instanceof Error ? error.message : String(error)}`);
        overallStatus = 'unhealthy';
      }

      // 3. Verifica setup
      let setupStatus;
      try {
        setupStatus = await FirstRunSetup.getSetupStatus();
        if (setupStatus.isFirstRun && !setupStatus.setupCompleted) {
          errors.push('Setup primo avvio non completato');
          overallStatus = 'degraded';
        }
      } catch (error) {
        errors.push(`Setup: ${error instanceof Error ? error.message : String(error)}`);
        overallStatus = 'degraded';
      }

      // 4. Verifica autenticazione
      const authConfig = {
        localEnabled: config?.auth.localEnabled || false,
        googleEnabled: config?.auth.googleEnabled || false,
        hasValidConfig: EnvironmentValidator.hasValidAuthConfig()
      };

      if (!authConfig.hasValidConfig) {
        errors.push('Nessuna strategia di autenticazione valida');
        overallStatus = 'degraded';
      }

      // 5. Verifica menu
      const menuConfig = config?.menu || {
        ristorante: { enabled: false },
        admin: { enabled: false }
      };

      const hasEnabledMenus = EnvironmentValidator.hasEnabledMenus();
      if (!hasEnabledMenus) {
        errors.push('Nessun menu abilitato');
        overallStatus = 'degraded';
      }

      return {
        status: overallStatus,
        timestamp: new Date().toISOString(),
        uptime: Date.now() - HealthCheckMiddleware.startTime,
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        database: databaseStatus || {
          connected: false,
          configured: false,
          hasTables: false,
          hasUsers: false,
          hasAdmin: false
        },
        setup: setupStatus || {
          isFirstRun: true,
          setupCompleted: false,
          hasBaseData: false
        },
        auth: authConfig,
        menu: menuConfig,
        errors: errors.length > 0 ? errors : undefined
      };

    } catch (error) {
      errors.push(`Errore generale: ${error instanceof Error ? error.message : String(error)}`);
      overallStatus = 'unhealthy';

      return {
        status: overallStatus,
        timestamp: new Date().toISOString(),
        uptime: Date.now() - HealthCheckMiddleware.startTime,
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        database: {
          connected: false,
          configured: false,
          hasTables: false,
          hasUsers: false,
          hasAdmin: false
        },
        setup: {
          isFirstRun: true,
          setupCompleted: false,
          hasBaseData: false
        },
        auth: {
          localEnabled: false,
          googleEnabled: false,
          hasValidConfig: false
        },
        menu: {
          ristorante: { enabled: false },
          admin: { enabled: false }
        },
        errors
      };
    }
  }

  /**
   * Determina il codice di stato HTTP basato sullo stato di salute
   */
  static getStatusCode(status: 'healthy' | 'degraded' | 'unhealthy'): number {
    switch (status) {
      case 'healthy':
        return 200;
      case 'degraded':
        return 200; // 200 ma con warning
      case 'unhealthy':
        return 503;
      default:
        return 500;
    }
  }

  /**
   * Chiude la connessione Prisma
   */
  static async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}

export default HealthCheckMiddleware;
