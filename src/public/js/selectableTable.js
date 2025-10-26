// ========================================
// NUOVO SISTEMA DI SELEZIONE TABELLE ROBUSTO
// ========================================

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

// ========================================
// CLASSE PRINCIPALE PER GESTIONE SELEZIONE TABELLE
// ========================================

class TableSelectionManager {
  constructor(tableId, config) {
    this.tableId = tableId;
    this.config = config;
    this.table = null;
    this.selectAllCheckbox = null;
    this.itemCheckboxes = [];
    this.actionButtons = [];
    this.editButton = null;
    this.isInitialized = false;
    
    // Bind methods per mantenere il contesto
    this.handleSelectAllClick = this.handleSelectAllClick.bind(this);
    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleActionClick = this.handleActionClick.bind(this);
  }

  // Inizializza il sistema di selezione
  initialize() {
    try {
      this.table = document.getElementById(this.tableId);
      if (!this.table) {
        console.warn('TableSelectionManager: Tabella non trovata:', this.tableId);
        return false;
      }

      // Trova gli elementi della tabella
      this.findElements();
      
      // Verifica che tutti gli elementi necessari siano presenti
      if (!this.validateElements()) {
        return false;
      }

      // Aggiungi event listeners
      this.addEventListeners();
      
      // Inizializza lo stato
      this.updateSelectionState();
      
      this.isInitialized = true;
      console.log('TableSelectionManager: Inizializzato con successo:', this.tableId);
      return true;
      
    } catch (error) {
      console.error('TableSelectionManager: Errore durante l\'inizializzazione:', error);
      return false;
    }
  }

  // Trova tutti gli elementi necessari
  findElements() {
    // Checkbox "seleziona tutto"
    this.selectAllCheckbox = this.table.querySelector(`input[id='${this.tableId}-select-all']`);
    
    // Checkbox delle righe
    this.itemCheckboxes = Array.from(this.table.querySelectorAll(`input[name='${this.tableId}-item']`));
    
    // Bottone di modifica
    this.editButton = document.getElementById(`${this.tableId}-editMultipleBtn`);
    
    // Bottoni di azione
    this.actionButtons = [];
    
    // Supporto per bottoni multipli
    if (this.config.actionButtons && Array.isArray(this.config.actionButtons)) {
      this.config.actionButtons.forEach((_, index) => {
        const btn = document.getElementById(`${this.tableId}-actionBtn-${index}`);
        if (btn) this.actionButtons.push(btn);
      });
    } else {
      // Fallback per compatibilità
      const actionSelectedBtn = document.getElementById(`${this.tableId}-actionSelectedBtn`);
      if (actionSelectedBtn) this.actionButtons.push(actionSelectedBtn);
    }
  }

  // Valida che tutti gli elementi necessari siano presenti
  validateElements() {
    const requiredElements = {
      selectAllCheckbox: !!this.selectAllCheckbox,
      itemCheckboxes: this.itemCheckboxes.length > 0,
      actionButtons: this.actionButtons.length > 0
    };

    const missingElements = Object.entries(requiredElements)
      .filter(([_, exists]) => !exists)
      .map(([name, _]) => name);

    if (missingElements.length > 0) {
      console.warn('TableSelectionManager: Elementi mancanti:', missingElements);
      return false;
    }

    return true;
  }

