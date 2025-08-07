console.log('userForm.js: Script caricato');

function initUserForm() {
  // Cerca il form utenti con pattern più flessibili
  const form = document.getElementById('userForm') || 
               document.querySelector('form[action*="/utenti"], form.user-form');
  
  if (!form) {
    return;
  }

  const inputs = form.querySelectorAll('input, select');
  
  const submitButton = form.querySelector('button[type="submit"]');

  if (!submitButton) return;

  // Funzione di validazione
  function validateForm(showErrors = false) {
    let isValid = true;

    inputs.forEach(input => {
      const fieldName = input.name;
      const fieldValue = input.value.trim();
      const errorElement = document.getElementById(`${input.id}-error`);
      
      // Nascondi sempre l'errore inizialmente
      if (errorElement) {
        errorElement.classList.add('hidden');
        input.classList.remove('outline-red-500');
      }
      
      // Validazione per campi vuoti
      if (!fieldValue) {
        isValid = false;
        
        if (showErrors && errorElement) {
          errorElement.classList.remove('hidden');
          input.classList.add('outline-red-500');
        }
        return;
      }
      
      // Validazione specifica per email
      if (input.type === 'email' && fieldValue) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(fieldValue)) {
          isValid = false;
          
          if (showErrors && errorElement) {
            errorElement.classList.remove('hidden');
            input.classList.add('outline-red-500');
          }
          return;
        }
      }
      
      // Validazione per password (solo se presente)
      if (input.type === 'password' && fieldValue) {
        if (fieldValue.length < 6) {
          isValid = false;
          
          if (showErrors && errorElement) {
            errorElement.classList.remove('hidden');
            input.classList.add('outline-red-500');
          }
          return;
        }
      }
      
      // Validazione per select (deve avere un valore selezionato)
      if (input.tagName === 'SELECT' && fieldValue === '') {
        isValid = false;
        
        if (showErrors && errorElement) {
          errorElement.classList.remove('hidden');
          input.classList.add('outline-red-500');
        }
        return;
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

  // Event listeners per tutti gli input
  inputs.forEach(input => {
    // Validazione silenziosa su input
    input.addEventListener('input', () => {
      validateForm(false);
    });
    
    // Validazione con errori su blur
    input.addEventListener('blur', () => {
      validateForm(true);
    });
  });

  // Validazione iniziale (silenziosa)
  validateForm(false);

  // Gestione submit del form con toast (solo validazione, non previene l'invio)
  form.addEventListener('submit', (e) => {
    if (!validateForm(true)) {
      e.preventDefault();
      if (window.showErrorToast) {
        window.showErrorToast('Compila tutti i campi obbligatori correttamente');
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
  document.addEventListener('DOMContentLoaded', initUserForm);
} else {
  initUserForm();
} 