console.log('subSectionForm.js: Script caricato');

function initSubSectionForm() {
  // Cerca il form con pattern più specifici
  const form = document.querySelector('form[id*="Form"], form[action*="/nuovo"], form[action*="/modifica"]');
  
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
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSubSectionForm);
} else {
  initSubSectionForm();
}

// Funzione per creare un toggle HTML
function createToggleHTML(field) {
  const isChecked = field.value === true || field.value === 'true' || field.value === 'on';
  const toggleId = field.id || field.name;
  
  return `
    <div class="flex items-center justify-between gap-3">
      <div class="group relative inline-flex w-11 shrink-0 rounded-full bg-gray-200 p-0.5 inset-ring inset-ring-gray-900/5 outline-offset-2 outline-indigo-600 transition-colors duration-200 ease-in-out ${isChecked ? 'has-checked bg-indigo-600' : ''} focus-within:outline-2">
        <span class="size-5 rounded-full bg-white shadow-xs ring-1 ring-gray-900/5 transition-transform duration-200 ease-in-out ${isChecked ? 'translate-x-5' : ''}"></span>
        <input 
          id="${toggleId}" 
          type="checkbox" 
          name="${field.name}" 
          aria-labelledby="${toggleId}-label" 
          aria-describedby="${toggleId}-description" 
          class="absolute inset-0 appearance-none focus:outline-hidden"
          ${isChecked ? 'checked' : ''}
        />
      </div>

      <div class="text-sm">
        <label id="${toggleId}-label" class="font-medium text-gray-900">${field.label}</label>
        ${field.description ? `<span id="${toggleId}-description" class="text-gray-500">(${field.description})</span>` : ''}
      </div>
    </div>
  `;
} 