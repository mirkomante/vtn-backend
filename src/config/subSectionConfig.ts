// Configurazioni per le sottosezioni delle impostazioni del ristorante menu

export interface SubSectionConfig {
  hasItems: boolean;
  items: any[];
  emptyState: {
    iconName: string;
    icon: {
      viewBox: string;
      path: string;
    };
    title: string;
    description: string;
    buttonText: string;
    buttonHref: string;
    buttonIconName: string;
    buttonIcon: {
      viewBox: string;
      path: string;
    };
  };
  tableData: {
    tableHeads: Array<{
      label: string;
      mobile: boolean;
    }>;
    fields: Array<{
      name: string;
      type?: string;
    }>;
  };
  tableConfig: {
    tableId: string;
    idField: string;
    labelField: string;
    detailUrl: string;
    editUrl: string;
    bulkEditUrl?: string;
    actionButton: {
      text: string;
      href: string;
    };
    editMultipleButton?: {
      text: string;
    };
    deleteButton: {
      text: string;
      classes: string;
    };
    endpoint: string;
    method: string;
    confirmMessage: string;
    confirmMessageMultiple: string;
    successMessage: string;
    errorMessage: string;
    includeScripts: boolean;
  };
  // Configurazione per i titoli delle pagine interne
  pageTitles?: {
    view?: {
      titleField: string; // Campo da usare come titolo (es. 'nome')
      prefix?: string; // Prefisso opzionale (es. 'Dettagli')
      suffix?: string; // Suffisso opzionale
    };
    edit?: {
      titleField: string; // Campo da usare come titolo (es. 'nome')
      prefix?: string; // Prefisso opzionale (es. 'Modifica')
      suffix?: string; // Suffisso opzionale
    };
  };
}

// Configurazioni per allergeni
export const allergeniConfig: SubSectionConfig = {
  hasItems: false, // Sarà impostato dinamicamente dalla route
  items: [], // Sarà impostato dinamicamente dalla route
  emptyState: {
    iconName: 'exclamation-triangle',
    icon: {
      viewBox: '0 0 24 24',
      path: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
    },
    title: 'Nessun allergene',
    description: 'Inizia creando il tuo primo allergene.',
    buttonText: 'Nuovo Allergene',
    buttonHref: '/ristorante-menu/impostazioni/allergeni/nuovo',
    buttonIconName: 'plus',
    buttonIcon: {
      viewBox: '0 0 20 20',
      path: 'M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z'
    }
  },
  tableData: {
    tableHeads: [
      { label: 'Nome', mobile: true },
      { label: 'Descrizione', mobile: false }
    ],
    fields: [
      { name: 'nome', type: 'text' },
      { name: 'descrizione', type: 'text' }
    ]
  },
  tableConfig: {
    tableId: 'allergeni-table',
    idField: 'id',
    labelField: 'nome',
    detailUrl: '/ristorante-menu/impostazioni/allergeni/dettagli/:id',
    editUrl: '/ristorante-menu/impostazioni/allergeni/modifica/:id',
    bulkEditUrl: undefined,
    actionButton: {
      text: 'Nuovo Allergene',
      href: '/ristorante-menu/impostazioni/allergeni/nuovo'
    },
    editMultipleButton: undefined,
    deleteButton: {
      text: 'Elimina',
      classes: 'bg-red-600 text-white ring-red-600 hover:bg-red-700 disabled:hover:bg-red-600'
    },
    endpoint: '/ristorante-menu/impostazioni/allergeni',
    method: 'DELETE',
    confirmMessage: 'Sei sicuro di voler eliminare questo allergene?',
    confirmMessageMultiple: 'Sei sicuro di voler eliminare {count} allergeni?',
    successMessage: 'Eliminati {count} allergene/i con successo',
    errorMessage: 'Errore durante l\'eliminazione',
    includeScripts: true
  },
  // Configurazione per i titoli delle pagine interne
  pageTitles: {
    view: {
      titleField: 'nome',
      prefix: 'Dettagli'
    },
    edit: {
      titleField: 'nome',
      prefix: 'Modifica'
    }
  }
};

