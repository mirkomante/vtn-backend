import { FormDataSchema, FormField } from "./sectionFormSchema";

// Configurazione form per allergeni
export const allergeneFormData: FormDataSchema = {
  formConfig: {
    method: 'POST',
    action: '/ristorante-menu/impostazioni/allergeni/nuovo/ajax', // Route AJAX
    id: 'allergeneForm',
    novalidate: true
  },
  fields: [
    {
      type: 'text',
      name: 'nome',
      id: 'nome',
      label: 'Nome Allergene',
      required: true,
      placeholder: 'Glutine',
      errorMessage: 'Il nome dell\'allergene è obbligatorio',
      bulkEditable: false // Il nome non è modificabile in massa
    },
    {
      type: 'textarea',
      name: 'descrizione',
      id: 'descrizione',
      label: 'Descrizione',
      required: false,
      placeholder: 'Descrizione dell\'allergene (opzionale)',
      errorMessage: 'La descrizione non può superare i 500 caratteri',
      bulkEditable: false // Gli allergeni non hanno campi modificabili in massa
    }
  ],
  buttons: {
    submit: {
      text: 'Salva',
      classes: 'rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed'
    },
    cancel: {
      text: 'Annulla',
      href: '/ristorante-menu/impostazioni/allergeni',
      classes: 'text-sm font-semibold leading-6 text-gray-900'
    }
  },
  getFormData: (data: any, isEdit: boolean = false, item?: any, _formData?: any) => {
    return {
      formConfig: {
        ...data.formConfig,
        action: isEdit 
          ? `/ristorante-menu/impostazioni/allergeni/modifica/${item?.id}/ajax` // Route AJAX
          : '/ristorante-menu/impostazioni/allergeni/nuovo/ajax' // Route AJAX
      },
      fields: data.fields.map((field: FormField) => {
        let value = '';
        
        if (_formData && _formData[field.name]) {
          value = _formData[field.name];
        } else if (isEdit && item) {
          value = item[field.name] || '';
        }
        
        return { ...field, value };
      }),
      buttons: {
        ...data.buttons,
        submit: {
          ...data.buttons.submit,
          text: isEdit ? 'Modifica' : 'Salva'
        },
        cancel: {
          ...data.buttons.cancel,
          href: isEdit 
            ? `/ristorante-menu/impostazioni/allergeni/dettagli/${item?.id}` 
            : '/ristorante-menu/impostazioni/allergeni'
        }
      }
    };
  }
};

