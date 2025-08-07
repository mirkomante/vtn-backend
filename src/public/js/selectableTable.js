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

  // Controlla se la tabella ha modifica massiva (ha bulkEditUrl)
  const hasBulkEdit = !!config.bulkEditUrl;

  if (!selectAllCheckbox || !actionSelectedBtn || !editMultipleBtn) {
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

    // Gestione del bottone di modifica
    if (hasBulkEdit) {
      // Se bulkEdit è abilitato, mostra sempre il bottone quando ci sono elementi selezionati
      editMultipleBtn.style.display = hasCheckedItems ? 'inline-flex' : 'none';
      editMultipleBtn.disabled = !hasCheckedItems;
      
      // Aggiorna il testo del pulsante in base al numero di elementi selezionati
      if (hasCheckedItems) {
        if (checkedItems.length === 1) {
          editMultipleBtn.textContent = 'Modifica';
        } else {
          editMultipleBtn.textContent = `Modifica (${checkedItems.length})`;
        }
      } else {
        editMultipleBtn.textContent = 'Modifica';
      }
    } else {
      // Se bulkEdit è disabilitato, mostra il bottone solo per un singolo elemento
      if (hasCheckedItems && checkedItems.length === 1) {
        editMultipleBtn.style.display = 'inline-flex';
        editMultipleBtn.disabled = false;
        editMultipleBtn.textContent = 'Modifica';
      } else {
        // Nascondi il bottone se non ci sono elementi selezionati o se ce ne sono più di uno
        editMultipleBtn.style.display = 'none';
      }
    }
    
    // Il bottone elimina deve essere sempre abilitato quando ci sono elementi selezionati
    actionSelectedBtn.disabled = !hasCheckedItems;
  }

  // Funzione per gestire il click del bottone modifica
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

  // Event listener per il bottone di modifica
  editMultipleBtn.addEventListener('click', handleEditClick);

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
      // Prepara i dati di base
      let requestData = { itemIds };
      
      // Gestione speciale per la tabella dei cancellati che ha bisogno di itemTypes
      if (config.tableId === 'deleted-items-table') {
        try {
          // Raccogli i tipi degli elementi selezionati
          const itemTypes = [];
          itemIds.forEach(id => {
            const row = document.querySelector(`tr[data-item-id="${id}"]`);
            if (row) {
              // Estrai il campo type dai dati della riga
              const type = row.getAttribute('data-type');
              if (type) {
                itemTypes.push(type);
              } else {
                // Fallback: cerca nella seconda colonna (type_label)
                const cells = row.querySelectorAll('td');
                if (cells.length > 1) {
                  const typeCell = cells[1];
                  const typeText = typeCell.textContent.trim();
                  // Mappa il testo visualizzato al valore del campo type
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
          
          // Aggiungi i tipi alla richiesta
          requestData.itemTypes = itemTypes;
        } catch (error) {
          console.error('selectableTable.js: Errore nel raccogliere i tipi:', error);
        }
      }
      // Se è definita onBeforeAction, chiamala per personalizzare i dati
      else if (config.onBeforeAction && typeof config.onBeforeAction === 'function') {
        try {
          // Raccogli gli elementi selezionati con i loro dati
          const selectedItems = [];
          itemIds.forEach(id => {
            const row = document.querySelector(`tr[data-item-id="${id}"]`);
            if (row) {
              const item = {};
              // Estrai i dati dalla riga
              const cells = row.querySelectorAll('td');
              cells.forEach((cell, index) => {
                if (index > 0) { // Salta la prima cella (checkbox)
                  const fieldName = config.tableData?.fields?.[index - 1]?.name;
                  if (fieldName) {
                    item[fieldName] = cell.textContent.trim();
                  }
                }
              });
              item.id = id;
              selectedItems.push(item);
            }
          });
          
          // Chiama onBeforeAction per personalizzare i dati
          const customData = config.onBeforeAction(selectedItems);
          if (customData && typeof customData === 'object') {
            requestData = { ...requestData, ...customData };
          }
        } catch (error) {
          console.error('selectableTable.js: Errore in onBeforeAction:', error);
        }
      }
      
      const response = await fetch(config.endpoint, {
        method: config.method,
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify(requestData)
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