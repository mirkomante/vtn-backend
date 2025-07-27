function initializeSelectableTable(tableId) {
  let usersTable = document.getElementById(tableId)
  let toggleAllCheckbox = usersTable.querySelector("thead input[type='checkbox']")
  let checkboxes = [...usersTable.querySelectorAll("tbody input[type='checkbox']")]

  toggleAllCheckbox.addEventListener('change', (event) => {
    checkboxes.forEach((checkbox) => {
      checkbox.checked = event.target.checked
    })
    updateDeleteButtonVisibility()
  })
  
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      let allChecked = checkboxes.every((checkbox) => checkbox.checked)
      let someChecked = checkboxes.some((checkbox) => checkbox.checked)
      toggleAllCheckbox.checked = someChecked
      toggleAllCheckbox.indeterminate = someChecked && !allChecked
      updateDeleteButtonVisibility()
    })
  })

  // Funzione per aggiornare la visibilità del bottone elimina
  function updateDeleteButtonVisibility() {
    const deleteSelectedBtn = document.getElementById('deleteSelectedBtn')
    if (deleteSelectedBtn) {
      const hasCheckedItems = checkboxes.some(checkbox => checkbox.checked)
      deleteSelectedBtn.disabled = !hasCheckedItems
    }
  }

  // Inizializza la visibilità del bottone
  updateDeleteButtonVisibility()
}

// Funzione per eliminare gli utenti selezionati
function deleteSelectedUsers() {
  const tableId = 'users-table' // o il tableId passato come parametro
  const usersTable = document.getElementById(tableId)
  const checkboxes = [...usersTable.querySelectorAll("tbody input[type='checkbox']:checked")]
  
  if (checkboxes.length === 0) {
    alert('Nessun utente selezionato per la cancellazione')
    return
  }

  // Raccogli gli ID degli utenti selezionati
  const selectedUserIds = checkboxes.map(checkbox => {
    const row = checkbox.closest('tr')
    return row.dataset.userId || row.getAttribute('data-user-id')
  }).filter(id => id) // Rimuovi eventuali valori null/undefined

  if (selectedUserIds.length === 0) {
    alert('Impossibile identificare gli utenti selezionati')
    return
  }

  // Conferma la cancellazione
  const userCount = selectedUserIds.length
  const confirmMessage = userCount === 1 
    ? 'Sei sicuro di voler eliminare questo utente?' 
    : `Sei sicuro di voler eliminare ${userCount} utenti?`
  
  if (!confirm(confirmMessage)) {
    return
  }

  // Esegui la cancellazione
  fetch('/admin/utenti', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userIds: selectedUserIds
    })
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      // Mostra messaggio di successo
      alert(data.message)
      // Ricarica la pagina per aggiornare la lista
      window.location.reload()
    } else {
      alert('Errore durante l\'eliminazione: ' + data.message)
    }
  })
  .catch(error => {
    console.error('Errore:', error)
    alert('Si è verificato un errore durante l\'eliminazione')
  })
}

// Inizializza la tabella quando il DOM è caricato
document.addEventListener('DOMContentLoaded', function() {
  // Inizializza la tabella selezionabile
  initializeSelectableTable('users-table')
  
  // Aggiungi event listener al bottone elimina selezionati
  const deleteSelectedBtn = document.getElementById('deleteSelectedBtn')
  if (deleteSelectedBtn) {
    deleteSelectedBtn.addEventListener('click', deleteSelectedUsers)
  }
}) 