// Configurazione form per categorie menu fisso
export const categoriaMenuFissoFormData: FormDataSchema = {
  formConfig: {
    method: 'POST',
    action: '/ristorante-menu/impostazioni/categoria-menu-fisso/nuovo/ajax', // Route AJAX
    id: 'categoriaMenuFissoForm',
    novalidate: true
  },
  fields: [
    {
      type: 'text',
      name: 'nome',
      id: 'nome',
      label: 'Nome Categoria',
      required: true,
      placeholder: 'Antipasti',
      errorMessage: 'Il nome della categoria è obbligatorio',
      bulkEditable: false // Il nome non è modificabile in massa
    },
    {
      type: 'textarea',
      name: 'descrizione',
      id: 'descrizione',
      label: 'Descrizione',
      required: false,
      placeholder: 'Descrizione della categoria (opzionale)',
      errorMessage: 'La descrizione non può superare i 500 caratteri',
      bulkEditable: false // La descrizione non è modificabile in massa
    },
    {
      type: 'toggle',
      name: 'inLista',
      id: 'inLista',
      label: 'Visibile nel menu',
      required: false,
      description: 'Mostra questa categoria nella lista del menu',
      value: true,
      defaultValue: true,
      bulkEditable: true,
      bulkLabel: 'Visibile nel menu',
      bulkDescription: 'Imposta lo stato "In Lista" per tutte le categorie selezionate',
      bulkHelpText: 'Seleziona per mostrare le categorie nella lista del menu'
    }
  ],
  buttons: {
    submit: {
      text: 'Salva',
      classes: 'rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed'
    },
    cancel: {
      text: 'Annulla',
      href: '/ristorante-menu/impostazioni/categoria-menu-fisso',
      classes: 'text-sm font-semibold leading-6 text-gray-900'
    }
  },
  getFormData: (data: any, isEdit: boolean = false, item?: any, _formData?: any, isBulkEdit: boolean = false, selectedItems?: any[]) => {
    return {
      formConfig: {
        ...data.formConfig,
        action: isBulkEdit 
          ? data.bulkEditConfig.action 
          : isEdit 
            ? `/ristorante-menu/impostazioni/categoria-menu-fisso/modifica/${item?.id}/ajax` // Route AJAX
            : '/ristorante-menu/impostazioni/categoria-menu-fisso/nuovo/ajax', // Route AJAX
        method: isBulkEdit ? data.bulkEditConfig.method : data.formConfig.method,
        hiddenFields: isBulkEdit && selectedItems ? [
          {
            name: 'itemIds',
            value: selectedItems.map(item => item.id)
          }
        ] : undefined
      },
      fields: data.fields.map((field: FormField) => {
        let value = '';
        
        // Determina il valore del campo
        if (_formData && _formData[field.name]) {
          value = _formData[field.name];
        } else if (isEdit && item && !isBulkEdit) {
          value = item[field.name] || '';
        } else if (!isEdit && !isBulkEdit && field.type === 'toggle' && field.defaultValue !== undefined) {
          // Per i nuovi elementi, usa il defaultValue se disponibile
          value = field.defaultValue.toString();
        }
        
        // Per la modifica massiva, mostra solo i campi modificabili
        if (isBulkEdit && !field.bulkEditable) {
          return null;
        }
        
        // Per la modifica massiva, usa configurazione specifica
        if (isBulkEdit && field.bulkEditable) {
          return {
            ...field,
            label: field.bulkLabel || field.label,
            placeholder: field.bulkPlaceholder || field.placeholder,
            required: field.bulkRequired || false,
            value: ''
          };
        }
        
        return { ...field, value };
      }).filter((field: FormField | null) => field !== null),
      buttons: {
        ...data.buttons,
        submit: {
          ...data.buttons.submit,
          text: isBulkEdit 
            ? `Aggiorna ${selectedItems?.length || 0} categorie` 
            : isEdit 
              ? 'Aggiorna' 
              : 'Salva'
        },
        cancel: {
          ...data.buttons.cancel,
          href: isBulkEdit 
            ? '/ristorante-menu/impostazioni/categoria-menu-fisso' 
            : isEdit 
              ? `/ristorante-menu/impostazioni/categoria-menu-fisso/dettagli/${item?.id}` 
              : '/ristorante-menu/impostazioni/categoria-menu-fisso'
        }
      }
    };
  },
  bulkEditConfig: {
    title: 'Modifica Massiva Categorie Menu Fisso',
    description: 'Modifica lo stato delle categorie selezionate',
    action: '/ristorante-menu/impostazioni/categoria-menu-fisso/modifica-massa',
    method: 'POST',
    endpoint: '/ristorante-menu/impostazioni/categoria-menu-fisso/modifica-massa',
    successMessage: 'Aggiornate {count} categorie con successo',
    errorMessage: 'Errore durante l\'aggiornamento delle categorie',
    requireAtLeastOneField: true,
    allowPartialUpdates: true
  }
};

