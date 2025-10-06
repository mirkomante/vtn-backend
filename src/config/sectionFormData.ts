import { FormDataSchema } from "./sectionFormSchema";

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
  getFormData: (data: any, isEdit: boolean = false, user?: any, formData?: any, isBulkEdit: boolean = false, selectedItems?: any[]) => {
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
      fields: data.fields.map((field: any) => {
        let value = '';
        
        // Determina il valore del campo
        if (formData && formData[field.name]) {
          value = formData[field.name];
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
          return null;
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
      }).filter(field => field !== null),
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
      name: 'inLista',
      id: 'inLista',
      label: 'Visibile nel menu',
      required: false,
      value: true,
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
  getFormData: (data: FormDataSchema, isEdit: boolean = false, piatto?: any, formData?: any, isBulkEdit: boolean = false, selectedItems?: any[]): FormDataSchema => {
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
      fields: data.fields.map(field => {
        let value = '';
        
        if (piatto && field.name in piatto) {
          if (field.name === 'allergeni') {
            // Per gli allergeni, prendiamo gli ID degli allergeni associati
            value = piatto.allergeni?.map((pa: any) => pa.allergene.id) || [];
          } else {
            value = piatto[field.name] || '';
          }
        }
        
        // Per la modifica massiva, mostra solo i campi modificabili
        if (isBulkEdit && !field.bulkEditable) {
          return null;
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
      }).filter(field => field !== null),
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
      bulkEditable: true,
      bulkLabel: 'Aggiorna capacità per tutti i vini selezionati',
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
  getFormData: (data: FormDataSchema, isEdit: boolean = false, vino?: any, formData?: any, isBulkEdit: boolean = false, selectedItems?: any[]): FormDataSchema => {
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
      fields: data.fields.map(field => {
        let value = '';
        
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
        }
        
        // Per la modifica massiva, mostra solo i campi modificabili
        if (isBulkEdit && !field.bulkEditable) {
          return null;
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
      }).filter(field => field !== null),
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
  getFormData: (data: FormDataSchema, isEdit: boolean = false, birra?: any, formData?: any, isBulkEdit: boolean = false, selectedItems?: any[]): FormDataSchema => {
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
      fields: data.fields.map(field => {
        let value = '';
        
        if (birra && field.name in birra) {
          if (field.name === 'tipologiaId') {
            value = birra.tipologia?.id || '';
          } else if (field.name === 'nazioneId') {
            value = birra.nazione?.id || '';
          } else {
            value = birra[field.name] || '';
          }
        }
        
        // Per la modifica massiva, mostra solo i campi modificabili
        if (isBulkEdit && !field.bulkEditable) {
          return null;
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
      }).filter(field => field !== null),
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