export interface FormConfig {
  method: string;
  action: string;
  id: string;
  novalidate?: boolean;
  enctype?: string;
  hiddenFields?: FormHiddenField[];
}

export interface FormHiddenField {
  name: string;
  value: string | string[];
}

export interface FormField {
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date' | 'datetime-local' | 'time' | 'select' | 'textarea' | 'checkbox' | 'radio' | 'toggle';
  name: string;
  id: string;
  label: string;
  description?: string;
  required?: boolean;
  placeholder?: string;
  value?: string | number | boolean;
  defaultValue?: boolean;
  errorMessage?: string;
  min?: number;
  max?: number;
  step?: number;
  pattern?: string;
  options?: FormOption[];
  // Proprietà per la modifica massiva
  bulkEditable?: boolean;
  bulkLabel?: string;
  bulkDescription?: string;
  bulkPlaceholder?: string;
  bulkHelpText?: string;
  bulkRequired?: boolean; // Se il campo è obbligatorio in modifica massiva
}

export interface FormOption {
  value: string | number;
  label: string;
}

export interface FormButtons {
  submit: {
    text: string;
    classes?: string;
  };
  cancel?: {
    text: string;
    href: string;
    classes?: string;
  };
}

export interface FormDataSchema {
  formConfig: FormConfig;
  fields: FormField[];
  buttons: FormButtons;
  getFormData?: (data: any, isEdit?: boolean, user?: any, formData?: any, isBulkEdit?: boolean, selectedItems?: any[]) => any;
  bulkEditConfig?: {
    title: string;
    description: string;
    action: string;
    method: string;
    endpoint: string;
    successMessage: string;
    errorMessage: string;
    requireAtLeastOneField?: boolean; // Se almeno un campo deve essere compilato
    allowPartialUpdates?: boolean; // Se permette aggiornamenti parziali
  };
} 