// Configurazioni per tipologie cocktail
export const tipologieCocktailConfig: SubSectionConfig = {
  hasItems: false,
  items: [],
  emptyState: {
    iconName: 'cocktail',
    icon: {
      viewBox: '0 0 24 24',
      path: 'M12 2C13.1 2 14 2.9 14 4V20C14 21.1 13.1 22 12 22C10.9 22 10 21.1 10 20V4C10 2.9 10.9 2 12 2M7 4C5.9 4 5 4.9 5 6V18C5 19.1 5.9 20 7 20H17C18.1 20 19 19.1 19 18V6C19 4.9 18.1 4 17 4H7M7 6H17V18H7V6M8 8V10H16V8H8M8 12V14H16V12H8Z'
    },
    title: 'Nessuna tipologia cocktail',
    description: 'Inizia creando la tua prima tipologia cocktail.',
    buttonText: 'Nuova Tipologia Cocktail',
    buttonHref: '/ristorante-menu/impostazioni/tipologie-cocktail/nuovo',
    buttonIconName: 'plus',
    buttonIcon: {
      viewBox: '0 0 20 20',
      path: 'M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z'
    }
  },
  tableData: {
    tableHeads: [
      { label: 'Nome', mobile: true },
      { label: 'Descrizione', mobile: false }
    ],
    fields: [
      { name: 'nome', type: 'text' },
      { name: 'descrizione', type: 'text' }
    ]
  },
  tableConfig: {
    tableId: 'tipologie-cocktail-table',
    idField: 'id',
    labelField: 'nome',
    detailUrl: '/ristorante-menu/impostazioni/tipologie-cocktail/dettagli/:id',
    editUrl: '/ristorante-menu/impostazioni/tipologie-cocktail/modifica/:id',
    // bulkEditUrl: undefined, // Non necessario per questa configurazione
    actionButton: {
      text: 'Nuova Tipologia Cocktail',
      href: '/ristorante-menu/impostazioni/tipologie-cocktail/nuovo'
    },
    // editMultipleButton: undefined, // Non necessario per questa configurazione
    deleteButton: {
      text: 'Elimina',
      classes: 'bg-red-600 text-white ring-red-600 hover:bg-red-700 disabled:hover:bg-red-600'
    },
    endpoint: '/ristorante-menu/impostazioni/tipologie-cocktail',
    method: 'DELETE',
    confirmMessage: 'Sei sicuro di voler eliminare questa tipologia cocktail?',
    confirmMessageMultiple: 'Sei sicuro di voler eliminare {count} tipologie cocktail?',
    successMessage: 'Eliminate {count} tipologia{count === 1 ? "" : "e"} cocktail con successo',
    errorMessage: 'Errore durante l\'eliminazione',
    includeScripts: true
  },
  pageTitles: {
    view: {
      titleField: 'nome',
      prefix: 'Dettagli'
    },
    edit: {
      titleField: 'nome',
      prefix: 'Modifica'
    }
  }
};

