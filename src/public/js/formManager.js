// Form Manager - Script unificato per la gestione dei form
class FormManager {
  constructor(options = {}) {
    this.options = {
      formSelector: 'form',
      requiredFieldSelector: 'input[required], select[required], textarea[required]',
      toggleSelector: '.toggle-container input[type="checkbox"]',
      checkboxSelector: 'input[type="checkbox"]:not(.toggle-container input)',
      radioSelector: 'input[type="radio"]',
      submitButtonSelector: 'button[type="submit"]',
      useAjax: true, // Uniforma tutto ad AJAX
      debug: true, // Abilita console.log per testing
      ...options
    };
    
    this.forms = new Map();
    this.init();
  }

  init() {
    const forms = document.querySelectorAll(this.options.formSelector);
    forms.forEach((form, index) => {
      this.registerForm(form);
    });
  }



  registerForm(form) {
    const formId = form.id;
    
    // Evita registrazioni duplicate
    if (this.forms.has(formId)) {
      return;
    }
    
    const formConfig = {
      element: form,
      requiredFields: form.querySelectorAll('input[required], select[required], textarea[required]'),
      toggleFields: form.querySelectorAll('.toggle-container input[type="checkbox"]'),
      checkboxFields: form.querySelectorAll('input[type="checkbox"]:not(.toggle-container input[type="checkbox"])'),
      radioFields: form.querySelectorAll('input[type="radio"]'),
      submitButton: form.querySelector('button[type="submit"]'),
      isValid: false,
      isBulkEdit: form.action.includes('/modifica-massa'),
      config: this.getFormConfig(form)
    };

    this.forms.set(formId, formConfig);
    this.setupForm(formId, formConfig);
  }

  getFormConfig(form) {
    const formId = form.id;
    if (window.formConfig) {
      return window.formConfig;
    }
    
    // Fallback: determina configurazione dal path
    const path = window.location.pathname;
    const action = form.action;
    
    if (action.includes('/modifica-massa')) {
      // Verifica se la modifica massiva è supportata per questa entità
      const entityType = this.getEntityTypeFromPath(path);
      const supportsBulkEdit = this.supportsBulkEdit(entityType);
      
      if (supportsBulkEdit) {
        return {
          requireAtLeastOneField: true,
          allowPartialUpdates: true
        };
      } else {
        console.warn('⚠️ FormManager: Modifica massiva non supportata per', entityType);
        return {
          requireAtLeastOneField: false,
          allowPartialUpdates: false
        };
      }
    }
    
    return {};
  }

  getEntityTypeFromPath(path) {
    if (path.includes('/admin/utenti')) return 'user';
    if (path.includes('/allergeni')) return 'allergene';
    if (path.includes('/categoria-menu-fisso')) return 'categoria-menu-fisso';
    if (path.includes('/categoria-piatti')) return 'categoria-piatti';
    return 'unknown';
  }

  supportsBulkEdit(entityType) {
    // Lista delle entità che supportano modifica massiva
    const supportedEntities = ['user', 'categoria-menu-fisso', 'categoria-piatti'];
    return supportedEntities.includes(entityType);
  }

