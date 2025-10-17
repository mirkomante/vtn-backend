/**
 * Sistema di graceful shutdown per terminazione pulita dell'applicazione
 * Garantisce che tutte le connessioni e risorse vengano chiuse correttamente
 */

import { Server } from 'http';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

export class GracefulShutdown {
  private static server: Server | null = null;
  private static prisma: PrismaClient | null = null;
  private static pgPool: Pool | null = null;
  private static isShuttingDown = false;
  private static shutdownTimeout = 30000; // 30 secondi

  /**
   * Inizializza il sistema di graceful shutdown
   */
  static initialize(server: Server, prisma: PrismaClient, pgPool: Pool): void {
    this.server = server;
    this.prisma = prisma;
    this.pgPool = pgPool;

    // Registra gestori per segnali di terminazione
    this.registerSignalHandlers();

    console.log('🛡️ Sistema graceful shutdown inizializzato');
  }

  /**
   * Registra i gestori per i segnali di terminazione
   */
  private static registerSignalHandlers(): void {
    // SIGTERM - terminazione normale
    process.on('SIGTERM', () => {
      console.log('📡 Ricevuto SIGTERM, avviando shutdown...');
      this.shutdown('SIGTERM');
    });

    // SIGINT - interruzione (Ctrl+C)
    process.on('SIGINT', () => {
      console.log('📡 Ricevuto SIGINT, avviando shutdown...');
      this.shutdown('SIGINT');
    });

    // SIGHUP - hangup (riavvio)
    process.on('SIGHUP', () => {
      console.log('📡 Ricevuto SIGHUP, avviando shutdown...');
      this.shutdown('SIGHUP');
    });

    // Gestione errori non catturati
    process.on('uncaughtException', (error) => {
      console.error('❌ Errore non catturato:', error);
      this.shutdown('uncaughtException');
    });

    process.on('unhandledRejection', (reason, _promise) => {
      console.error('❌ Promise rifiutata non gestita:', reason);
      this.shutdown('unhandledRejection');
    });
  }

  /**
   * Esegue lo shutdown graceful
   */
  private static async shutdown(signal: string): Promise<void> {
    if (this.isShuttingDown) {
      console.log('⚠️ Shutdown già in corso, ignorando segnale:', signal);
      return;
    }

    this.isShuttingDown = true;
    console.log(`🔄 Avviando shutdown graceful (${signal})...`);

    try {
      // 1. Chiude il server HTTP
      await this.closeServer();

      // 2. Chiude connessioni database
      await this.closeDatabaseConnections();

      // 3. Chiude pool PostgreSQL
      await this.closePgPool();

      console.log('✅ Shutdown completato con successo');
      process.exit(0);

    } catch (error) {
      console.error('❌ Errore durante shutdown:', error);
      console.log('🔄 Forzando terminazione...');
      process.exit(1);
    }
  }

  /**
   * Chiude il server HTTP
   */
  private static async closeServer(): Promise<void> {
    if (!this.server) {
      console.log('⚠️ Server HTTP non inizializzato');
      return;
    }

    return new Promise((resolve, reject) => {
      console.log('🔄 Chiudendo server HTTP...');
      
      this.server!.close((error) => {
        if (error) {
          console.error('❌ Errore chiusura server:', error);
          reject(error);
        } else {
          console.log('✅ Server HTTP chiuso');
          resolve();
        }
      });

      // Timeout per chiusura forzata
      setTimeout(() => {
        console.log('⚠️ Timeout chiusura server, forzando...');
        this.server!.close(() => {
          console.log('✅ Server HTTP chiuso forzatamente');
          resolve();
        });
      }, this.shutdownTimeout);
    });
  }

  /**
   * Chiude le connessioni database
   */
  private static async closeDatabaseConnections(): Promise<void> {
    if (!this.prisma) {
      console.log('⚠️ Prisma non inizializzato');
      return;
    }

    try {
      console.log('🔄 Chiudendo connessioni Prisma...');
      await this.prisma.$disconnect();
      console.log('✅ Connessioni Prisma chiuse');
    } catch (error) {
      console.error('❌ Errore chiusura Prisma:', error);
      throw error;
    }
  }

  /**
   * Chiude il pool PostgreSQL
   */
  private static async closePgPool(): Promise<void> {
    if (!this.pgPool) {
      console.log('⚠️ Pool PostgreSQL non inizializzato');
      return;
    }

    try {
      console.log('🔄 Chiudendo pool PostgreSQL...');
      await this.pgPool.end();
      console.log('✅ Pool PostgreSQL chiuso');
    } catch (error) {
      console.error('❌ Errore chiusura pool PostgreSQL:', error);
      throw error;
    }
  }

  /**
   * Verifica se lo shutdown è in corso
   */
  static isShuttingDownInProgress(): boolean {
    return this.isShuttingDown;
  }

  /**
   * Imposta il timeout per lo shutdown
   */
  static setTimeout(timeout: number): void {
    this.shutdownTimeout = timeout;
    console.log(`⏱️ Timeout shutdown impostato a ${timeout}ms`);
  }

  /**
   * Forza la terminazione immediata
   */
  static forceExit(code: number = 1): void {
    console.log('🔄 Forzando terminazione immediata...');
    process.exit(code);
  }

  /**
   * Ottiene informazioni sullo stato dello shutdown
   */
  static getStatus(): {
    isShuttingDown: boolean;
    shutdownTimeout: number;
    serverActive: boolean;
    prismaActive: boolean;
    pgPoolActive: boolean;
  } {
    return {
      isShuttingDown: this.isShuttingDown,
      shutdownTimeout: this.shutdownTimeout,
      serverActive: this.server !== null,
      prismaActive: this.prisma !== null,
      pgPoolActive: this.pgPool !== null
    };
  }
}

export default GracefulShutdown;
