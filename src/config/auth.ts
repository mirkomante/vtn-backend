/**
 * Configurazione centralizzata per le strategie di autenticazione
 * Permette di abilitare/disabilitare le diverse strategie tramite variabili d'ambiente
 */

export interface AuthStrategyConfig {
  enabled: boolean;
  requirePasswordChange?: boolean;
}

export interface AuthUIConfig {
  showLocalLogin: boolean;
  showGoogleLogin: boolean;
}

export interface AuthConfig {
  strategies: {
    local: AuthStrategyConfig;
    google: AuthStrategyConfig;
  };
  ui: AuthUIConfig;
  fallback: {
    enabled: boolean;
    message: string;
  };
}

/**
 * Configurazione delle strategie di autenticazione
 * Legge le variabili d'ambiente per determinare quali strategie sono abilitate
 */
export const authConfig: AuthConfig = {
  strategies: {
    local: {
      enabled: process.env.AUTH_LOCAL_ENABLED === 'true',
      requirePasswordChange: false
    },
    google: {
      enabled: process.env.AUTH_GOOGLE_ENABLED !== 'false', // Default true
      requirePasswordChange: false
    }
  },
  ui: {
    showLocalLogin: process.env.AUTH_LOCAL_ENABLED === 'true',
    showGoogleLogin: process.env.AUTH_GOOGLE_ENABLED !== 'false'
  },
  fallback: {
    enabled: true,
    message: 'Nessuna strategia di autenticazione disponibile. Contatta l\'amministratore.'
  }
};

/**
 * Verifica se almeno una strategia è abilitata
 */
export const hasEnabledStrategy = (): boolean => {
  return authConfig.strategies.local.enabled || authConfig.strategies.google.enabled;
};

/**
 * Verifica se una strategia specifica è abilitata
 */
export const isStrategyEnabled = (strategy: 'local' | 'google'): boolean => {
  return authConfig.strategies[strategy].enabled;
};

/**
 * Ottiene la configurazione UI per la vista di login
 */
export const getLoginUIConfig = () => {
  return {
    showLocalLogin: authConfig.ui.showLocalLogin,
    showGoogleLogin: authConfig.ui.showGoogleLogin,
    hasAnyStrategy: hasEnabledStrategy(),
    fallbackMessage: authConfig.fallback.message
  };
};

/**
 * Log della configurazione di autenticazione all'avvio
 */
export const logAuthConfig = (): void => {
  console.log('🔐 Configurazione Autenticazione:');
  console.log(`  - Strategia Locale: ${authConfig.strategies.local.enabled ? '✅ Abilitata' : '❌ Disabilitata'}`);
  console.log(`  - Strategia Google: ${authConfig.strategies.google.enabled ? '✅ Abilitata' : '❌ Disabilitata'}`);
  console.log(`  - UI Locale: ${authConfig.ui.showLocalLogin ? '✅ Visibile' : '❌ Nascosta'}`);
  console.log(`  - UI Google: ${authConfig.ui.showGoogleLogin ? '✅ Visibile' : '❌ Nascosta'}`);
  
  if (!hasEnabledStrategy()) {
    console.warn('⚠️  ATTENZIONE: Nessuna strategia di autenticazione è abilitata!');
  }
};