// Configurazioni per tipologie bevanda
export const tipologieBevandaConfig: SubSectionConfig = {
  hasItems: false,
  items: [],
  emptyState: {
    iconName: 'drink',
    icon: {
      viewBox: '0 0 24 24',
      path: 'M12 2C13.1 2 14 2.9 14 4V20C14 21.1 13.1 22 12 22C10.9 22 10 21.1 10 20V4C10 2.9 10.9 2 12 2M7 4C5.9 4 5 4.9 5 6V18C5 19.1 5.9 20 7 20H17C18.1 20 19 19.1 19 18V6C19 4.9 18.1 4 17 4H7M7 6H17V18H7V6M8 8V10H16V8H8M8 12V14H16V12H8M8 16V18H16V16H8Z'
    },
    title: 'Nessuna tipologia bevanda',
    description: 'Inizia creando la tua prima tipologia bevanda.',
    buttonText: 'Nuova Tipologia Bevanda',
    buttonHref: '/ristorante-menu/impostazioni/tipologie-bevanda/nuovo',
    buttonIconName: 'plus',
    buttonIcon: {
      viewBox: '0 0 20 20',
      path: 'M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z'
    }
  },
  tableData: {
    tableHeads: [
      { label: 'Nome', mobile: true },
      { label: 'Descrizione', mobile: false }
    ],
    fields: [
      { name: 'nome', type: 'text' },
      { name: 'descrizione', type: 'text' }
    ]
  },
  tableConfig: {
    tableId: 'tipologie-bevanda-table',
    idField: 'id',
    labelField: 'nome',
    detailUrl: '/ristorante-menu/impostazioni/tipologie-bevanda/dettagli/:id',
    editUrl: '/ristorante-menu/impostazioni/tipologie-bevanda/modifica/:id',
    // bulkEditUrl: undefined, // Non necessario per questa configurazione
    actionButton: {
      text: 'Nuova Tipologia Bevanda',
      href: '/ristorante-menu/impostazioni/tipologie-bevanda/nuovo'
    },
    // editMultipleButton: undefined, // Non necessario per questa configurazione
    deleteButton: {
      text: 'Elimina',
      classes: 'bg-red-600 text-white ring-red-600 hover:bg-red-700 disabled:hover:bg-red-600'
    },
    endpoint: '/ristorante-menu/impostazioni/tipologie-bevanda',
    method: 'DELETE',
    confirmMessage: 'Sei sicuro di voler eliminare questa tipologia bevanda?',
    confirmMessageMultiple: 'Sei sicuro di voler eliminare {count} tipologie bevanda?',
    successMessage: 'Eliminate {count} tipologia{count === 1 ? "" : "e"} bevanda con successo',
    errorMessage: 'Errore durante l\'eliminazione',
    includeScripts: true
  },
  pageTitles: {
    view: {
      titleField: 'nome',
      prefix: 'Dettagli'
    },
    edit: {
      titleField: 'nome',
      prefix: 'Modifica'
    }
  }
};

// Configurazioni per tipologie liquore
export const tipologieLiquoreConfig: SubSectionConfig = {
  hasItems: false,
  items: [],
  emptyState: {
    iconName: 'liquor',
    icon: {
      viewBox: '0 0 24 24',
      path: 'M12 2C13.1 2 14 2.9 14 4V20C14 21.1 13.1 22 12 22C10.9 22 10 21.1 10 20V4C10 2.9 10.9 2 12 2M7 4C5.9 4 5 4.9 5 6V18C5 19.1 5.9 20 7 20H17C18.1 20 19 19.1 19 18V6C19 4.9 18.1 4 17 4H7M7 6H17V18H7V6Z'
    },
    title: 'Nessuna tipologia liquore',
    description: 'Inizia creando la tua prima tipologia liquore.',
    buttonText: 'Nuova Tipologia Liquore',
    buttonHref: '/ristorante-menu/impostazioni/tipologie-liquore/nuovo',
    buttonIconName: 'plus',
    buttonIcon: {
      viewBox: '0 0 20 20',
      path: 'M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z'
    }
  },
  tableData: {
    tableHeads: [
      { label: 'Nome', mobile: true },
      { label: 'Descrizione', mobile: false }
    ],
    fields: [
      { name: 'nome', type: 'text' },
      { name: 'descrizione', type: 'text' }
    ]
  },
  tableConfig: {
    tableId: 'tipologie-liquore-table',
    idField: 'id',
    labelField: 'nome',
    detailUrl: '/ristorante-menu/impostazioni/tipologie-liquore/dettagli/:id',
    editUrl: '/ristorante-menu/impostazioni/tipologie-liquore/modifica/:id',
    // bulkEditUrl: undefined, // Non necessario per questa configurazione
    actionButton: {
      text: 'Nuova Tipologia Liquore',
      href: '/ristorante-menu/impostazioni/tipologie-liquore/nuovo'
    },
    // editMultipleButton: undefined, // Non necessario per questa configurazione
    deleteButton: {
      text: 'Elimina',
      classes: 'bg-red-600 text-white ring-red-600 hover:bg-red-700 disabled:hover:bg-red-600'
    },
    endpoint: '/ristorante-menu/impostazioni/tipologie-liquore',
    method: 'DELETE',
    confirmMessage: 'Sei sicuro di voler eliminare questa tipologia liquore?',
    confirmMessageMultiple: 'Sei sicuro di voler eliminare {count} tipologie liquore?',
    successMessage: 'Eliminate {count} tipologia{count === 1 ? "" : "e"} liquore con successo',
    errorMessage: 'Errore durante l\'eliminazione',
    includeScripts: true
  },
  pageTitles: {
    view: {
      titleField: 'nome',
      prefix: 'Dettagli'
    },
    edit: {
      titleField: 'nome',
      prefix: 'Modifica'
    }
  }
};



