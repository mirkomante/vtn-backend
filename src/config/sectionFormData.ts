import { FormDataSchema, FormField } from "./sectionFormSchema";

export const userFormData: FormDataSchema = {
  formConfig: {
    method: 'POST',
    action: '/admin/utenti/nuovo/ajax',
    id: 'userForm',
    novalidate: true
  },
  fields: [
    {
      type: 'text',
      name: 'nome',
      id: 'nome',
      label: 'Nome',
      required: true,
      placeholder: 'Mario',
      errorMessage: 'Il nome è obbligatorio',
      bulkEditable: false
    },
    {
      type: 'text',
      name: 'cognome',
      id: 'cognome',
      label: 'Cognome',
      required: true,
      placeholder: 'Rossi',
      errorMessage: 'Il cognome è obbligatorio',
      bulkEditable: false
    },
    {
      type: 'email',
      name: 'email',
      id: 'email',
      label: 'Email',
      required: true,
      placeholder: 'you@example.com',
      errorMessage: 'Inserisci un indirizzo email valido',
      bulkEditable: false
    },
    {
      type: 'password',
      name: 'password',
      id: 'password',
      label: 'Password',
      required: true,
      placeholder: 'Inserisci la password',
      errorMessage: 'La password deve contenere almeno 8 caratteri, una lettera maiuscola, una minuscola e un numero',
      bulkEditable: false
    },
    {
      type: 'select',
      name: 'ruolo',
      id: 'ruolo',
      label: 'Ruolo',
      required: true,
      placeholder: 'Seleziona un ruolo',
      errorMessage: 'Seleziona un ruolo',
      bulkEditable: true,
      bulkLabel: 'Imposta ruolo per tutti gli utenti selezionati',
      bulkPlaceholder: 'Seleziona il nuovo ruolo (opzionale)',
      bulkHelpText: 'Questo ruolo verrà applicato a tutti gli utenti selezionati. Lascia vuoto per non modificare.',
      bulkRequired: false, // Non obbligatorio in modifica massiva
      options: [
        { value: 'user', label: 'Utente' },
        { value: 'admin', label: 'Amministratore' }
      ]
    },
    {
      type: 'select',
      name: 'auth',
      id: 'auth',
      label: 'Autorizzazione',
      required: true,
      placeholder: 'Seleziona autorizzazione',
      errorMessage: 'Seleziona un\'autorizzazione',
      bulkEditable: true,
      bulkLabel: 'Imposta autorizzazione per tutti gli utenti selezionati',
      bulkPlaceholder: 'Seleziona la nuova autorizzazione (opzionale)',
      bulkHelpText: 'Questa autorizzazione verrà applicata a tutti gli utenti selezionati. Lascia vuoto per non modificare.',
      bulkRequired: false, // Non obbligatorio in modifica massiva
      options: [
        { value: 'user', label: 'Utente' },
        { value: 'admin', label: 'Amministratore' }
      ]
    }
  ],
  buttons: {
    submit: {
      text: 'Salva',
      classes: 'rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed'
    },
    cancel: {
      text: 'Annulla',
      href: '/admin/utenti',
      classes: 'text-sm font-semibold leading-6 text-gray-900'
    }
  },
  bulkEditConfig: {
    title: 'Modifica Massiva Utenti',
    description: 'Modifica i campi selezionati per tutti gli utenti scelti. Puoi modificare uno o entrambi i campi.',
    action: '/admin/utenti/modifica-massa/ajax',
    method: 'POST',
    endpoint: '/admin/utenti/modifica-massa/ajax',
    successMessage: 'Aggiornati {count} utenti con successo',
    errorMessage: 'Errore durante l\'aggiornamento degli utenti',
    requireAtLeastOneField: true, // Almeno un campo deve essere compilato
    allowPartialUpdates: true // Permette aggiornamenti parziali
  },
  getFormData: (data: any, isEdit: boolean = false, user?: any, _formData?: any, isBulkEdit: boolean = false, selectedItems?: any[]) => {
    return {
      formConfig: {
        ...data.formConfig,
        action: isBulkEdit 
          ? data.bulkEditConfig.action 
          : isEdit 
            ? `/admin/utenti/modifica/${user?.id}/ajax` 
            : '/admin/utenti/nuovo/ajax',
        method: isBulkEdit ? data.bulkEditConfig.method : data.formConfig.method,
        hiddenFields: isBulkEdit && selectedItems ? [
          {
            name: 'itemIds',
            value: selectedItems.map(item => item.id)
          }
        ] : undefined
      },
      fields: data.fields.map((field: FormField) => {
        let value: any = '';
        
        // Determina il valore del campo
        if (_formData && _formData[field.name]) {
          value = _formData[field.name];
        } else if (isEdit && user && !isBulkEdit) {
          switch (field.name) {
            case 'nome':
              value = user.givenName || '';
              break;
            case 'cognome':
              value = user.familyName || '';
              break;
            case 'email':
              value = user.email || '';
              break;
            case 'ruolo':
              value = user.role || '';
              break;
            case 'auth':
              value = user.auth || '';
              break;
          }
        }
        
        // Gestione speciale per password in modalità edit
        if (field.name === 'password' && isEdit && !isBulkEdit) {
          return {
            ...field,
            required: false,
            placeholder: 'Lascia vuoto per non modificare',
            value: ''
          };
        }
        
        // Per la modifica massiva, mostra solo i campi modificabili
        if (isBulkEdit && !field.bulkEditable) {
          return { ...field, value: '', skip: true };
        }
        
        // Per la modifica massiva, usa configurazione specifica
        if (isBulkEdit && field.bulkEditable) {
          return {
            ...field,
            label: field.bulkLabel || field.label,
            placeholder: field.bulkPlaceholder || field.placeholder,
            required: field.bulkRequired || false, // Usa la configurazione specifica
            value: ''
          };
        }
        
        return { ...field, value };
      }).filter((field: any): field is FormField => field !== null && !field.skip),
      buttons: {
        ...data.buttons,
        submit: {
          ...data.buttons.submit,
          text: isBulkEdit 
            ? `Aggiorna ${selectedItems?.length || 0} utenti` 
            : isEdit 
              ? 'Aggiorna' 
              : 'Salva'
        },
        cancel: {
          ...data.buttons.cancel,
          href: isBulkEdit 
            ? '/admin/utenti' 
            : isEdit 
              ? `/admin/utenti/dettagli/${user?.id}` 
              : '/admin/utenti'
        }
      }
    };
  }
};