  // Aggiunge tutti gli event listeners
  addEventListeners() {
    // Checkbox "seleziona tutto"
    if (this.selectAllCheckbox) {
      this.selectAllCheckbox.addEventListener('change', this.handleSelectAllClick);
    }

    // Checkbox delle righe
    this.itemCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', this.handleItemClick);
    });

    // Bottone di modifica
    if (this.editButton) {
      this.editButton.addEventListener('click', this.handleEditClick);
    }

    // Bottoni di azione
    this.actionButtons.forEach(button => {
      button.addEventListener('click', this.handleActionClick);
    });
  }

  // Gestisce il click sul checkbox "seleziona tutto"
  handleSelectAllClick(event) {
    const isChecked = event.target.checked;
    
    // Aggiorna tutti i checkbox delle righe
    this.itemCheckboxes.forEach(checkbox => {
      checkbox.checked = isChecked;
      this.updateRowSelectionState(checkbox);
    });

    // Aggiorna lo stato generale
    this.updateSelectionState();
  }

  // Gestisce il click sui checkbox delle righe
  handleItemClick(event) {
    this.updateRowSelectionState(event.target);
    this.updateSelectionState();
  }

  // Aggiorna lo stato di selezione di una singola riga
  updateRowSelectionState(checkbox) {
    const row = checkbox.closest('tr');
    if (!row) return;

    // Non modifichiamo le classi CSS - lasciamo che Tailwind gestisca tutto
    // Il sistema originale funziona già correttamente con group-has-checked
  }

  // Aggiorna lo stato generale della selezione
  updateSelectionState() {
    const checkedItems = this.itemCheckboxes.filter(cb => cb.checked);
    const hasCheckedItems = checkedItems.length > 0;
    const allChecked = checkedItems.length === this.itemCheckboxes.length && this.itemCheckboxes.length > 0;

    // Aggiorna lo stato del checkbox "seleziona tutto"
    if (this.selectAllCheckbox) {
      this.selectAllCheckbox.checked = allChecked;
      this.selectAllCheckbox.indeterminate = hasCheckedItems && !allChecked;
    }

    // Aggiorna i bottoni di azione
    this.updateActionButtons(checkedItems, hasCheckedItems);

    // Aggiorna il bottone di modifica
    this.updateEditButton(checkedItems, hasCheckedItems);

    // Aggiorna la visibilità dei bottoni di azione
    this.updateActionButtonsVisibility(hasCheckedItems);
  }

  // Aggiorna lo stato dei bottoni di azione
  updateActionButtons(checkedItems, hasCheckedItems) {
    this.actionButtons.forEach(btn => {
      btn.disabled = !hasCheckedItems;
    });
  }

  // Aggiorna la visibilità dei bottoni di azione
  updateActionButtonsVisibility(hasCheckedItems) {
    const buttonsContainer = document.getElementById(`${this.tableId}-action-buttons`);
    if (buttonsContainer) {
      if (hasCheckedItems) {
        buttonsContainer.classList.remove('hidden');
        buttonsContainer.classList.add('flex');
      } else {
        buttonsContainer.classList.remove('flex');
        buttonsContainer.classList.add('hidden');
      }
    }
  }

  // Aggiorna lo stato del bottone di modifica
  updateEditButton(checkedItems, hasCheckedItems) {
    if (!this.editButton) return;

    const hasBulkEdit = !!this.config.bulkEditUrl;
    const hasSingleEdit = !!this.config.editUrl;

    if (!hasBulkEdit && !hasSingleEdit) {
      this.editButton.style.display = 'none';
      return;
    }

    if (hasBulkEdit) {
      this.editButton.style.display = hasCheckedItems ? 'inline-flex' : 'none';
      this.editButton.disabled = !hasCheckedItems;
      
      if (hasCheckedItems) {
        this.editButton.textContent = checkedItems.length === 1 ? 'Modifica' : `Modifica (${checkedItems.length})`;
      }
    } else if (hasSingleEdit) {
      if (hasCheckedItems && checkedItems.length === 1) {
        this.editButton.style.display = 'inline-flex';
        this.editButton.disabled = false;
        this.editButton.textContent = 'Modifica';
      } else {
        this.editButton.style.display = 'none';
      }
    }
  }

  // Gestisce il click sul bottone di modifica
  handleEditClick() {
    const checkedItems = this.itemCheckboxes.filter(cb => cb.checked);
    if (checkedItems.length === 0) return;

    const itemIds = checkedItems.map(cb => cb.value);
    
    if (checkedItems.length === 1) {
      // Modifica singola
      if (!this.config.editUrl) {
        console.error('TableSelectionManager: editUrl non configurato');
        alert('Errore: URL di modifica singola non configurato');
        return;
      }
      
      const editUrl = this.config.editUrl.replace(':id', itemIds[0]);
      window.location.href = editUrl;
    } else {
      // Modifica multipla
      if (!this.config.bulkEditUrl) {
        console.error('TableSelectionManager: bulkEditUrl non configurato');
        alert('Errore: URL di modifica multipla non configurato');
        return;
      }
      
      const bulkEditUrl = this.config.bulkEditUrl + '?ids=' + itemIds.join(',');
      window.location.href = bulkEditUrl;
    }
  }

  // Gestisce il click sui bottoni di azione
  handleActionClick(event) {
    const checkedItems = this.itemCheckboxes.filter(cb => cb.checked);
    if (checkedItems.length === 0) return;

    const buttonIndex = event.target.dataset.buttonIndex;
    const itemIds = checkedItems.map(cb => cb.value);
    
    // Determina l'azione da eseguire
    let actionConfig;
    if (this.config.actionButtons && Array.isArray(this.config.actionButtons)) {
      actionConfig = this.config.actionButtons[buttonIndex];
    } else {
      actionConfig = this.config.actionButton;
    }

    if (!actionConfig) {
      console.error('TableSelectionManager: Configurazione azione non trovata');
      return;
    }

    // Conferma l'azione
    const confirmMessage = checkedItems.length === 1 
      ? (actionConfig.confirmMessage || 'Sei sicuro di voler eseguire questa azione?')
      : (actionConfig.confirmMessageMultiple || `Sei sicuro di voler eseguire questa azione su ${checkedItems.length} elementi?`);

    if (!confirm(confirmMessage)) {
      return;
    }

    // Esegui l'azione
    this.executeAction(actionConfig, itemIds);
  }

  // Esegue l'azione specificata
  async executeAction(actionConfig, itemIds) {
    try {
      const endpoint = actionConfig.endpoint || this.config.endpoint;
      const method = actionConfig.method || this.config.method || 'POST';
      
      if (!endpoint) {
        console.error('TableSelectionManager: Endpoint non configurato');
        showErrorToastLocal('Errore: Endpoint non configurato');
        return;
      }

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ids: itemIds })
      });

      const result = await response.json();

      if (result.success) {
        showSuccessToastLocal(result.message || actionConfig.successMessage || 'Azione eseguita con successo');
        // Ricarica la pagina per aggiornare i dati
        window.location.reload();
      } else {
        showErrorToastLocal(result.message || actionConfig.errorMessage || 'Errore durante l\'esecuzione dell\'azione');
      }

    } catch (error) {
      console.error('TableSelectionManager: Errore durante l\'esecuzione dell\'azione:', error);
      showErrorToastLocal('Errore di connessione');
    }
  }

  // Distrugge il manager e rimuove gli event listeners
  destroy() {
    if (this.selectAllCheckbox) {
      this.selectAllCheckbox.removeEventListener('change', this.handleSelectAllClick);
    }

    this.itemCheckboxes.forEach(checkbox => {
      checkbox.removeEventListener('change', this.handleItemClick);
    });

    if (this.editButton) {
      this.editButton.removeEventListener('click', this.handleEditClick);
    }

    this.actionButtons.forEach(button => {
      button.removeEventListener('click', this.handleActionClick);
    });

    this.isInitialized = false;
  }
}

