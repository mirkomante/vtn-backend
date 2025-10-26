// === TOGGLE TABLE FUNCTIONALITY ===

// Funzione per chiamare l'endpoint toggle
async function toggleField(entity, id, field, value) {
  try {
    const response = await fetch(`/ristorante-menu/toggle/${entity}/${id}/ajax`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ field, value })
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Errore nella chiamata toggle:', error);
    return { 
      success: false, 
      message: 'Errore di connessione' 
    };
  }
}

// Funzione per gestire il click sui toggle button
function handleToggleClick(event) {
  const checkbox = event.target.closest('.toggle-switch-input');
  if (!checkbox) return;
  
  // Prevenire click multipli durante la richiesta
  if (checkbox.disabled) return;
  
  const entity = checkbox.dataset.entity;
  const id = checkbox.dataset.id;
  const field = checkbox.dataset.field;
  const currentValue = checkbox.dataset.currentValue === 'true';
  const newValue = !currentValue;
  
  // Trova il container del toggle per aggiornare le classi
  const toggleContainer = checkbox.closest('.toggle-switch-container');
  const toggleSlider = toggleContainer.querySelector('.toggle-switch-slider');
  
  // Disabilita il checkbox durante la richiesta
  checkbox.disabled = true;
  checkbox.style.opacity = '0.5';
  
  // Aggiorna immediatamente l'UI per feedback visivo
  if (newValue) {
    toggleContainer.classList.add('toggle-switch-active', 'bg-indigo-600');
    toggleContainer.classList.remove('bg-gray-200');
    toggleSlider.classList.add('toggle-switch-slider-active', 'translate-x-5');
    toggleSlider.classList.remove('translate-x-0');
    checkbox.checked = true;
  } else {
    toggleContainer.classList.add('bg-gray-200');
    toggleContainer.classList.remove('toggle-switch-active', 'bg-indigo-600');
    toggleSlider.classList.add('translate-x-0');
    toggleSlider.classList.remove('toggle-switch-slider-active', 'translate-x-5');
    checkbox.checked = false;
  }
  checkbox.dataset.currentValue = newValue.toString();
  
  // Chiama l'endpoint
  toggleField(entity, id, field, newValue)
    .then(result => {
      if (result.success) {
        // Successo: mantieni il nuovo stato
        showSuccessToastLocal(result.message || `${field} aggiornato con successo`);
      } else {
        // Errore: ripristina lo stato precedente
        if (currentValue) {
          toggleContainer.classList.add('toggle-switch-active', 'bg-indigo-600');
          toggleContainer.classList.remove('bg-gray-200');
          toggleSlider.classList.add('toggle-switch-slider-active', 'translate-x-5');
          toggleSlider.classList.remove('translate-x-0');
          checkbox.checked = true;
        } else {
          toggleContainer.classList.add('bg-gray-200');
          toggleContainer.classList.remove('toggle-switch-active', 'bg-indigo-600');
          toggleSlider.classList.add('translate-x-0');
          toggleSlider.classList.remove('toggle-switch-slider-active', 'translate-x-5');
          checkbox.checked = false;
        }
        checkbox.dataset.currentValue = currentValue.toString();
        showErrorToastLocal(result.message || 'Errore durante l\'aggiornamento');
      }
    })
    .catch(error => {
      // Errore di rete: ripristina lo stato precedente
      if (currentValue) {
        toggleContainer.classList.add('has-checked', 'bg-indigo-600');
        toggleContainer.classList.remove('bg-gray-200');
        toggleSlider.classList.add('translate-x-5');
        toggleSlider.classList.remove('translate-x-0');
        checkbox.checked = true;
      } else {
        toggleContainer.classList.add('bg-gray-200');
        toggleContainer.classList.remove('has-checked', 'bg-indigo-600');
        toggleSlider.classList.add('translate-x-0');
        toggleSlider.classList.remove('translate-x-5');
        checkbox.checked = false;
      }
      checkbox.dataset.currentValue = currentValue.toString();
      showErrorToastLocal('Errore di connessione');
      console.error('Errore toggle:', error);
    })
    .finally(() => {
      // Riabilita il checkbox
      checkbox.disabled = false;
      checkbox.style.opacity = '';
    });
}

