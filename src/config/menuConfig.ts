/**
 * Configurazione centralizzata per i menu principali
 * Permette di abilitare/disabilitare e mostrare/nascondere i menu tramite variabili d'ambiente
 */

export interface MenuConfig {
  enabled: boolean;
  visible: boolean;
  developmentOnly?: boolean;
  requiredRole?: 'admin' | 'user' | 'all';
  description?: string;
}

export interface MainMenuConfig {
  ristorante: MenuConfig;
  admin: MenuConfig;
  // Menu futuri per sviluppo
  analytics?: MenuConfig;
  reports?: MenuConfig;
  settings?: MenuConfig;
  dashboard?: MenuConfig;
}

/**
 * Configurazione dei menu principali
 * Legge le variabili d'ambiente per determinare quali menu sono abilitati e visibili
 */
export const menuConfig: MainMenuConfig = {
  ristorante: {
    enabled: process.env.MENU_RISTORANTE_ENABLED !== 'false', // Default true
    visible: process.env.MENU_RISTORANTE_VISIBLE !== 'false', // Default true
    developmentOnly: false,
    requiredRole: 'all',
    description: 'Gestione menu ristorante, piatti, bevande e impostazioni'
  },
  admin: {
    enabled: process.env.MENU_ADMIN_ENABLED !== 'false', // Default true
    visible: process.env.MENU_ADMIN_VISIBLE !== 'false', // Default true
    developmentOnly: false,
    requiredRole: 'admin',
    description: 'Gestione utenti e configurazioni amministrative'
  },
  // Menu futuri per sviluppo
  analytics: {
    enabled: process.env.MENU_ANALYTICS_ENABLED === 'true',
    visible: process.env.MENU_ANALYTICS_VISIBLE === 'true',
    developmentOnly: true,
    requiredRole: 'admin',
    description: 'Analisi e reportistica (in sviluppo)'
  },
  reports: {
    enabled: process.env.MENU_REPORTS_ENABLED === 'true',
    visible: process.env.MENU_REPORTS_VISIBLE === 'true',
    developmentOnly: true,
    requiredRole: 'admin',
    description: 'Report dettagliati (in sviluppo)'
  },
  settings: {
    enabled: process.env.MENU_SETTINGS_ENABLED === 'true',
    visible: process.env.MENU_SETTINGS_VISIBLE === 'true',
    developmentOnly: true,
    requiredRole: 'admin',
    description: 'Impostazioni avanzate (in sviluppo)'
  },
  dashboard: {
    enabled: process.env.MENU_DASHBOARD_ENABLED === 'true',
    visible: process.env.MENU_DASHBOARD_VISIBLE === 'true',
    developmentOnly: true,
    requiredRole: 'all',
    description: 'Dashboard principale (in sviluppo)'
  }
};

/**
 * Verifica se un menu è abilitato e visibile
 */
export const isMenuEnabled = (menuName: keyof MainMenuConfig): boolean => {
  const menu = menuConfig[menuName];
  return menu ? menu.enabled : false;
};

/**
 * Verifica se un menu è visibile nell'interfaccia
 */
export const isMenuVisible = (menuName: keyof MainMenuConfig): boolean => {
  const menu = menuConfig[menuName];
  return menu ? menu.enabled && menu.visible : false;
};

/**
 * Verifica se un menu è solo per sviluppo
 */
export const isMenuDevelopmentOnly = (menuName: keyof MainMenuConfig): boolean => {
  const menu = menuConfig[menuName];
  return menu ? menu.developmentOnly || false : false;
};

/**
 * Ottiene tutti i menu abilitati e visibili
 */
export const getEnabledMenus = (): Array<{ name: keyof MainMenuConfig; config: MenuConfig }> => {
  return Object.entries(menuConfig)
    .filter(([_, config]) => config.enabled && config.visible)
    .map(([name, config]) => ({ name: name as keyof MainMenuConfig, config }));
};

/**
 * Ottiene tutti i menu per un ruolo specifico
 */
export const getMenusForRole = (role: 'admin' | 'user' | 'all'): Array<{ name: keyof MainMenuConfig; config: MenuConfig }> => {
  return Object.entries(menuConfig)
    .filter(([_, config]) => 
      config.enabled && 
      config.visible && 
      (config.requiredRole === role || config.requiredRole === 'all')
    )
    .map(([name, config]) => ({ name: name as keyof MainMenuConfig, config }));
};

/**
 * Verifica se almeno un menu è abilitato e visibile
 */
export const hasEnabledMenus = (): boolean => {
  return Object.values(menuConfig).some(menu => menu.enabled && menu.visible);
};

/**
 * Log della configurazione dei menu all'avvio
 */
export const logMenuConfig = (): void => {
  console.log('📋 Configurazione Menu:');
  
  Object.entries(menuConfig).forEach(([key, config]) => {
    const status = config.enabled ? '✅ Abilitato' : '❌ Disabilitato';
    const visibility = config.visible ? '(Visibile)' : '(Nascosto)';
    const devOnly = config.developmentOnly ? ' [DEV]' : '';
    const role = config.requiredRole ? ` [${config.requiredRole.toUpperCase()}]` : '';
    
    console.log(`  - ${key}: ${status} ${visibility}${devOnly}${role}`);
  });
  
  const enabledCount = Object.values(menuConfig).filter(menu => menu.enabled && menu.visible).length;
  
  if (enabledCount === 0) {
    console.warn('⚠️  ATTENZIONE: Nessun menu è abilitato e visibile!');
  } else if (enabledCount === 1) {
    console.info('ℹ️  Solo un menu è abilitato e visibile');
  } else {
    console.log(`ℹ️  ${enabledCount} menu abilitati e visibili`);
  }
};

/**
 * Validazione della configurazione dei menu
 */
export const validateMenuConfig = (): void => {
  const enabledMenus = Object.values(menuConfig).filter(menu => menu.enabled && menu.visible);
  
  if (enabledMenus.length === 0) {
    console.error('❌ ERRORE: Nessun menu è abilitato e visibile!');
    throw new Error('Almeno un menu deve essere abilitato e visibile');
  }
  
  // Verifica che i menu principali siano sempre abilitati in produzione
  if (process.env.NODE_ENV === 'production') {
    if (!menuConfig.ristorante.enabled || !menuConfig.ristorante.visible) {
      console.warn('⚠️  ATTENZIONE: Menu Ristorante disabilitato in produzione!');
    }
    if (!menuConfig.admin.enabled || !menuConfig.admin.visible) {
      console.warn('⚠️  ATTENZIONE: Menu Admin disabilitato in produzione!');
    }
  }
};
