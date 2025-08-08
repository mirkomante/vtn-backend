import { FormDataSchema } from "./sectionFormSchema";

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
  getFormData: (data: any, isEdit: boolean = false, item?: any, formData?: any) => {
    return {
      formConfig: {
        ...data.formConfig,
        action: isEdit 
          ? `/ristorante-menu/impostazioni/allergeni/modifica/${item?.id}/ajax` // Route AJAX
          : '/ristorante-menu/impostazioni/allergeni/nuovo/ajax' // Route AJAX
      },
      fields: data.fields.map((field: any) => {
        let value = '';
        
        if (formData && formData[field.name]) {
          value = formData[field.name];
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
      label: 'In Lista',
      required: false,
      description: 'Mostra questa categoria nella lista del menu',
      value: true,
      bulkEditable: true,
      bulkLabel: 'Stato In Lista',
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
  getFormData: (data: any, isEdit: boolean = false, item?: any, formData?: any, isBulkEdit: boolean = false, selectedItems?: any[]) => {
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
      fields: data.fields.map((field: any) => {
        let value = '';
        
        // Determina il valore del campo
        if (formData && formData[field.name]) {
          value = formData[field.name];
        } else if (isEdit && item && !isBulkEdit) {
          value = item[field.name] || '';
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
      }).filter(field => field !== null),
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
      label: 'In Lista',
      required: false,
      description: 'Mostra questa categoria nella lista del menu',
      value: true,
      bulkEditable: true,
      bulkLabel: 'Stato In Lista',
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
  getFormData: (data: any, isEdit: boolean = false, item?: any, formData?: any, isBulkEdit: boolean = false, selectedItems?: any[]) => {
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
      fields: data.fields.map((field: any) => {
        let value = '';
        
        // Determina il valore del campo
        if (formData && formData[field.name]) {
          value = formData[field.name];
        } else if (isEdit && item && !isBulkEdit) {
          value = item[field.name] || '';
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
      }).filter(field => field !== null),
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