// Configurazione form per categorie piatti
export const categoriaPiattiFormData: FormDataSchema = {
  formConfig: {
    method: 'POST',
    action: '/ristorante-menu/impostazioni/categoria-piatti/nuovo/ajax', // Route AJAX
    id: 'categoriaPiattiForm',
    novalidate: true
  },
  fields: [
    {
      type: 'text',
      name: 'nome',
      id: 'nome',
      label: 'Nome Categoria',
      required: true,
      placeholder: 'Primi Piatti',
      errorMessage: 'Il nome della categoria è obbligatorio',
      bulkEditable: false // Il nome non è modificabile in massa
    },
    {
      type: 'textarea',
      name: 'descrizione',
      id: 'descrizione',
      label: 'Descrizione',
      required: false,
      placeholder: 'Descrizione della categoria (opzionale)',
      errorMessage: 'La descrizione non può superare i 500 caratteri',
      bulkEditable: false // La descrizione non è modificabile in massa
    },
    {
      type: 'toggle',
      name: 'inLista',
      id: 'inLista',
      label: 'Visibile nel menu',
      required: false,
      description: 'Mostra questa categoria nella lista del menu',
      value: true,
      defaultValue: true,
      bulkEditable: true,
      bulkLabel: 'Visibile nel menu',
      bulkDescription: 'Imposta lo stato "In Lista" per tutte le categorie selezionate',
      bulkHelpText: 'Seleziona per mostrare le categorie nella lista del menu'
    }
  ],
  buttons: {
    submit: {
      text: 'Salva',
      classes: 'rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed'
    },
    cancel: {
      text: 'Annulla',
      href: '/ristorante-menu/impostazioni/categoria-piatti',
      classes: 'text-sm font-semibold leading-6 text-gray-900'
    }
  },
  getFormData: (data: any, isEdit: boolean = false, item?: any, _formData?: any, isBulkEdit: boolean = false, selectedItems?: any[]) => {
    return {
      formConfig: {
        ...data.formConfig,
        action: isBulkEdit 
          ? data.bulkEditConfig.action 
          : isEdit 
            ? `/ristorante-menu/impostazioni/categoria-piatti/modifica/${item?.id}/ajax` // Route AJAX
            : '/ristorante-menu/impostazioni/categoria-piatti/nuovo/ajax', // Route AJAX
        method: isBulkEdit ? data.bulkEditConfig.method : data.formConfig.method,
        hiddenFields: isBulkEdit && selectedItems ? [
          {
            name: 'itemIds',
            value: selectedItems.map(item => item.id)
          }
        ] : undefined
      },
      fields: data.fields.map((field: FormField) => {
        let value = '';
        
        // Determina il valore del campo
        if (_formData && _formData[field.name]) {
          value = _formData[field.name];
        } else if (isEdit && item && !isBulkEdit) {
          value = item[field.name] || '';
        } else if (!isEdit && !isBulkEdit && field.type === 'toggle' && field.defaultValue !== undefined) {
          // Per i nuovi elementi, usa il defaultValue se disponibile
          value = field.defaultValue.toString();
        }
        
        // Per la modifica massiva, mostra solo i campi modificabili
        if (isBulkEdit && !field.bulkEditable) {
          return null;
        }
        
        // Per la modifica massiva, usa configurazione specifica
        if (isBulkEdit && field.bulkEditable) {
          return {
            ...field,
            label: field.bulkLabel || field.label,
            placeholder: field.bulkPlaceholder || field.placeholder,
            required: field.bulkRequired || false,
            value: ''
          };
        }
        
        return { ...field, value };
      }).filter((field: FormField | null) => field !== null),
      buttons: {
        ...data.buttons,
        submit: {
          ...data.buttons.submit,
          text: isBulkEdit 
            ? `Aggiorna ${selectedItems?.length || 0} categorie` 
            : isEdit 
              ? 'Aggiorna' 
              : 'Salva'
        },
        cancel: {
          ...data.buttons.cancel,
          href: isBulkEdit 
            ? '/ristorante-menu/impostazioni/categoria-piatti' 
            : isEdit 
              ? `/ristorante-menu/impostazioni/categoria-piatti/dettagli/${item?.id}` 
              : '/ristorante-menu/impostazioni/categoria-piatti'
        }
      }
    };
  },
  bulkEditConfig: {
    title: 'Modifica Massiva Categorie Piatti',
    description: 'Modifica lo stato delle categorie selezionate',
    action: '/ristorante-menu/impostazioni/categoria-piatti/modifica-massa',
    method: 'POST',
    endpoint: '/ristorante-menu/impostazioni/categoria-piatti/modifica-massa',
    successMessage: 'Aggiornate {count} categorie con successo',
    errorMessage: 'Errore durante l\'aggiornamento delle categorie',
    requireAtLeastOneField: true,
    allowPartialUpdates: true
  }
};

// Configurazione form per nazioni
export const nazioneFormData: FormDataSchema = {
  formConfig: {
    method: 'POST',
    action: '/ristorante-menu/impostazioni/nazioni/nuovo/ajax', // Route AJAX
    id: 'nazioneForm',
    novalidate: true
  },
  fields: [
    {
      type: 'text',
      name: 'nome',
      id: 'nome',
      label: 'Nome Nazione',
      required: true,
      placeholder: 'Italia',
      errorMessage: 'Il nome della nazione è obbligatorio',
      bulkEditable: false // Il nome non è modificabile in massa
    },
    {
      type: 'text',
      name: 'sigla',
      id: 'sigla',
      label: 'Sigla',
      required: true,
      placeholder: 'IT',
      errorMessage: 'La sigla è obbligatoria e deve essere di 2 caratteri',
      bulkEditable: false, // La sigla non è modificabile in massa
      pattern: '^[A-Z]{2}$'
    }
  ],
  buttons: {
    submit: {
      text: 'Salva',
      classes: 'rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed'
    },
    cancel: {
      text: 'Annulla',
      href: '/ristorante-menu/impostazioni/nazioni',
      classes: 'text-sm font-semibold leading-6 text-gray-900'
    }
  },
  getFormData: (data: any, isEdit: boolean = false, item?: any, _formData?: any) => {
    return {
      formConfig: {
        ...data.formConfig,
        action: isEdit 
          ? `/ristorante-menu/impostazioni/nazioni/modifica/${item?.id}/ajax` // Route AJAX
          : '/ristorante-menu/impostazioni/nazioni/nuovo/ajax' // Route AJAX
      },
      fields: data.fields.map((field: FormField) => {
        let value = '';
        
        if (_formData && _formData[field.name]) {
          value = _formData[field.name];
        } else if (isEdit && item) {
          value = item[field.name] || '';
        }
        
        return { ...field, value };
      }),
      buttons: {
        ...data.buttons,
        submit: {
          ...data.buttons.submit,
          text: isEdit ? 'Modifica' : 'Salva'
        },
        cancel: {
          ...data.buttons.cancel,
          href: isEdit 
            ? `/ristorante-menu/impostazioni/nazioni/dettagli/${item?.id}` 
            : '/ristorante-menu/impostazioni/nazioni'
        }
      }
    };
  }
};