// ========================================
// FUNZIONI DI INIZIALIZZAZIONE COMPATIBILITÀ
// ========================================

// Funzione di inizializzazione per compatibilità con il sistema esistente
function initializeSelectableTable(tableId, config) {
  const manager = new TableSelectionManager(tableId, config);
  return manager.initialize();
}

// Funzione per inizializzare tutte le tabelle
function initializeTables() {
  const tables = document.querySelectorAll('table[id$="-table"]');
  
  tables.forEach(table => {
    const tableId = table.id;
    const configKey = tableId + '-config';
    const config = window[configKey];
    
    if (config && typeof config === 'object') {
      initializeSelectableTable(tableId, config);
    } else {
      console.warn('TableSelectionManager: Configurazione non valida per tabella', tableId, config);
    }
  });
  
  // Fallback per tabelle che non hanno ancora configurazione
  if (tables.length === 0) {
    const configKeys = Object.keys(window).filter(key => key.endsWith('-config'));
    
    if (configKeys.length > 0) {
      setTimeout(initializeTables, 100);
    }
  }
  
  // Retry per tabelle senza configurazione
  setTimeout(() => {
    const allTables = document.querySelectorAll('table[id$="-table"]');
    allTables.forEach(table => {
      const tableId = table.id;
      const config = window[tableId + '-config'];
      if (config && typeof config === 'object') {
        initializeSelectableTable(tableId, config);
      }
    });
  }, 500);
}

// ========================================
// INIZIALIZZAZIONE AUTOMATICA
// ========================================

// Inizializza quando il DOM è caricato
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(initializeTables, 50);
});

// Esporta le funzioni per uso globale
window.TableSelectionManager = TableSelectionManager;
window.initializeSelectableTable = initializeSelectableTable;
window.initializeTables = initializeTables;