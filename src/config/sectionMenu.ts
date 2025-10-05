import { MenuItem } from './mainMenu';

interface SectionMenu {
  [key: string]: MenuItem[];
}

// Esportiamo le singole sezioni
export const ristoranteMenuItems: MenuItem[] = [
  {
    label: 'Menu ristorante',
    link: '/ristorante-menu',
    icon: 'dashboard'
  },
  {
    label: 'Menu Fissi',
    link: '/ristorante-menu/menu-fissi',
    icon: 'tabella'
  },
  {
    label: 'Piatti',
    link: '/ristorante-menu/piatti',
    icon: 'tabella'
  },
  {
    label: 'Servizi',
    link: '/ristorante-menu/servizi',
    icon: 'tabella'
  },
  {
    label: 'Impostazioni',
    link: '/ristorante-menu/impostazioni',
    icon: 'tabella'
  },
  {
    label: 'Cancellati',
    link: '/ristorante-menu/cancellati',
    icon: 'cestino'
  }
];

export const ristorantePrenotazioniItems: MenuItem[] = [
  {
    label: 'Dashboard',
    link: '/ristorante-prenotazioni/dashboard',
    icon: 'dashboard'
  },
  {
    label: 'Lista prenotazioni',
    link: '/ristorante-menu/lista-completa',
    icon: 'lista-completa'
  }
];

export const adminItems: MenuItem[] = [
  {
    label: 'Admin',
    link: '/admin',
    icon: 'dashboard'
  },
  {
    label: 'Utenti',
    link: '/admin/utenti',
    icon: 'utenti'
  },
  {
    label: 'Cancellati',
    link: '/admin/utenti/cancellati',
    icon: 'cestino'
  }
];

export const defaultNavigationItems: MenuItem[] = [
  {
    label: 'Dashboard',
    link: '/dashboard',
    icon: 'dashboard'
  }
];

// Manteniamo anche l'oggetto completo per chi ne avesse bisogno
export const sectionMenuItems: SectionMenu = {
  'ristorante-menu': ristoranteMenuItems,
  'ristorante-prenotazioni': ristorantePrenotazioniItems,
  'admin': adminItems,
  'defaultNavigationItems': defaultNavigationItems
}; 