// Configurazione form per servizi
export const servizioFormData: FormDataSchema = {
  formConfig: {
    method: 'POST',
    action: '/ristorante-menu/servizi/nuovo/ajax', // Route AJAX
    id: 'servizioForm',
    novalidate: true
  },
  fields: [
    {
      type: 'text',
      name: 'nome',
      id: 'nome',
      label: 'Nome Servizio',
      required: true,
      placeholder: 'Servizio di esempio',
      errorMessage: 'Il nome del servizio è obbligatorio',
      bulkEditable: false
    },
    {
      type: 'textarea',
      name: 'descrizione',
      id: 'descrizione',
      label: 'Descrizione',
      required: false,
      placeholder: 'Descrizione del servizio (opzionale)',
      errorMessage: 'La descrizione non può superare i 500 caratteri',
      bulkEditable: false
    },
    {
      type: 'number',
      name: 'prezzo',
      id: 'prezzo',
      label: 'Prezzo (€)',
      required: true,
      placeholder: '0.00',
      step: 0.01,
      min: 0,
      errorMessage: 'Il prezzo deve essere un numero valido maggiore o uguale a 0',
      bulkEditable: true,
      bulkLabel: 'Imposta prezzo per tutti i servizi selezionati',
      bulkPlaceholder: 'Inserisci il nuovo prezzo (opzionale)',
      bulkHelpText: 'Questo prezzo verrà applicato a tutti i servizi selezionati. Lascia vuoto per non modificare.',
      bulkRequired: false
    },
    {
      type: 'toggle',
      name: 'inLista',
      id: 'inLista',
      label: 'Visibile nel menu',
      required: false,
      description: 'Mostra questo servizio nella lista del menu',
      value: true,
      defaultValue: true,
      errorMessage: '',
      bulkEditable: true,
      bulkLabel: 'Visibile nel menu',
      bulkHelpText: 'Questa impostazione verrà applicata a tutti i servizi selezionati.',
      bulkRequired: false
    }
  ],
  buttons: {
    submit: {
      text: 'Salva',
      classes: 'rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed'
    },
    cancel: {
      text: 'Annulla',
      href: '/ristorante-menu/servizi',
      classes: 'text-sm font-semibold leading-6 text-gray-900'
    }
  },
  getFormData: (data: any, isEdit: boolean = false, item?: any, _formData?: any, isBulkEdit: boolean = false, selectedItems?: any[]) => {
    return {
      formConfig: {
        ...data.formConfig,
        action: isBulkEdit 
          ? data.bulkEditConfig.action 
          : isEdit 
            ? `/ristorante-menu/servizi/modifica/${item?.id}/ajax` // Route AJAX
            : '/ristorante-menu/servizi/nuovo/ajax', // Route AJAX
        method: isBulkEdit ? data.bulkEditConfig.method : data.formConfig.method,
        hiddenFields: isBulkEdit && selectedItems ? [
          {
            name: 'itemIds',
            value: selectedItems.map(item => item.id)
          }
        ] : undefined
      },
      fields: data.fields.map((field: FormField) => {
        let value = '';
        
        // Determina il valore del campo
        if (_formData && _formData[field.name]) {
          value = _formData[field.name];
        } else if (isEdit && item && !isBulkEdit) {
          value = item[field.name] || '';
        } else if (!isEdit && !isBulkEdit && field.type === 'toggle' && field.defaultValue !== undefined) {
          // Per i nuovi elementi, usa il defaultValue se disponibile
          value = field.defaultValue.toString();
        }
        
        // Per la modifica massiva, mostra solo i campi modificabili
        if (isBulkEdit && !field.bulkEditable) {
          return null;
        }
        
        // Per la modifica massiva, usa configurazione specifica
        if (isBulkEdit && field.bulkEditable) {
          return {
            ...field,
            label: field.bulkLabel || field.label,
            placeholder: field.bulkPlaceholder || field.placeholder,
            required: field.bulkRequired || false,
            value: ''
          };
        }
        
        return { ...field, value };
      }).filter((field: FormField | null) => field !== null),
      buttons: {
        ...data.buttons,
        submit: {
          ...data.buttons.submit,
          text: isBulkEdit ? 'Aggiorna' : (isEdit ? 'Modifica' : 'Salva')
        },
        cancel: {
          ...data.buttons.cancel,
          href: isBulkEdit 
            ? '/ristorante-menu/servizi'
            : isEdit 
              ? `/ristorante-menu/servizi/dettagli/${item?.id}` 
              : '/ristorante-menu/servizi'
        }
      }
    };
  },
  bulkEditConfig: {
    title: 'Modifica Massiva Servizi',
    description: 'Modifica i servizi selezionati',
    action: '/ristorante-menu/servizi/modifica-massa/ajax',
    method: 'POST',
    endpoint: '/ristorante-menu/servizi/modifica-massa',
    successMessage: 'Servizi aggiornati con successo',
    errorMessage: 'Errore durante l\'aggiornamento dei servizi',
    requireAtLeastOneField: true,
    allowPartialUpdates: true
  }
};