// Configurazioni per tipologie birra
export const tipologieBirraConfig: SubSectionConfig = {
  hasItems: false,
  items: [],
  emptyState: {
    iconName: 'beer',
    icon: {
      viewBox: '0 0 24 24',
      path: 'M7 2C5.9 2 5 2.9 5 4V20C5 21.1 5.9 22 7 22H17C18.1 22 19 21.1 19 20V4C19 2.9 18.1 2 17 2H7M7 4H17V20H7V4M8 6V8H16V6H8M8 10V12H16V10H8M8 14V16H16V14H8Z'
    },
    title: 'Nessuna tipologia birra',
    description: 'Inizia creando la tua prima tipologia birra.',
    buttonText: 'Nuova Tipologia Birra',
    buttonHref: '/ristorante-menu/impostazioni/tipologie-birra/nuovo',
    buttonIconName: 'plus',
    buttonIcon: {
      viewBox: '0 0 20 20',
      path: 'M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z'
    }
  },
  tableData: {
    tableHeads: [
      { label: 'Nome', mobile: true },
      { label: 'Descrizione', mobile: false }
    ],
    fields: [
      { name: 'nome', type: 'text' },
      { name: 'descrizione', type: 'text' }
    ]
  },
  tableConfig: {
    tableId: 'tipologie-birra-table',
    idField: 'id',
    labelField: 'nome',
    detailUrl: '/ristorante-menu/impostazioni/tipologie-birra/dettagli/:id',
    editUrl: '/ristorante-menu/impostazioni/tipologie-birra/modifica/:id',
    // bulkEditUrl: undefined, // Non necessario per questa configurazione
    actionButton: {
      text: 'Nuova Tipologia Birra',
      href: '/ristorante-menu/impostazioni/tipologie-birra/nuovo'
    },
    // editMultipleButton: undefined, // Non necessario per questa configurazione
    deleteButton: {
      text: 'Elimina',
      classes: 'bg-red-600 text-white ring-red-600 hover:bg-red-700 disabled:hover:bg-red-600'
    },
    endpoint: '/ristorante-menu/impostazioni/tipologie-birra',
    method: 'DELETE',
    confirmMessage: 'Sei sicuro di voler eliminare questa tipologia birra?',
    confirmMessageMultiple: 'Sei sicuro di voler eliminare {count} tipologie birra?',
    successMessage: 'Eliminate {count} tipologia{count === 1 ? "" : "e"} birra con successo',
    errorMessage: 'Errore durante l\'eliminazione',
    includeScripts: true
  },
  pageTitles: {
    view: {
      titleField: 'nome',
      prefix: 'Dettagli'
    },
    edit: {
      titleField: 'nome',
      prefix: 'Modifica'
    }
  }
};






