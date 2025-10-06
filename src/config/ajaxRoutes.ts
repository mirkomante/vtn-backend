// Configurazione per le route AJAX
export interface AjaxRouteConfig {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  successMessage: string;
  errorMessage: string;
  redirectUrl?: string;
  requireAtLeastOneField?: boolean;
  allowPartialUpdates?: boolean;
}

export const ajaxRoutes: { [key: string]: AjaxRouteConfig } = {
  // Route per utenti
  'user-new': {
    endpoint: '/admin/utenti/nuovo',
    method: 'POST',
    successMessage: 'Utente creato con successo',
    errorMessage: 'Errore durante la creazione dell\'utente',
    redirectUrl: '/admin/utenti'
  },
  'user-edit': {
    endpoint: '/admin/utenti/modifica',
    method: 'POST',
    successMessage: 'Utente aggiornato con successo',
    errorMessage: 'Errore durante l\'aggiornamento dell\'utente'
  },
  'user-bulk-edit': {
    endpoint: '/admin/utenti/modifica-massa',
    method: 'POST',
    successMessage: 'Aggiornati {count} utenti con successo',
    errorMessage: 'Errore durante l\'aggiornamento degli utenti',
    redirectUrl: '/admin/utenti',
    requireAtLeastOneField: true,
    allowPartialUpdates: true
  },

  // Route per allergeni
  'allergene-new': {
    endpoint: '/ristorante-menu/impostazioni/allergeni/nuovo',
    method: 'POST',
    successMessage: 'Allergene creato con successo',
    errorMessage: 'Errore durante la creazione dell\'allergene',
    redirectUrl: '/ristorante-menu/impostazioni/allergeni'
  },
  'allergene-edit': {
    endpoint: '/ristorante-menu/impostazioni/allergeni/modifica',
    method: 'POST',
    successMessage: 'Allergene aggiornato con successo',
    errorMessage: 'Errore durante l\'aggiornamento dell\'allergene'
  },


  // Route per categorie menu fisso
  'categoria-menu-fisso-new': {
    endpoint: '/ristorante-menu/impostazioni/categoria-menu-fisso/nuovo',
    method: 'POST',
    successMessage: 'Categoria creata con successo',
    errorMessage: 'Errore durante la creazione della categoria',
    redirectUrl: '/ristorante-menu/impostazioni/categoria-menu-fisso'
  },
  'categoria-menu-fisso-edit': {
    endpoint: '/ristorante-menu/impostazioni/categoria-menu-fisso/modifica',
    method: 'POST',
    successMessage: 'Categoria aggiornata con successo',
    errorMessage: 'Errore durante l\'aggiornamento della categoria'
  },
  'categoria-menu-fisso-bulk-edit': {
    endpoint: '/ristorante-menu/impostazioni/categoria-menu-fisso/modifica-massa',
    method: 'POST',
    successMessage: 'Aggiornate {count} categorie con successo',
    errorMessage: 'Errore durante l\'aggiornamento delle categorie',
    redirectUrl: '/ristorante-menu/impostazioni/categoria-menu-fisso',
    requireAtLeastOneField: true,
    allowPartialUpdates: true
  },

  // Route per categorie piatti
  'categoria-piatti-new': {
    endpoint: '/ristorante-menu/impostazioni/categoria-piatti/nuovo',
    method: 'POST',
    successMessage: 'Categoria creata con successo',
    errorMessage: 'Errore durante la creazione della categoria',
    redirectUrl: '/ristorante-menu/impostazioni/categoria-piatti'
  },
  'categoria-piatti-edit': {
    endpoint: '/ristorante-menu/impostazioni/categoria-piatti/modifica',
    method: 'POST',
    successMessage: 'Categoria aggiornata con successo',
    errorMessage: 'Errore durante l\'aggiornamento della categoria'
  },
  'categoria-piatti-bulk-edit': {
    endpoint: '/ristorante-menu/impostazioni/categoria-piatti/modifica-massa',
    method: 'POST',
    successMessage: 'Aggiornate {count} categorie con successo',
    errorMessage: 'Errore durante l\'aggiornamento delle categorie',
    redirectUrl: '/ristorante-menu/impostazioni/categoria-piatti',
    requireAtLeastOneField: true,
    allowPartialUpdates: true
  },
  'servizio-new': {
    endpoint: '/ristorante-menu/servizi/nuovo/ajax',
    method: 'POST',
    successMessage: 'Servizio creato con successo',
    errorMessage: 'Errore durante la creazione del servizio',
    redirectUrl: '/ristorante-menu/servizi'
  },
  'servizio-edit': {
    endpoint: '/ristorante-menu/servizi/modifica',
    method: 'POST',
    successMessage: 'Servizio aggiornato con successo',
    errorMessage: 'Errore durante l\'aggiornamento del servizio'
  },
  'servizio-bulk-edit': {
    endpoint: '/ristorante-menu/servizi/modifica-massa',
    method: 'POST',
    successMessage: 'Aggiornati {count} servizi con successo',
    errorMessage: 'Errore durante l\'aggiornamento dei servizi',
    redirectUrl: '/ristorante-menu/servizi',
    requireAtLeastOneField: true,
    allowPartialUpdates: true
  },

  'nazione-new': {
    method: 'POST',
    endpoint: '/ristorante-menu/impostazioni/nazioni/nuovo/ajax',
    successMessage: 'Nazione creata con successo',
    errorMessage: 'Errore durante la creazione della nazione',
    redirectUrl: '/ristorante-menu/impostazioni/nazioni',
    allowPartialUpdates: false
  },

  'nazione-edit': {
    method: 'POST',
    endpoint: '/ristorante-menu/impostazioni/nazioni/modifica/:id/ajax',
    successMessage: 'Nazione aggiornata con successo',
    errorMessage: 'Errore durante l\'aggiornamento della nazione',
    redirectUrl: '/ristorante-menu/impostazioni/nazioni',
    allowPartialUpdates: false
  },
  'regione-new': {
    method: 'POST',
    endpoint: '/ristorante-menu/impostazioni/regioni/nuovo/ajax',
    successMessage: 'Regione creata con successo',
    errorMessage: 'Errore durante la creazione della regione',
    redirectUrl: '/ristorante-menu/impostazioni/regioni',
    allowPartialUpdates: false
  },
  'regione-edit': {
    method: 'POST',
    endpoint: '/ristorante-menu/impostazioni/regioni/modifica/:id/ajax',
    successMessage: 'Regione aggiornata con successo',
    errorMessage: 'Errore durante l\'aggiornamento della regione',
    redirectUrl: '/ristorante-menu/impostazioni/regioni',
    allowPartialUpdates: false
  },
  'zona-new': {
    method: 'POST',
    endpoint: '/ristorante-menu/impostazioni/zone/nuovo/ajax',
    successMessage: 'Zona creata con successo',
    errorMessage: 'Errore durante la creazione della zona',
    redirectUrl: '/ristorante-menu/impostazioni/zone',
    allowPartialUpdates: false
  },
  'zona-edit': {
    method: 'POST',
    endpoint: '/ristorante-menu/impostazioni/zone/modifica/:id/ajax',
    successMessage: 'Zona aggiornata con successo',
    errorMessage: 'Errore durante l\'aggiornamento della zona',
    redirectUrl: '/ristorante-menu/impostazioni/zone',
    allowPartialUpdates: false
  },
  'tipologia-vino-new': {
    method: 'POST',
    endpoint: '/ristorante-menu/impostazioni/tipologie-vino/nuovo/ajax',
    successMessage: 'Tipologia vino creata con successo',
    errorMessage: 'Errore durante la creazione della tipologia vino',
    redirectUrl: '/ristorante-menu/impostazioni/tipologie-vino',
    allowPartialUpdates: false
  },
  'tipologia-vino-edit': {
    method: 'POST',
    endpoint: '/ristorante-menu/impostazioni/tipologie-vino/modifica/:id/ajax',
    successMessage: 'Tipologia vino aggiornata con successo',
    errorMessage: 'Errore durante l\'aggiornamento della tipologia vino',
    redirectUrl: '/ristorante-menu/impostazioni/tipologie-vino',
    allowPartialUpdates: false
  },
  'tipologia-birra-new': {
    method: 'POST',
    endpoint: '/ristorante-menu/impostazioni/tipologie-birra/nuovo/ajax',
    successMessage: 'Tipologia birra creata con successo',
    errorMessage: 'Errore durante la creazione della tipologia birra',
    redirectUrl: '/ristorante-menu/impostazioni/tipologie-birra',
    allowPartialUpdates: false
  },
  'tipologia-birra-edit': {
    method: 'POST',
    endpoint: '/ristorante-menu/impostazioni/tipologie-birra/modifica/:id/ajax',
    successMessage: 'Tipologia birra aggiornata con successo',
    errorMessage: 'Errore durante l\'aggiornamento della tipologia birra',
    redirectUrl: '/ristorante-menu/impostazioni/tipologie-birra',
    allowPartialUpdates: false
  },
  'tipologia-liquore-new': {
    method: 'POST',
    endpoint: '/ristorante-menu/impostazioni/tipologie-liquore/nuovo/ajax',
    successMessage: 'Tipologia liquore creata con successo',
    errorMessage: 'Errore durante la creazione della tipologia liquore',
    redirectUrl: '/ristorante-menu/impostazioni/tipologie-liquore',
    allowPartialUpdates: false
  },
  'tipologia-liquore-edit': {
    method: 'POST',
    endpoint: '/ristorante-menu/impostazioni/tipologie-liquore/modifica/:id/ajax',
    successMessage: 'Tipologia liquore aggiornata con successo',
    errorMessage: 'Errore durante l\'aggiornamento della tipologia liquore',
    redirectUrl: '/ristorante-menu/impostazioni/tipologie-liquore',
    allowPartialUpdates: false
  },
  'tipologia-cocktail-new': {
    method: 'POST',
    endpoint: '/ristorante-menu/impostazioni/tipologie-cocktail/nuovo/ajax',
    successMessage: 'Tipologia cocktail creata con successo',
    errorMessage: 'Errore durante la creazione della tipologia cocktail',
    redirectUrl: '/ristorante-menu/impostazioni/tipologie-cocktail',
    allowPartialUpdates: false
  },
  'tipologia-cocktail-edit': {
    method: 'POST',
    endpoint: '/ristorante-menu/impostazioni/tipologie-cocktail/modifica/:id/ajax',
    successMessage: 'Tipologia cocktail aggiornata con successo',
    errorMessage: 'Errore durante l\'aggiornamento della tipologia cocktail',
    redirectUrl: '/ristorante-menu/impostazioni/tipologie-cocktail',
    allowPartialUpdates: false
  },
  'tipologia-bevanda-new': {
    method: 'POST',
    endpoint: '/ristorante-menu/impostazioni/tipologie-bevanda/nuovo/ajax',
    successMessage: 'Tipologia bevanda creata con successo',
    errorMessage: 'Errore durante la creazione della tipologia bevanda',
    redirectUrl: '/ristorante-menu/impostazioni/tipologie-bevanda',
    allowPartialUpdates: false
  },
  'tipologia-bevanda-edit': {
    method: 'POST',
    endpoint: '/ristorante-menu/impostazioni/tipologie-bevanda/modifica/:id/ajax',
    successMessage: 'Tipologia bevanda aggiornata con successo',
    errorMessage: 'Errore durante l\'aggiornamento della tipologia bevanda',
    redirectUrl: '/ristorante-menu/impostazioni/tipologie-bevanda',
    allowPartialUpdates: false
  }
};

