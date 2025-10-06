// Configurazioni centralizzate per le viste in dettaglio

import { DetailViewConfig } from './detailViewSchema';

// Configurazione per i Servizi
export const serviziDetailViewConfig: DetailViewConfig = {
  fields: [
    {
      name: 'nome',
      label: 'Nome',
      type: 'text',
      required: true
    },
    {
      name: 'descrizione',
      label: 'Descrizione',
      type: 'text',
      conditional: 'descrizione' // mostra solo se descrizione esiste
    },
    {
      name: 'prezzo',
      label: 'Prezzo',
      type: 'currency',
      required: true,
      format: {
        currency: {
          symbol: '€',
          decimals: 2
        }
      }
    },
    {
      name: 'inLista',
      label: 'Stato',
      type: 'boolean',
      format: {
        boolean: {
          trueText: 'Attivo',
          falseText: 'Inattivo',
          showBadge: true
        }
      }
    }
  ],
  layout: 'default',
  showTimestamps: true,
  timestampFields: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
};

// Configurazione per gli Allergeni
export const allergeniDetailViewConfig: DetailViewConfig = {
  fields: [
    {
      name: 'nome',
      label: 'Nome',
      type: 'text',
      required: true
    },
    {
      name: 'descrizione',
      label: 'Descrizione',
      type: 'text',
      conditional: 'descrizione'
    }
  ],
  layout: 'default',
  showTimestamps: true,
  timestampFields: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
};

// Configurazione per le Categorie Menu Fisso
export const categoriaMenuFissoDetailViewConfig: DetailViewConfig = {
  fields: [
    {
      name: 'nome',
      label: 'Nome',
      type: 'text',
      required: true
    },
    {
      name: 'descrizione',
      label: 'Descrizione',
      type: 'text',
      conditional: 'descrizione'
    },
    {
      name: 'inLista',
      label: 'Stato',
      type: 'boolean',
      format: {
        boolean: {
          trueText: 'Attivo',
          falseText: 'Inattivo',
          showBadge: true
        }
      }
    }
  ],
  layout: 'default',
  showTimestamps: true,
  timestampFields: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
};

// Configurazione per le Categorie Piatti
export const categoriaPiattiDetailViewConfig: DetailViewConfig = {
  fields: [
    {
      name: 'nome',
      label: 'Nome',
      type: 'text',
      required: true
    },
    {
      name: 'descrizione',
      label: 'Descrizione',
      type: 'text',
      conditional: 'descrizione'
    },
    {
      name: 'inLista',
      label: 'Stato',
      type: 'boolean',
      format: {
        boolean: {
          trueText: 'Attivo',
          falseText: 'Inattivo',
          showBadge: true
        }
      }
    }
  ],
  layout: 'default',
  showTimestamps: true,
  timestampFields: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
};

// Configurazione per le Nazioni
export const nazioniDetailViewConfig: DetailViewConfig = {
  fields: [
    {
      name: 'nome',
      label: 'Nome',
      type: 'text',
      required: true
    },
    {
      name: 'sigla',
      label: 'Sigla',
      type: 'text',
      required: true
    },
    {
      name: 'regioni',
      label: 'Regioni',
      type: 'text'
    }
  ],
  layout: 'default',
  showTimestamps: true,
  timestampFields: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
};

export const regioniDetailViewConfig: DetailViewConfig = {
  fields: [
    {
      name: 'nome',
      label: 'Nome',
      type: 'text',
      required: true
    },
    {
      name: 'nazione_nome',
      label: 'Nazione',
      type: 'text',
      required: true
    }
  ],
  layout: 'default',
  showTimestamps: true,
  timestampFields: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
};

export const zoneDetailViewConfig: DetailViewConfig = {
  fields: [
    {
      name: 'nome',
      label: 'Nome',
      type: 'text',
      required: true
    },
    {
      name: 'regione_nome',
      label: 'Regione',
      type: 'text',
      required: true
    },
    {
      name: 'nazione_nome',
      label: 'Nazione',
      type: 'text',
      required: true
    }
  ],
  layout: 'default',
  showTimestamps: true,
  timestampFields: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
};

export const tipologieVinoDetailViewConfig: DetailViewConfig = {
  fields: [
    {
      name: 'nome',
      label: 'Nome',
      type: 'text',
      required: true
    },
    {
      name: 'descrizione',
      label: 'Descrizione',
      type: 'text',
      required: false
    }
  ],
  layout: 'default',
  showTimestamps: true,
  timestampFields: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
};

