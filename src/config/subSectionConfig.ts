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
      { name: 'nome' },
      { name: 'descrizione' }
    ]
  },
  tableConfig: {
    tableId: 'allergeni-table',
    idField: 'id',
    labelField: 'nome',
    detailUrl: '/ristorante-menu/impostazioni/allergeni/dettagli/:id',
    editUrl: '/ristorante-menu/impostazioni/allergeni/modifica/:id',
    bulkEditUrl: '/ristorante-menu/impostazioni/allergeni/modifica-massa',
    actionButton: {
      text: 'Nuovo Allergene',
      href: '/ristorante-menu/impostazioni/allergeni/nuovo'
    },
    editMultipleButton: {
      text: 'Modifica'
    },
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
  }
};

// Configurazioni per categoria menu fisso
export const categoriaMenuFissoConfig: SubSectionConfig = {
  hasItems: false,
  items: [],
  emptyState: {
    iconName: 'document-text',
    icon: {
      viewBox: '0 0 24 24',
      path: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
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
      { name: 'nome' },
      { name: 'descrizione' },
      { name: 'inLista' }
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
    successMessage: 'Eliminate {count} categoria/e con successo',
    errorMessage: 'Errore durante l\'eliminazione',
    includeScripts: true
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
      { name: 'nome' },
      { name: 'descrizione' },
      { name: 'inLista' }
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
    successMessage: 'Eliminate {count} categoria/e con successo',
    errorMessage: 'Errore durante l\'eliminazione',
    includeScripts: true
  }
}; 