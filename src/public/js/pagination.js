// Gestione paginazione AJAX per le tabelle
class TablePagination {
  constructor(tableId, config) {
    this.tableId = tableId;
    this.config = config;
    this.currentPage = 1;
    this.currentFilters = {};
    this.isLoading = false;
    
    this.init();
  }

  init() {
    // Event listeners per i bottoni di paginazione
    this.bindPaginationEvents();
    
    // Event listeners per i filtri (se presenti)
    this.bindFilterEvents();
  }

  bindPaginationEvents() {
    const container = document.querySelector(`#${this.tableId}`).closest('.pt-5');
    if (!container) return;

    // Previous button
    const prevBtn = container.querySelector('.pagination-prev');
    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const page = parseInt(e.target.dataset.page);
        if (page && page > 0) {
          this.goToPage(page);
        }
      });
    }

    // Next button
    const nextBtn = container.querySelector('.pagination-next');
    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const page = parseInt(e.target.dataset.page);
        if (page) {
          this.goToPage(page);
        }
      });
    }

    // Page number buttons
    const pageBtns = container.querySelectorAll('.pagination-page');
    pageBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const page = parseInt(e.target.dataset.page);
        if (page && page > 0) {
          this.goToPage(page);
        }
      });
    });
  }

  bindFilterEvents() {
    const container = document.querySelector(`#${this.tableId}`).closest('.pt-5');
    if (!container) return;

    // Cerca i form di filtro
    const filterForms = container.querySelectorAll('form[data-filter-form]');
    filterForms.forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.applyFilters(form);
      });

      // Gestione cambio immediato per select
      const selects = form.querySelectorAll('select');
      selects.forEach(select => {
        select.addEventListener('change', () => {
          this.applyFilters(form);
        });
      });
    });
  }

  async goToPage(page) {
    if (this.isLoading) return;
    
    this.currentPage = page;
    await this.loadData();
  }

  async applyFilters(form) {
    if (this.isLoading) return;
    
    // Reset alla prima pagina quando si applicano filtri
    this.currentPage = 1;
    
    // Raccogli i dati del form
    const formData = new FormData(form);
    this.currentFilters = {};
    
    for (let [key, value] of formData.entries()) {
      if (value && value.trim() !== '') {
        this.currentFilters[key] = value;
      }
    }
    
    await this.loadData();
  }

  async loadData() {
    if (this.isLoading) return;
    
    this.isLoading = true;
    this.showLoadingState();

    try {
      // Costruisci l'URL con i parametri
      const url = new URL(window.location.href);
      
      // Aggiungi parametri di paginazione
      url.searchParams.set('page', this.currentPage.toString());
      url.searchParams.set('limit', '20'); // Limite fisso di 20 elementi
      
      // Aggiungi filtri
      Object.keys(this.currentFilters).forEach(key => {
        url.searchParams.set(key, this.currentFilters[key]);
      });

      // Per ora, usa reload della pagina invece di AJAX
      // In futuro, si può implementare AJAX completo
      window.location.href = url.toString();
    } catch (error) {
      console.error('Errore durante il caricamento:', error);
      this.showError('Errore di connessione');
    } finally {
      this.isLoading = false;
      this.hideLoadingState();
    }
  }

  updateTable(data) {
    const container = document.querySelector(`#${this.tableId}`).closest('.pt-5');
    if (!container) return;

    // Aggiorna i dati della tabella
    if (data.data && Array.isArray(data.data)) {
      this.updateTableRows(data.data);
    }

    // Aggiorna la paginazione
    if (data.pagination) {
      this.updatePagination(data.pagination);
    }

    // Reinizializza la tabella selectable
    if (window.initializeSelectableTable) {
      const configKey = this.tableId + '-config';
      const config = window[configKey];
      if (config) {
        window.initializeSelectableTable(this.tableId, config);
      }
    }

    // Reinizializza i filtri
    this.bindFilterEvents();
    
    // Aggiorna il titolo della pagina se necessario
    if (data.title) {
      document.title = data.title;
    }
  }

  // Aggiorna le righe della tabella
  updateTableRows(items) {
    const tbody = document.querySelector(`#${this.tableId} tbody`);
    if (!tbody) return;

    // Per ora, ricarica la pagina per semplicità
    // In futuro, si può implementare l'aggiornamento dinamico delle righe
    window.location.reload();
  }

  // Aggiorna la paginazione
  updatePagination(pagination) {
    const container = document.querySelector(`#${this.tableId}`).closest('.pt-5');
    if (!container) return;

    // Per ora, ricarica la pagina per semplicità
    // In futuro, si può implementare l'aggiornamento dinamico della paginazione
    window.location.reload();
  }

  updateURL(url) {
    // Aggiorna l'URL senza ricaricare la pagina
    window.history.pushState({}, '', url.toString());
  }

  showLoadingState() {
    const container = document.querySelector(`#${this.tableId}`).closest('.pt-5');
    if (!container) return;

    // Aggiungi overlay di caricamento
    const overlay = document.createElement('div');
    overlay.className = 'absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10';
    overlay.id = `${this.tableId}-loading-overlay`;
    
    overlay.innerHTML = `
      <div class="flex items-center space-x-2">
        <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
        <span class="text-sm text-gray-600">Caricamento...</span>
      </div>
    `;
    
    const tableContainer = container.querySelector('.flow-root');
    if (tableContainer) {
      tableContainer.style.position = 'relative';
      tableContainer.appendChild(overlay);
    }
  }

  hideLoadingState() {
    const overlay = document.getElementById(`${this.tableId}-loading-overlay`);
    if (overlay) {
      overlay.remove();
    }
  }

  showError(message) {
    // Usa il sistema toast esistente
    if (window.showErrorToastLocal) {
      window.showErrorToastLocal(message);
    } else if (window.showToastLocal) {
      window.showToastLocal(message, 'error');
    } else {
      alert(message);
    }
  }
}

// Inizializzazione automatica della paginazione
document.addEventListener('DOMContentLoaded', function() {
  // Cerca tutte le tabelle con paginazione
  const tables = document.querySelectorAll('table[id$="-table"]');
  
  tables.forEach(table => {
    const tableId = table.id;
    const container = table.closest('.pt-5');
    
    // Controlla se c'è paginazione
    if (container && container.querySelector('nav')) {
      // Cerca la configurazione della tabella
      const configKey = tableId + '-config';
      const config = window[configKey];
      
      if (config) {
        // Aggiungi configurazione di paginazione
        config.pagination = {
          enabled: true,
          itemsPerPage: 20
        };
        
        // Inizializza la paginazione
        new TablePagination(tableId, config);
      }
    }
  });
});

// Gestione del browser back/forward
window.addEventListener('popstate', function() {
  // Ricarica i dati quando l'utente usa i pulsanti del browser
  const tables = document.querySelectorAll('table[id$="-table"]');
  tables.forEach(table => {
    const tableId = table.id;
    const pagination = window[`${tableId}-pagination`];
    if (pagination && pagination.loadData) {
      pagination.loadData();
    }
  });
});
