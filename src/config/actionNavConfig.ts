export interface ActionNavAction {
  type: 'link' | 'button';
  text: string;
  href?: string;
  id?: string;
  classes?: string;
}

export interface ActionNavConfig {
  actions: ActionNavAction[];
}

// Funzione helper per generare configurazioni actionNav per sottosezioni
export function createSubSectionActionNav(subSection: string, action: 'index' | 'new' | 'edit' | 'view' | 'editBulk', itemId?: string): ActionNavConfig {
  const baseUrl = `/ristorante-menu/impostazioni/${subSection}`;
  
  switch (action) {
    case 'index':
      return {
        actions: [
          {
            type: 'link',
            text: 'Nuovo',
            href: `${baseUrl}/nuovo`,
            classes: 'rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
          }
        ]
      };
    
    case 'new':
    case 'edit':
    case 'editBulk':
      return {
        actions: [
          {
            type: 'link',
            text: 'Torna alla lista',
            href: baseUrl,
            classes: 'rounded-md bg-gray-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600'
          }
        ]
      };
    
    case 'view':
      return {
        actions: [
          {
            type: 'link',
            text: 'Torna alla lista',
            href: baseUrl,
            classes: 'rounded-md bg-gray-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600'
          },
          {
            type: 'link',
            text: 'Modifica',
            href: `${baseUrl}/modifica/${itemId}`,
            classes: 'rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
          }
        ]
      };
    
    default:
      return { actions: [] };
  }
}

