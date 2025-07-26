export interface MenuItem {
  label: string;
  link: string;
  icon?: string;
}

export const mainMenuItems: MenuItem[] = [
  {
    label: 'Vietnamonamour',
    link: '/website-vietnamonamour'
  },
  {
    label: 'Ristorante: Prenotazioni',
    link: '/ristorante-prenotazioni'
  },
  {
    label: 'Ristorante: Menu',
    link: '/ristorante-menu'
  },
  {
    label: 'Admin',
    link: '/admin'
  }
]; 