function initializeSelectableTable(tableId) {
  let usersTable = document.getElementById(tableId)
  let toggleAllCheckbox = usersTable.querySelector("thead input[type='checkbox']")
  let checkboxes = [...usersTable.querySelectorAll("tbody input[type='checkbox']")]

  toggleAllCheckbox.addEventListener('change', (event) => {
    checkboxes.forEach((checkbox) => {
      checkbox.checked = event.target.checked
    })
  })
  
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      let allChecked = checkboxes.every((checkbox) => checkbox.checked)
      let someChecked = checkboxes.some((checkbox) => checkbox.checked)
      toggleAllCheckbox.checked = someChecked
      toggleAllCheckbox.indeterminate = someChecked && !allChecked
    })
  })
} 