// Configurazione form per regioni
export const regioneFormData: FormDataSchema = {
  formConfig: {
    method: 'POST',
    action: '/ristorante-menu/impostazioni/regioni/nuovo/ajax', // Route AJAX
    id: 'regioneForm',
    novalidate: true
  },
  fields: [
    {
      type: 'text',
      name: 'nome',
      id: 'nome',
      label: 'Nome Regione',
      required: true,
      placeholder: 'Lombardia',
      errorMessage: 'Il nome della regione è obbligatorio',
      bulkEditable: false // Le regioni non hanno modifica massiva
    },
    {
      type: 'select',
      name: 'nazioneId',
      id: 'nazioneId',
      label: 'Nazione',
      required: true,
      placeholder: 'Seleziona una nazione',
      errorMessage: 'La nazione è obbligatoria',
      bulkEditable: false, // Le regioni non hanno modifica massiva
      options: [], // Sarà popolato dinamicamente
    }
  ],
  buttons: {
    submit: {
      text: 'Salva',
      classes: 'rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed'
    },
    cancel: {
      text: 'Annulla',
      href: '/ristorante-menu/impostazioni/regioni',
      classes: 'text-sm font-semibold leading-6 text-gray-900'
    }
  },
  getFormData: (data: any, isEdit: boolean = false, item?: any, _formData?: any) => {
    return {
      formConfig: {
        ...data.formConfig,
        action: isEdit
          ? `/ristorante-menu/impostazioni/regioni/modifica/${item?.id}/ajax` // Route AJAX
          : '/ristorante-menu/impostazioni/regioni/nuovo/ajax' // Route AJAX
      },
      fields: data.fields.map((field: FormField) => {
        let value = '';

        if (_formData && _formData[field.name]) {
          value = _formData[field.name];
        } else if (isEdit && item) {
          value = item[field.name] || '';
        }

        return { ...field, value };
      }),
      buttons: {
        ...data.buttons,
        submit: {
          ...data.buttons.submit,
          text: isEdit ? 'Modifica' : 'Salva'
        },
        cancel: {
          ...data.buttons.cancel,
          href: isEdit
            ? `/ristorante-menu/impostazioni/regioni/dettagli/${item?.id}`
            : '/ristorante-menu/impostazioni/regioni'
        }
      }
    };
  }
};

