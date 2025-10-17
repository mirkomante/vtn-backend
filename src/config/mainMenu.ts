import { getEnabledMenus, logMenuConfig, validateMenuConfig } from './menuConfig';

export interface MenuItem {
  label: string;
  link: string;
  icon?: string;
  description?: string;
  developmentOnly?: boolean;
  requiredRole?: 'admin' | 'user' | 'all';
}

/**
 * Configurazione dei menu principali con controlli condizionali
 * I menu vengono filtrati in base alla configurazione delle variabili d'ambiente
 */
export const mainMenuItems: MenuItem[] = (() => {
  // Log della configurazione all'avvio
  logMenuConfig();
  
  // Validazione della configurazione
  validateMenuConfig();
  
  // Configurazione base dei menu
  const menuDefinitions: Record<string, MenuItem> = {
    ristorante: {
      label: 'Ristorante: Menu',
      link: '/ristorante-menu',
      icon: 'restaurant',
      description: 'Gestione menu ristorante, piatti, bevande e impostazioni',
      developmentOnly: false,
      requiredRole: 'all'
    },
    admin: {
      label: 'Admin',
      link: '/admin',
      icon: 'admin',
      description: 'Gestione utenti e configurazioni amministrative',
      developmentOnly: false,
      requiredRole: 'admin'
    }
  };
  
  // Filtra i menu in base alla configurazione
  const enabledMenus = getEnabledMenus();
  
  return enabledMenus
    .map(({ name, config }) => ({
      ...menuDefinitions[name],
      developmentOnly: config.developmentOnly,
      requiredRole: config.requiredRole,
      description: config.description
    }))
    .filter(menu => menu); // Rimuove eventuali undefined
})(); 