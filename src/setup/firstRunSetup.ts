/**
 * Sistema di primo avvio con controlli di sicurezza
 * Gestisce l'inizializzazione automatica solo al primo avvio
 */

import { PrismaClient } from '@prisma/client';
import { EnvironmentValidator } from '../config/env';
import DatabaseSetup from './databaseSetup';

export class FirstRunSetup {
  private static prisma = new PrismaClient();
  private static isFirstRunCompleted = false;

  /**
   * Esegue il setup completo solo se necessario
   */
  static async performSetupIfNeeded(): Promise<void> {
    console.log('🚀 Verificando necessità di setup...');

    try {
      // 1. Verifica se è davvero il primo avvio
      const isFirstRun = await DatabaseSetup.isFirstRun();
      
      if (!isFirstRun) {
        console.log('✅ Sistema già configurato, skip setup');
        return;
      }

      console.log('🆕 Primo avvio rilevato, eseguendo setup...');

      // 2. Valida configurazione ambiente
      EnvironmentValidator.validate();

      // 3. Verifica che almeno una strategia auth sia abilitata
      if (!EnvironmentValidator.hasValidAuthConfig()) {
        throw new Error('Nessuna strategia di autenticazione abilitata');
      }

      // 4. Verifica che almeno un menu sia abilitato
      if (!EnvironmentValidator.hasEnabledMenus()) {
        throw new Error('Nessun menu abilitato');
      }

      // 5. Esegue setup database
      await DatabaseSetup.ensureDatabaseReady();

      // 6. Crea utente admin se necessario
      await this.createAdminUserIfNeeded();

      // 7. Inizializza dati di base
      await this.initializeBaseData();

      // 8. Marca setup come completato
      this.isFirstRunCompleted = true;

      console.log('🎉 Setup primo avvio completato con successo!');
      console.log('💡 Il sistema è ora pronto per l\'uso');

    } catch (error) {
      console.error('❌ Errore durante setup primo avvio:', error);
      throw new Error(`Setup primo avvio fallito: ${error}`);
    }
  }

  /**
   * Crea utente admin se necessario
   */
  private static async createAdminUserIfNeeded(): Promise<void> {
    try {
      const hasAdmin = await DatabaseSetup.hasAdminUser();
      
      if (hasAdmin) {
        console.log('✅ Utente admin già presente');
        return;
      }

      // Verifica se Google OAuth è abilitato
      const config = EnvironmentValidator.getConfig();
      const isGoogleEnabled = config.auth.googleEnabled;
      
      if (isGoogleEnabled) {
        console.log('🔐 Google OAuth abilitato - il primo utente Google diventerà admin');
        console.log('⏳ In attesa del primo login Google per creare l\'admin...');
        return;
      }

      console.log('👤 Creazione utente admin locale...');

      // Crea utente admin di default solo se Google OAuth non è abilitato
      const adminUser = await this.prisma.user.create({
        data: {
          email: 'admin@vietnamonamour.com',
          givenName: 'Admin',
          familyName: 'System',
          role: 'admin',
          auth: 'admin',
          authProvider: 'local',
        }
      });

      console.log(`✅ Utente admin creato: ${adminUser.email}`);

    } catch (error) {
      console.error('❌ Errore creazione utente admin:', error);
      throw error;
    }
  }

  /**
   * Inizializza dati di base del sistema
   */
  private static async initializeBaseData(): Promise<void> {
    try {
      console.log('📊 Inizializzazione dati di base...');

      // Inizializza categorie piatti se non esistono
      await this.initializeCategoriePiatti();

      // Inizializza nazioni se non esistono
      await this.initializeNazioni();

      // Inizializza allergeni se non esistono
      await this.initializeAllergeni();

      console.log('✅ Dati di base inizializzati');

    } catch (error) {
      console.error('❌ Errore inizializzazione dati base:', error);
      throw error;
    }
  }