// Configurazione form per zone
export const zonaFormData: FormDataSchema = {
  formConfig: {
    method: 'POST',
    action: '/ristorante-menu/impostazioni/zone/nuovo/ajax', // Route AJAX
    id: 'zonaForm',
    novalidate: true
  },
  fields: [
    {
      type: 'text',
      name: 'nome',
      id: 'nome',
      label: 'Nome Zona',
      required: true,
      placeholder: 'Milano Centro',
      errorMessage: 'Il nome della zona è obbligatorio',
      bulkEditable: false // Le zone non hanno modifica massiva
    },
    {
      type: 'select',
      name: 'regioneId',
      id: 'regioneId',
      label: 'Regione',
      required: true,
      placeholder: 'Seleziona una regione',
      errorMessage: 'La regione è obbligatoria',
      bulkEditable: false, // Le zone non hanno modifica massiva
      options: [], // Sarà popolato dinamicamente
    },
    {
      type: 'select',
      name: 'nazioneId',
      id: 'nazioneId',
      label: 'Nazione',
      required: true,
      placeholder: 'Seleziona una nazione',
      errorMessage: 'La nazione è obbligatoria',
      bulkEditable: false, // Le zone non hanno modifica massiva
      options: [], // Sarà popolato dinamicamente
    }
  ],
  buttons: {
    submit: {
      text: 'Salva',
      classes: 'rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed'
    },
    cancel: {
      text: 'Annulla',
      href: '/ristorante-menu/impostazioni/zone',
      classes: 'text-sm font-semibold leading-6 text-gray-900'
    }
  },
  getFormData: (data: any, isEdit: boolean = false, item?: any, _formData?: any) => {
    return {
      formConfig: {
        ...data.formConfig,
        action: isEdit
          ? `/ristorante-menu/impostazioni/zone/modifica/${item?.id}/ajax` // Route AJAX
          : '/ristorante-menu/impostazioni/zone/nuovo/ajax' // Route AJAX
      },
      fields: data.fields.map((field: FormField) => {
        let value = '';

        if (_formData && _formData[field.name]) {
          value = _formData[field.name];
        } else if (isEdit && item) {
          value = item[field.name] || '';
        }

        return { ...field, value };
      }),
      buttons: {
        ...data.buttons,
        submit: {
          ...data.buttons.submit,
          text: isEdit ? 'Modifica' : 'Salva'
        },
        cancel: {
          ...data.buttons.cancel,
          href: isEdit
            ? `/ristorante-menu/impostazioni/zone/dettagli/${item?.id}`
            : '/ristorante-menu/impostazioni/zone'
        }
      }
    };
  }
};

// Configurazione form per tipologie vino
export const tipologiaVinoFormData: FormDataSchema = {
  formConfig: {
    method: 'POST',
    action: '/ristorante-menu/impostazioni/tipologie-vino/nuovo/ajax', // Route AJAX
    id: 'tipologiaVinoForm',
    novalidate: true
  },
  fields: [
    {
      type: 'text',
      name: 'nome',
      id: 'nome',
      label: 'Nome Tipologia Vino',
      required: true,
      placeholder: 'Chianti Classico',
      errorMessage: 'Il nome della tipologia vino è obbligatorio',
      bulkEditable: false // Le tipologie vino non hanno modifica massiva
    },
    {
      type: 'textarea',
      name: 'descrizione',
      id: 'descrizione',
      label: 'Descrizione',
      required: false,
      placeholder: 'Descrizione dettagliata della tipologia vino...',
      errorMessage: '',
      bulkEditable: false // Le tipologie vino non hanno modifica massiva
    }
  ],
  buttons: {
    submit: {
      text: 'Salva',
      classes: 'rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed'
    },
    cancel: {
      text: 'Annulla',
      href: '/ristorante-menu/impostazioni/tipologie-vino',
      classes: 'text-sm font-semibold leading-6 text-gray-900'
    }
  },
  getFormData: (data: any, isEdit: boolean = false, item?: any, _formData?: any) => {
    return {
      formConfig: {
        ...data.formConfig,
        action: isEdit
          ? `/ristorante-menu/impostazioni/tipologie-vino/modifica/${item?.id}/ajax` // Route AJAX
          : '/ristorante-menu/impostazioni/tipologie-vino/nuovo/ajax' // Route AJAX
      },
      fields: data.fields.map((field: FormField) => {
        let value = '';

        if (_formData && _formData[field.name]) {
          value = _formData[field.name];
        } else if (isEdit && item) {
          value = item[field.name] || '';
        }

        return { ...field, value };
      }),
      buttons: {
        ...data.buttons,
        submit: {
          ...data.buttons.submit,
          text: isEdit ? 'Modifica' : 'Salva'
        },
        cancel: {
          ...data.buttons.cancel,
          href: isEdit
            ? `/ristorante-menu/impostazioni/tipologie-vino/dettagli/${item?.id}`
            : '/ristorante-menu/impostazioni/tipologie-vino'
        }
      }
    };
  }
};