// Configurazioni statiche per pagine specifiche (utenti, ecc.)
export const actionNavConfigs: Record<string, ActionNavConfig> = {
  'users.index': {
    actions: [
      {
        type: 'link',
        text: 'Nuovo Utente',
        href: '/admin/utenti/nuovo',
        classes: 'rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
      }
    ]
  },
  
  'servizi.index': {
    actions: [
      {
        type: 'link',
        text: 'Nuovo Servizio',
        href: '/ristorante-menu/servizi/nuovo',
        classes: 'rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
      }
    ]
  },
  
  'servizi.new': {
    actions: [
      {
        type: 'link',
        text: 'Torna alla lista',
        href: '/ristorante-menu/servizi',
        classes: 'rounded-md bg-gray-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600'
      }
    ]
  },
  
  'servizi.edit': {
    actions: [
      {
        type: 'link',
        text: 'Torna alla lista',
        href: '/ristorante-menu/servizi',
        classes: 'rounded-md bg-gray-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600'
      }
    ]
  },
  
  'servizi.view': {
    actions: [
      {
        type: 'link',
        text: 'Torna alla lista',
        href: '/ristorante-menu/servizi',
        classes: 'rounded-md bg-gray-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600'
      },
      {
        type: 'link',
        text: 'Modifica',
        href: '/ristorante-menu/servizi/modifica/:id',
        classes: 'rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
      }
    ]
  },
  
  'servizi.editBulk': {
    actions: [
      {
        type: 'link',
        text: 'Torna alla lista',
        href: '/ristorante-menu/servizi',
        classes: 'rounded-md bg-gray-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600'
      }
    ]
  },

  'piatti.index': {
    actions: [
      {
        type: 'link',
        text: 'Nuovo Piatto',
        href: '/ristorante-menu/piatti/nuovo',
        classes: 'rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
      }
    ]
  },
  
  'piatti.new': {
    actions: [
      {
        type: 'link',
        text: 'Torna alla lista',
        href: '/ristorante-menu/piatti',
        classes: 'rounded-md bg-gray-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600'
      }
    ]
  },
  
  'piatti.edit': {
    actions: [
      {
        type: 'link',
        text: 'Torna alla lista',
        href: '/ristorante-menu/piatti',
        classes: 'rounded-md bg-gray-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600'
      }
    ]
  },
  
  'piatti.view': {
    actions: [
      {
        type: 'link',
        text: 'Torna alla lista',
        href: '/ristorante-menu/piatti',
        classes: 'rounded-md bg-gray-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600'
      },
      {
        type: 'link',
        text: 'Modifica',
        href: '/ristorante-menu/piatti/modifica/:id',
        classes: 'rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
      }
    ]
  },
  
  'piatti.editBulk': {
    actions: [
      {
        type: 'link',
        text: 'Torna alla lista',
        href: '/ristorante-menu/piatti',
        classes: 'rounded-md bg-gray-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600'
      }
    ]
  },
  
  'menu-fissi.index': {
    actions: [
      {
        type: 'link',
        text: 'Nuovo Menu',
        href: '/ristorante-menu/menu-fissi/nuovo',
        classes: 'rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
      }
    ]
  },
  
  'menu-fissi.new': {
    actions: [
      {
        type: 'link',
        text: 'Torna alla lista',
        href: '/ristorante-menu/menu-fissi',
        classes: 'rounded-md bg-gray-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600'
      }
    ]
  },
  
  'menu-fissi.edit': {
    actions: [
      {
        type: 'link',
        text: 'Torna alla lista',
        href: '/ristorante-menu/menu-fissi',
        classes: 'rounded-md bg-gray-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600'
      }
    ]
  },
  
  'menu-fissi.view': {
    actions: [
      {
        type: 'link',
        text: 'Torna alla lista',
        href: '/ristorante-menu/menu-fissi',
        classes: 'rounded-md bg-gray-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600'
      },
      {
        type: 'link',
        text: 'Modifica',
        href: '/ristorante-menu/menu-fissi/modifica/:id',
        classes: 'rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
      }
    ]
  },
  
  'menu-fissi.editBulk': {
    actions: [
      {
        type: 'link',
        text: 'Torna alla lista',
        href: '/ristorante-menu/menu-fissi',
        classes: 'rounded-md bg-gray-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600'
      }
    ]
  },

  'vini.index': {
    actions: [
      {
        type: 'link',
        text: 'Nuovo Vino',
        href: '/ristorante-menu/vini/nuovo',
        classes: 'rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
      }
    ]
  },
  
  'vini.new': {
    actions: [
      {
        type: 'link',
        text: 'Torna alla lista',
        href: '/ristorante-menu/vini',
        classes: 'rounded-md bg-gray-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600'
      }
    ]
  },
  
  'vini.edit': {
    actions: [
      {
        type: 'link',
        text: 'Torna alla lista',
        href: '/ristorante-menu/vini',
        classes: 'rounded-md bg-gray-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600'
      }
    ]
  },
  
  'vini.view': {
    actions: [
      {
        type: 'link',
        text: 'Torna alla lista',
        href: '/ristorante-menu/vini',
        classes: 'rounded-md bg-gray-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600'
      },
      {
        type: 'link',
        text: 'Modifica',
        href: '/ristorante-menu/vini/modifica/:id',
        classes: 'rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
      }
    ]
  },
  
  'vini.editBulk': {
    actions: [
      {
        type: 'link',
        text: 'Torna alla lista',
        href: '/ristorante-menu/vini',
        classes: 'rounded-md bg-gray-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600'
      }
    ]
  },
  
  'birre.index': {
    actions: [
      {
        type: 'link',
        text: 'Nuova Birra',
        href: '/ristorante-menu/birre/nuovo',
        classes: 'rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
      }
    ]
  },
  
  'birre.new': {
    actions: [
      {
        type: 'link',
        text: 'Torna alla lista',
        href: '/ristorante-menu/birre',
        classes: 'rounded-md bg-gray-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600'
      }
    ]
  },
  
  'birre.edit': {
    actions: [
      {
        type: 'link',
        text: 'Torna alla lista',
        href: '/ristorante-menu/birre',
        classes: 'rounded-md bg-gray-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600'
      }
    ]
  },
  
  'birre.view': {
    actions: [
      {
        type: 'link',
        text: 'Torna alla lista',
        href: '/ristorante-menu/birre',
        classes: 'rounded-md bg-gray-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600'
      },
      {
        type: 'link',
        text: 'Modifica',
        href: '/ristorante-menu/birre/modifica/:id',
        classes: 'rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
      }
    ]
  },
  
  'birre.editBulk': {
    actions: [
      {
        type: 'link',
        text: 'Torna alla lista',
        href: '/ristorante-menu/birre',
        classes: 'rounded-md bg-gray-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600'
      }
    ]
  },
  
  'liquori.index': {
    actions: [
      {
        type: 'link',
        text: 'Nuovo Liquore',
        href: '/ristorante-menu/liquori/nuovo',
        classes: 'rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
      }
    ]
  },
  
  'liquori.new': {
    actions: [
      {
        type: 'link',
        text: 'Torna alla lista',
        href: '/ristorante-menu/liquori',
        classes: 'rounded-md bg-gray-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600'
      }
    ]
  },
  
  'liquori.edit': {
    actions: [
      {
        type: 'link',
        text: 'Torna alla lista',
        href: '/ristorante-menu/liquori',
        classes: 'rounded-md bg-gray-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600'
      }
    ]
  },
  
  'liquori.view': {
    actions: [
      {
        type: 'link',
        text: 'Torna alla lista',
        href: '/ristorante-menu/liquori',
        classes: 'rounded-md bg-gray-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600'
      },
      {
        type: 'link',
        text: 'Modifica',
        href: '/ristorante-menu/liquori/modifica/:id',
        classes: 'rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
      }
    ]
  },
  
  'liquori.editBulk': {
    actions: [
      {
        type: 'link',
        text: 'Torna alla lista',
        href: '/ristorante-menu/liquori',
        classes: 'rounded-md bg-gray-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600'
      }
    ]
  },
  
  'cocktails.index': {
    actions: [
      {
        type: 'link',
        text: 'Nuovo Cocktail',
        href: '/ristorante-menu/cocktails/nuovo',
        classes: 'rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
      }
    ]
  },
  
  'cocktails.new': {
    actions: [
      {
        type: 'link',
        text: 'Torna alla lista',
        href: '/ristorante-menu/cocktails',
        classes: 'rounded-md bg-gray-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600'
      }
    ]
  },
  
  'cocktails.edit': {
    actions: [
      {
        type: 'link',
        text: 'Torna alla lista',
        href: '/ristorante-menu/cocktails',
        classes: 'rounded-md bg-gray-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600'
      }
    ]
  },
  
  'cocktails.view': {
    actions: [
      {
        type: 'link',
        text: 'Torna alla lista',
        href: '/ristorante-menu/cocktails',
        classes: 'rounded-md bg-gray-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600'
      },
      {
        type: 'link',
        text: 'Modifica',
        href: '/ristorante-menu/cocktails/modifica/:id',
        classes: 'rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
      }
    ]
  },
  
  'cocktails.editBulk': {
    actions: [
      {
        type: 'link',
        text: 'Torna alla lista',
        href: '/ristorante-menu/cocktails',
        classes: 'rounded-md bg-gray-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600'
      }
    ]
  },
  
  'bevande.index': {
    actions: [
      {
        type: 'link',
        text: 'Nuova Bevanda',
        href: '/ristorante-menu/bevande/nuovo',
        classes: 'rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
      }
    ]
  },
  
  'bevande.new': {
    actions: [
      {
        type: 'link',
        text: 'Torna alla lista',
        href: '/ristorante-menu/bevande',
        classes: 'rounded-md bg-gray-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600'
      }
    ]
  },
  
  'bevande.edit': {
    actions: [
      {
        type: 'link',
        text: 'Torna alla lista',
        href: '/ristorante-menu/bevande',
        classes: 'rounded-md bg-gray-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600'
      }
    ]
  },
  
  'bevande.view': {
    actions: [
      {
        type: 'link',
        text: 'Torna alla lista',
        href: '/ristorante-menu/bevande',
        classes: 'rounded-md bg-gray-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600'
      },
      {
        type: 'link',
        text: 'Modifica',
        href: '/ristorante-menu/bevande/modifica/:id',
        classes: 'rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
      }
    ]
  },
  
  'bevande.editBulk': {
    actions: [
      {
        type: 'link',
        text: 'Torna alla lista',
        href: '/ristorante-menu/bevande',
        classes: 'rounded-md bg-gray-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600'
      }
    ]
  },
  
  'users.new': {
    actions: [
      {
        type: 'link',
        text: 'Torna alla lista',
        href: '/admin/utenti',
        classes: 'rounded-md bg-gray-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600'
      }
    ]
  },
  
  'users.edit': {
    actions: [
      {
        type: 'link',
        text: 'Torna alla lista',
        href: '/admin/utenti',
        classes: 'rounded-md bg-gray-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600'
      }
    ]
  },
  
  'users.editBulk': {
    actions: [
      {
        type: 'link',
        text: 'Torna alla lista',
        href: '/admin/utenti',
        classes: 'rounded-md bg-gray-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600'
      }
    ]
  },
  
  'users.view': {
    actions: [
      {
        type: 'link',
        text: 'Torna alla lista',
        href: '/admin/utenti',
        classes: 'rounded-md bg-gray-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600'
      },
      {
        type: 'link',
        text: 'Modifica',
        href: '/admin/utenti/modifica/:id',
        classes: 'rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
      }
    ]
  }
};