// Configurazioni per tipologie vino
export const tipologieVinoConfig: SubSectionConfig = {
  hasItems: false,
  items: [],
  emptyState: {
    iconName: 'wine',
    icon: {
      viewBox: '0 0 24 24',
      path: 'M12 2C13.1 2 14 2.9 14 4C14 4.74 13.6 5.39 13 5.73V7H14C15.1 7 16 7.9 16 9V20C16 21.1 15.1 22 14 22H10C8.9 22 8 21.1 8 20V9C8 7.9 8.9 7 10 7H11V5.73C10.4 5.39 10 4.74 10 4C10 2.9 10.9 2 12 2M10 9V20H14V9H10Z'
    },
    title: 'Nessuna tipologia vino',
    description: 'Inizia creando la tua prima tipologia vino.',
    buttonText: 'Nuova Tipologia Vino',
    buttonHref: '/ristorante-menu/impostazioni/tipologie-vino/nuovo',
    buttonIconName: 'plus',
    buttonIcon: {
      viewBox: '0 0 20 20',
      path: 'M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z'
    }
  },
  tableData: {
    tableHeads: [
      { label: 'Nome', mobile: true },
      { label: 'Descrizione', mobile: false }
    ],
    fields: [
      { name: 'nome', type: 'text' },
      { name: 'descrizione', type: 'text' }
    ]
  },
  tableConfig: {
    tableId: 'tipologie-vino-table',
    idField: 'id',
    labelField: 'nome',
    detailUrl: '/ristorante-menu/impostazioni/tipologie-vino/dettagli/:id',
    editUrl: '/ristorante-menu/impostazioni/tipologie-vino/modifica/:id',
    // bulkEditUrl: undefined, // Non necessario per questa configurazione
    actionButton: {
      text: 'Nuova Tipologia Vino',
      href: '/ristorante-menu/impostazioni/tipologie-vino/nuovo'
    },
    // editMultipleButton: undefined, // Non necessario per questa configurazione
    deleteButton: {
      text: 'Elimina',
      classes: 'bg-red-600 text-white ring-red-600 hover:bg-red-700 disabled:hover:bg-red-600'
    },
    endpoint: '/ristorante-menu/impostazioni/tipologie-vino',
    method: 'DELETE',
    confirmMessage: 'Sei sicuro di voler eliminare questa tipologia vino?',
    confirmMessageMultiple: 'Sei sicuro di voler eliminare {count} tipologie vino?',
    successMessage: 'Eliminate {count} tipologia{count === 1 ? "" : "e"} vino con successo',
    errorMessage: 'Errore durante l\'eliminazione',
    includeScripts: true
  },
  pageTitles: {
    view: {
      titleField: 'nome',
      prefix: 'Dettagli'
    },
    edit: {
      titleField: 'nome',
      prefix: 'Modifica'
    }
  }
};