export const piattoFormData: FormDataSchema = {
  formConfig: {
    method: 'POST',
    action: '/ristorante-menu/piatti/nuovo/ajax', // Route AJAX
    id: 'piattoForm',
    novalidate: true
  },
  fields: [
    {
      type: 'text',
      name: 'nome',
      id: 'nome',
      label: 'Nome Piatto',
      required: true,
      placeholder: 'Spaghetti Carbonara',
      errorMessage: 'Il nome del piatto è obbligatorio',
      bulkEditable: false
    },
    {
      type: 'textarea',
      name: 'descrizione',
      id: 'descrizione',
      label: 'Descrizione',
      required: false,
      placeholder: 'Descrizione del piatto (opzionale)',
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
      errorMessage: 'La categoria è obbligatoria',
      bulkEditable: true,
      bulkLabel: 'Aggiorna categoria per tutti i piatti selezionati',
      bulkPlaceholder: 'Seleziona nuova categoria (opzionale)',
      bulkRequired: false,
      options: [] // Sarà popolato dinamicamente
    },
    {
      type: 'number',
      name: 'prezzo',
      id: 'prezzo',
      label: 'Prezzo (€)',
      required: true,
      placeholder: '12.50',
      min: 0,
      step: 0.01,
      errorMessage: 'Il prezzo deve essere un numero valido maggiore di 0',
      bulkEditable: true,
      bulkLabel: 'Aggiorna prezzo per tutti i piatti selezionati',
      bulkPlaceholder: 'Nuovo prezzo (opzionale)',
      bulkRequired: false
    },
    {
      type: 'checkbox-group',
      name: 'allergeni',
      id: 'allergeni',
      label: 'Allergeni',
      required: false,
      description: 'Seleziona gli allergeni presenti nel piatto',
      errorMessage: 'Seleziona almeno un allergene valido',
      bulkEditable: false,
      options: [] // Sarà popolato dinamicamente
    },
    {
      type: 'toggle',
      name: 'glutenFree',
      id: 'glutenFree',
      label: 'Gluten Free',
      required: false,
      value: false,
      bulkEditable: true,
      bulkLabel: 'Aggiorna opzione gluten free per tutti i piatti selezionati',
      bulkRequired: false
    },
    {
      type: 'toggle',
      name: 'noLatticini',
      id: 'noLatticini',
      label: 'No Latticini',
      required: false,
      value: false,
      bulkEditable: true,
      bulkLabel: 'Aggiorna opzione no latticini per tutti i piatti selezionati',
      bulkRequired: false
    },
    {
      type: 'toggle',
      name: 'vegan',
      id: 'vegan',
      label: 'Vegan',
      required: false,
      value: false,
      bulkEditable: true,
      bulkLabel: 'Aggiorna opzione vegan per tutti i piatti selezionati',
      bulkRequired: false
    },
    {
      type: 'toggle',
      name: 'noUovo',
      id: 'noUovo',
      label: 'No Uovo',
      required: false,
      value: false,
      bulkEditable: true,
      bulkLabel: 'Aggiorna opzione no uovo per tutti i piatti selezionati',
      bulkRequired: false
    },
    {
      type: 'toggle',
      name: 'soloMenuFissi',
      id: 'soloMenuFissi',
      label: 'Solo Menu Fissi',
      required: false,
      value: false,
      defaultValue: false,
      bulkEditable: true,
      bulkLabel: 'Aggiorna opzione solo menu fissi per tutti i piatti selezionati',
      bulkRequired: false
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
      bulkLabel: 'Aggiorna visibilità per tutti i piatti selezionati',
      bulkRequired: false
    }
  ],
  buttons: {
    submit: {
      text: 'Salva',
      classes: 'rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
    },
    cancel: {
      text: 'Annulla',
      href: '/ristorante-menu/piatti',
      classes: 'rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
    }
  },
  getFormData: (data: FormDataSchema, isEdit: boolean = false, piatto?: any, __formData?: any, isBulkEdit: boolean = false, selectedItems?: any[]): FormDataSchema => {
    return {
      ...data,
      formConfig: {
        ...data.formConfig,
        action: isBulkEdit 
          ? '/ristorante-menu/piatti/modifica-massa/ajax'
          : isEdit 
            ? `/ristorante-menu/piatti/modifica/${piatto?.id}/ajax`
            : '/ristorante-menu/piatti/nuovo/ajax',
        method: isBulkEdit ? 'POST' : 'POST'
      },
      fields: data.fields.map((field: FormField) => {
        let value: any = '';
        
        if (piatto && field.name in piatto) {
          if (field.name === 'allergeni') {
            // Per gli allergeni, prendiamo gli ID degli allergeni associati
            value = piatto.allergeni?.map((pa: any) => pa.allergene.id) || [];
          } else {
            value = piatto[field.name] || '';
          }
        } else if (!isEdit && !isBulkEdit && field.type === 'toggle' && field.defaultValue !== undefined) {
          // Per i nuovi elementi, usa il defaultValue se disponibile
          value = field.defaultValue;
        }
        
        // Per la modifica massiva, mostra solo i campi modificabili
        if (isBulkEdit && !field.bulkEditable) {
          return { ...field, value: '', skip: true };
        }
        
        // Per la modifica massiva, usa configurazione specifica
        if (isBulkEdit && field.bulkEditable) {
          let bulkValue = '';
          
          // Per i campi toggle/checkbox, gestisci gli stati misti
          if (field.type === 'toggle' && selectedItems && selectedItems.length > 0) {
            const values = selectedItems.map((item: any) => item[field.name]);
            const trueCount = values.filter(v => v === true || v === 'true' || v === 'on').length;
            const falseCount = values.filter(v => v === false || v === 'false' || v === 'off').length;
            
            if (trueCount === selectedItems.length) {
              // Tutti true
              bulkValue = 'true';
            } else if (falseCount === selectedItems.length) {
              // Tutti false
              bulkValue = 'false';
            } else {
              // Stato misto
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
      }).filter((field: any): field is FormField => field !== null && !field.skip),
      buttons: {
        ...data.buttons,
        submit: {
          ...data.buttons.submit,
          text: isBulkEdit 
            ? `Aggiorna ${selectedItems?.length || 0} piatti` 
            : isEdit 
              ? 'Aggiorna' 
              : 'Salva'
        },
        cancel: {
          ...data.buttons.cancel,
          text: 'Annulla',
          href: isBulkEdit 
            ? '/ristorante-menu/piatti' 
            : isEdit 
              ? `/ristorante-menu/piatti/dettagli/${piatto?.id}` 
              : '/ristorante-menu/piatti'
        }
      }
    };
  }
};

export const vinoFormData: FormDataSchema = {
  formConfig: {
    method: 'POST',
    action: '/ristorante-menu/vini/nuovo/ajax', // Route AJAX
    id: 'vinoForm',
    novalidate: true
  },
  fields: [
    {
      type: 'text',
      name: 'nome',
      id: 'nome',
      label: 'Nome Vino',
      required: true,
      placeholder: 'Chianti Classico',
      errorMessage: 'Il nome del vino è obbligatorio',
      bulkEditable: false
    },
    {
      type: 'textarea',
      name: 'descrizione',
      id: 'descrizione',
      label: 'Descrizione',
      required: false,
      placeholder: 'Descrizione del vino (opzionale)',
      errorMessage: 'La descrizione non può superare i 500 caratteri',
      bulkEditable: false
    },
    {
      type: 'text',
      name: 'cantina',
      id: 'cantina',
      label: 'Cantina',
      required: false,
      placeholder: 'Nome della cantina produttrice',
      errorMessage: 'Il nome della cantina non può superare i 100 caratteri',
      bulkEditable: true,
      bulkLabel: 'Aggiorna cantina per tutti i vini selezionati',
      bulkPlaceholder: 'Nuova cantina (opzionale)',
      bulkRequired: false
    },
    {
      type: 'text',
      name: 'grado',
      id: 'grado',
      label: 'Grado Alcolico',
      required: false,
      placeholder: '13.5%',
      errorMessage: 'Il grado alcolico deve essere un valore valido',
      bulkEditable: true,
      bulkLabel: 'Aggiorna grado alcolico per tutti i vini selezionati',
      bulkPlaceholder: 'Nuovo grado alcolico (opzionale)',
      bulkRequired: false
    },
    {
      type: 'text',
      name: 'certificazione',
      id: 'certificazione',
      label: 'Certificazione',
      required: false,
      placeholder: 'DOCG, DOC, IGT, etc.',
      errorMessage: 'La certificazione non può superare i 50 caratteri',
      bulkEditable: true,
      bulkLabel: 'Aggiorna certificazione per tutti i vini selezionati',
      bulkPlaceholder: 'Nuova certificazione (opzionale)',
      bulkRequired: false
    },
    {
      type: 'text',
      name: 'capacita',
      id: 'capacita',
      label: 'Capacità',
      required: false,
      placeholder: '750ml, 1L, etc.',
      errorMessage: 'La capacità deve essere un valore valido',
      defaultValue: '75cl',
      bulkEditable: true,
      bulkLabel: 'Aggiorna capacità per tutti i vini selezionati',
      bulkPlaceholder: 'Nuova capacità (opzionale)',
      bulkRequired: false
    },
    {
      type: 'text',
      name: 'anno',
      id: 'anno',
      label: 'Anno',
      required: false,
      placeholder: '2020, 2019, etc.',
      errorMessage: 'L\'anno deve essere un valore valido',
      bulkEditable: true,
      bulkLabel: 'Aggiorna anno per tutti i vini selezionati',
      bulkPlaceholder: 'Nuovo anno (opzionale)',
      bulkRequired: false
    },
    {
      type: 'select',
      name: 'tipologiaId',
      id: 'tipologiaId',
      label: 'Tipologia',
      required: true,
      placeholder: 'Seleziona una tipologia',
      errorMessage: 'La tipologia è obbligatoria',
      bulkEditable: true,
      bulkLabel: 'Aggiorna tipologia per tutti i vini selezionati',
      bulkPlaceholder: 'Seleziona nuova tipologia (opzionale)',
      bulkRequired: false,
      options: [] // Sarà popolato dinamicamente
    },
    {
      type: 'select',
      name: 'nazioneId',
      id: 'nazioneId',
      label: 'Nazione',
      required: true,
      placeholder: 'Seleziona una nazione',
      errorMessage: 'La nazione è obbligatoria',
      bulkEditable: true,
      bulkLabel: 'Aggiorna nazione per tutti i vini selezionati',
      bulkPlaceholder: 'Seleziona nuova nazione (opzionale)',
      bulkRequired: false,
      options: [] // Sarà popolato dinamicamente
    },
    {
      type: 'select',
      name: 'regioneId',
      id: 'regioneId',
      label: 'Regione',
      required: false,
      placeholder: 'Seleziona una regione',
      errorMessage: 'Seleziona una regione valida',
      bulkEditable: true,
      bulkLabel: 'Aggiorna regione per tutti i vini selezionati',
      bulkPlaceholder: 'Seleziona nuova regione (opzionale)',
      bulkRequired: false,
      options: [] // Sarà popolato dinamicamente
    },
    {
      type: 'select',
      name: 'zonaId',
      id: 'zonaId',
      label: 'Zona',
      required: false,
      placeholder: 'Seleziona una zona',
      errorMessage: 'Seleziona una zona valida',
      bulkEditable: true,
      bulkLabel: 'Aggiorna zona per tutti i vini selezionati',
      bulkPlaceholder: 'Seleziona nuova zona (opzionale)',
      bulkRequired: false,
      options: [] // Sarà popolato dinamicamente
    },
    {
      type: 'number',
      name: 'prezzo',
      id: 'prezzo',
      label: 'Prezzo Bottiglia (€)',
      required: true,
      placeholder: '25.00',
      min: 0,
      step: 0.01,
      errorMessage: 'Il prezzo deve essere un numero valido maggiore di 0',
      bulkEditable: true,
      bulkLabel: 'Aggiorna prezzo bottiglia per tutti i vini selezionati',
      bulkPlaceholder: 'Nuovo prezzo bottiglia (opzionale)',
      bulkRequired: false
    },
    {
      type: 'number',
      name: 'prezzoCalice',
      id: 'prezzoCalice',
      label: 'Prezzo Calice (€)',
      required: false,
      placeholder: '6.50',
      min: 0,
      step: 0.01,
      errorMessage: 'Il prezzo calice deve essere un numero valido maggiore di 0',
      bulkEditable: true,
      bulkLabel: 'Aggiorna prezzo calice per tutti i vini selezionati',
      bulkPlaceholder: 'Nuovo prezzo calice (opzionale)',
      bulkRequired: false
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
      bulkLabel: 'Aggiorna visibilità per tutti i vini selezionati',
      bulkRequired: false
    }
  ],
  buttons: {
    submit: {
      text: 'Salva',
      classes: 'rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
    },
    cancel: {
      text: 'Annulla',
      href: '/ristorante-menu/vini',
      classes: 'rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
    }
  },
  getFormData: (data: FormDataSchema, isEdit: boolean = false, vino?: any, _formData?: any, isBulkEdit: boolean = false, selectedItems?: any[]): FormDataSchema => {
    return {
      ...data,
      formConfig: {
        ...data.formConfig,
        action: isBulkEdit 
          ? '/ristorante-menu/vini/modifica-massa/ajax'
          : isEdit 
            ? `/ristorante-menu/vini/modifica/${vino?.id}/ajax`
            : '/ristorante-menu/vini/nuovo/ajax',
        method: isBulkEdit ? 'POST' : 'POST'
      },
      fields: data.fields.map((field: FormField) => {
        let value: any = '';
        
        if (vino && field.name in vino) {
          if (field.name === 'tipologiaId') {
            value = vino.tipologia?.id || '';
          } else if (field.name === 'nazioneId') {
            value = vino.nazione?.id || '';
          } else if (field.name === 'regioneId') {
            value = vino.regione?.id || '';
          } else if (field.name === 'zonaId') {
            value = vino.zona?.id || '';
          } else {
            value = vino[field.name] || '';
          }
        } else if (!isEdit && !isBulkEdit && field.defaultValue !== undefined) {
          // Per i nuovi elementi, usa il defaultValue se disponibile
          value = field.defaultValue;
        }
        
        // Per la modifica massiva, mostra solo i campi modificabili
        if (isBulkEdit && !field.bulkEditable) {
          return { ...field, value: '', skip: true };
        }
        
        // Per la modifica massiva, usa configurazione specifica
        if (isBulkEdit && field.bulkEditable) {
          let bulkValue = '';
          
          // Per i campi toggle/checkbox, gestisci gli stati misti
          if (field.type === 'toggle' && selectedItems && selectedItems.length > 0) {
            const values = selectedItems.map((item: any) => item[field.name]);
            const trueCount = values.filter(v => v === true || v === 'true' || v === 'on').length;
            const falseCount = values.filter(v => v === false || v === 'false' || v === 'off').length;
            
            if (trueCount === selectedItems.length) {
              // Tutti true
              bulkValue = 'true';
            } else if (falseCount === selectedItems.length) {
              // Tutti false
              bulkValue = 'false';
            } else {
              // Stato misto
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
      }).filter((field: any): field is FormField => field !== null && !field.skip),
      buttons: {
        ...data.buttons,
        submit: {
          ...data.buttons.submit,
          text: isBulkEdit 
            ? `Aggiorna ${selectedItems?.length || 0} vini` 
            : isEdit 
              ? 'Aggiorna' 
              : 'Salva'
        },
        cancel: {
          ...data.buttons.cancel,
          text: 'Annulla',
          href: isBulkEdit 
            ? '/ristorante-menu/vini' 
            : isEdit 
              ? `/ristorante-menu/vini/dettagli/${vino?.id}` 
              : '/ristorante-menu/vini'
        }
      }
    };
  }
};

export const birraFormData: FormDataSchema = {
  formConfig: {
    method: 'POST',
    action: '/ristorante-menu/birre/nuovo/ajax', // Route AJAX
    id: 'birraForm',
    novalidate: true
  },
  fields: [
    {
      type: 'text',
      name: 'nome',
      id: 'nome',
      label: 'Nome Birra',
      required: true,
      placeholder: 'Peroni Nastro Azzurro',
      errorMessage: 'Il nome della birra è obbligatorio',
      bulkEditable: false
    },
    {
      type: 'textarea',
      name: 'descrizione',
      id: 'descrizione',
      label: 'Descrizione',
      required: false,
      placeholder: 'Descrizione della birra (opzionale)',
      errorMessage: 'La descrizione non può superare i 500 caratteri',
      bulkEditable: false
    },
    {
      type: 'text',
      name: 'grado',
      id: 'grado',
      label: 'Grado Alcolico',
      required: false,
      placeholder: '5.2%',
      errorMessage: 'Il grado alcolico deve essere un valore valido',
      bulkEditable: true,
      bulkLabel: 'Aggiorna grado alcolico per tutte le birre selezionate',
      bulkPlaceholder: 'Nuovo grado alcolico (opzionale)',
      bulkRequired: false
    },
    {
      type: 'text',
      name: 'capacita',
      id: 'capacita',
      label: 'Capacità',
      required: false,
      placeholder: '33cl, 50cl, 1L, etc.',
      errorMessage: 'La capacità deve essere un valore valido',
      bulkEditable: true,
      bulkLabel: 'Aggiorna capacità per tutte le birre selezionate',
      bulkPlaceholder: 'Nuova capacità (opzionale)',
      bulkRequired: false
    },
    {
      type: 'select',
      name: 'tipologiaId',
      id: 'tipologiaId',
      label: 'Tipologia',
      required: true,
      placeholder: 'Seleziona una tipologia',
      errorMessage: 'La tipologia è obbligatoria',
      bulkEditable: true,
      bulkLabel: 'Aggiorna tipologia per tutte le birre selezionate',
      bulkPlaceholder: 'Seleziona nuova tipologia (opzionale)',
      bulkRequired: false,
      options: [] // Sarà popolato dinamicamente
    },
    {
      type: 'select',
      name: 'nazioneId',
      id: 'nazioneId',
      label: 'Nazione',
      required: true,
      placeholder: 'Seleziona una nazione',
      errorMessage: 'La nazione è obbligatoria',
      bulkEditable: true,
      bulkLabel: 'Aggiorna nazione per tutte le birre selezionate',
      bulkPlaceholder: 'Seleziona nuova nazione (opzionale)',
      bulkRequired: false,
      options: [] // Sarà popolato dinamicamente
    },
    {
      type: 'number',
      name: 'prezzo',
      id: 'prezzo',
      label: 'Prezzo (€)',
      required: true,
      placeholder: '4.50',
      min: 0,
      step: 0.01,
      errorMessage: 'Il prezzo deve essere un numero valido maggiore di 0',
      bulkEditable: true,
      bulkLabel: 'Aggiorna prezzo per tutte le birre selezionate',
      bulkPlaceholder: 'Nuovo prezzo (opzionale)',
      bulkRequired: false
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
      bulkLabel: 'Aggiorna visibilità per tutte le birre selezionate',
      bulkRequired: false
    }
  ],
  buttons: {
    submit: {
      text: 'Salva',
      classes: 'rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
    },
    cancel: {
      text: 'Annulla',
      href: '/ristorante-menu/birre',
      classes: 'rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
    }
  },
  getFormData: (data: FormDataSchema, isEdit: boolean = false, birra?: any, _formData?: any, isBulkEdit: boolean = false, selectedItems?: any[]): FormDataSchema => {
    return {
      ...data,
      formConfig: {
        ...data.formConfig,
        action: isBulkEdit 
          ? '/ristorante-menu/birre/modifica-massa/ajax'
          : isEdit 
            ? `/ristorante-menu/birre/modifica/${birra?.id}/ajax`
            : '/ristorante-menu/birre/nuovo/ajax',
        method: isBulkEdit ? 'POST' : 'POST'
      },
      fields: data.fields.map((field: FormField) => {
        let value: any = '';
        
        if (birra && field.name in birra) {
          if (field.name === 'tipologiaId') {
            value = birra.tipologia?.id || '';
          } else if (field.name === 'nazioneId') {
            value = birra.nazione?.id || '';
          } else {
            value = birra[field.name] || '';
          }
        } else if (!isEdit && !isBulkEdit && field.type === 'toggle' && field.defaultValue !== undefined) {
          // Per i nuovi elementi, usa il defaultValue se disponibile
          value = field.defaultValue;
        }
        
        // Per la modifica massiva, mostra solo i campi modificabili
        if (isBulkEdit && !field.bulkEditable) {
          return { ...field, value: '', skip: true };
        }
        
        // Per la modifica massiva, usa configurazione specifica
        if (isBulkEdit && field.bulkEditable) {
          let bulkValue = '';
          
          // Per i campi toggle/checkbox, gestisci gli stati misti
          if (field.type === 'toggle' && selectedItems && selectedItems.length > 0) {
            const values = selectedItems.map((item: any) => item[field.name]);
            const trueCount = values.filter(v => v === true || v === 'true' || v === 'on').length;
            const falseCount = values.filter(v => v === false || v === 'false' || v === 'off').length;
            
            if (trueCount === selectedItems.length) {
              // Tutti true
              bulkValue = 'true';
            } else if (falseCount === selectedItems.length) {
              // Tutti false
              bulkValue = 'false';
            } else {
              // Stato misto
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
      }).filter((field: any): field is FormField => field !== null && !field.skip),
      buttons: {
        ...data.buttons,
        submit: {
          ...data.buttons.submit,
          text: isBulkEdit 
            ? `Aggiorna ${selectedItems?.length || 0} birre` 
            : isEdit 
              ? 'Aggiorna' 
              : 'Salva'
        },
        cancel: {
          ...data.buttons.cancel,
          text: 'Annulla',
          href: isBulkEdit 
            ? '/ristorante-menu/birre' 
            : isEdit 
              ? `/ristorante-menu/birre/dettagli/${birra?.id}` 
              : '/ristorante-menu/birre'
        }
      }
    };
  }
};

export const liquoreFormData: FormDataSchema = {
  formConfig: {
    method: 'POST',
    action: '/ristorante-menu/liquori/nuovo/ajax', // Route AJAX
    id: 'liquoreForm',
    novalidate: true
  },
  fields: [
    {
      type: 'text',
      name: 'nome',
      id: 'nome',
      label: 'Nome Liquore',
      required: true,
      placeholder: 'Whisky Johnnie Walker Black Label',
      errorMessage: 'Il nome del liquore è obbligatorio',
      bulkEditable: false
    },
    {
      type: 'textarea',
      name: 'descrizione',
      id: 'descrizione',
      label: 'Descrizione',
      required: false,
      placeholder: 'Descrizione del liquore (opzionale)',
      errorMessage: 'La descrizione non può superare i 500 caratteri',
      bulkEditable: false
    },
    {
      type: 'text',
      name: 'grado',
      id: 'grado',
      label: 'Grado Alcolico',
      required: false,
      placeholder: '40%',
      errorMessage: 'Il grado alcolico deve essere un valore valido',
      bulkEditable: true,
      bulkLabel: 'Aggiorna grado alcolico per tutti i liquori selezionati',
      bulkPlaceholder: 'Nuovo grado alcolico (opzionale)',
      bulkRequired: false
    },
    {
      type: 'text',
      name: 'invecchiamento',
      id: 'invecchiamento',
      label: 'Invecchiamento',
      required: false,
      placeholder: '12 anni, 8 mesi, Non invecchiato',
      errorMessage: 'L\'invecchiamento deve essere un valore valido',
      bulkEditable: true,
      bulkLabel: 'Aggiorna invecchiamento per tutti i liquori selezionati',
      bulkPlaceholder: 'Nuovo invecchiamento (opzionale)',
      bulkRequired: false
    },
    {
      type: 'text',
      name: 'capacita',
      id: 'capacita',
      label: 'Capacità',
      required: false,
      placeholder: '50ml, 70cl, 1L, etc.',
      errorMessage: 'La capacità deve essere un valore valido',
      bulkEditable: true,
      bulkLabel: 'Aggiorna capacità per tutti i liquori selezionati',
      bulkPlaceholder: 'Nuova capacità (opzionale)',
      bulkRequired: false
    },
    {
      type: 'select',
      name: 'tipologiaId',
      id: 'tipologiaId',
      label: 'Tipologia',
      required: true,
      placeholder: 'Seleziona una tipologia',
      errorMessage: 'La tipologia è obbligatoria',
      bulkEditable: true,
      bulkLabel: 'Aggiorna tipologia per tutti i liquori selezionati',
      bulkPlaceholder: 'Seleziona nuova tipologia (opzionale)',
      bulkRequired: false,
      options: [] // Sarà popolato dinamicamente
    },
    {
      type: 'select',
      name: 'nazioneId',
      id: 'nazioneId',
      label: 'Nazione',
      required: true,
      placeholder: 'Seleziona una nazione',
      errorMessage: 'La nazione è obbligatoria',
      bulkEditable: true,
      bulkLabel: 'Aggiorna nazione per tutti i liquori selezionati',
      bulkPlaceholder: 'Seleziona nuova nazione (opzionale)',
      bulkRequired: false,
      options: [] // Sarà popolato dinamicamente
    },
    {
      type: 'number',
      name: 'prezzo',
      id: 'prezzo',
      label: 'Prezzo (€)',
      required: true,
      placeholder: '25.00',
      min: 0,
      step: 0.01,
      errorMessage: 'Il prezzo deve essere un numero valido maggiore di 0',
      bulkEditable: true,
      bulkLabel: 'Aggiorna prezzo per tutti i liquori selezionati',
      bulkPlaceholder: 'Nuovo prezzo (opzionale)',
      bulkRequired: false
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
      bulkLabel: 'Aggiorna visibilità per tutti i liquori selezionati',
      bulkRequired: false
    }
  ],
  buttons: {
    submit: {
      text: 'Salva',
      classes: 'rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
    },
    cancel: {
      text: 'Annulla',
      href: '/ristorante-menu/liquori',
      classes: 'rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
    }
  },
  getFormData: (data: FormDataSchema, isEdit: boolean = false, liquore?: any, _formData?: any, isBulkEdit: boolean = false, selectedItems?: any[]): FormDataSchema => {
    return {
      ...data,
      formConfig: {
        ...data.formConfig,
        action: isBulkEdit 
          ? '/ristorante-menu/liquori/modifica-massa/ajax'
          : isEdit 
            ? `/ristorante-menu/liquori/modifica/${liquore?.id}/ajax`
            : '/ristorante-menu/liquori/nuovo/ajax',
        method: isBulkEdit ? 'POST' : 'POST',
        hiddenFields: isBulkEdit && selectedItems ? [
          {
            name: 'itemIds',
            value: selectedItems.map(item => item.id)
          }
        ] : undefined
      },
      fields: data.fields.map((field: FormField) => {
        let value: any = '';
        
        if (liquore && field.name in liquore) {
          if (field.name === 'tipologiaId') {
            value = liquore.tipologia?.id || '';
          } else if (field.name === 'nazioneId') {
            value = liquore.nazione?.id || '';
          } else {
            value = liquore[field.name] || '';
          }
        } else if (!isEdit && !isBulkEdit && field.type === 'toggle' && field.defaultValue !== undefined) {
          // Per i nuovi elementi, usa il defaultValue se disponibile
          value = field.defaultValue;
        }
        
        // Per la modifica massiva, mostra solo i campi modificabili
        if (isBulkEdit && !field.bulkEditable) {
          return { ...field, value: '', skip: true };
        }
        
        // Per la modifica massiva, usa configurazione specifica
        if (isBulkEdit && field.bulkEditable) {
          let bulkValue = '';
          
          // Per i campi toggle/checkbox, gestisci gli stati misti
          if (field.type === 'toggle' && selectedItems && selectedItems.length > 0) {
            const values = selectedItems.map((item: any) => item[field.name]);
            const trueCount = values.filter(v => v === true || v === 'true' || v === 'on').length;
            const falseCount = values.filter(v => v === false || v === 'false' || v === 'off').length;
            
            if (trueCount === selectedItems.length) {
              // Tutti true
              bulkValue = 'true';
            } else if (falseCount === selectedItems.length) {
              // Tutti false
              bulkValue = 'false';
            } else {
              // Stato misto
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
      }).filter((field: any): field is FormField => field !== null && !field.skip),
      buttons: {
        ...data.buttons,
        submit: {
          ...data.buttons.submit,
          text: isBulkEdit 
            ? `Aggiorna ${selectedItems?.length || 0} liquori` 
            : isEdit 
              ? 'Aggiorna' 
              : 'Salva'
        },
        cancel: {
          ...data.buttons.cancel,
          text: 'Annulla',
          href: isBulkEdit 
            ? '/ristorante-menu/liquori' 
            : isEdit 
              ? `/ristorante-menu/liquori/dettagli/${liquore?.id}` 
              : '/ristorante-menu/liquori'
        }
      }
    };
  }
};

export const cocktailFormData: FormDataSchema = {
  formConfig: {
    method: 'POST',
    action: '/ristorante-menu/cocktails/nuovo/ajax', // Route AJAX
    id: 'cocktailForm',
    novalidate: true
  },
  fields: [
    {
      type: 'text',
      name: 'nome',
      id: 'nome',
      label: 'Nome Cocktail',
      required: true,
      placeholder: 'Mojito, Margarita, Cosmopolitan',
      errorMessage: 'Il nome del cocktail è obbligatorio',
      bulkEditable: false
    },
    {
      type: 'textarea',
      name: 'descrizione',
      id: 'descrizione',
      label: 'Descrizione',
      required: false,
      placeholder: 'Descrizione del cocktail (opzionale)',
      errorMessage: 'La descrizione non può superare i 500 caratteri',
      bulkEditable: false
    },
    {
      type: 'select',
      name: 'tipologiaId',
      id: 'tipologiaId',
      label: 'Tipologia',
      required: true,
      placeholder: 'Seleziona una tipologia',
      errorMessage: 'La tipologia è obbligatoria',
      bulkEditable: true,
      bulkLabel: 'Aggiorna tipologia per tutti i cocktails selezionati',
      bulkPlaceholder: 'Seleziona nuova tipologia (opzionale)',
      bulkRequired: false,
      options: [] // Sarà popolato dinamicamente
    },
    {
      type: 'select',
      name: 'nazioneId',
      id: 'nazioneId',
      label: 'Nazione',
      required: false,
      placeholder: 'Seleziona una nazione (opzionale)',
      errorMessage: 'Seleziona una nazione valida',
      bulkEditable: true,
      bulkLabel: 'Aggiorna nazione per tutti i cocktails selezionati',
      bulkPlaceholder: 'Seleziona nuova nazione (opzionale)',
      bulkRequired: false,
      options: [] // Sarà popolato dinamicamente
    },
    {
      type: 'number',
      name: 'prezzo',
      id: 'prezzo',
      label: 'Prezzo (€)',
      required: true,
      placeholder: '12.00',
      min: 0,
      step: 0.01,
      errorMessage: 'Il prezzo deve essere un numero valido maggiore di 0',
      bulkEditable: true,
      bulkLabel: 'Aggiorna prezzo per tutti i cocktails selezionati',
      bulkPlaceholder: 'Nuovo prezzo (opzionale)',
      bulkRequired: false
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
      bulkLabel: 'Aggiorna visibilità per tutti i cocktails selezionati',
      bulkRequired: false
    }
  ],
  buttons: {
    submit: {
      text: 'Salva',
      classes: 'rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
    },
    cancel: {
      text: 'Annulla',
      href: '/ristorante-menu/cocktails',
      classes: 'rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
    }
  },
  getFormData: (data: FormDataSchema, isEdit: boolean = false, cocktail?: any, _formData?: any, isBulkEdit: boolean = false, selectedItems?: any[]): FormDataSchema => {
    return {
      ...data,
      formConfig: {
        ...data.formConfig,
        action: isBulkEdit 
          ? '/ristorante-menu/cocktails/modifica-massa/ajax'
          : isEdit 
            ? `/ristorante-menu/cocktails/modifica/${cocktail?.id}/ajax`
            : '/ristorante-menu/cocktails/nuovo/ajax',
        method: isBulkEdit ? 'POST' : 'POST',
        hiddenFields: isBulkEdit && selectedItems ? [
          {
            name: 'itemIds',
            value: selectedItems.map(item => item.id)
          }
        ] : undefined
      },
      fields: data.fields.map((field: FormField) => {
        let value: any = '';
        
        if (cocktail && field.name in cocktail) {
          if (field.name === 'tipologiaId') {
            value = cocktail.tipologia?.id || '';
          } else if (field.name === 'nazioneId') {
            value = cocktail.nazione?.id || '';
          } else {
            value = cocktail[field.name] || '';
          }
        } else if (!isEdit && !isBulkEdit && field.type === 'toggle' && field.defaultValue !== undefined) {
          // Per i nuovi elementi, usa il defaultValue se disponibile
          value = field.defaultValue;
        }
        
        // Per la modifica massiva, mostra solo i campi modificabili
        if (isBulkEdit && !field.bulkEditable) {
          return { ...field, value: '', skip: true };
        }
        
        // Per la modifica massiva, usa configurazione specifica
        if (isBulkEdit && field.bulkEditable) {
          let bulkValue = '';
          
          // Per i campi toggle/checkbox, gestisci gli stati misti
          if (field.type === 'toggle' && selectedItems && selectedItems.length > 0) {
            const values = selectedItems.map((item: any) => item[field.name]);
            const trueCount = values.filter(v => v === true || v === 'true' || v === 'on').length;
            const falseCount = values.filter(v => v === false || v === 'false' || v === 'off').length;
            
            if (trueCount === selectedItems.length) {
              // Tutti true
              bulkValue = 'true';
            } else if (falseCount === selectedItems.length) {
              // Tutti false
              bulkValue = 'false';
            } else {
              // Stato misto
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
      }).filter((field: any): field is FormField => field !== null && !field.skip),
      buttons: {
        ...data.buttons,
        submit: {
          ...data.buttons.submit,
          text: isBulkEdit 
            ? `Aggiorna ${selectedItems?.length || 0} cocktails` 
            : isEdit 
              ? 'Aggiorna' 
              : 'Salva'
        },
        cancel: {
          ...data.buttons.cancel,
          text: 'Annulla',
          href: isBulkEdit 
            ? '/ristorante-menu/cocktails' 
            : isEdit 
              ? `/ristorante-menu/cocktails/dettagli/${cocktail?.id}` 
              : '/ristorante-menu/cocktails'
        }
      }
    };
  }
};

export const bevandaFormData: FormDataSchema = {
  formConfig: {
    method: 'POST',
    action: '/ristorante-menu/bevande/nuovo/ajax', // Route AJAX
    id: 'bevandaForm',
    novalidate: true
  },
  fields: [
    {
      type: 'text',
      name: 'nome',
      id: 'nome',
      label: 'Nome Bevanda',
      required: true,
      placeholder: 'Coca Cola, Sprite, Acqua Naturale',
      errorMessage: 'Il nome della bevanda è obbligatorio',
      bulkEditable: false
    },
    {
      type: 'textarea',
      name: 'descrizione',
      id: 'descrizione',
      label: 'Descrizione',
      required: false,
      placeholder: 'Descrizione della bevanda (opzionale)',
      errorMessage: 'La descrizione non può superare i 500 caratteri',
      bulkEditable: false
    },
    {
      type: 'select',
      name: 'tipologiaId',
      id: 'tipologiaId',
      label: 'Tipologia',
      required: true,
      placeholder: 'Seleziona una tipologia',
      errorMessage: 'La tipologia è obbligatoria',
      bulkEditable: true,
      bulkLabel: 'Aggiorna tipologia per tutte le bevande selezionate',
      bulkPlaceholder: 'Seleziona nuova tipologia (opzionale)',
      bulkRequired: false,
      options: [] // Sarà popolato dinamicamente
    },
    {
      type: 'select',
      name: 'nazioneId',
      id: 'nazioneId',
      label: 'Nazione',
      required: false,
      placeholder: 'Seleziona una nazione (opzionale)',
      errorMessage: 'Seleziona una nazione valida',
      bulkEditable: true,
      bulkLabel: 'Aggiorna nazione per tutte le bevande selezionate',
      bulkPlaceholder: 'Seleziona nuova nazione (opzionale)',
      bulkRequired: false,
      options: [] // Sarà popolato dinamicamente
    },
    {
      type: 'number',
      name: 'prezzo',
      id: 'prezzo',
      label: 'Prezzo (€)',
      required: true,
      placeholder: '3.50',
      min: 0,
      step: 0.01,
      errorMessage: 'Il prezzo deve essere un numero valido maggiore di 0',
      bulkEditable: true,
      bulkLabel: 'Aggiorna prezzo per tutte le bevande selezionate',
      bulkPlaceholder: 'Nuovo prezzo (opzionale)',
      bulkRequired: false
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
      bulkLabel: 'Aggiorna visibilità per tutte le bevande selezionate',
      bulkRequired: false
    }
  ],
  buttons: {
    submit: {
      text: 'Salva',
      classes: 'rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
    },
    cancel: {
      text: 'Annulla',
      href: '/ristorante-menu/bevande',
      classes: 'rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
    }
  },
  getFormData: (data: FormDataSchema, isEdit: boolean = false, bevanda?: any, _formData?: any, isBulkEdit: boolean = false, selectedItems?: any[]): FormDataSchema => {
    return {
      ...data,
      formConfig: {
        ...data.formConfig,
        action: isBulkEdit 
          ? '/ristorante-menu/bevande/modifica-massa/ajax'
          : isEdit 
            ? `/ristorante-menu/bevande/modifica/${bevanda?.id}/ajax`
            : '/ristorante-menu/bevande/nuovo/ajax',
        method: isBulkEdit ? 'POST' : 'POST',
        hiddenFields: isBulkEdit && selectedItems ? [
          {
            name: 'itemIds',
            value: selectedItems.map(item => item.id)
          }
        ] : undefined
      },
      fields: data.fields.map((field: FormField) => {
        let value: any = '';
        
        if (bevanda && field.name in bevanda) {
          if (field.name === 'tipologiaId') {
            value = bevanda.tipologia?.id || '';
          } else if (field.name === 'nazioneId') {
            value = bevanda.nazione?.id || '';
          } else {
            value = bevanda[field.name] || '';
          }
        } else if (!isEdit && !isBulkEdit && field.type === 'toggle' && field.defaultValue !== undefined) {
          // Per i nuovi elementi, usa il defaultValue se disponibile
          value = field.defaultValue;
        }
        
        // Per la modifica massiva, mostra solo i campi modificabili
        if (isBulkEdit && !field.bulkEditable) {
          return { ...field, value: '', skip: true };
        }
        
        // Per la modifica massiva, usa configurazione specifica
        if (isBulkEdit && field.bulkEditable) {
          let bulkValue = '';
          
          // Per i campi toggle/checkbox, gestisci gli stati misti
          if (field.type === 'toggle' && selectedItems && selectedItems.length > 0) {
            const values = selectedItems.map((item: any) => item[field.name]);
            const trueCount = values.filter(v => v === true || v === 'true' || v === 'on').length;
            const falseCount = values.filter(v => v === false || v === 'false' || v === 'off').length;
            
            if (trueCount === selectedItems.length) {
              // Tutti true
              bulkValue = 'true';
            } else if (falseCount === selectedItems.length) {
              // Tutti false
              bulkValue = 'false';
            } else {
              // Stato misto
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
      }).filter((field: any): field is FormField => field !== null && !field.skip),
      buttons: {
        ...data.buttons,
        submit: {
          ...data.buttons.submit,
          text: isBulkEdit 
            ? `Aggiorna ${selectedItems?.length || 0} bevande` 
            : isEdit 
              ? 'Aggiorna' 
              : 'Salva'
        },
        cancel: {
          ...data.buttons.cancel,
          text: 'Annulla',
          href: isBulkEdit 
            ? '/ristorante-menu/bevande' 
            : isEdit 
              ? `/ristorante-menu/bevande/dettagli/${bevanda?.id}` 
              : '/ristorante-menu/bevande'
        }
      }
    };
  }
}; 