export const tipologieBirraDetailViewConfig: DetailViewConfig = {
  fields: [
    {
      name: 'nome',
      label: 'Nome',
      type: 'text',
      required: true
    },
    {
      name: 'descrizione',
      label: 'Descrizione',
      type: 'text',
      required: false
    }
  ],
  layout: 'default',
  showTimestamps: true,
  timestampFields: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
};

export const tipologieLiquoreDetailViewConfig: DetailViewConfig = {
  fields: [
    {
      name: 'nome',
      label: 'Nome',
      type: 'text',
      required: true
    },
    {
      name: 'descrizione',
      label: 'Descrizione',
      type: 'text',
      required: false
    }
  ],
  layout: 'default',
  showTimestamps: true,
  timestampFields: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
};

export const tipologieCocktailDetailViewConfig: DetailViewConfig = {
  fields: [
    {
      name: 'nome',
      label: 'Nome',
      type: 'text',
      required: true
    },
    {
      name: 'descrizione',
      label: 'Descrizione',
      type: 'text',
      required: false
    }
  ],
  layout: 'default',
  showTimestamps: true,
  timestampFields: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
};

export const tipologieBevandaDetailViewConfig: DetailViewConfig = {
  fields: [
    {
      name: 'nome',
      label: 'Nome',
      type: 'text',
      required: true
    },
    {
      name: 'descrizione',
      label: 'Descrizione',
      type: 'text',
      required: false
    }
  ],
  layout: 'default',
  showTimestamps: true,
  timestampFields: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
};

// Configurazione per gli Utenti
export const utentiDetailViewConfig: DetailViewConfig = {
  fields: [
    {
      name: 'givenName',
      label: 'Nome completo',
      type: 'custom',
      customRender: 'userFullName'
    },
    {
      name: 'role',
      label: 'Ruolo',
      type: 'text'
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email'
    },
    {
      name: 'authProvider',
      label: 'Provider di autenticazione',
      type: 'text'
    }
  ],
  layout: 'default',
  showTimestamps: true,
  timestampFields: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
};

// Configurazione per i Piatti
export const piattiDetailViewConfig: DetailViewConfig = {
  fields: [
    {
      name: 'nome',
      label: 'Nome',
      type: 'text',
      required: true
    },
    {
      name: 'descrizione',
      label: 'Descrizione',
      type: 'text',
      conditional: 'descrizione'
    },
    {
      name: 'categoria_nome',
      label: 'Categoria',
      type: 'text',
      required: true
    },
    {
      name: 'prezzo',
      label: 'Prezzo',
      type: 'currency',
      required: true,
      format: {
        currency: {
          symbol: '€',
          decimals: 2
        }
      }
    },
    {
      name: 'allergeni_list',
      label: 'Allergeni',
      type: 'custom',
      customRender: 'allergeniList'
    },
    {
      name: 'inLista',
      label: 'Stato',
      type: 'boolean',
      format: {
        boolean: {
          trueText: 'Attivo',
          falseText: 'Inattivo',
          showBadge: true
        }
      }
    }
  ],
  layout: 'default',
  showTimestamps: true,
  timestampFields: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
};

// Mappa delle configurazioni per facile accesso
export const menuFissiDetailViewConfig: DetailViewConfig = {
  fields: [
    {
      name: 'nome',
      label: 'Nome',
      type: 'text',
      required: true
    },
    {
      name: 'descrizione',
      label: 'Descrizione',
      type: 'text',
      conditional: 'descrizione'
    },
    {
      name: 'categoria_nome',
      label: 'Categoria',
      type: 'text',
      required: true
    },
    {
      name: 'prezzo',
      label: 'Prezzo',
      type: 'currency',
      required: true,
      format: {
        currency: {
          symbol: '€',
          decimals: 2
        }
      }
    },
    {
      name: 'piatti_list',
      label: 'Piatti',
      type: 'custom',
      customRender: 'piattiList'
    },
    {
      name: 'servizi_list',
      label: 'Servizi Accessori',
      type: 'custom',
      customRender: 'serviziList'
    },
    {
      name: 'inLista',
      label: 'Stato',
      type: 'boolean',
      format: {
        boolean: {
          trueText: 'Attivo',
          falseText: 'Inattivo',
          showBadge: true
        }
      }
    }
  ],
  layout: 'default',
  showTimestamps: true,
  timestampFields: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
};