// Configurazione form per tipologie birra
export const tipologiaBirraFormData: FormDataSchema = {
  formConfig: {
    method: 'POST',
    action: '/ristorante-menu/impostazioni/tipologie-birra/nuovo/ajax', // Route AJAX
    id: 'tipologiaBirraForm',
    novalidate: true
  },
  fields: [
    {
      type: 'text',
      name: 'nome',
      id: 'nome',
      label: 'Nome Tipologia Birra',
      required: true,
      placeholder: 'IPA',
      errorMessage: 'Il nome della tipologia birra è obbligatorio',
      bulkEditable: false // Le tipologie birra non hanno modifica massiva
    },
    {
      type: 'textarea',
      name: 'descrizione',
      id: 'descrizione',
      label: 'Descrizione',
      required: false,
      placeholder: 'Descrizione dettagliata della tipologia birra...',
      errorMessage: '',
      bulkEditable: false // Le tipologie birra non hanno modifica massiva
    }
  ],
  buttons: {
    submit: {
      text: 'Salva',
      classes: 'rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed'
    },
    cancel: {
      text: 'Annulla',
      href: '/ristorante-menu/impostazioni/tipologie-birra',
      classes: 'text-sm font-semibold leading-6 text-gray-900'
    }
  },
  getFormData: (data: any, isEdit: boolean = false, item?: any, _formData?: any) => {
    return {
      formConfig: {
        ...data.formConfig,
        action: isEdit
          ? `/ristorante-menu/impostazioni/tipologie-birra/modifica/${item?.id}/ajax` // Route AJAX
          : '/ristorante-menu/impostazioni/tipologie-birra/nuovo/ajax' // Route AJAX
      },
      fields: data.fields.map((field: FormField) => {
        let value = '';

        if (_formData && _formData[field.name]) {
          value = _formData[field.name];
        } else if (isEdit && item) {
          value = item[field.name] || '';
        }

        return { ...field, value };
      }),
      buttons: {
        ...data.buttons,
        submit: {
          ...data.buttons.submit,
          text: isEdit ? 'Modifica' : 'Salva'
        },
        cancel: {
          ...data.buttons.cancel,
          href: isEdit
            ? `/ristorante-menu/impostazioni/tipologie-birra/dettagli/${item?.id}`
            : '/ristorante-menu/impostazioni/tipologie-birra'
        }
      }
    };
  }
};

// Configurazione form per tipologie liquore
export const tipologiaLiquoreFormData: FormDataSchema = {
  formConfig: {
    method: 'POST',
    action: '/ristorante-menu/impostazioni/tipologie-liquore/nuovo/ajax', // Route AJAX
    id: 'tipologiaLiquoreForm',
    novalidate: true
  },
  fields: [
    {
      type: 'text',
      name: 'nome',
      id: 'nome',
      label: 'Nome Tipologia Liquore',
      required: true,
      placeholder: 'Whisky',
      errorMessage: 'Il nome della tipologia liquore è obbligatorio',
      bulkEditable: false // Le tipologie liquore non hanno modifica massiva
    },
    {
      type: 'textarea',
      name: 'descrizione',
      id: 'descrizione',
      label: 'Descrizione',
      required: false,
      placeholder: 'Descrizione dettagliata della tipologia liquore...',
      errorMessage: '',
      bulkEditable: false // Le tipologie liquore non hanno modifica massiva
    }
  ],
  buttons: {
    submit: {
      text: 'Salva',
      classes: 'rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed'
    },
    cancel: {
      text: 'Annulla',
      href: '/ristorante-menu/impostazioni/tipologie-liquore',
      classes: 'text-sm font-semibold leading-6 text-gray-900'
    }
  },
  getFormData: (data: any, isEdit: boolean = false, item?: any, _formData?: any) => {
    return {
      formConfig: {
        ...data.formConfig,
        action: isEdit
          ? `/ristorante-menu/impostazioni/tipologie-liquore/modifica/${item?.id}/ajax` // Route AJAX
          : '/ristorante-menu/impostazioni/tipologie-liquore/nuovo/ajax' // Route AJAX
      },
      fields: data.fields.map((field: FormField) => {
        let value = '';

        if (_formData && _formData[field.name]) {
          value = _formData[field.name];
        } else if (isEdit && item) {
          value = item[field.name] || '';
        }

        return { ...field, value };
      }),
      buttons: {
        ...data.buttons,
        submit: {
          ...data.buttons.submit,
          text: isEdit ? 'Modifica' : 'Salva'
        },
        cancel: {
          ...data.buttons.cancel,
          href: isEdit
            ? `/ristorante-menu/impostazioni/tipologie-liquore/dettagli/${item?.id}`
            : '/ristorante-menu/impostazioni/tipologie-liquore'
        }
      }
    };
  }
};

