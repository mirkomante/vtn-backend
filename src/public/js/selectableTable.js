console.log('selectableTable.js: Script caricato');

function initializeSelectableTable(tableId, config) {
  const table = document.getElementById(tableId);
  if (!table) {
    return;
  }

  // Trova gli elementi della tabella
  const selectAllCheckbox = document.querySelector(`input[id='${tableId}-select-all']`);
  const itemCheckboxes = document.querySelectorAll(`input[name='${tableId}-item']`);
  const editMultipleBtn = document.getElementById(`${tableId}-editMultipleBtn`);
  const actionSelectedBtn = document.getElementById(`${tableId}-actionSelectedBtn`);

  // Controlla se la tabella ha modifica massiva (ha editMultipleBtn)
  const hasBulkEdit = !!editMultipleBtn;

  if (!selectAllCheckbox || !actionSelectedBtn) {
    return;
  }

  // Funzione per aggiornare lo stato dei bottoni
  function updateButtonStates() {
    const checkedItems = document.querySelectorAll(`input[name='${tableId}-item']:checked`);
    const hasCheckedItems = checkedItems.length > 0;
    const allChecked = checkedItems.length === itemCheckboxes.length && itemCheckboxes.length > 0;

    // Aggiorna lo stato del checkbox "seleziona tutto"
    selectAllCheckbox.checked = allChecked;
    selectAllCheckbox.indeterminate = hasCheckedItems && !allChecked;

    // Abilita/disabilita i bottoni
    if (hasBulkEdit) {
      editMultipleBtn.disabled = !hasCheckedItems;
    }
    actionSelectedBtn.disabled = !hasCheckedItems;
  }

  // Event listener per il checkbox "seleziona tutto"
  selectAllCheckbox.addEventListener('change', function() {
    itemCheckboxes.forEach(checkbox => {
      checkbox.checked = this.checked;
    });
    updateButtonStates();
  });

  // Event listeners per i checkbox individuali
  itemCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      updateButtonStates();
    });
  });

  // Event listener per il bottone di modifica multipla
  if (hasBulkEdit) {
    editMultipleBtn.addEventListener('click', function() {
      const checkedItems = document.querySelectorAll(`input[name='${tableId}-item']:checked`);
      if (checkedItems.length === 0) return;

      const itemIds = Array.from(checkedItems).map(cb => cb.value);
      const idsParam = itemIds.join(',');
      
      // Costruisci l'URL di modifica massiva
      let bulkEditUrl = config.bulkEditUrl;
      if (bulkEditUrl.includes(':ids')) {
        bulkEditUrl = bulkEditUrl.replace(':ids', idsParam);
      } else {
        bulkEditUrl += `?ids=${idsParam}`;
      }
      
      window.location.href = bulkEditUrl;
    });
  }

  // Event listener per il bottone di azione (elimina)
  actionSelectedBtn.addEventListener('click', function() {
    const checkedItems = document.querySelectorAll(`input[name='${tableId}-item']:checked`);
    if (checkedItems.length === 0) return;

    const itemIds = Array.from(checkedItems).map(cb => cb.value);
    const count = checkedItems.length;
    
    // Messaggio di conferma
    const confirmMessage = count === 1 
      ? config.confirmMessage 
      : config.confirmMessageMultiple.replace('{count}', count);
    
    if (!confirm(confirmMessage)) {
      return;
    }

    // Esegui l'azione
    performBulkAction(itemIds, config);
  });

  // Funzione per eseguire l'azione bulk
  async function performBulkAction(itemIds, config) {
    try {
      const response = await fetch(config.endpoint, {
        method: config.method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({ itemIds })
      });

      const result = await response.json();
      
      if (result.success) {
        const successMessage = config.successMessage.replace('{count}', itemIds.length);
        alert(successMessage);
        window.location.reload();
      } else {
        alert(result.message || config.errorMessage);
      }
    } catch (error) {
      console.error('selectableTable.js: Errore durante l\'azione bulk:', error);
      alert(config.errorMessage);
    }
  }

  // Inizializza lo stato
  updateButtonStates();
}

// Inizializzazione quando il DOM è caricato
document.addEventListener('DOMContentLoaded', function() {
  // Cerca tutte le tabelle con ID che terminano con '-table'
  const tables = document.querySelectorAll('table[id$="-table"]');
  
  tables.forEach(table => {
    const tableId = table.id;
    
    // Cerca la configurazione per questa tabella
    const configKey = tableId + '-config';
    const config = window[configKey];
    
    if (config) {
      initializeSelectableTable(tableId, config);
    }
  });
  
  // Fallback: se non ci sono tabelle ma ci sono configurazioni, prova dopo un breve delay
  if (tables.length === 0) {
    const configKeys = Object.keys(window).filter(key => key.endsWith('-config'));
    
    if (configKeys.length > 0) {
      setTimeout(() => {
        const retryTables = document.querySelectorAll('table[id$="-table"]');
        retryTables.forEach(table => {
          const tableId = table.id;
          const config = window[tableId + '-config'];
          if (config) {
            initializeSelectableTable(tableId, config);
          }
        });
      }, 100);
    }
  }
}); 