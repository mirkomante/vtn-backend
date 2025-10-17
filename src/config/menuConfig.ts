/**
 * Configurazione centralizzata per i menu principali
 * Permette di abilitare/disabilitare e mostrare/nascondere i menu tramite variabili d'ambiente
 */

export interface MenuConfig {
  enabled: boolean;
  developmentOnly?: boolean;
  requiredRole?: 'admin' | 'user' | 'all';
  description?: string;
}

export interface MainMenuConfig {
  ristorante: MenuConfig;
  admin: MenuConfig;
}

/**
 * Configurazione dei menu principali
 * Legge le variabili d'ambiente per determinare quali menu sono abilitati e visibili
 */
export const menuConfig: MainMenuConfig = {
  ristorante: {
    enabled: process.env.MENU_RISTORANTE !== 'false', // Default true
    developmentOnly: false,
    requiredRole: 'all',
    description: 'Gestione menu ristorante, piatti, bevande e impostazioni'
  },
  admin: {
    enabled: process.env.MENU_ADMIN !== 'false', // Default true
    developmentOnly: false,
    requiredRole: 'admin',
    description: 'Gestione utenti e configurazioni amministrative'
  }
};

/**
 * Verifica se un menu è abilitato
 */
export const isMenuEnabled = (menuName: keyof MainMenuConfig): boolean => {
  const menu = menuConfig[menuName];
  return menu ? menu.enabled : false;
};

/**
 * Verifica se un menu è solo per sviluppo
 */
export const isMenuDevelopmentOnly = (menuName: keyof MainMenuConfig): boolean => {
  const menu = menuConfig[menuName];
  return menu ? menu.developmentOnly || false : false;
};

/**
 * Ottiene tutti i menu abilitati
 */
export const getEnabledMenus = (): Array<{ name: keyof MainMenuConfig; config: MenuConfig }> => {
  return Object.entries(menuConfig)
    .filter(([_, config]) => config.enabled)
    .map(([name, config]) => ({ name: name as keyof MainMenuConfig, config }));
};

/**
 * Ottiene tutti i menu per un ruolo specifico
 */
export const getMenusForRole = (role: 'admin' | 'user' | 'all'): Array<{ name: keyof MainMenuConfig; config: MenuConfig }> => {
  return Object.entries(menuConfig)
    .filter(([_, config]) => 
      config.enabled && 
      (config.requiredRole === role || config.requiredRole === 'all')
    )
    .map(([name, config]) => ({ name: name as keyof MainMenuConfig, config }));
};

/**
 * Verifica se almeno un menu è abilitato
 */
export const hasEnabledMenus = (): boolean => {
  return Object.values(menuConfig).some(menu => menu.enabled);
};

/**
 * Log della configurazione dei menu all'avvio
 */
export const logMenuConfig = (): void => {
  console.log('📋 Configurazione Menu:');
  
  Object.entries(menuConfig).forEach(([key, config]) => {
    const status = config.enabled ? '✅ Abilitato' : '❌ Disabilitato';
    const devOnly = config.developmentOnly ? ' [DEV]' : '';
    const role = config.requiredRole ? ` [${config.requiredRole.toUpperCase()}]` : '';
    
    console.log(`  - ${key}: ${status}${devOnly}${role}`);
  });
  
  const enabledCount = Object.values(menuConfig).filter(menu => menu.enabled).length;
  
  if (enabledCount === 0) {
    console.warn('⚠️  ATTENZIONE: Nessun menu è abilitato!');
  } else if (enabledCount === 1) {
    console.info('ℹ️  Solo un menu è abilitato');
  } else {
    console.log(`ℹ️  ${enabledCount} menu abilitati`);
  }
};

/**
 * Validazione della configurazione dei menu
 */
export const validateMenuConfig = (): void => {
  const enabledMenus = Object.values(menuConfig).filter(menu => menu.enabled);
  
  if (enabledMenus.length === 0) {
    console.error('❌ ERRORE: Nessun menu è abilitato!');
    throw new Error('Almeno un menu deve essere abilitato');
  }
  
  // Verifica che i menu principali siano sempre abilitati in produzione
  if (process.env.NODE_ENV === 'production') {
    if (!menuConfig.ristorante.enabled) {
      console.warn('⚠️  ATTENZIONE: Menu Ristorante disabilitato in produzione!');
    }
    if (!menuConfig.admin.enabled) {
      console.warn('⚠️  ATTENZIONE: Menu Admin disabilitato in produzione!');
    }
  }
};