export const viniDetailViewConfig: DetailViewConfig = {
  fields: [
    {
      name: 'nome',
      label: 'Nome',
      type: 'text',
      required: true
    },
    {
      name: 'descrizione',
      label: 'Descrizione',
      type: 'text',
      conditional: 'descrizione'
    },
    {
      name: 'cantina',
      label: 'Cantina',
      type: 'text',
      conditional: 'cantina'
    },
    {
      name: 'grado',
      label: 'Grado Alcolico',
      type: 'text',
      conditional: 'grado'
    },
    {
      name: 'certificazione',
      label: 'Certificazione',
      type: 'text',
      conditional: 'certificazione'
    },
    {
      name: 'capacita',
      label: 'Capacità',
      type: 'text',
      conditional: 'capacita'
    },
    {
      name: 'tipologia_nome',
      label: 'Tipologia',
      type: 'text',
      required: true
    },
    {
      name: 'nazione_nome',
      label: 'Nazione',
      type: 'text',
      required: true
    },
    {
      name: 'regione_nome',
      label: 'Regione',
      type: 'text',
      conditional: 'regione_nome'
    },
    {
      name: 'zona_nome',
      label: 'Zona',
      type: 'text',
      conditional: 'zona_nome'
    },
    {
      name: 'prezzo',
      label: 'Prezzo Bottiglia',
      type: 'currency',
      required: true,
      format: {
        currency: {
          symbol: '€',
          decimals: 2
        }
      }
    },
    {
      name: 'prezzoCalice',
      label: 'Prezzo Calice',
      type: 'currency',
      conditional: 'prezzoCalice',
      format: {
        currency: {
          symbol: '€',
          decimals: 2
        }
      }
    },
    {
      name: 'inLista',
      label: 'Stato',
      type: 'boolean',
      format: {
        boolean: {
          trueText: 'Attivo',
          falseText: 'Inattivo',
          showBadge: true
        }
      }
    }
  ],
  layout: 'default',
  showTimestamps: true,
  timestampFields: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
};

export const birreDetailViewConfig: DetailViewConfig = {
  fields: [
    {
      name: 'nome',
      label: 'Nome',
      type: 'text',
      required: true
    },
    {
      name: 'descrizione',
      label: 'Descrizione',
      type: 'text',
      conditional: 'descrizione'
    },
    {
      name: 'grado',
      label: 'Grado Alcolico',
      type: 'text',
      conditional: 'grado'
    },
    {
      name: 'capacita',
      label: 'Capacità',
      type: 'text',
      conditional: 'capacita'
    },
    {
      name: 'tipologia_nome',
      label: 'Tipologia',
      type: 'text',
      required: true
    },
    {
      name: 'nazione_nome',
      label: 'Nazione',
      type: 'text',
      required: true
    },
    {
      name: 'prezzo',
      label: 'Prezzo',
      type: 'currency',
      required: true,
      format: {
        currency: {
          symbol: '€',
          decimals: 2
        }
      }
    },
    {
      name: 'inLista',
      label: 'Stato',
      type: 'boolean',
      format: {
        boolean: {
          trueText: 'Attivo',
          falseText: 'Inattivo',
          showBadge: true
        }
      }
    }
  ],
  layout: 'default',
  showTimestamps: true,
  timestampFields: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  }
};

export const detailViewConfigs = {
  'servizi': serviziDetailViewConfig,
  'piatti': piattiDetailViewConfig,
  'menu-fissi': menuFissiDetailViewConfig,
  'vini': viniDetailViewConfig,
  'birre': birreDetailViewConfig,
  'allergeni': allergeniDetailViewConfig,
  'categoria-menu-fisso': categoriaMenuFissoDetailViewConfig,
  'categoria-piatti': categoriaPiattiDetailViewConfig,
  'nazioni': nazioniDetailViewConfig,
  'regioni': regioniDetailViewConfig,
  'zone': zoneDetailViewConfig,
  'tipologie-vino': tipologieVinoDetailViewConfig,
  'tipologie-birra': tipologieBirraDetailViewConfig,
  'tipologie-liquore': tipologieLiquoreDetailViewConfig,
  'tipologie-cocktail': tipologieCocktailDetailViewConfig,
  'tipologie-bevanda': tipologieBevandaDetailViewConfig,
  'utenti': utentiDetailViewConfig
};

// Funzione helper per ottenere la configurazione
export function getDetailViewConfig(entityType: string): DetailViewConfig | null {
  return (detailViewConfigs as any)[entityType] || null;
}
