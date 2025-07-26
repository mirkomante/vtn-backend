console.log('Test iniziale - Script caricato');

// Test immediato per verificare che il DOM sia caricato
if (document.readyState === 'loading') {
  console.log('DOM ancora in caricamento');
} else {
  console.log('DOM già caricato');
}

// Funzione di inizializzazione
function initForm() {
  console.log('Inizializzazione form');
  
  const form = document.getElementById('userForm');
  if (!form) {
    console.error('Form non trovato!');
    return;
  }
  
  const submitButton = form.querySelector('button[type="submit"]');
  const inputs = form.querySelectorAll('input, select');
  
  console.log('Elementi form trovati:', {
    form: form,
    submitButton: submitButton,
    inputs: inputs.length
  });
  
  // Regex per la validazione
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  function showError(field, errorIcon, errorMessage) {
    console.log('showError chiamato per:', field.id);
    
    // Rimuovi le classi normali
    field.classList.remove('text-gray-900', 'outline-gray-300', 'focus:outline-indigo-600');
    // Aggiungi le classi di errore
    field.classList.add('text-red-900', 'outline-red-300', 'focus:outline-red-600');
    // Mostra l'icona di errore
    errorIcon.classList.remove('hidden');
    // Mostra il messaggio di errore
    errorMessage.style.display = 'block';
  }

  function hideError(field, errorIcon, errorMessage) {
    console.log('hideError chiamato per:', field.id);
    
    // Rimuovi le classi di errore
    field.classList.remove('text-red-900', 'outline-red-300', 'focus:outline-red-600');
    // Aggiungi le classi normali
    field.classList.add('text-gray-900', 'outline-gray-300', 'focus:outline-indigo-600');
    // Nascondi l'icona di errore
    errorIcon.classList.add('hidden');
    // Nascondi il messaggio di errore
    errorMessage.style.display = 'none';
  }

  function validateField(field, showErrorMessage = false) {
    console.log('validateField chiamato per:', field.id);
    
    const errorIcon = field.parentElement.querySelector('svg');
    const errorMessage = document.getElementById(`${field.id}-error`);
    
    let isValid = true;

    // Reset dello stile
    hideError(field, errorIcon, errorMessage);

    // Validazione campo vuoto
    if (field.required && !field.value.trim()) {
      console.log('Campo vuoto:', field.id);
      isValid = false;
    }

    // Validazione specifica per email
    if (field.type === 'email' && field.value) {
      if (!emailRegex.test(field.value)) {
        console.log('Email non valida:', field.value);
        isValid = false;
      }
    }

    // Validazione specifica per password
    if (field.type === 'password' && field.value) {
      if (!passwordRegex.test(field.value)) {
        console.log('Password non valida');
        isValid = false;
      }
    }

    // Validazione specifica per select
    if (field.tagName === 'SELECT' && field.required) {
      if (!field.value) {
        console.log('Select non valido:', field.id);
        isValid = false;
      }
    }

    // Applica stile di errore se non valido e se dobbiamo mostrare il messaggio
    if (!isValid && showErrorMessage) {
      console.log('Mostro errore per:', field.id);
      showError(field, errorIcon, errorMessage);
    }

    return isValid;
  }

  function validateForm(showErrors = false) {
    console.log('validateForm chiamato, showErrors:', showErrors);
    
    let isValid = true;
    inputs.forEach(input => {
      if (!validateField(input, showErrors)) {
        isValid = false;
      }
    });
    
    submitButton.disabled = !isValid;
  }

  // Aggiungi event listeners
  inputs.forEach(input => {
    console.log('Aggiungo event listeners per:', input.id);
    
    // Validazione durante la digitazione (senza mostrare errori)
    input.addEventListener('input', () => {
      console.log('Evento input su:', input.id);
      validateForm(false);
    });
    
    // Validazione al blur (mostrando errori)
    input.addEventListener('blur', () => {
      console.log('Evento blur su:', input.id);
      validateField(input, true);
      validateForm(true);
    });

    // Validazione al change per il select
    if (input.tagName === 'SELECT') {
      input.addEventListener('change', () => {
        console.log('Evento change su select:', input.id);
        validateField(input, true);
        validateForm(true);
      });
    }
  });

  // Validazione iniziale
  validateForm(false);

  // Previeni il submit se il form non è valido
  form.addEventListener('submit', function(e) {
    console.log('Tentativo di submit form');
    validateForm(true);
    if (submitButton.disabled) {
      console.log('Submit prevenuto - form non valido');
      e.preventDefault();
    }
  });
}

// Prova a inizializzare immediatamente
initForm();

// E anche quando il DOM è pronto
document.addEventListener('DOMContentLoaded', initForm); 