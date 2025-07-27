console.log('Bulk Edit Form Script caricato');

function initBulkEditForm() {
  const form = document.getElementById('userForm');
  if (!form) {
    console.error('Form non trovato!');
    return;
  }
  
  const submitButton = form.querySelector('button[type="submit"]');
  const selectFields = form.querySelectorAll('select');
  
  // Ottieni la configurazione dal form (se disponibile)
  const formConfig = window.formConfig || {};
  const bulkConfig = formConfig.bulkEditConfig || {};
  
  function validateForm() {
    let isValid = true;
    let hasAtLeastOneValue = false;
    
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
  
  updateSubmitButton();
  
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
    
    const urlParams = new URLSearchParams(window.location.search);
    const selectedIds = urlParams.get('ids');
    
    if (!selectedIds) {
      showMessage('Nessun utente selezionato', 'error');
      return;
    }
    
    const itemIds = selectedIds.split(',').filter(id => id.trim() !== '');
    
    if (itemIds.length === 0) {
      showMessage('Nessun utente valido selezionato', 'error');
      return;
    }
    
    data.itemIds = itemIds;
    
    try {
      submitButton.disabled = true;
      submitButton.textContent = 'Salvataggio...';
      
      const response = await fetch('/admin/utenti/modifica-massa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (result.success) {
        showMessage(result.message, 'success');
        
        setTimeout(() => {
          window.location.href = '/admin/utenti';
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