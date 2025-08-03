console.log('Bulk Edit Form Script caricato');

function initBulkEditForm() {
  // Cerca il form - può essere userForm o altri form con ID specifici
  const form = document.getElementById('userForm') || 
               document.getElementById('categoriaMenuFissoForm') ||
               document.getElementById('categoriaPiattiForm') ||
               document.getElementById('allergeneForm') ||
               document.querySelector('form[action*="/modifica-massa"]');
               
  if (!form) {
    return;
  }
  
  const submitButton = form.querySelector('button[type="submit"]');
  const selectFields = form.querySelectorAll('select');
  const toggleFields = form.querySelectorAll('input[type="checkbox"]');
  
  // Ottieni la configurazione dal form (se disponibile)
  const formConfig = window.formConfig || {};
  const bulkConfig = formConfig.bulkEditConfig || {};
  
  function validateForm() {
    let isValid = true;
    let hasAtLeastOneValue = false;
    
    // Controlla i select fields
    selectFields.forEach(select => {
      const field = select.closest('div').querySelector('label');
      const fieldName = field ? field.textContent.trim() : select.name;
      
      // Controlla se il campo è obbligatorio
      const isRequired = select.hasAttribute('required');
      
      if (isRequired && select.value === '') {
        isValid = false;
      }
      
      // Controlla se almeno un campo ha un valore
      if (select.value !== '') {
        hasAtLeastOneValue = true;
      }
    });
    
    // Controlla i toggle fields
    toggleFields.forEach(toggle => {
      // Per i toggle, consideriamo che abbiano sempre un valore (true/false)
      hasAtLeastOneValue = true;
    });
    
    // Se è richiesto almeno un campo, controlla che ce ne sia uno
    if (bulkConfig.requireAtLeastOneField && !hasAtLeastOneValue) {
      isValid = false;
    }
    
    return isValid;
  }
  
  function updateSubmitButton() {
    const isValid = validateForm();
    submitButton.disabled = !isValid;
    
    if (isValid) {
      submitButton.classList.remove('opacity-50', 'cursor-not-allowed');
      submitButton.classList.add('hover:bg-indigo-500');
    } else {
      submitButton.classList.add('opacity-50', 'cursor-not-allowed');
      submitButton.classList.remove('hover:bg-indigo-500');
    }
  }
  
  // Gestione toggle e checkbox a stati
  function initToggleAndStateCheckboxes() {
    toggleFields.forEach(toggle => {
      const container = toggle.closest('.toggle-container');
      if (!container) return;
      
      // Controlla se è un toggle box originale o un checkbox a stati
      const isStateCheckbox = toggle.classList.contains('opacity-0') && 
                             container.querySelector('.checkbox-visual');
      
      if (isStateCheckbox) {
        // Gestione checkbox a stati per modifica massiva con elemento visivo personalizzato
        const checkboxVisual = container.querySelector('.checkbox-visual');
        const checkboxIcon = container.querySelector('svg');
        const checkIcon = container.querySelector('.check-icon');
        const indeterminateIcon = container.querySelector('.indeterminate-icon');
        
        function updateCheckboxVisual() {
          if (toggle.hasAttribute('data-indeterminate') || toggle.indeterminate) {
            // Stato indeterminate
            checkboxVisual.classList.remove('bg-white', 'border-gray-300');
            checkboxVisual.classList.add('bg-indigo-600', 'border-indigo-600');
            checkIcon.style.display = 'none';
            indeterminateIcon.style.display = 'block';
            checkboxIcon.classList.remove('opacity-0');
            checkboxIcon.classList.add('opacity-100');
          } else if (toggle.checked) {
            // Stato checked
            checkboxVisual.classList.remove('bg-white', 'border-gray-300');
            checkboxVisual.classList.add('bg-indigo-600', 'border-indigo-600');
            checkIcon.style.display = 'block';
            indeterminateIcon.style.display = 'none';
            checkboxIcon.classList.remove('opacity-0');
            checkboxIcon.classList.add('opacity-100');
          } else {
            // Stato unchecked
            checkboxVisual.classList.remove('bg-indigo-600', 'border-indigo-600');
            checkboxVisual.classList.add('bg-white', 'border-gray-300');
            checkboxIcon.classList.remove('opacity-100');
            checkboxIcon.classList.add('opacity-0');
          }
        }
        
        // Inizializza lo stato
        if (toggle.hasAttribute('data-indeterminate')) {
          toggle.indeterminate = true;
          toggle.removeAttribute('data-indeterminate');
        }
        updateCheckboxVisual();
        
        function updateCheckboxState() {
          // Rimuovi lo stato indeterminate quando l'utente clicca
          if (toggle.indeterminate) {
            toggle.indeterminate = false;
            toggle.checked = true; // Passa da indeterminate a checked
          }
          updateCheckboxVisual();
        }
        
        // Aggiungi event listener
        toggle.addEventListener('change', () => {
          updateCheckboxState();
          updateSubmitButton();
        });
      } else {
        // Gestione toggle box originale
        const toggleElement = container.querySelector('.group');
        const toggleSpan = container.querySelector('span');
        
        function updateToggleState() {
          if (toggle.checked) {
            toggleElement.classList.add('has-checked', 'bg-indigo-600');
            toggleSpan.classList.add('translate-x-5');
          } else {
            toggleElement.classList.remove('has-checked', 'bg-indigo-600');
            toggleSpan.classList.remove('translate-x-5');
          }
        }
        
        // Inizializza lo stato
        updateToggleState();
        
        // Aggiungi event listener
        toggle.addEventListener('change', () => {
          updateToggleState();
          updateSubmitButton();
        });
      }
    });
  }
  
  updateSubmitButton();
  initToggleAndStateCheckboxes();
  
  // Event listeners per select fields
  selectFields.forEach(select => {
    select.addEventListener('change', () => {
      updateSubmitButton();
    });
  });
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      const message = bulkConfig.requireAtLeastOneField 
        ? 'Seleziona almeno un campo da modificare' 
        : 'Compila tutti i campi obbligatori';
      showMessage(message, 'error');
      return;
    }
    
    const data = {};
    
    // Raccogli solo i campi che hanno un valore
    selectFields.forEach(select => {
      if (select.value !== '') {
        data[select.name] = select.value;
      }
    });
    
    // Raccogli i toggle fields
    toggleFields.forEach(toggle => {
      data[toggle.name] = toggle.checked;
    });
    
    const urlParams = new URLSearchParams(window.location.search);
    const selectedIds = urlParams.get('ids');
    
    if (!selectedIds) {
      showMessage('Nessun elemento selezionato', 'error');
      return;
    }
    
    const itemIds = selectedIds.split(',').filter(id => id.trim() !== '');
    
    if (itemIds.length === 0) {
      showMessage('Nessun elemento valido selezionato', 'error');
      return;
    }
    
    data.itemIds = itemIds;
    
    try {
      submitButton.disabled = true;
      submitButton.textContent = 'Salvataggio...';
      
      // Determina l'endpoint in base al form
      let endpoint = form.action;
      if (!endpoint || endpoint === window.location.href) {
        // Fallback: determina l'endpoint dal path corrente
        const path = window.location.pathname;
        if (path.includes('/admin/utenti')) {
          endpoint = '/admin/utenti/modifica-massa';
        } else if (path.includes('/categoria-menu-fisso')) {
          endpoint = '/ristorante-menu/impostazioni/categoria-menu-fisso/modifica-massa';
        } else if (path.includes('/categoria-piatti')) {
          endpoint = '/ristorante-menu/impostazioni/categoria-piatti/modifica-massa';
        } else if (path.includes('/allergeni')) {
          endpoint = '/ristorante-menu/impostazioni/allergeni/modifica-massa';
        }
      }
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (result.success) {
        showMessage(result.message, 'success');
        
        setTimeout(() => {
          // Determina la pagina di ritorno
          const backUrl = new URLSearchParams(window.location.search).get('backUrl') || 
                         window.location.pathname.replace('/modifica-massa', '');
          window.location.href = backUrl;
        }, 2000);
      } else {
        showMessage(result.message, 'error');
        submitButton.disabled = false;
        submitButton.textContent = 'Salva modifiche';
      }
      
    } catch (error) {
      console.error('Errore durante l\'invio:', error);
      showMessage('Errore di connessione. Riprova.', 'error');
      
      submitButton.disabled = false;
      submitButton.textContent = 'Salva modifiche';
    }
  });
}

function showMessage(message, type) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${
    type === 'success' 
      ? 'bg-green-500 text-white' 
      : 'bg-red-500 text-white'
  }`;
  messageDiv.textContent = message;
  
  document.body.appendChild(messageDiv);
  
  setTimeout(() => {
    if (messageDiv.parentNode) {
      messageDiv.parentNode.removeChild(messageDiv);
    }
  }, 5000);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBulkEditForm);
} else {
  initBulkEditForm();
} 