// Configurazioni per zone
export const zoneConfig: SubSectionConfig = {
  hasItems: false,
  items: [],
  emptyState: {
    iconName: 'map-pin',
    icon: {
      viewBox: '0 0 24 24',
      path: 'M15 10.5a3 3 0 11-6 0 3 3 0 016 0z M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z'
    },
    title: 'Nessuna zona',
    description: 'Inizia creando la tua prima zona.',
    buttonText: 'Nuova Zona',
    buttonHref: '/ristorante-menu/impostazioni/zone/nuovo',
    buttonIconName: 'plus',
    buttonIcon: {
      viewBox: '0 0 20 20',
      path: 'M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z'
    }
  },
  tableData: {
    tableHeads: [
      { label: 'Nome', mobile: true },
      { label: 'Regione', mobile: true },
      { label: 'Nazione', mobile: true }
    ],
    fields: [
      { name: 'nome', type: 'text' },
      { name: 'regione_nome', type: 'text' },
      { name: 'nazione_nome', type: 'text' }
    ]
  },
  tableConfig: {
    tableId: 'zone-table',
    idField: 'id',
    labelField: 'nome',
    detailUrl: '/ristorante-menu/impostazioni/zone/dettagli/:id',
    editUrl: '/ristorante-menu/impostazioni/zone/modifica/:id',
    // bulkEditUrl: undefined, // Non necessario per questa configurazione
    actionButton: {
      text: 'Nuova Zona',
      href: '/ristorante-menu/impostazioni/zone/nuovo'
    },
    // editMultipleButton: undefined, // Non necessario per questa configurazione
    deleteButton: {
      text: 'Elimina',
      classes: 'bg-red-600 text-white ring-red-600 hover:bg-red-700 disabled:hover:bg-red-600'
    },
    endpoint: '/ristorante-menu/impostazioni/zone',
    method: 'DELETE',
    confirmMessage: 'Sei sicuro di voler eliminare questa zona?',
    confirmMessageMultiple: 'Sei sicuro di voler eliminare {count} zone?',
    successMessage: 'Eliminate {count} zona{count === 1 ? "" : "e"} con successo',
    errorMessage: 'Errore durante l\'eliminazione',
    includeScripts: true
  },
  pageTitles: {
    view: {
      titleField: 'nome',
      prefix: 'Dettagli'
    },
    edit: {
      titleField: 'nome',
      prefix: 'Modifica'
    }
  }
};
























// Configurazioni per categoria menu fisso
export const categoriaMenuFissoConfig: SubSectionConfig = {
  hasItems: false,
  items: [],
  emptyState: {
    iconName: 'rectangle-stack',
    icon: {
      viewBox: '0 0 24 24',
      path: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
    },
    title: 'Nessuna categoria',
    description: 'Inizia creando la tua prima categoria per i menu fissi.',
    buttonText: 'Nuova Categoria',
    buttonHref: '/ristorante-menu/impostazioni/categoria-menu-fisso/nuovo',
    buttonIconName: 'plus',
    buttonIcon: {
      viewBox: '0 0 20 20',
      path: 'M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z'
    }
  },
  tableData: {
    tableHeads: [
      { label: 'Nome', mobile: true },
      { label: 'Descrizione', mobile: false },
      { label: 'Stato', mobile: true }
    ],
    fields: [
      { name: 'nome', type: 'text' },
      { name: 'descrizione', type: 'text' },
      { name: 'inLista', type: 'boolean' }
    ]
  },
  tableConfig: {
    tableId: 'categorie-menu-fisso-table',
    idField: 'id',
    labelField: 'nome',
    detailUrl: '/ristorante-menu/impostazioni/categoria-menu-fisso/dettagli/:id',
    editUrl: '/ristorante-menu/impostazioni/categoria-menu-fisso/modifica/:id',
    bulkEditUrl: '/ristorante-menu/impostazioni/categoria-menu-fisso/modifica-massa',
    actionButton: {
      text: 'Nuova Categoria',
      href: '/ristorante-menu/impostazioni/categoria-menu-fisso/nuovo'
    },
    editMultipleButton: {
      text: 'Modifica'
    },
    deleteButton: {
      text: 'Elimina',
      classes: 'bg-red-600 text-white ring-red-600 hover:bg-red-700 disabled:hover:bg-red-600'
    },
    endpoint: '/ristorante-menu/impostazioni/categoria-menu-fisso',
    method: 'DELETE',
    confirmMessage: 'Sei sicuro di voler eliminare questa categoria?',
    confirmMessageMultiple: 'Sei sicuro di voler eliminare {count} categorie?',
    successMessage: 'Eliminate {count} categoria{count === 1 ? "" : "e"} con successo',
    errorMessage: 'Errore durante l\'eliminazione',
    includeScripts: true
  },
  // Configurazione per i titoli delle pagine interne
  pageTitles: {
    view: {
      titleField: 'nome',
      prefix: 'Dettagli'
    },
    edit: {
      titleField: 'nome',
      prefix: 'Modifica'
    }
  }
};
















































