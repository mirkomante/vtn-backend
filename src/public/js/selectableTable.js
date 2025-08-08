console.log('selectableTable.js: Script caricato');

// Funzione di utilità per mostrare toast in modo coerente
function showToastLocal(message, type = 'info') {
  if (window.showToast) {
    window.showToast(message, type);
  } else if (window.toastManager) {
    window.toastManager.show(message, type);
  } else {
    console.warn(`Sistema toast non disponibile per messaggio ${type}:`, message);
  }
}

// Funzioni specifiche per tipo di toast
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

function showInfoToastLocal(message) {
  if (window.showInfoToast) {
    window.showInfoToast(message);
  } else if (window.toastManager) {
    window.toastManager.show(message, 'info');
  } else {
    console.warn('Sistema toast non disponibile per messaggio informativo:', message);
  }
}

function initializeSelectableTable(tableId, config) {
  const table = document.getElementById(tableId);
  if (!table) {
    return;
  }

  // Trova gli elementi della tabella
  const selectAllCheckbox = document.querySelector(`input[id='${tableId}-select-all']`);
  const itemCheckboxes = document.querySelectorAll(`input[name='${tableId}-item']`);
  const editMultipleBtn = document.getElementById(`${tableId}-editMultipleBtn`);
  
  // Trova tutti i bottoni di azione (supporto per bottoni multipli)
  const actionButtons = [];
  if (config.actionButtons && Array.isArray(config.actionButtons)) {
    config.actionButtons.forEach((_, index) => {
      const btn = document.getElementById(`${tableId}-actionBtn-${index}`);
      if (btn) actionButtons.push(btn);
    });
  } else {
    // Fallback per compatibilità
    const actionSelectedBtn = document.getElementById(`${tableId}-actionSelectedBtn`);
    if (actionSelectedBtn) actionButtons.push(actionSelectedBtn);
  }

  // Controlla se la tabella ha modifica massiva (ha bulkEditUrl)
  const hasBulkEdit = !!config.bulkEditUrl;
  // Controlla se la modifica singola è disponibile (ha editUrl)
  const hasSingleEdit = !!config.editUrl;

  // Controllo più flessibile: richiediamo solo selectAllCheckbox e almeno un bottone di azione
  if (!selectAllCheckbox || actionButtons.length === 0) {
    console.warn('selectableTable.js: Elementi richiesti non trovati', {
      selectAllCheckbox: !!selectAllCheckbox,
      actionButtonsCount: actionButtons.length,
      editMultipleBtn: !!editMultipleBtn
    });
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

    // Gestione del bottone di modifica (solo se esiste e se la modifica è disponibile)
    if (editMultipleBtn) {
      // Nascondi sempre il bottone se non ci sono URL di modifica configurati
      if (!hasBulkEdit && !hasSingleEdit) {
        editMultipleBtn.style.display = 'none';
      } else if (hasBulkEdit) {
        // Se è disponibile la modifica massiva, mostra il bottone quando ci sono elementi selezionati
        editMultipleBtn.style.display = hasCheckedItems ? 'inline-flex' : 'none';
        editMultipleBtn.disabled = !hasCheckedItems;
        
        if (hasCheckedItems) {
          if (checkedItems.length === 1) {
            editMultipleBtn.textContent = 'Modifica';
          } else {
            editMultipleBtn.textContent = `Modifica (${checkedItems.length})`;
          }
        } else {
          editMultipleBtn.textContent = 'Modifica';
        }
      } else if (hasSingleEdit) {
        // Se è disponibile solo la modifica singola, mostra il bottone solo per un singolo elemento
        if (hasCheckedItems && checkedItems.length === 1) {
          editMultipleBtn.style.display = 'inline-flex';
          editMultipleBtn.disabled = false;
          editMultipleBtn.textContent = 'Modifica';
        } else {
          editMultipleBtn.style.display = 'none';
        }
      }
    }
    
    // Aggiorna lo stato di tutti i bottoni di azione
    actionButtons.forEach(btn => {
      btn.disabled = !hasCheckedItems;
    });
  }

  // Funzione per gestire il click del bottone modifica (solo se esiste)
  function handleEditClick() {
    const checkedItems = document.querySelectorAll(`input[name='${tableId}-item']:checked`);
    if (checkedItems.length === 0) return;

    const itemIds = Array.from(checkedItems).map(cb => cb.value);
    
    // Se è selezionato solo 1 elemento, apri la pagina di modifica del singolo elemento
    if (checkedItems.length === 1) {
      if (!config.editUrl) {
        console.error('selectableTable.js: editUrl non configurato per la modifica singola');
        alert('Errore: URL di modifica singola non configurato');
        return;
      }
      
      const singleItemId = itemIds[0];
      let editUrl = config.editUrl;
      if (editUrl.includes(':id')) {
        editUrl = editUrl.replace(':id', singleItemId);
      } else {
        editUrl += `/${singleItemId}`;
      }
      window.location.href = editUrl;
    } else {
      // Altrimenti apri la pagina di modifica massiva (solo se bulkEdit è abilitato)
      if (!config.bulkEditUrl) {
        console.error('selectableTable.js: bulkEditUrl non configurato per la modifica massiva');
        alert('Errore: URL di modifica massiva non configurato');
        return;
      }
      
      const idsParam = itemIds.join(',');
      let bulkEditUrl = config.bulkEditUrl;
      if (bulkEditUrl.includes(':ids')) {
        bulkEditUrl = bulkEditUrl.replace(':ids', idsParam);
      } else {
        bulkEditUrl += `?ids=${idsParam}`;
      }
      window.location.href = bulkEditUrl;
    }
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

  // Event listener per il bottone di modifica (solo se esiste e se la modifica è disponibile)
  if (editMultipleBtn && (hasBulkEdit || hasSingleEdit)) {
    editMultipleBtn.addEventListener('click', handleEditClick);
  }

  // Event listeners per i bottoni di azione
  actionButtons.forEach((btn, index) => {
    btn.addEventListener('click', function() {
      const checkedItems = document.querySelectorAll(`input[name='${tableId}-item']:checked`);
      if (checkedItems.length === 0) return;

      const itemIds = Array.from(checkedItems).map(cb => cb.value);
      const count = checkedItems.length;
      
      // Determina quale configurazione di bottone usare
      let buttonConfig;
      if (config.actionButtons && Array.isArray(config.actionButtons)) {
        buttonConfig = config.actionButtons[index];
      } else {
        buttonConfig = config; // Fallback per compatibilità
      }
      
      // Messaggio di conferma
      const confirmMessage = count === 1 
        ? buttonConfig.confirmMessage 
        : buttonConfig.confirmMessageMultiple.replace('{count}', count);
      
      // Usa il sistema di conferma toast invece di confirm()
      showConfirmDialog(confirmMessage, () => {
        performBulkAction(itemIds, buttonConfig);
      });
    });
  });

  // Funzione per mostrare dialog di conferma con toast
  function showConfirmDialog(message, onConfirm) {
    // Crea un overlay per il dialog di conferma
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    overlay.id = 'confirm-overlay';
    
    // Determina il tipo di toast in base al messaggio
    const isDestructive = message.includes('ATTENZIONE') || message.includes('irreversibile');
    const toastType = isDestructive ? 'warning' : 'info';
    
    // Crea il dialog di conferma
    const dialog = document.createElement('div');
    dialog.className = 'bg-white rounded-lg shadow-xl p-6 max-w-md mx-4';
    dialog.innerHTML = `
      <div class="flex items-start">
        <div class="flex-shrink-0">
          ${isDestructive ? `
            <svg class="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          ` : `
            <svg class="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          `}
        </div>
        <div class="ml-3 w-0 flex-1">
          <h3 class="text-lg font-medium text-gray-900">
            ${isDestructive ? 'Conferma Azione' : 'Conferma'}
          </h3>
          <div class="mt-2">
            <p class="text-sm text-gray-500">${message}</p>
          </div>
        </div>
      </div>
      <div class="mt-4 flex justify-end space-x-3">
        <button type="button" id="confirm-cancel" class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
          Annulla
        </button>
        <button type="button" id="confirm-ok" class="inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${isDestructive ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'}">
          Conferma
        </button>
      </div>
    `;
    
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
    
    // Event listeners per i bottoni
    const cancelBtn = dialog.querySelector('#confirm-cancel');
    const confirmBtn = dialog.querySelector('#confirm-ok');
    
    const cleanup = () => {
      document.body.removeChild(overlay);
    };
    
    cancelBtn.addEventListener('click', cleanup);
    confirmBtn.addEventListener('click', () => {
      cleanup();
      onConfirm();
    });
    
    // Chiudi con ESC
    const handleKeydown = (e) => {
      if (e.key === 'Escape') {
        cleanup();
        document.removeEventListener('keydown', handleKeydown);
      }
    };
    document.addEventListener('keydown', handleKeydown);
    
    // Focus sul bottone di conferma
    setTimeout(() => confirmBtn.focus(), 100);
  }

  // Funzione per eseguire l'azione bulk (aggiornata per supportare configurazioni multiple)
  async function performBulkAction(itemIds, buttonConfig) {
    try {
      // Mostra indicatore di caricamento
      showInfoToastLocal('Esecuzione in corso...');
      
      // Disabilita temporaneamente i bottoni per evitare click multipli
      const allActionButtons = document.querySelectorAll(`#${tableId}-actionBtn-0, #${tableId}-actionBtn-1, #${tableId}-actionSelectedBtn`);
      allActionButtons.forEach(btn => {
        btn.disabled = true;
        btn.classList.add('opacity-50', 'cursor-not-allowed');
      });
      
      // Prepara i dati di base
      let requestData = { itemIds };
      
      // Gestione speciale per la tabella dei cancellati che ha bisogno di itemTypes
      if (config.tableId === 'deleted-items-table') {
        try {
          const itemTypes = [];
          itemIds.forEach(id => {
            const row = document.querySelector(`tr[data-item-id="${id}"]`);
            if (row) {
              const type = row.getAttribute('data-type');
              if (type) {
                itemTypes.push(type);
              } else {
                const cells = row.querySelectorAll('td');
                if (cells.length > 1) {
                  const typeCell = cells[1];
                  const typeText = typeCell.textContent.trim();
                  const typeMap = {
                    'Categoria Piatti': 'categoria-piatti',
                    'Categoria Menu Fisso': 'categoria-menu-fisso',
                    'Allergene': 'allergene',
                    'Piatto': 'piatto',
                    'Servizio Accessorio': 'servizio-accessorio',
                    'Menu Fisso': 'menu-fisso'
                  };
                  const mappedType = typeMap[typeText] || typeText;
                  itemTypes.push(mappedType);
                }
              }
            }
          });
          
          requestData.itemTypes = itemTypes;
        } catch (error) {
          console.error('selectableTable.js: Errore nel raccogliere i tipi:', error);
        }
      }
      
      const response = await fetch(buttonConfig.endpoint, {
        method: buttonConfig.method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify(requestData)
      });

      const result = await response.json();
      
      // Riabilita i bottoni
      allActionButtons.forEach(btn => {
        btn.disabled = false;
        btn.classList.remove('opacity-50', 'cursor-not-allowed');
      });
      
      if (result.success) {
        // Gestione avanzata dei placeholder nei messaggi di successo
        let successMessage = buttonConfig.successMessage;
        
        // Sostituisce {count} con il numero effettivo
        successMessage = successMessage.replace(/\{count\}/g, itemIds.length);
        
        // Valuta espressioni JavaScript nel formato {expression}
        successMessage = successMessage.replace(/\{([^}]+)\}/g, (match, expression) => {
          try {
            // Sostituisce 'count' con il valore effettivo nell'espressione
            const evaluatedExpression = expression.replace(/count/g, itemIds.length);
            return eval(evaluatedExpression);
          } catch (error) {
            console.warn('Errore nella valutazione dell\'espressione:', expression, error);
            return match; // Ritorna il placeholder originale se c'è un errore
          }
        });
        
        showSuccessToastLocal(successMessage);
        
        // Reload della pagina dopo un breve delay per permettere al toast di essere visto
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        const errorMessage = result.message || buttonConfig.errorMessage;
        showErrorToastLocal(errorMessage);
      }
    } catch (error) {
      console.error('selectableTable.js: Errore durante l\'azione bulk:', error);
      
      // Riabilita i bottoni in caso di errore
      const allActionButtons = document.querySelectorAll(`#${tableId}-actionBtn-0, #${tableId}-actionBtn-1, #${tableId}-actionSelectedBtn`);
      allActionButtons.forEach(btn => {
        btn.disabled = false;
        btn.classList.remove('opacity-50', 'cursor-not-allowed');
      });
      
      const errorMessage = buttonConfig.errorMessage || 'Si è verificato un errore durante l\'operazione';
      showErrorToastLocal(errorMessage);
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