// Configurazione form per tipologie bevanda
export const tipologiaBevandaFormData: FormDataSchema = {
  formConfig: {
    method: 'POST',
    action: '/ristorante-menu/impostazioni/tipologie-bevanda/nuovo/ajax', // Route AJAX
    id: 'tipologiaBevandaForm',
    novalidate: true
  },
  fields: [
    {
      type: 'text',
      name: 'nome',
      id: 'nome',
      label: 'Nome Tipologia Bevanda',
      required: true,
      placeholder: 'Analcolica',
      errorMessage: 'Il nome della tipologia bevanda è obbligatorio',
      bulkEditable: false // Le tipologie bevanda non hanno modifica massiva
    },
    {
      type: 'textarea',
      name: 'descrizione',
      id: 'descrizione',
      label: 'Descrizione',
      required: false,
      placeholder: 'Descrizione dettagliata della tipologia bevanda...',
      errorMessage: '',
      bulkEditable: false // Le tipologie bevanda non hanno modifica massiva
    }
  ],
  buttons: {
    submit: {
      text: 'Salva',
      classes: 'rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed'
    },
    cancel: {
      text: 'Annulla',
      href: '/ristorante-menu/impostazioni/tipologie-bevanda',
      classes: 'text-sm font-semibold leading-6 text-gray-900'
    }
  },
  getFormData: (data: any, isEdit: boolean = false, item?: any, _formData?: any) => {
    return {
      formConfig: {
        ...data.formConfig,
        action: isEdit
          ? `/ristorante-menu/impostazioni/tipologie-bevanda/modifica/${item?.id}/ajax` // Route AJAX
          : '/ristorante-menu/impostazioni/tipologie-bevanda/nuovo/ajax' // Route AJAX
      },
      fields: data.fields.map((field: FormField) => {
        let value = '';

        if (_formData && _formData[field.name]) {
          value = _formData[field.name];
        } else if (isEdit && item) {
          value = item[field.name] || '';
        }

        return { ...field, value };
      }),
      buttons: {
        ...data.buttons,
        submit: {
          ...data.buttons.submit,
          text: isEdit ? 'Modifica' : 'Salva'
        },
        cancel: {
          ...data.buttons.cancel,
          href: isEdit
            ? `/ristorante-menu/impostazioni/tipologie-bevanda/dettagli/${item?.id}`
            : '/ristorante-menu/impostazioni/tipologie-bevanda'
        }
      }
    };
  }
};

// Configurazione form per tipologie cocktail
export const tipologiaCocktailFormData: FormDataSchema = {
  formConfig: {
    method: 'POST',
    action: '/ristorante-menu/impostazioni/tipologie-cocktail/nuovo/ajax', // Route AJAX
    id: 'tipologiaCocktailForm',
    novalidate: true
  },
  fields: [
    {
      type: 'text',
      name: 'nome',
      id: 'nome',
      label: 'Nome Tipologia Cocktail',
      required: true,
      placeholder: 'Classico',
      errorMessage: 'Il nome della tipologia cocktail è obbligatorio',
      bulkEditable: false // Le tipologie cocktail non hanno modifica massiva
    },
    {
      type: 'textarea',
      name: 'descrizione',
      id: 'descrizione',
      label: 'Descrizione',
      required: false,
      placeholder: 'Descrizione dettagliata della tipologia cocktail...',
      errorMessage: '',
      bulkEditable: false // Le tipologie cocktail non hanno modifica massiva
    }
  ],
  buttons: {
    submit: {
      text: 'Salva',
      classes: 'rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed'
    },
    cancel: {
      text: 'Annulla',
      href: '/ristorante-menu/impostazioni/tipologie-cocktail',
      classes: 'text-sm font-semibold leading-6 text-gray-900'
    }
  },
  getFormData: (data: any, isEdit: boolean = false, item?: any, _formData?: any) => {
    return {
      formConfig: {
        ...data.formConfig,
        action: isEdit
          ? `/ristorante-menu/impostazioni/tipologie-cocktail/modifica/${item?.id}/ajax` // Route AJAX
          : '/ristorante-menu/impostazioni/tipologie-cocktail/nuovo/ajax' // Route AJAX
      },
      fields: data.fields.map((field: FormField) => {
        let value = '';

        if (_formData && _formData[field.name]) {
          value = _formData[field.name];
        } else if (isEdit && item) {
          value = item[field.name] || '';
        }

        return { ...field, value };
      }),
      buttons: {
        ...data.buttons,
        submit: {
          ...data.buttons.submit,
          text: isEdit ? 'Modifica' : 'Salva'
        },
        cancel: {
          ...data.buttons.cancel,
          href: isEdit
            ? `/ristorante-menu/impostazioni/tipologie-cocktail/dettagli/${item?.id}`
            : '/ristorante-menu/impostazioni/tipologie-cocktail'
        }
      }
    };
  }
};