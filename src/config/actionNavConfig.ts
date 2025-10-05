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