// Configurazioni dinamiche per sottosezioni e altri contesti
export const dynamicActionNavConfigs: Record<string, (context: any) => ActionNavConfig> = {
  // Configurazione per sottosezioni del ristorante menu
  'ristorante-menu.subsection': (context: any) => ({
    actions: [
      {
        type: 'link',
        text: 'Nuovo',
        href: `/ristorante-menu/impostazioni/${context.subSection}/nuovo`,
        classes: 'rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
      }
    ]
  }),
  
  // Configurazione per pagine di creazione di sottosezioni
  'ristorante-menu.subsection.new': (context: any) => ({
    actions: [
      {
        type: 'link',
        text: 'Torna alla lista',
        href: `/ristorante-menu/impostazioni/${context.subSection}`,
        classes: 'rounded-md bg-gray-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600'
      }
    ]
  }),
  
  // Configurazione per pagine di modifica di sottosezioni
  'ristorante-menu.subsection.edit': (context: any) => ({
    actions: [
      {
        type: 'link',
        text: 'Torna alla lista',
        href: `/ristorante-menu/impostazioni/${context.subSection}`,
        classes: 'rounded-md bg-gray-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600'
      }
    ]
  }),
  
  // Configurazione per pagine di visualizzazione di sottosezioni
  'ristorante-menu.subsection.view': (context: any) => ({
    actions: [
      {
        type: 'link',
        text: 'Torna alla lista',
        href: `/ristorante-menu/impostazioni/${context.subSection}`,
        classes: 'rounded-md bg-gray-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600'
      },
      {
        type: 'link',
        text: 'Modifica',
        href: `/ristorante-menu/impostazioni/${context.subSection}/modifica/${context.id}`,
        classes: 'rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
      }
    ]
  }),
  
  // Configurazione per pagine di modifica massiva di sottosezioni
  'ristorante-menu.subsection.editBulk': (context: any) => ({
    actions: [
      {
        type: 'link',
        text: 'Torna alla lista',
        href: `/ristorante-menu/impostazioni/${context.subSection}`,
        classes: 'rounded-md bg-gray-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-gray-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600'
      }
    ]
  })
};

export function getActionNavConfig(pageKey: string, context?: any): ActionNavConfig | null {
  // Prima prova con le configurazioni statiche
  const staticConfig = actionNavConfigs[pageKey];
  if (staticConfig) {
    return staticConfig;
  }
  
  // Se non trova configurazione statica, prova con quelle dinamiche
  const dynamicConfig = dynamicActionNavConfigs[pageKey];
  if (dynamicConfig && context) {
    return dynamicConfig(context);
  }
  
  return null;
}

// Helper per estrarre il nome della sottosezione dall'URL
export function getSubSectionFromUrl(url: string): string | null {
  const match = url.match(/\/impostazioni\/([^\/]+)/);
  return match ? match[1] : null;
} 