// Configurazioni per categoria piatti
export const categoriaPiattiConfig: SubSectionConfig = {
  hasItems: false,
  items: [],
  emptyState: {
    iconName: 'rectangle-stack',
    icon: {
      viewBox: '0 0 24 24',
      path: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
    },
    title: 'Nessuna categoria',
    description: 'Inizia creando la tua prima categoria per i piatti.',
    buttonText: 'Nuova Categoria',
    buttonHref: '/ristorante-menu/impostazioni/categoria-piatti/nuovo',
    buttonIconName: 'plus',
    buttonIcon: {
      viewBox: '0 0 20 20',
      path: 'M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z'
    }
  },
  tableData: {
    tableHeads: [
      { label: 'Nome', mobile: true },
      { label: 'Descrizione', mobile: false },
      { label: 'Stato', mobile: true }
    ],
    fields: [
      { name: 'nome', type: 'text' },
      { name: 'descrizione', type: 'text' },
      { name: 'inLista', type: 'boolean' }
    ]
  },
  tableConfig: {
    tableId: 'categorie-piatti-table',
    idField: 'id',
    labelField: 'nome',
    detailUrl: '/ristorante-menu/impostazioni/categoria-piatti/dettagli/:id',
    editUrl: '/ristorante-menu/impostazioni/categoria-piatti/modifica/:id',
    bulkEditUrl: '/ristorante-menu/impostazioni/categoria-piatti/modifica-massa',
    actionButton: {
      text: 'Nuova Categoria',
      href: '/ristorante-menu/impostazioni/categoria-piatti/nuovo'
    },
    editMultipleButton: {
      text: 'Modifica'
    },
    deleteButton: {
      text: 'Elimina',
      classes: 'bg-red-600 text-white ring-red-600 hover:bg-red-700 disabled:hover:bg-red-600'
    },
    endpoint: '/ristorante-menu/impostazioni/categoria-piatti',
    method: 'DELETE',
    confirmMessage: 'Sei sicuro di voler eliminare questa categoria?',
    confirmMessageMultiple: 'Sei sicuro di voler eliminare {count} categorie?',
    successMessage: 'Eliminate {count} categoria{count === 1 ? "" : "e"} con successo',
    errorMessage: 'Errore durante l\'eliminazione',
    includeScripts: true
  },
  // Configurazione per i titoli delle pagine interne
  pageTitles: {
    view: {
      titleField: 'nome',
      prefix: 'Dettagli'
    },
    edit: {
      titleField: 'nome',
      prefix: 'Modifica'
    }
  }
};
















































// Configurazioni per nazioni
export const nazioniConfig: SubSectionConfig = {
  hasItems: false,
  items: [],
  emptyState: {
    iconName: 'globe-alt',
    icon: {
      viewBox: '0 0 24 24',
      path: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'
    },
    title: 'Nessuna nazione',
    description: 'Inizia creando la tua prima nazione.',
    buttonText: 'Nuova Nazione',
    buttonHref: '/ristorante-menu/impostazioni/nazioni/nuovo',
    buttonIconName: 'plus',
    buttonIcon: {
      viewBox: '0 0 20 20',
      path: 'M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z'
    }
  },
  tableData: {
    tableHeads: [
      { label: 'Nome', mobile: true },
      { label: 'Sigla', mobile: true },
      { label: 'Regioni', mobile: false }
    ],
    fields: [
      { name: 'nome', type: 'text' },
      { name: 'sigla', type: 'text' },
      { name: 'regioni', type: 'count' }
    ]
  },
  tableConfig: {
    tableId: 'nazioni-table',
    idField: 'id',
    labelField: 'nome',
    detailUrl: '/ristorante-menu/impostazioni/nazioni/dettagli/:id',
    editUrl: '/ristorante-menu/impostazioni/nazioni/modifica/:id',
    bulkEditUrl: undefined, // Le nazioni non hanno modifica massiva per ora
    actionButton: {
      text: 'Nuova Nazione',
      href: '/ristorante-menu/impostazioni/nazioni/nuovo'
    },
    editMultipleButton: undefined,
    deleteButton: {
      text: 'Elimina',
      classes: 'bg-red-600 text-white ring-red-600 hover:bg-red-700 disabled:hover:bg-red-600'
    },
    endpoint: '/ristorante-menu/impostazioni/nazioni',
    method: 'DELETE',
    confirmMessage: 'Sei sicuro di voler eliminare questa nazione?',
    confirmMessageMultiple: 'Sei sicuro di voler eliminare {count} nazioni?',
    successMessage: 'Eliminate {count} nazione{count === 1 ? "" : "i"} con successo',
    errorMessage: 'Errore durante l\'eliminazione',
    includeScripts: true
  },
  // Configurazione per i titoli delle pagine interne
  pageTitles: {
    view: {
      titleField: 'nome',
      prefix: 'Dettagli'
    },
    edit: {
      titleField: 'nome',
      prefix: 'Modifica'
    }
  }
};
















































