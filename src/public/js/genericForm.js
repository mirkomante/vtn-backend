console.log('genericForm.js: Script caricato');

function initGenericForm() {
  // Cerca il form generico
  const form = document.querySelector('form');
  
  if (!form) {
    return;
  }

  // Trova i campi obbligatori
  const requiredFields = form.querySelectorAll('input[required], select[required], textarea[required]');
  
  const submitButton = form.querySelector('button[type="submit"]');

  if (!submitButton) return;

  // Funzione di validazione
  function validateForm(showErrors = false) {
    let isValid = true;

    requiredFields.forEach(field => {
      const fieldName = field.name;
      const fieldValue = field.value.trim();
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

    // Abilita/disabilita il bottone submit
    if (isValid) {
      submitButton.disabled = false;
      submitButton.classList.remove('opacity-50', 'cursor-not-allowed');
    } else {
      submitButton.disabled = true;
      submitButton.classList.add('opacity-50', 'cursor-not-allowed');
    }

    return isValid;
  }

  // Event listeners per i campi obbligatori
  requiredFields.forEach(field => {
    // Validazione silenziosa su input
    field.addEventListener('input', () => {
      validateForm(false);
    });
    
    // Validazione con errori su blur
    field.addEventListener('blur', () => {
      validateForm(true);
    });
  });

  // Validazione iniziale (silenziosa)
  validateForm(false);

  // Gestione toggle button
  const toggleFields = form.querySelectorAll('.toggle-container input[type="checkbox"]');
  
  toggleFields.forEach(toggle => {
    const container = toggle.closest('.toggle-container');
    if (!container) return;
    
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
      validateForm(false);
    });
  });

  // Gestione submit del form con toast (solo validazione, non previene l'invio)
  form.addEventListener('submit', (e) => {
    if (!validateForm(true)) {
      e.preventDefault();
      if (window.showErrorToast) {
        window.showErrorToast('Compila tutti i campi obbligatori');
      }
      return false;
    }
    
    // Se la validazione passa, lascia che il form venga inviato normalmente
    // Il server gestirà i messaggi di successo/errore
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Salvataggio...';
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGenericForm);
} else {
  initGenericForm();
}
