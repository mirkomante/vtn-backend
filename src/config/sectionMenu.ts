import { MenuItem } from './mainMenu';

interface SectionMenu {
  [key: string]: MenuItem[];
}

// Esportiamo le singole sezioni
export const ristoranteMenuItems: MenuItem[] = [
  {
    label: 'Menu degustazione',
    link: '/ristorante-menu/degustazioni',
    icon: 'degustazioni'
  },
  {
    label: 'Menu lavoro',
    link: '/ristorante-menu/lavoro',
    icon: 'lavoro'
  },
  {
    label: 'Piatti',
    link: '/ristorante-menu/piatti',
    icon: 'piatti'
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