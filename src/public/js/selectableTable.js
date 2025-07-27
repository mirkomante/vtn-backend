function initializeSelectableTable(tableId, config) {
  const table = document.getElementById(tableId)
  if (!table) {
    console.error(`Tabella con ID "${tableId}" non trovata`)
    return
  }

  const toggleAllCheckbox = table.querySelector("thead input[type='checkbox']")
  const checkboxes = [...table.querySelectorAll("tbody input[type='checkbox']")]

  if (!toggleAllCheckbox || checkboxes.length === 0) {
    console.error(`Elementi checkbox non trovati nella tabella "${tableId}"`)
    return
  }

  toggleAllCheckbox.addEventListener('change', (event) => {
    checkboxes.forEach((checkbox) => {
      checkbox.checked = event.target.checked
    })
    updateActionButtonsVisibility()
  })
  
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      const allChecked = checkboxes.every((checkbox) => checkbox.checked)
      const someChecked = checkboxes.some((checkbox) => checkbox.checked)
      toggleAllCheckbox.checked = someChecked
      toggleAllCheckbox.indeterminate = someChecked && !allChecked
      updateActionButtonsVisibility()
    })
  })

  function updateActionButtonsVisibility() {
    const actionSelectedBtn = document.getElementById('actionSelectedBtn')
    const editMultipleBtn = document.getElementById('editMultipleBtn')
    
    const hasCheckedItems = checkboxes.some(checkbox => checkbox.checked)
    
    if (actionSelectedBtn) {
      actionSelectedBtn.disabled = !hasCheckedItems
    }
    
    if (editMultipleBtn) {
      editMultipleBtn.disabled = !hasCheckedItems
    }
  }

  updateActionButtonsVisibility()
}

function executeTableAction(tableId, config) {
  const table = document.getElementById(tableId)
  if (!table) {
    console.error(`Tabella con ID "${tableId}" non trovata`)
    return
  }

  const checkboxes = [...table.querySelectorAll("tbody input[type='checkbox']:checked")]
  
  if (checkboxes.length === 0) {
    alert('Nessun elemento selezionato')
    return
  }

  const selectedIds = checkboxes.map(checkbox => {
    const row = checkbox.closest('tr')
    return row.dataset.itemId
  }).filter(id => id)

  if (selectedIds.length === 0) {
    alert('Impossibile identificare gli elementi selezionati')
    return
  }

  const itemCount = selectedIds.length
  const confirmMessage = itemCount === 1 
    ? config.confirmMessage 
    : config.confirmMessageMultiple.replace('{count}', itemCount)
  
  if (!confirm(confirmMessage)) {
    return
  }

  fetch(config.endpoint, {
    method: config.method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      itemIds: selectedIds
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      const successMessage = config.successMessage.replace('{count}', data.deletedCount || data.restoredCount || itemCount)
      alert(successMessage)
      window.location.reload()
    } else {
      alert('Errore: ' + data.message)
    }
  })
  .catch(error => {
    console.error('Errore:', error)
    alert(config.errorMessage || 'Si è verificato un errore')
  })
}

function executeEditMultiple(tableId, config) {
  const table = document.getElementById(tableId)
  if (!table) {
    console.error(`Tabella con ID "${tableId}" non trovata`)
    return
  }

  const checkboxes = [...table.querySelectorAll("tbody input[type='checkbox']:checked")]
  
  if (checkboxes.length === 0) {
    alert('Nessun elemento selezionato per la modifica')
    return
  }

  const selectedIds = checkboxes.map(checkbox => {
    const row = checkbox.closest('tr')
    return row.dataset.itemId
  }).filter(id => id)

  if (selectedIds.length === 0) {
    alert('Impossibile identificare gli elementi selezionati')
    return
  }

  // Per ora reindirizza alla modifica del primo elemento selezionato
  // In futuro si può implementare una modifica multipla vera e propria
  const firstId = selectedIds[0]
  const editUrl = config.editUrl.replace(':id', firstId)
  window.location.href = editUrl
}

document.addEventListener('DOMContentLoaded', function() {
  // Inizializza tutte le tabelle selezionabili presenti nella pagina
  const tables = document.querySelectorAll('[id$="-table"]')
  
  tables.forEach(table => {
    const tableId = table.id
    const configKey = tableId + 'Config'
    const config = window[configKey]
    
    if (config) {
      initializeSelectableTable(tableId, config)
      
      // Event listener per il bottone azione principale (Elimina/Ripristina)
      const actionSelectedBtn = document.getElementById('actionSelectedBtn')
      if (actionSelectedBtn) {
        actionSelectedBtn.addEventListener('click', () => executeTableAction(tableId, config))
      }
      
      // Event listener per il bottone modifica multipla (solo se presente)
      const editMultipleBtn = document.getElementById('editMultipleBtn')
      if (editMultipleBtn) {
        editMultipleBtn.addEventListener('click', () => executeEditMultiple(tableId, config))
      }
    }
  })
}) 