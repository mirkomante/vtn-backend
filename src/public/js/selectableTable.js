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
      
      if (!confirm(confirmMessage)) {
        return;
      }

      // Esegui l'azione con la configurazione del bottone specifico
      performBulkAction(itemIds, buttonConfig);
    });
  });

  // Funzione per eseguire l'azione bulk (aggiornata per supportare configurazioni multiple)
  async function performBulkAction(itemIds, buttonConfig) {
    try {
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
      
      if (result.success) {
        const successMessage = buttonConfig.successMessage.replace('{count}', itemIds.length);
        if (window.showSuccessToast) {
          window.showSuccessToast(successMessage);
        } else {
          alert(successMessage);
        }
        window.location.reload();
      } else {
        const errorMessage = result.message || buttonConfig.errorMessage;
        if (window.showErrorToast) {
          window.showErrorToast(errorMessage);
        } else {
          alert(errorMessage);
        }
      }
    } catch (error) {
      console.error('selectableTable.js: Errore durante l\'azione bulk:', error);
      if (window.showErrorToast) {
        window.showErrorToast(buttonConfig.errorMessage);
      } else {
        alert(buttonConfig.errorMessage);
      }
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