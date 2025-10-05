/**
 * Dynamic List Manager
 * Gestisce liste dinamiche con drag & drop per i form
 */
class DynamicListManager {
  constructor(container) {
    this.container = container;
    this.fieldName = container.dataset.fieldName;
    this.listContainer = container.querySelector('[id$="-list"]');
    this.selector = container.querySelector('[id$="-selector"]');
    this.addButton = container.querySelector('.add-item-btn');
    this.removeButtons = container.querySelectorAll('.remove-item-btn');
    this.items = [];
    
    this.init();
  }
  
  init() {
    // Inizializza gli elementi esistenti
    this.loadExistingItems();
    
    // Aggiungi event listeners
    this.addButton.addEventListener('click', () => this.addItem());
    this.selector.addEventListener('change', () => this.handleSelection());
    
    // Aggiungi event listeners per i pulsanti di rimozione
    this.removeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => this.removeItem(e));
    });
    
    // Inizializza drag & drop
    this.initSortable();
    
    // Aggiorna gli input nascosti
    this.updateHiddenInputs();
  }
  
  loadExistingItems() {
    const existingItems = this.listContainer.querySelectorAll('[data-value]');
    existingItems.forEach(item => {
      const value = item.dataset.value;
      const label = item.querySelector('span').textContent;
      this.items.push({ value, label });
    });
  }
  
  addItem() {
    const selectedOption = this.selector.options[this.selector.selectedIndex];
    if (selectedOption.value) {
      this.addItemToList(selectedOption.value, selectedOption.dataset.label);
      this.selector.selectedIndex = 0;
      this.updateSelector();
    }
  }
  
  addItemToList(value, label) {
    // Controlla se l'elemento esiste già
    if (this.items.find(item => item.value === value)) {
      return;
    }
    
    const item = { value, label };
    this.items.push(item);
    this.renderList();
  }
  
  removeItem(event) {
    const itemElement = event.target.closest('[data-value]');
    const value = itemElement.dataset.value;
    
    this.items = this.items.filter(item => item.value !== value);
    this.renderList();
    this.updateSelector();
  }
  
  renderList() {
    this.listContainer.innerHTML = '';
    
    if (this.items.length === 0) {
      const emptyMessage = this.container.querySelector('p').textContent || 'Nessun elemento selezionato';
      this.listContainer.innerHTML = `<p class="text-gray-500 text-sm">${emptyMessage}</p>`;
      return;
    }
    
    this.items.forEach((item, index) => {
      const itemElement = this.createItemElement(item, index);
      this.listContainer.appendChild(itemElement);
    });
    
    // Aggiungi event listeners per i nuovi pulsanti di rimozione
    this.removeButtons = this.listContainer.querySelectorAll('.remove-item-btn');
    this.removeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => this.removeItem(e));
    });
    
    this.updateHiddenInputs();
  }
  
  createItemElement(item, index) {
    const div = document.createElement('div');
    div.className = 'flex items-center justify-between p-3 bg-gray-50 rounded-md border';
    div.draggable = true;
    div.dataset.value = item.value;
    
    div.innerHTML = `
      <div class="flex items-center space-x-3">
        <svg class="h-5 w-5 text-gray-400 cursor-move" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
        </svg>
        <span class="text-sm font-medium text-gray-900">${item.label}</span>
      </div>
      <button type="button" class="text-red-600 hover:text-red-800 remove-item-btn">
        <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    `;
    
    return div;
  }
  
  updateSelector() {
    // Rimuovi le opzioni già selezionate dal selettore
    const options = this.selector.querySelectorAll('option');
    options.forEach(option => {
      if (option.value) {
        const isSelected = this.items.find(item => item.value === option.value);
        option.style.display = isSelected ? 'none' : 'block';
      }
    });
  }
  
  initSortable() {
    // Implementazione drag & drop semplice senza dipendenze esterne
    let draggedElement = null;
    
    this.listContainer.addEventListener('dragstart', (e) => {
      draggedElement = e.target;
      e.target.style.opacity = '0.5';
    });
    
    this.listContainer.addEventListener('dragend', (e) => {
      e.target.style.opacity = '';
      draggedElement = null;
    });
    
    this.listContainer.addEventListener('dragover', (e) => {
      e.preventDefault();
    });
    
    this.listContainer.addEventListener('drop', (e) => {
      e.preventDefault();
      
      if (draggedElement && e.target !== draggedElement) {
        const dropTarget = e.target.closest('[data-value]');
        if (dropTarget) {
          const draggedValue = draggedElement.dataset.value;
          const dropValue = dropTarget.dataset.value;
          
          // Trova gli indici
          const draggedIndex = this.items.findIndex(item => item.value === draggedValue);
          const dropIndex = this.items.findIndex(item => item.value === dropValue);
          
          if (draggedIndex !== -1 && dropIndex !== -1) {
            // Sposta l'elemento nell'array
            const item = this.items.splice(draggedIndex, 1)[0];
            this.items.splice(dropIndex, 0, item);
            
            // Riorganizza il DOM
            this.renderList();
          }
        }
      }
    });
  }
  
  updateHiddenInputs() {
    // Rimuovi input nascosti esistenti
    const existingInputs = this.container.querySelectorAll('input[type="hidden"]');
    existingInputs.forEach(input => input.remove());
    
    // Aggiungi nuovi input nascosti per ogni elemento
    this.items.forEach((item, index) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = `${this.fieldName}[]`;
      input.value = item.value;
      this.container.appendChild(input);
    });
  }
  
  getValues() {
    return this.items.map(item => item.value);
  }
  
  setValues(values) {
    this.items = [];
    if (values && values.length > 0) {
      values.forEach(value => {
        const option = this.selector.querySelector(`option[value="${value}"]`);
        if (option) {
          this.items.push({
            value: value,
            label: option.dataset.label
          });
        }
      });
    }
    this.renderList();
    this.updateSelector();
  }
}

// Inizializza tutti i dynamic list quando il DOM è pronto
document.addEventListener('DOMContentLoaded', function() {
  const dynamicLists = document.querySelectorAll('.dynamic-list-container');
  dynamicLists.forEach(container => {
    container.dynamicListManager = new DynamicListManager(container);
  });
});

// Esporta la classe per uso globale
window.DynamicListManager = DynamicListManager;