// Funzione per determinare la configurazione AJAX in base al path
export function getAjaxConfig(path: string, action: string): AjaxRouteConfig | null {
  const pathSegments = path.split('/').filter(Boolean);
  
  // Determina il tipo di entità e azione
  let entityType = '';
  let actionType = '';
  
  if (pathSegments.includes('admin') && pathSegments.includes('utenti')) {
    entityType = 'user';
  } else if (pathSegments.includes('allergeni')) {
    entityType = 'allergene';
  } else if (pathSegments.includes('categoria-menu-fisso')) {
    entityType = 'categoria-menu-fisso';
  } else if (pathSegments.includes('categoria-piatti')) {
    entityType = 'categoria-piatti';
  } else if (pathSegments.includes('nazioni')) {
    entityType = 'nazione';
  } else if (pathSegments.includes('regioni')) {
    entityType = 'regione';
  } else if (pathSegments.includes('zone')) {
    entityType = 'zona';
  } else if (pathSegments.includes('tipologie-vino')) {
    entityType = 'tipologia-vino';
  } else if (pathSegments.includes('tipologie-birra')) {
    entityType = 'tipologia-birra';
  } else if (pathSegments.includes('tipologie-liquore')) {
    entityType = 'tipologia-liquore';
  } else if (pathSegments.includes('tipologie-cocktail')) {
    entityType = 'tipologia-cocktail';
  } else if (pathSegments.includes('tipologie-bevanda')) {
    entityType = 'tipologia-bevanda';
  } else if (pathSegments.includes('servizi')) {
    entityType = 'servizio';
  }
  
  if (action.includes('/nuovo')) {
    actionType = 'new';
  } else if (action.includes('/modifica/') && !action.includes('/modifica-massa')) {
    actionType = 'edit';
  } else if (action.includes('/modifica-massa')) {
    actionType = 'bulk-edit';
  }
  
  const configKey = `${entityType}-${actionType}`;
  return ajaxRoutes[configKey] || null;
}

// Funzione per ottenere messaggio di successo con placeholder sostituiti
export function getSuccessMessage(config: AjaxRouteConfig, data?: any): string {
  let message = config.successMessage;
  
  if (data && data.count) {
    message = message.replace('{count}', data.count.toString());
  }
  
  return message;
}
