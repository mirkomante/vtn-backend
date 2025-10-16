import { FormDataSchema } from "./sectionFormSchema";

// Configurazione form per Menu Fisso
export const menuFissoFormData: FormDataSchema = {
  formConfig: {
    method: 'POST',
    action: '/ristorante-menu/menu-fissi/nuovo/ajax',
    id: 'menuFissoForm',
    novalidate: true
  },
  fields: [
    {
      type: 'text',
      name: 'nome',
      id: 'nome',
      label: 'Nome Menu',
      required: true,
      placeholder: 'Menu del Giorno',
      errorMessage: 'Il nome del menu è obbligatorio',
      bulkEditable: false
    },
    {
      type: 'textarea',
      name: 'descrizione',
      id: 'descrizione',
      label: 'Descrizione',
      required: false,
      placeholder: 'Descrizione del menu (opzionale)',
      errorMessage: 'La descrizione non può superare i 500 caratteri',
      bulkEditable: false
    },
    {
      type: 'select',
      name: 'categoriaId',
      id: 'categoriaId',
      label: 'Categoria',
      required: true,
      placeholder: 'Seleziona una categoria',
      errorMessage: 'Seleziona una categoria valida',
      bulkEditable: true,
      bulkLabel: 'Aggiorna categoria per tutti i menu selezionati',
      bulkPlaceholder: 'Seleziona nuova categoria (opzionale)',
      bulkRequired: false,
      options: []
    },
    {
      type: 'number',
      name: 'prezzo',
      id: 'prezzo',
      label: 'Prezzo',
      required: true,
      placeholder: '0.00',
      step: 0.01,
      min: 0,
      errorMessage: 'Il prezzo deve essere un numero valido maggiore o uguale a 0',
      bulkEditable: true,
      bulkLabel: 'Aggiorna prezzo per tutti i menu selezionati',
      bulkPlaceholder: 'Nuovo prezzo (opzionale)',
      bulkRequired: false
    },
    {
      type: 'dynamic-list',
      name: 'piatti',
      id: 'piatti',
      label: 'Piatti del Menu',
      required: false,
      description: 'Aggiungi e riordina i piatti inclusi nel menu',
      errorMessage: 'Seleziona almeno un piatto valido',
      bulkEditable: false,
      listConfig: {
        itemType: 'piatto',
        placeholder: 'Seleziona un piatto...',
        addButtonText: 'Aggiungi Piatto',
        emptyMessage: 'Nessun piatto selezionato',
        allowReorder: true,
        allowRemove: true,
        maxItems: 20
      },
      options: []
    },
    {
      type: 'dynamic-list',
      name: 'servizi',
      id: 'servizi',
      label: 'Servizi Accessori',
      required: false,
      description: 'Aggiungi e riordina i servizi accessori inclusi nel menu',
      errorMessage: 'Seleziona almeno un servizio valido',
      bulkEditable: false,
      listConfig: {
        itemType: 'servizio',
        placeholder: 'Seleziona un servizio...',
        addButtonText: 'Aggiungi Servizio',
        emptyMessage: 'Nessun servizio selezionato',
        allowReorder: true,
        allowRemove: true,
        maxItems: 10
      },
      options: []
    },
    {
      type: 'toggle',
      name: 'inLista',
      id: 'inLista',
      label: 'Visibile nel menu',
      required: false,
      value: true,
      defaultValue: true,
      bulkEditable: true,
      bulkLabel: 'Aggiorna visibilità per tutti i menu selezionati',
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
      href: '/ristorante-menu/menu-fissi',
      classes: 'text-sm font-semibold leading-6 text-gray-900'
    }
  },
  getFormData: (data: FormDataSchema, isEdit: boolean = false, menuFisso?: any, _formData?: any, isBulkEdit: boolean = false, selectedItems?: any[]): FormDataSchema => {
    return {
      ...data,
      formConfig: {
        ...data.formConfig,
        action: isBulkEdit 
          ? '/ristorante-menu/menu-fissi/modifica-massa/ajax'
          : isEdit 
            ? `/ristorante-menu/menu-fissi/modifica/${menuFisso?.id}/ajax`
            : '/ristorante-menu/menu-fissi/nuovo/ajax',
        method: isBulkEdit ? 'POST' : 'POST'
      },
      fields: data.fields.map(field => {
        let value = '';
        
        if (menuFisso && field.name in menuFisso) {
          if (field.name === 'piatti') {
            value = menuFisso.piatti?.map((mp: any) => mp.piatto?.id || mp.piattoId) || [];
          } else if (field.name === 'servizi') {
            value = menuFisso.servizi?.map((ms: any) => ms.servizioAccessorio?.id || ms.servizioAccessorioId) || [];
          } else {
            value = menuFisso[field.name] || '';
          }
        } else if (!isEdit && !isBulkEdit && field.type === 'toggle' && field.defaultValue !== undefined) {
          // Per i nuovi elementi, usa il defaultValue se disponibile
          value = field.defaultValue.toString();
        }
        
        if (isBulkEdit && !field.bulkEditable) {
          return null;
        }
        
        if (isBulkEdit && field.bulkEditable) {
          let bulkValue = '';
          
          if (field.type === 'toggle' && selectedItems && selectedItems.length > 0) {
            const values = selectedItems.map((item: any) => item[field.name]);
            const trueCount = values.filter(v => v === true || v === 'true' || v === 'on').length;
            const falseCount = values.filter(v => v === false || v === 'false' || v === 'off').length;
            
            if (trueCount === selectedItems.length) {
              bulkValue = 'true';
            } else if (falseCount === selectedItems.length) {
              bulkValue = 'false';
            } else {
              bulkValue = 'indeterminate';
            }
          }
          
          return {
            ...field,
            label: field.bulkLabel || field.label,
            placeholder: field.bulkPlaceholder || field.placeholder,
            required: field.bulkRequired || false,
            value: bulkValue
          };
        }
        
        return { ...field, value };
      }).filter(field => field !== null),
      buttons: {
        ...data.buttons,
        submit: {
          ...data.buttons.submit,
          text: isBulkEdit 
            ? `Aggiorna ${selectedItems?.length || 0} menu` 
            : isEdit 
              ? 'Aggiorna' 
              : 'Salva'
        },
        cancel: {
          text: 'Annulla',
          href: isBulkEdit 
            ? '/ristorante-menu/menu-fissi' 
            : isEdit 
              ? `/ristorante-menu/menu-fissi/dettagli/${menuFisso?.id}` 
              : '/ristorante-menu/menu-fissi',
          classes: 'text-sm font-semibold leading-6 text-gray-900'
        }
      }
    };
  }
};