  setupForm(formId, config) {
    // Validazione iniziale
    this.validateForm(formId);

    // Event listeners per campi obbligatori
    config.requiredFields.forEach(field => {
      field.addEventListener('input', () => {
        this.validateForm(formId, false);
      });
      field.addEventListener('blur', () => {
        this.validateForm(formId, true);
      });
    });

    // Event listeners per toggle
    config.toggleFields.forEach(toggle => {
      this.setupToggle(toggle);
      
      // Per i checkbox a 3 stati, non aggiungere event listener aggiuntivo
      // perché setupStateCheckbox già gestisce tutto
      const container = toggle.closest('.toggle-container');
      const isStateCheckbox = toggle.classList.contains('opacity-0') && 
                             container && container.querySelector('[data-checkbox-id]');
      
      if (!isStateCheckbox) {
        toggle.addEventListener('change', () => {
          this.updateToggleState(toggle);
          this.validateForm(formId, false);
        });
      }
    });

    // Event listeners per checkbox
    config.checkboxFields.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        this.validateForm(formId, false);
      });
    });

    // Event listeners per radio
    config.radioFields.forEach(radio => {
      radio.addEventListener('change', () => {
        this.validateForm(formId, false);
      });
    });

    // Event listener per submit
    config.element.addEventListener('submit', (e) => {
      this.handleSubmit(e, formId);
    });
  }

  setupToggle(toggle) {
    const container = toggle.closest('.toggle-container');
    if (!container) return;

    // Controlla se è un checkbox a stati (per bulk edit)
    const isStateCheckbox = toggle.classList.contains('opacity-0') && 
                           container.querySelector('[data-checkbox-id]');
    
    // Evita reinizializzazioni
    if (toggle.hasAttribute('data-form-manager-initialized')) {
      return;
    }
    
    if (isStateCheckbox) {
      this.setupStateCheckbox(toggle, container);
    } else {
      this.setupStandardToggle(toggle, container);
    }
    
    // Marca come inizializzato
    toggle.setAttribute('data-form-manager-initialized', 'true');
  }

  setupStateCheckbox(toggle, container) {
    // Per il checkbox a 3 stati, il toggle è invisibile (opacity-0)
    // Il div visivo ha data-checkbox-id
    const checkboxId = toggle.id;
    const checkboxVisual = container.querySelector(`[data-checkbox-id="${checkboxId}"]`);
    const checkboxIcon = container.querySelector(`#${checkboxId}-icon`);
    const checkIcon = container.querySelector('.check-icon');
    const indeterminateIcon = container.querySelector('.indeterminate-icon');
    
    if (!checkboxVisual) {
      console.error('🔧 FormManager: Checkbox visual non trovato per', checkboxId);
      return;
    }
    
    // Determina lo stato iniziale in base ai valori degli elementi selezionati
    this.initializeCheckboxState(toggle);
    
    const updateVisual = () => {
      if (toggle.indeterminate) {
        // Stato indeterminate
        checkboxVisual.classList.remove('bg-white', 'border-gray-300');
        checkboxVisual.classList.add('bg-indigo-600', 'border-indigo-600');
        if (checkIcon) checkIcon.style.display = 'none';
        if (indeterminateIcon) indeterminateIcon.style.display = 'block';
        if (checkboxIcon) {
          checkboxIcon.classList.remove('opacity-0');
          checkboxIcon.classList.add('opacity-100');
        }
      } else if (toggle.checked) {
        // Stato checked
        checkboxVisual.classList.remove('bg-white', 'border-gray-300');
        checkboxVisual.classList.add('bg-indigo-600', 'border-indigo-600');
        if (checkIcon) checkIcon.style.display = 'block';
        if (indeterminateIcon) indeterminateIcon.style.display = 'none';
        if (checkboxIcon) {
          checkboxIcon.classList.remove('opacity-0');
          checkboxIcon.classList.add('opacity-100');
        }
      } else {
        // Stato unchecked
        checkboxVisual.classList.remove('bg-indigo-600', 'border-indigo-600');
        checkboxVisual.classList.add('bg-white', 'border-gray-300');
        if (checkboxIcon) {
          checkboxIcon.classList.remove('opacity-100');
          checkboxIcon.classList.add('opacity-0');
        }
      }
    };
    
    // Inizializza lo stato
    if (toggle.hasAttribute('data-indeterminate')) {
      toggle.indeterminate = true;
      toggle.removeAttribute('data-indeterminate');
    }
    updateVisual();
    
    // Aggiungi event listener al checkbox (anche se invisibile)
    toggle.addEventListener('change', () => {
      // Rimuovi lo stato indeterminate quando l'utente clicca
      if (toggle.indeterminate) {
        toggle.indeterminate = false;
        toggle.checked = true; // Passa da indeterminate a checked
      }
      updateVisual();
      
      // Trigger validazione
      const formId = toggle.closest('form').id;
      this.validateForm(formId, false);
    });
    
    // Aggiungi event listener al div visivo per gestire i click
    checkboxVisual.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      // Toggle lo stato del checkbox
      if (toggle.indeterminate) {
        toggle.indeterminate = false;
        toggle.checked = true;
      } else {
        toggle.checked = !toggle.checked;
      }
      
      // Trigger l'evento change manualmente
      toggle.dispatchEvent(new Event('change'));
    });
    
    // Aggiungi event listener anche alla label per maggiore usabilità
    const label = container.querySelector(`#${checkboxId}-label`);
    if (label) {
      label.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Toggle lo stato del checkbox
        if (toggle.indeterminate) {
          toggle.indeterminate = false;
          toggle.checked = true;
        } else {
          toggle.checked = !toggle.checked;
        }
        
        // Trigger l'evento change manualmente
        toggle.dispatchEvent(new Event('change'));
      });
    }
  }

  initializeCheckboxState(toggle) {
    // Ottieni i dati dal form
    const form = toggle.closest('form');
    const selectedItemsData = this.getSelectedItemsData(form);
    
    if (selectedItemsData.length === 0) {
      console.warn('⚠️ FormManager: Nessun elemento selezionato trovato');
      return;
    }
    
    // Determina lo stato in base ai valori del campo
    const fieldName = toggle.name;
    const values = selectedItemsData.map(item => item[fieldName]);
    
    const allTrue = values.every(value => value === true || value === 'true' || value === 'on' || value === 1);
    const allFalse = values.every(value => value === false || value === 'false' || value === 'off' || value === 0 || value === null || value === undefined || value === '');
    
    if (allTrue) {
      // Tutti gli elementi sono true
      toggle.checked = true;
      toggle.indeterminate = false;
    } else if (allFalse) {
      // Tutti gli elementi sono false
      toggle.checked = false;
      toggle.indeterminate = false;
    } else {
      // Valori misti - stato indeterminate
      toggle.checked = false;
      toggle.indeterminate = true;
    }
  }

  getSelectedItemsData(form) {
    try {
      const dataAttribute = form.getAttribute('data-selected-items');
      if (dataAttribute) {
        return JSON.parse(dataAttribute);
      }
    } catch (error) {
      console.error('🔧 FormManager: Errore nel parsing dei dati selezionati', error);
    }
    return [];
  }

  setupStandardToggle(toggle, container) {
    const toggleElement = container.querySelector('.group');
    const toggleSpan = container.querySelector('span');
    
    const updateState = () => {
      if (toggle.checked) {
        toggleElement.classList.add('has-checked', 'bg-indigo-600');
        toggleSpan.classList.add('translate-x-5');
      } else {
        toggleElement.classList.remove('has-checked', 'bg-indigo-600');
        toggleSpan.classList.remove('translate-x-5');
      }
    };

    updateState();
  }

  updateToggleState(toggle) {
    const container = toggle.closest('.toggle-container');
    if (!container) return;

    const isStateCheckbox = toggle.classList.contains('opacity-0') && 
                           container.querySelector('.checkbox-visual');
    
    if (isStateCheckbox) {
      this.setupStateCheckbox(toggle, container);
    } else {
      this.setupStandardToggle(toggle, container);
    }
  }

  validateForm(formId, showErrors = false) {
    const config = this.forms.get(formId);
    if (!config) return false;

    let isValid = true;
    let hasAtLeastOneValue = false;

    // Per bulk edit, controlla solo i campi modificabili
    if (config.isBulkEdit) {
      // Controlla i campi obbligatori
      config.requiredFields.forEach(field => {
        const fieldValue = this.getFieldValue(field);
        const errorElement = document.getElementById(`${field.id}-error`);
        
        if (field.required && !fieldValue) {
          isValid = false;
          if (showErrors && errorElement) {
            errorElement.classList.remove('hidden');
            field.classList.add('outline-red-500');
          }
        } else {
          if (errorElement) {
            errorElement.classList.add('hidden');
            field.classList.remove('outline-red-500');
          }
        }
        
        // Controlla se almeno un campo ha un valore
        if (fieldValue !== '' && fieldValue !== false && fieldValue !== null && fieldValue !== undefined) {
          hasAtLeastOneValue = true;
        }
      });

      // Controlla i toggle fields
      config.toggleFields.forEach(toggle => {
        const toggleValue = this.getFieldValue(toggle);
        
        // Per i toggle, consideriamo che abbiano sempre un valore se non sono indeterminate
        if (toggleValue !== null) {
          hasAtLeastOneValue = true;
        }
      });

      // Se è richiesto almeno un campo, controlla che ce ne sia uno
      if (config.config.requireAtLeastOneField && !hasAtLeastOneValue) {
        isValid = false;
      }
    } else {
      // Validazione normale per form non bulk
      config.requiredFields.forEach(field => {
        const fieldValue = this.getFieldValue(field);
        const errorElement = document.getElementById(`${field.id}-error`);
        
        if (!fieldValue) {
          isValid = false;
          if (showErrors && errorElement) {
            errorElement.classList.remove('hidden');
            field.classList.add('outline-red-500');
          }
        } else {
          if (errorElement) {
            errorElement.classList.add('hidden');
            field.classList.remove('outline-red-500');
          }
        }
      });
    }

    // Aggiorna stato del bottone
    this.updateSubmitButton(formId, isValid);
    config.isValid = isValid;

    return isValid;
  }

  getFieldValue(field) {
    if (field.type === 'checkbox') {
      // Per checkbox a 3 stati, se è indeterminate non includere il campo
      if (field.indeterminate) {
        return null; // Non includere il campo nei dati
      }
      return field.checked;
    }
    return field.value;
  }

  updateSubmitButton(formId, isValid) {
    const config = this.forms.get(formId);
    if (!config || !config.submitButton) return;

    if (isValid) {
      config.submitButton.disabled = false;
      config.submitButton.classList.remove('opacity-50', 'cursor-not-allowed');
      config.submitButton.classList.add('hover:bg-indigo-500');
    } else {
      config.submitButton.disabled = true;
      config.submitButton.classList.add('opacity-50', 'cursor-not-allowed');
      config.submitButton.classList.remove('hover:bg-indigo-500');
    }
  }

  async handleSubmit(event, formId) {
    const config = this.forms.get(formId);
    if (!config) return;

    if (!this.validateForm(formId, true)) {
      event.preventDefault();
      const message = config.isBulkEdit && config.config.requireAtLeastOneField
        ? 'Seleziona almeno un campo da modificare' 
        : 'Compila tutti i campi obbligatori';
      
      this.showToast(message, 'error');
      return false;
    }

    // Se AJAX è abilitato, gestisci tutto via AJAX
    if (this.options.useAjax) {
      event.preventDefault();
      await this.handleAjaxSubmit(config);
    } else {
      // Fallback: disabilita il bottone e lascia che il form si invii
      if (config.submitButton) {
        config.submitButton.disabled = true;
        config.submitButton.textContent = 'Salvataggio...';
      }
    }
  }

  async handleAjaxSubmit(config) {
    const data = this.collectFormData(config);
    
    try {
      config.submitButton.disabled = true;
      config.submitButton.textContent = 'Salvataggio...';

      const response = await fetch(config.element.action, {
        method: config.element.method || 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.success) {
        const message = result.message || 'Operazione completata con successo';
        this.showToast(message, 'success');
        
        // Redirect dopo un breve delay
        setTimeout(() => {
          const backUrl = this.getBackUrl(config);
          window.location.href = backUrl;
        }, 2000);
      } else {
        const message = result.message || 'Si è verificato un errore';
        this.showToast(message, 'error');
        config.submitButton.disabled = false;
        config.submitButton.textContent = this.getSubmitButtonText(config);
      }

    } catch (error) {
      console.error('🔧 FormManager: Errore durante l\'invio AJAX', error);
      this.showToast('Errore di connessione. Riprova.', 'error');
      
      config.submitButton.disabled = false;
      config.submitButton.textContent = this.getSubmitButtonText(config);
    }
  }

  collectFormData(config) {
    const data = {};
    
    // Raccogli TUTTI i campi del form, non solo quelli trovati dai selettori
    const allFormFields = config.element.querySelectorAll('input, select, textarea');
    
    allFormFields.forEach(field => {
      // Salta i campi nascosti di sistema o campi senza nome
      if (!field.name || field.type === 'hidden' && field.name === '_method') {
        return;
      }
      
      // Per bulk edit, verifica se il campo è modificabile
      if (config.isBulkEdit) {
        // Controlla se il campo ha l'attributo data-bulk-editable
        const isBulkEditable = field.hasAttribute('data-bulk-editable') || 
                              field.getAttribute('data-bulk-editable') === 'true';
        
        if (!isBulkEditable) {
          return;
        }
      }
      
      const value = this.getFieldValue(field);
      
      // Per bulk edit, raccogli solo campi con valori (includendo false per checkbox)
      if (config.isBulkEdit && config.config.allowPartialUpdates) {
        if (value !== '' && value !== null && value !== undefined) {
          data[field.name] = value;
        }
      } else {
        // Per form normali, includi tutti i campi tranne quelli null
        if (value !== null) {
          data[field.name] = value;
        }
      }
    });

    // Per bulk edit, aggiungi gli ID degli elementi selezionati
    if (config.isBulkEdit) {
      const urlParams = new URLSearchParams(window.location.search);
      const selectedIds = urlParams.get('ids');
      
      if (selectedIds) {
        const itemIds = selectedIds.split(',').filter(id => id.trim() !== '');
        if (itemIds.length > 0) {
          data.itemIds = itemIds;
        }
      }
    }

    return data;
  }

  getBackUrl(config) {
    // Determina l'URL di ritorno
    const urlParams = new URLSearchParams(window.location.search);
    const backUrl = urlParams.get('backUrl');
    
    if (backUrl) {
      return backUrl;
    }
    
    // Fallback: determina dall'action del form
    const action = config.element.action;
    let redirectUrl = '/';
    
    // Rimuovi /ajax dall'action per ottenere la route canonica
    const canonicalAction = action.replace('/ajax', '');
    
    if (canonicalAction.includes('/modifica-massa')) {
      redirectUrl = canonicalAction.replace('/modifica-massa', '');
    } else if (canonicalAction.includes('/modifica/')) {
      redirectUrl = canonicalAction.replace('/modifica/', '/dettagli/');
    } else if (canonicalAction.includes('/nuovo')) {
      redirectUrl = canonicalAction.replace('/nuovo', '');
    }
    
    return redirectUrl;
  }

  getSubmitButtonText(config) {
    if (config.isBulkEdit) {
      return 'Salva modifiche';
    } else if (config.element.action.includes('/modifica/')) {
      return 'Aggiorna';
    } else {
      return 'Salva';
    }
  }

  showToast(message, type = 'info') {
    
    if (window.showToast) {
      window.showToast(message, type);
    } else if (window.toastManager) {
      window.toastManager.show(message, type);
    } else {
      // Fallback
      console.warn('🔧 FormManager: Sistema toast non disponibile, uso alert');
      alert(message);
    }
  }

  // Metodi pubblici per integrazione esterna
  validateFormById(formId, showErrors = false) {
    return this.validateForm(formId, showErrors);
  }

  submitFormById(formId) {
    const config = this.forms.get(formId);
    if (config) {
      return this.handleAjaxSubmit(config);
    }
  }

  getFormData(formId) {
    const config = this.forms.get(formId);
    if (config) {
      return this.collectFormData(config);
    }
    return {};
  }
}

// Inizializzazione
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.formManager = new FormManager();
  });
} else {
  window.formManager = new FormManager();
}
