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
  }
];

// Oggetto completo per l'accesso alle sottosezioni
export const subSectionMenuItems: SubSectionMenu = {
  'ristorante-menu-impostazioni': ristoranteMenuImpostazioniSubItems
}; 