// Funzione helper per generare i titoli delle pagine interne
export function generatePageTitle(
  config: SubSectionConfig, 
  pageType: 'view' | 'edit', 
  item: any
): string {
  const pageTitleConfig = config.pageTitles?.[pageType];
  
  if (!pageTitleConfig || !item) {
    return '';
  }
  
  const { titleField, prefix, suffix } = pageTitleConfig;
  const fieldValue = item[titleField] || '';
  
  let title = '';
  if (prefix) {
    title += prefix + ' ';
  }
  title += fieldValue;
  if (suffix) {
    title += ' ' + suffix;
  }
  
  return title;
}

// Configurazioni per regioni
export const regioniConfig: SubSectionConfig = {
  hasItems: false,
  items: [],
  emptyState: {
    iconName: 'map',
    icon: {
      viewBox: '0 0 24 24',
      path: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7'
    },
    title: 'Nessuna regione',
    description: 'Inizia creando la tua prima regione.',
    buttonText: 'Nuova Regione',
    buttonHref: '/ristorante-menu/impostazioni/regioni/nuovo',
    buttonIconName: 'plus',
    buttonIcon: {
      viewBox: '0 0 20 20',
      path: 'M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z'
    }
  },
  tableData: {
    tableHeads: [
      { label: 'Nome', mobile: true },
      { label: 'Nazione', mobile: true }
    ],
    fields: [
      { name: 'nome', type: 'text' },
      { name: 'nazione_nome', type: 'text' }
    ]
  },
  tableConfig: {
    tableId: 'regioni-table',
    idField: 'id',
    labelField: 'nome',
    detailUrl: '/ristorante-menu/impostazioni/regioni/dettagli/:id',
    editUrl: '/ristorante-menu/impostazioni/regioni/modifica/:id',
    // bulkEditUrl: undefined, // Non necessario per questa configurazione
    actionButton: {
      text: 'Nuova Regione',
      href: '/ristorante-menu/impostazioni/regioni/nuovo'
    },
    // editMultipleButton: undefined, // Non necessario per questa configurazione
    deleteButton: {
      text: 'Elimina',
      classes: 'bg-red-600 text-white ring-red-600 hover:bg-red-700 disabled:hover:bg-red-600'
    },
    endpoint: '/ristorante-menu/impostazioni/regioni',
    method: 'DELETE',
    confirmMessage: 'Sei sicuro di voler eliminare questa regione?',
    confirmMessageMultiple: 'Sei sicuro di voler eliminare {count} regioni?',
    successMessage: 'Eliminate {count} regione{count === 1 ? "" : "i"} con successo',
    errorMessage: 'Errore durante l\'eliminazione',
    includeScripts: true
  },
  pageTitles: {
    view: {
      titleField: 'nome',
      prefix: 'Dettagli'
    },
    edit: {
      titleField: 'nome',
      prefix: 'Modifica'
    }
  }
};















































