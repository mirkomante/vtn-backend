import { MenuItem } from './mainMenu';

interface SubSectionMenu {
  [key: string]: MenuItem[];
}

// Sottosezioni per le impostazioni del ristorante menu
export const ristoranteMenuImpostazioniSubItems: MenuItem[] = [
  {
    label: 'Categoria Menu Fisso',
    link: '/ristorante-menu/impostazioni/categoria-menu-fisso',
    icon: 'tabella'
  },
  {
    label: 'Categoria Piatti',
    link: '/ristorante-menu/impostazioni/categoria-piatti',
    icon: 'tabella'
  },
  {
    label: 'Allergeni',
    link: '/ristorante-menu/impostazioni/allergeni',
    icon: 'tabella'
  },
  {
    label: 'Nazioni',
    link: '/ristorante-menu/impostazioni/nazioni',
    icon: 'globe-alt'
  },
  {
    label: 'Regioni',
    link: '/ristorante-menu/impostazioni/regioni',
    icon: 'map'
  },
  {
    label: 'Zone',
    link: '/ristorante-menu/impostazioni/zone',
    icon: 'map-pin'
  },
  {
    label: 'Tipologie Vino',
    link: '/ristorante-menu/impostazioni/tipologie-vino',
    icon: 'wine'
  },
  {
    label: 'Tipologie Birra',
    link: '/ristorante-menu/impostazioni/tipologie-birra',
    icon: 'beer'
  },
  {
    label: 'Tipologie Liquore',
    link: '/ristorante-menu/impostazioni/tipologie-liquore',
    icon: 'liquor'
  },
  {
    label: 'Tipologie Cocktail',
    link: '/ristorante-menu/impostazioni/tipologie-cocktail',
    icon: 'cocktail'
  },
  {
    label: 'Tipologie Bevanda',
    link: '/ristorante-menu/impostazioni/tipologie-bevanda',
    icon: 'drink'
  }
];

// Oggetto completo per l'accesso alle sottosezioni
export const subSectionMenuItems: SubSectionMenu = {
  'ristorante-menu-impostazioni': ristoranteMenuImpostazioniSubItems
}; 