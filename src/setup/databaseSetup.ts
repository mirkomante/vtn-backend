/**
 * Setup automatico del database con controlli di sicurezza
 * Garantisce che il database sia configurato correttamente senza toccare dati esistenti
 */

import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

export class DatabaseSetup {
  private static prisma = new PrismaClient();

  /**
   * Verifica e configura il database se necessario
   */
  static async ensureDatabaseReady(): Promise<void> {
    console.log('🗄️ Verificando configurazione database...');

    try {
      // 1. Verifica connessione base
      await this.testConnection();
      console.log('✅ Connessione database verificata');

      // 2. Verifica se le tabelle esistono
      const hasTables = await this.hasRequiredTables();
      if (!hasTables) {
        console.log('📦 Tabelle mancanti, applicando migrazioni...');
        await this.applyMigrations();
      } else {
        console.log('✅ Tabelle database verificate');
      }

      // 3. Verifica migrazioni pendenti
      await this.checkPendingMigrations();

      console.log('✅ Database pronto per l\'uso');

    } catch (error) {
      console.error('❌ Errore configurazione database:', error);
      throw new Error(`Database setup fallito: ${error}`);
    }
  }

  /**
   * Testa la connessione al database
   */
  private static async testConnection(): Promise<void> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch (error) {
      throw new Error(`Impossibile connettersi al database: ${error}`);
    }
  }

  /**
   * Verifica se le tabelle principali esistono
   */
  private static async hasRequiredTables(): Promise<boolean> {
    try {
      // Verifica tabelle critiche una per una
      // User table
      await this.prisma.$queryRaw`SELECT 1 FROM "User" LIMIT 1`;
      
      // Session table
      await this.prisma.$queryRaw`SELECT 1 FROM "session" LIMIT 1`;
      
      // Logs table
      await this.prisma.$queryRaw`SELECT 1 FROM "logs" LIMIT 1`;
      
      return true;
    } catch (error) {
      // Se una tabella non esiste, il database non è configurato
      console.log('⚠️ Tabella mancante rilevata:', error);
      return false;
    }
  }

  /**
   * Applica le migrazioni Prisma
   */
  private static async applyMigrations(): Promise<void> {
    try {
      console.log('🔄 Applicando migrazioni Prisma...');
      
      // Usa Prisma migrate deploy per produzione
      execSync('npx prisma migrate deploy', { 
        stdio: 'inherit',
        env: { ...process.env, NODE_ENV: process.env.NODE_ENV || 'development' }
      });
      
      console.log('✅ Migrazioni applicate con successo');
    } catch (error) {
      throw new Error(`Errore applicazione migrazioni: ${error}`);
    }
  }

  /**
   * Verifica se ci sono migrazioni pendenti
   */
  private static async checkPendingMigrations(): Promise<void> {
    try {
      // Controlla lo stato delle migrazioni
      const migrations = await this.prisma.$queryRaw`
        SELECT migration_name, finished_at 
        FROM _prisma_migrations 
        ORDER BY finished_at DESC 
        LIMIT 1
      ` as any[];

      if (migrations.length > 0) {
        console.log(`✅ Ultima migrazione: ${migrations[0].migration_name}`);
      } else {
        console.log('⚠️ Nessuna migrazione trovata');
      }
    } catch (error) {
      console.warn('⚠️ Impossibile verificare stato migrazioni:', error);
    }
  }

  /**
   * Verifica se il database è già configurato
   */
  static async isDatabaseConfigured(): Promise<boolean> {
    try {
      // Test connessione
      await this.testConnection();
      
      // Verifica tabelle
      const hasTables = await this.hasRequiredTables();
      
      return hasTables;
    } catch (error) {
      return false;
    }
  }

  /**
   * Verifica se esiste almeno un utente admin
   */
  static async hasAdminUser(): Promise<boolean> {
    try {
      const adminCount = await this.prisma.user.count({
        where: { role: 'admin' }
      });
      return adminCount > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Verifica se esiste almeno un utente
   */
  static async hasAnyUser(): Promise<boolean> {
    try {
      const userCount = await this.prisma.user.count();
      return userCount > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Verifica se il sistema è al primo avvio
   */
  static async isFirstRun(): Promise<boolean> {
    try {
      const hasTables = await this.hasRequiredTables();
      const hasUsers = await this.hasAnyUser();
      
      // Primo avvio se non ci sono tabelle o utenti
      return !hasTables || !hasUsers;
    } catch (error) {
      // Se c'è errore, probabilmente è primo avvio
      return true;
    }
  }

  /**
   * Ottiene informazioni sullo stato del database
   */
  static async getDatabaseStatus(): Promise<{
    connected: boolean;
    configured: boolean;
    hasTables: boolean;
    hasUsers: boolean;
    hasAdmin: boolean;
    isFirstRun: boolean;
  }> {
    try {
      const connected = await this.testConnection().then(() => true).catch(() => false);
      const hasTables = await this.hasRequiredTables();
      const hasUsers = await this.hasAnyUser();
      const hasAdmin = await this.hasAdminUser();
      const configured = hasTables && hasUsers;
      const isFirstRun = !hasTables || !hasUsers;

      return {
        connected,
        configured,
        hasTables,
        hasUsers,
        hasAdmin,
        isFirstRun
      };
    } catch (error) {
      return {
        connected: false,
        configured: false,
        hasTables: false,
        hasUsers: false,
        hasAdmin: false,
        isFirstRun: true
      };
    }
  }

  /**
   * Chiude la connessione Prisma
   */
  static async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}

export default DatabaseSetup;