  /**
   * Inizializza categorie piatti
   */
  private static async initializeCategoriePiatti(): Promise<void> {
    try {
      const existingCount = await this.prisma.categoriaPiatti.count();
      
      if (existingCount > 0) {
        return; // Già inizializzato
      }

      const categorie = [
        { nome: 'Antipasti', descrizione: 'Antipasti tradizionali vietnamiti' },
        { nome: 'Primi Piatti', descrizione: 'Primi piatti e zuppe' },
        { nome: 'Secondi Piatti', descrizione: 'Secondi piatti principali' },
        { nome: 'Dolci', descrizione: 'Dolci e dessert' },
        { nome: 'Bevande', descrizione: 'Bevande e drink' }
      ];

      await this.prisma.categoriaPiatti.createMany({
        data: categorie
      });

      console.log('✅ Categorie piatti inizializzate');

    } catch (error) {
      console.error('❌ Errore inizializzazione categorie piatti:', error);
      throw error;
    }
  }

  /**
   * Inizializza nazioni
   */
  private static async initializeNazioni(): Promise<void> {
    try {
      const existingCount = await this.prisma.nazione.count();
      
      if (existingCount > 0) {
        return; // Già inizializzato
      }

      const nazioni = [
        { nome: 'Vietnam', sigla: 'VNM' },
        { nome: 'Italia', sigla: 'ITA' },
        { nome: 'Francia', sigla: 'FRA' },
        { nome: 'Germania', sigla: 'DEU' },
        { nome: 'Spagna', sigla: 'ESP' }
      ];

      await this.prisma.nazione.createMany({
        data: nazioni
      });

      console.log('✅ Nazioni inizializzate');

    } catch (error) {
      console.error('❌ Errore inizializzazione nazioni:', error);
      throw error;
    }
  }

  /**
   * Inizializza allergeni
   */
  private static async initializeAllergeni(): Promise<void> {
    try {
      const existingCount = await this.prisma.allergene.count();
      
      if (existingCount > 0) {
        return; // Già inizializzato
      }

      const allergeni = [
        { nome: 'Glutine', descrizione: 'Contiene glutine' },
        { nome: 'Latte', descrizione: 'Contiene latte e derivati' },
        { nome: 'Uova', descrizione: 'Contiene uova' },
        { nome: 'Soia', descrizione: 'Contiene soia' },
        { nome: 'Frutta a guscio', descrizione: 'Contiene frutta a guscio' },
        { nome: 'Arachidi', descrizione: 'Contiene arachidi' },
        { nome: 'Pesce', descrizione: 'Contiene pesce' },
        { nome: 'Crostacei', descrizione: 'Contiene crostacei' },
        { nome: 'Molluschi', descrizione: 'Contiene molluschi' }
      ];

      await this.prisma.allergene.createMany({
        data: allergeni
      });

      console.log('✅ Allergeni inizializzati');

    } catch (error) {
      console.error('❌ Errore inizializzazione allergeni:', error);
      throw error;
    }
  }

  /**
   * Verifica se il setup è stato completato
   */
  static isSetupCompleted(): boolean {
    return this.isFirstRunCompleted;
  }

  /**
   * Ottiene informazioni sullo stato del setup
   */
  static async getSetupStatus(): Promise<{
    isFirstRun: boolean;
    databaseReady: boolean;
    hasAdmin: boolean;
    hasBaseData: boolean;
    setupCompleted: boolean;
  }> {
    try {
      const isFirstRun = await DatabaseSetup.isFirstRun();
      const databaseStatus = await DatabaseSetup.getDatabaseStatus();
      const hasAdmin = await DatabaseSetup.hasAdminUser();
      
      // Verifica se ci sono dati di base
      const hasBaseData = await this.hasBaseData();

      return {
        isFirstRun,
        databaseReady: databaseStatus.configured,
        hasAdmin,
        hasBaseData,
        setupCompleted: this.isFirstRunCompleted
      };
    } catch (error) {
      return {
        isFirstRun: true,
        databaseReady: false,
        hasAdmin: false,
        hasBaseData: false,
        setupCompleted: false
      };
    }
  }

  /**
   * Verifica se ci sono dati di base
   */
  private static async hasBaseData(): Promise<boolean> {
    try {
      const [categorie, nazioni, allergeni] = await Promise.all([
        this.prisma.categoriaPiatti.count(),
        this.prisma.nazione.count(),
        this.prisma.allergene.count()
      ]);

      return categorie > 0 && nazioni > 0 && allergeni > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Chiude la connessione Prisma
   */
  static async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }
}

export default FirstRunSetup;