// Funzione per inizializzare i toggle button in una tabella
function initializeToggleTable(tableId, config) {
  const table = document.getElementById(tableId);
  if (!table) {
    console.warn('toggleTable.js: Tabella non trovata:', tableId);
    return;
  }
  
  // Trova tutti i toggle button nella tabella
  const toggleButtons = table.querySelectorAll('.toggle-switch-input');
  
  if (toggleButtons.length === 0) {
    console.log('toggleTable.js: Nessun toggle button trovato in:', tableId);
    return;
  }
  
  console.log(`toggleTable.js: Inizializzati ${toggleButtons.length} toggle button in ${tableId}`);
  
  // Aggiungi event listener a tutti i toggle button
  toggleButtons.forEach(button => {
    button.addEventListener('click', handleToggleClick);
  });
}

// Funzione per inizializzare tutte le tabelle con toggle
function initializeToggleTables() {
  // Cerca tutte le tabelle con ID che terminano con '-table'
  const tables = document.querySelectorAll('table[id$="-table"]');
  
  tables.forEach(table => {
    const tableId = table.id;
    
    // Cerca la configurazione per questa tabella
    const configKey = tableId + '-config';
    const config = window[configKey];
    
    if (config && typeof config === 'object') {
      // Controlla se questa tabella ha toggle button
      const hasToggleButtons = table.querySelectorAll('.toggle-switch-input').length > 0;
      
      if (hasToggleButtons) {
        initializeToggleTable(tableId, config);
      }
    }
  });
  
  // Fallback: se non ci sono tabelle ma ci sono configurazioni, prova dopo un breve delay
  if (tables.length === 0) {
    const configKeys = Object.keys(window).filter(key => key.endsWith('-config'));
    
    if (configKeys.length > 0) {
      setTimeout(initializeToggleTables, 100);
    }
  }
  
  // Retry per tabelle che non hanno ancora configurazione
  const tablesWithoutConfig = Array.from(tables).filter(table => {
    const tableId = table.id;
    const config = window[tableId + '-config'];
    return !config;
  });
  
  if (tablesWithoutConfig.length > 0) {
    setTimeout(initializeToggleTables, 200);
  }
  
  // Fallback aggiuntivo: se ci sono tabelle ma non hanno configurazione, riprova dopo un delay più lungo
  setTimeout(() => {
    const allTables = document.querySelectorAll('table[id$="-table"]');
    allTables.forEach(table => {
      const tableId = table.id;
      const config = window[tableId + '-config'];
      if (config && typeof config === 'object') {
        // Se la configurazione è ora disponibile, inizializza la tabella
        const hasToggleButtons = table.querySelectorAll('.toggle-switch-input').length > 0;
        if (hasToggleButtons) {
          initializeToggleTable(tableId, config);
        }
      }
    });
  }, 500);
}

// Funzioni di utilità per toast (riutilizzate da selectableTable.js)
function showToastLocal(message, type = 'info') {
  if (window.showToast) {
    window.showToast(message, type);
  } else if (window.toastManager) {
    window.toastManager.show(message, type);
  } else {
    console.warn(`Sistema toast non disponibile per messaggio ${type}:`, message);
  }
}

function showSuccessToastLocal(message) {
  if (window.showSuccessToast) {
    window.showSuccessToast(message);
  } else if (window.toastManager) {
    window.toastManager.show(message, 'success');
  } else {
    console.warn('Sistema toast non disponibile per messaggio di successo:', message);
  }
}

function showErrorToastLocal(message) {
  if (window.showErrorToast) {
    window.showErrorToast(message);
  } else if (window.toastManager) {
    window.toastManager.show(message, 'error');
  } else {
    console.error('Sistema toast non disponibile per messaggio di errore:', message);
  }
}

// Inizializzazione quando il DOM è caricato
document.addEventListener('DOMContentLoaded', function() {
  // Inizializza le tabelle toggle dopo un breve delay per assicurarsi che selectableTable.js sia già caricato
  setTimeout(initializeToggleTables, 50);
});

// Esporta le funzioni per uso globale
window.toggleField = toggleField;
window.initializeToggleTable = initializeToggleTable;
window.initializeToggleTables = initializeToggleTables;
