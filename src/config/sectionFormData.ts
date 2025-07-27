import { FormDataSchema } from "./sectionFormSchema";

export const userFormData: FormDataSchema = {
  formConfig: {
    method: 'POST',
    action: '/admin/utenti/nuovo',
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
    action: '/admin/utenti/modifica-massa',
    method: 'POST',
    endpoint: '/admin/utenti/modifica-massa',
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
            ? `/admin/utenti/modifica/${user?.id}` 
            : '/admin/utenti/nuovo',
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