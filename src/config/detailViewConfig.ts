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

// Mappa delle configurazioni per facile accesso
export const detailViewConfigs = {
  'servizi': serviziDetailViewConfig,
  'allergeni': allergeniDetailViewConfig,
  'categoria-menu-fisso': categoriaMenuFissoDetailViewConfig,
  'categoria-piatti': categoriaPiattiDetailViewConfig,
  'utenti': utentiDetailViewConfig
};

// Funzione helper per ottenere la configurazione
export function getDetailViewConfig(entityType: string): DetailViewConfig | null {
  return detailViewConfigs[entityType] || null;
}
