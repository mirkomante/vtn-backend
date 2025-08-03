/**
 * Gestione filtri custom con select personalizzate
 */
(function() {
  function initCustomSelects() {
    console.log('Inizializzazione select custom...');
    
    // Gestione delle select custom
    const selectButtons = document.querySelectorAll('[id$="-button"]');
    console.log('Trovati', selectButtons.length, 'pulsanti select');
    
    // Se non ci sono select custom, esci silenziosamente
    if (selectButtons.length === 0) {
      console.log('Nessuna select custom trovata, uscendo...');
      return;
    }
    
    selectButtons.forEach(button => {
      const selectId = button.id.replace('-button', '');
      const select = document.getElementById(selectId);
      const optionsList = document.getElementById(selectId + '-options');
      const selectedSpan = document.getElementById(selectId + '-selected');
      
      console.log('Configurando select:', selectId, { select, optionsList, selectedSpan });
      
      if (!select || !optionsList || !selectedSpan) {
        console.warn('Elementi mancanti per select:', selectId);
        return;
      }
      
      // Toggle dropdown
      button.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Click su pulsante select:', selectId);
        
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        
        // Chiudi tutti gli altri dropdown
        document.querySelectorAll('[id$="-options"]').forEach(list => {
          if (list !== optionsList) {
            list.classList.add('hidden');
            const otherButton = list.previousElementSibling;
            if (otherButton && otherButton.tagName === 'BUTTON') {
              otherButton.setAttribute('aria-expanded', 'false');
            }
          }
        });
        
        // Toggle corrente
        if (isExpanded) {
          console.log('Chiudendo dropdown:', selectId);
          optionsList.classList.add('hidden');
          button.setAttribute('aria-expanded', 'false');
        } else {
          console.log('Aprendo dropdown:', selectId);
          optionsList.classList.remove('hidden');
          button.setAttribute('aria-expanded', 'true');
        }
      });
      
      // Gestione selezione opzioni
      const optionItems = optionsList.querySelectorAll('li[role="option"]');
      optionItems.forEach(item => {
        item.addEventListener('click', function(e) {
          e.preventDefault();
          e.stopPropagation();
          
          const value = this.getAttribute('data-value');
          const label = this.querySelector('span').textContent;
          
          console.log('Selezionata opzione:', value, label);
          
          // Aggiorna select nascosta
          select.value = value;
          
          // Aggiorna testo visualizzato
          selectedSpan.textContent = label;
          
          // Aggiorna stato visivo
          optionItems.forEach(opt => {
            opt.classList.remove('bg-indigo-600', 'text-white');
            opt.classList.add('text-gray-900');
            opt.setAttribute('aria-selected', 'false');
            const optSpan = opt.querySelector('span');
            if (optSpan) {
              optSpan.classList.remove('font-semibold');
              optSpan.classList.add('font-normal');
            }
            
            // Rimuovi checkmark
            const checkmark = opt.querySelector('svg');
            if (checkmark && checkmark.parentElement) {
              checkmark.parentElement.remove();
            }
          });
          
          this.classList.add('bg-indigo-600', 'text-white');
          this.classList.remove('text-gray-900');
          this.setAttribute('aria-selected', 'true');
          const thisSpan = this.querySelector('span');
          if (thisSpan) {
            thisSpan.classList.add('font-semibold');
            thisSpan.classList.remove('font-normal');
          }
          
          // Aggiungi checkmark
          const checkmark = document.createElement('span');
          checkmark.className = 'absolute inset-y-0 right-0 flex items-center pr-4 text-white';
          checkmark.innerHTML = '<svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" /></svg>';
          this.appendChild(checkmark);
          
          // Chiudi dropdown
          optionsList.classList.add('hidden');
          button.setAttribute('aria-expanded', 'false');
          
          // Applica filtro automaticamente per tutte le opzioni (incluso valore vuoto)
          console.log('Applicando filtro automatico per:', value);
          setTimeout(() => {
            const form = document.getElementById('filter-form');
            if (form) {
              form.submit();
            }
          }, 100);
        });
      });
      
      // Chiudi dropdown quando si clicca fuori
      document.addEventListener('click', function(e) {
        if (!button.contains(e.target) && !optionsList.contains(e.target)) {
          optionsList.classList.add('hidden');
          button.setAttribute('aria-expanded', 'false');
        }
      });
      
      // Gestione tastiera
      button.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          button.click();
        }
      });
      
      optionsList.addEventListener('keydown', function(e) {
        const currentOption = document.querySelector(`#${selectId}-options li[aria-selected="true"]`);
        const options = Array.from(optionItems);
        const currentIndex = options.indexOf(currentOption);
        
        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            const nextIndex = (currentIndex + 1) % options.length;
            options[currentIndex].setAttribute('aria-selected', 'false');
            options[nextIndex].setAttribute('aria-selected', 'true');
            break;
          case 'ArrowUp':
            e.preventDefault();
            const prevIndex = currentIndex === 0 ? options.length - 1 : currentIndex - 1;
            options[currentIndex].setAttribute('aria-selected', 'false');
            options[prevIndex].setAttribute('aria-selected', 'true');
            break;
          case 'Enter':
          case ' ':
            e.preventDefault();
            const selectedOption = options.find(opt => opt.getAttribute('aria-selected') === 'true');
            if (selectedOption) selectedOption.click();
            break;
          case 'Escape':
            optionsList.classList.add('hidden');
            button.setAttribute('aria-expanded', 'false');
            button.focus();
            break;
        }
      });
    });
  }
  
  // Inizializza quando il DOM è pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCustomSelects);
  } else {
    initCustomSelects();
  }
})(); 