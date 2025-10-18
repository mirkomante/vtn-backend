/**
 * Validatore e gestore delle variabili d'ambiente
 * Garantisce che tutte le configurazioni necessarie siano presenti e valide
 */

export interface EnvironmentConfig {
  // Database
  database: {
    url: string;
  };
  
  // Sessioni
  session: {
    secret: string;
    maxAge: number;
    secure: boolean;
  };
  
  // Google OAuth
  google: {
    clientId: string;
    clientSecret: string;
    enabled: boolean;
  };
  
  // Autenticazione
  auth: {
    localEnabled: boolean;
    googleEnabled: boolean;
  };
  
  // Menu
  menu: {
    ristorante: { enabled: boolean };
    admin: { enabled: boolean };
  };
  
  // Server
  server: {
    port: number;
    nodeEnv: string;
  };
}

/**
 * Valida e carica le variabili d'ambiente
 */
export class EnvironmentValidator {
  private static config: EnvironmentConfig | null = null;

  /**
   * Valida tutte le variabili d'ambiente richieste
   */
  static validate(): EnvironmentConfig {
    if (this.config) {
      return this.config;
    }

    console.log('🔍 Validando configurazione ambiente...');

    const errors: string[] = [];
    const warnings: string[] = [];

    // Database (OBBLIGATORIO)
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      errors.push('DATABASE_URL è obbligatorio');
    } else if (!this.isValidDatabaseUrl(databaseUrl)) {
      errors.push('DATABASE_URL non è un URL valido');
    }

    // Session Secret (OBBLIGATORIO)
    const sessionSecret = process.env.SESSION_SECRET;
    if (!sessionSecret) {
      errors.push('SESSION_SECRET è obbligatorio');
    } else if (sessionSecret.length < 32) {
      warnings.push('SESSION_SECRET dovrebbe essere almeno 32 caratteri per sicurezza');
    }

    // Google OAuth (OPZIONALE ma validato se presente)
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const googleEnabled = process.env.AUTH_GOOGLE_ENABLED !== 'false';

    if (googleEnabled) {
      if (!googleClientId) {
        errors.push('GOOGLE_CLIENT_ID è obbligatorio quando AUTH_GOOGLE_ENABLED è true');
      }
      if (!googleClientSecret) {
        errors.push('GOOGLE_CLIENT_SECRET è obbligatorio quando AUTH_GOOGLE_ENABLED è true');
      }
    }

    // Port (OPZIONALE con default)
    const port = parseInt(process.env.PORT || '8080', 10);
    if (isNaN(port) || port < 1 || port > 65535) {
      errors.push('PORT deve essere un numero valido tra 1 e 65535');
    }

    // Node Environment
    const nodeEnv = process.env.NODE_ENV || 'development';
    if (!['development', 'staging', 'production'].includes(nodeEnv)) {
      warnings.push(`NODE_ENV "${nodeEnv}" non è un ambiente standard`);
    }

    // Log degli errori critici
    if (errors.length > 0) {
      console.error('❌ Errori di configurazione critici:');
      errors.forEach(error => console.error(`  - ${error}`));
      throw new Error(`Configurazione ambiente non valida: ${errors.join(', ')}`);
    }

    // Log dei warning
    if (warnings.length > 0) {
      console.warn('⚠️ Warning di configurazione:');
      warnings.forEach(warning => console.warn(`  - ${warning}`));
    }

    // Crea configurazione validata
    this.config = {
      database: {
        url: databaseUrl!
      },
      session: {
        secret: sessionSecret!,
        maxAge: 60 * 60 * 1000, // 1 ora
        secure: false // Disabilitato per Cloud Run
      },
      google: {
        clientId: googleClientId || '',
        clientSecret: googleClientSecret || '',
        enabled: googleEnabled
      },
      auth: {
        localEnabled: process.env.AUTH_LOCAL_ENABLED === 'true',
        googleEnabled: googleEnabled
      },
      menu: {
        ristorante: {
          enabled: process.env.MENU_RISTORANTE !== 'false'
        },
        admin: {
          enabled: process.env.MENU_ADMIN !== 'false'
        }
      },
      server: {
        port,
        nodeEnv
      }
    };

    console.log('✅ Configurazione ambiente validata con successo');
    this.logConfigSummary();

    return this.config;
  }

  /**
   * Ottiene la configurazione validata
   */
  static getConfig(): EnvironmentConfig {
    if (!this.config) {
      return this.validate();
    }
    return this.config;
  }

  /**
   * Verifica se l'URL del database è valido
   */
  private static isValidDatabaseUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return ['postgresql:', 'postgres:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  }

  /**
   * Log del riepilogo configurazione
   */
  private static logConfigSummary(): void {
    const config = this.config!;
    
    console.log('📊 Riepilogo configurazione:');
    console.log(`  - Ambiente: ${config.server.nodeEnv}`);
    console.log(`  - Porta: ${config.server.port}`);
    console.log(`  - Database: ${this.maskUrl(config.database.url)}`);
    console.log(`  - Auth Locale: ${config.auth.localEnabled ? '✅' : '❌'}`);
    console.log(`  - Auth Google: ${config.auth.googleEnabled ? '✅' : '❌'}`);
    console.log(`  - Menu Ristorante: ${config.menu.ristorante.enabled ? '✅' : '❌'}`);
    console.log(`  - Menu Admin: ${config.menu.admin.enabled ? '✅' : '❌'}`);
  }

  /**
   * Maschera URL sensibili per il logging
   */
  private static maskUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      return `${urlObj.protocol}//${urlObj.hostname}:${urlObj.port}${urlObj.pathname}`;
    } catch {
      return 'URL non valido';
    }
  }

  /**
   * Verifica se almeno una strategia di autenticazione è abilitata
   */
  static hasValidAuthConfig(): boolean {
    const config = this.getConfig();
    return config.auth.localEnabled || config.auth.googleEnabled;
  }

  /**
   * Verifica se almeno un menu è abilitato
   */
  static hasEnabledMenus(): boolean {
    const config = this.getConfig();
    return Object.values(config.menu).some(menu => menu.enabled);
  }

  /**
   * Verifica se la configurazione è valida per la produzione
   */
  static isProductionReady(): boolean {
    const config = this.getConfig();
    
    if (config.server.nodeEnv !== 'production') {
      return true; // Non in produzione, ok
    }

    // In produzione, verifiche aggiuntive
    if (config.session.secret.length < 32) {
      return false;
    }

    if (config.auth.googleEnabled && (!config.google.clientId || !config.google.clientSecret)) {
      return false;
    }

    return true;
  }
}

export default EnvironmentValidator;
