/**
 * Gestione Custom Dropdown per Form Menu Fisso
 * Implementazione selettiva solo per form con id 'menuFissoForm'
 */

class MenuFissoDropdown {
    constructor() {
        this.init();
    }

    init() {
        // Solo per form Menu Fisso
        const menuFissoForm = document.getElementById('menuFissoForm');
        if (!menuFissoForm) return;

        this.setupDropdowns();
        this.setupEventListeners();
    }

    setupDropdowns() {
        // Trova tutti i custom dropdown nel form Menu Fisso
        const dropdownButtons = document.querySelectorAll('#menuFissoForm button[id$="-button"]');
        
        dropdownButtons.forEach(button => {
            const fieldId = button.id.replace('-button', '');
            const select = document.getElementById(fieldId);
            const optionsList = document.getElementById(fieldId + '-options');
            const selectedSpan = document.getElementById(fieldId + '-selected');
            
            if (!select || !optionsList || !selectedSpan) return;

            // Inizializza stato
            this.updateSelectedDisplay(select, selectedSpan);
        });
    }

    setupEventListeners() {
        // Click sui button dropdown
        document.addEventListener('click', (e) => {
            if (e.target.closest('#menuFissoForm button[id$="-button"]')) {
                e.preventDefault();
                const button = e.target.closest('button');
                const fieldId = button.id.replace('-button', '');
                this.toggleDropdown(fieldId);
            }
        });

        // Click sulle opzioni
        document.addEventListener('click', (e) => {
            if (e.target.closest('#menuFissoForm li[role="option"]')) {
                e.preventDefault();
                const option = e.target.closest('li');
                const fieldId = option.closest('ul').id.replace('-options', '');
                this.selectOption(fieldId, option);
            }
        });

        // Click fuori per chiudere
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#menuFissoForm .relative')) {
                this.closeAllDropdowns();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.target.closest('#menuFissoForm button[id$="-button"]')) {
                this.handleKeyboard(e);
            }
        });
    }

    toggleDropdown(fieldId) {
        const button = document.getElementById(fieldId + '-button');
        const optionsList = document.getElementById(fieldId + '-options');
        
        if (!button || !optionsList) return;

        // Chiudi altri dropdown
        this.closeAllDropdowns();

        // Toggle questo dropdown
        const isOpen = !optionsList.classList.contains('hidden');
        
        if (isOpen) {
            this.closeDropdown(fieldId);
        } else {
            this.openDropdown(fieldId);
        }
    }

    openDropdown(fieldId) {
        const button = document.getElementById(fieldId + '-button');
        const optionsList = document.getElementById(fieldId + '-options');
        
        if (!button || !optionsList) return;

        optionsList.classList.remove('hidden');
        button.setAttribute('aria-expanded', 'true');
        
        // Focus sulla prima opzione
        const firstOption = optionsList.querySelector('li[role="option"]');
        if (firstOption) {
            firstOption.focus();
        }
    }

    closeDropdown(fieldId) {
        const button = document.getElementById(fieldId + '-button');
        const optionsList = document.getElementById(fieldId + '-options');
        
        if (!button || !optionsList) return;

        optionsList.classList.add('hidden');
        button.setAttribute('aria-expanded', 'false');
        button.focus();
    }

    closeAllDropdowns() {
        const dropdowns = document.querySelectorAll('#menuFissoForm ul[id$="-options"]');
        const buttons = document.querySelectorAll('#menuFissoForm button[id$="-button"]');
        
        dropdowns.forEach(dropdown => dropdown.classList.add('hidden'));
        buttons.forEach(button => button.setAttribute('aria-expanded', 'false'));
    }

    selectOption(fieldId, optionElement) {
        const select = document.getElementById(fieldId);
        const selectedSpan = document.getElementById(fieldId + '-selected');
        const optionsList = document.getElementById(fieldId + '-options');
        
        if (!select || !selectedSpan || !optionsList) return;

        const value = optionElement.getAttribute('data-value');
        const label = optionElement.querySelector('span').textContent;

        // Aggiorna select nascosto
        select.value = value;
        
        // Aggiorna display
        selectedSpan.textContent = label;
        
        // Aggiorna stato visivo delle opzioni
        this.updateOptionsState(fieldId, value);
        
        // Chiudi dropdown
        this.closeDropdown(fieldId);
        
        // Trigger change event per compatibilità con FormManager
        const changeEvent = new Event('change', { bubbles: true });
        select.dispatchEvent(changeEvent);
    }

    updateOptionsState(fieldId, selectedValue) {
        const optionsList = document.getElementById(fieldId + '-options');
        if (!optionsList) return;

        const options = optionsList.querySelectorAll('li[role="option"]');
        
        options.forEach(option => {
            const value = option.getAttribute('data-value');
            const isSelected = value === selectedValue;
            
            // Aggiorna classi CSS
            if (isSelected) {
                option.classList.add('bg-indigo-600', 'text-white');
                option.classList.remove('text-gray-900');
                option.setAttribute('aria-selected', 'true');
                
                // Mostra checkmark
                let checkmark = option.querySelector('.checkmark');
                if (!checkmark) {
                    checkmark = document.createElement('span');
                    checkmark.className = 'absolute inset-y-0 right-0 flex items-center pr-4 text-white checkmark';
                    checkmark.innerHTML = `
                        <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                        </svg>
                    `;
                    option.appendChild(checkmark);
                }
            } else {
                option.classList.remove('bg-indigo-600', 'text-white');
                option.classList.add('text-gray-900');
                option.setAttribute('aria-selected', 'false');
                
                // Rimuovi checkmark
                const checkmark = option.querySelector('.checkmark');
                if (checkmark) {
                    checkmark.remove();
                }
            }
        });
    }

    updateSelectedDisplay(select, selectedSpan) {
        const selectedOption = select.querySelector('option:checked');
        if (selectedOption) {
            selectedSpan.textContent = selectedOption.textContent;
        } else {
            selectedSpan.textContent = select.querySelector('option[value=""]')?.textContent || 'Seleziona...';
        }
    }

    handleKeyboard(e) {
        const button = e.target.closest('button');
        const fieldId = button.id.replace('-button', '');
        const optionsList = document.getElementById(fieldId + '-options');
        
        if (!optionsList) return;

        const isOpen = !optionsList.classList.contains('hidden');
        
        switch (e.key) {
            case 'Enter':
            case ' ':
                e.preventDefault();
                if (!isOpen) {
                    this.openDropdown(fieldId);
                }
                break;
                
            case 'Escape':
                if (isOpen) {
                    this.closeDropdown(fieldId);
                }
                break;
                
            case 'ArrowDown':
                e.preventDefault();
                if (!isOpen) {
                    this.openDropdown(fieldId);
                } else {
                    this.navigateOptions(fieldId, 1);
                }
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                if (isOpen) {
                    this.navigateOptions(fieldId, -1);
                }
                break;
        }
    }

    navigateOptions(fieldId, direction) {
        const optionsList = document.getElementById(fieldId + '-options');
        if (!optionsList) return;

        const options = Array.from(optionsList.querySelectorAll('li[role="option"]'));
        const currentIndex = options.findIndex(opt => opt === document.activeElement);
        
        let nextIndex = currentIndex + direction;
        
        if (nextIndex < 0) nextIndex = options.length - 1;
        if (nextIndex >= options.length) nextIndex = 0;
        
        options[nextIndex].focus();
    }
}

// Inizializza quando il DOM è pronto
document.addEventListener('DOMContentLoaded', () => {
    new MenuFissoDropdown();
});

// Esporta per test
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MenuFissoDropdown;
}
