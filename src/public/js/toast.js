// Classe per gestire i toast message
class ToastManager {
  constructor() {
    this.toastContainer = null;
    this.messageQueue = [];
    this.init();
  }

  init() {
    // Crea il container per i toast se non esiste
    if (!this.toastContainer) {
      this.toastContainer = document.createElement('div');
      this.toastContainer.id = 'toast-container';
      this.toastContainer.className = 'fixed top-4 right-4 z-50 space-y-2 pointer-events-none';
      this.toastContainer.style.width = 'auto';
      this.toastContainer.style.minWidth = '300px';
      this.toastContainer.style.maxWidth = '400px';
      this.toastContainer.style.minHeight = '1px'; // Forza altezza minima
      this.toastContainer.style.display = 'block';
      this.toastContainer.style.visibility = 'visible';
      
      document.body.appendChild(this.toastContainer);
      
      // Processa i messaggi in coda
      this.processMessageQueue();
    }
  }

  processMessageQueue() {
    while (this.messageQueue.length > 0) {
      const { message, type, duration } = this.messageQueue.shift();
      this.show(message, type, duration);
    }
  }

  ensureContainerVisible() {
    // Verifica che il container sia visibile e abbia dimensioni
    if (this.toastContainer) {
      const width = this.toastContainer.offsetWidth;
      const height = this.toastContainer.offsetHeight;
      
      if (width === 0 || height === 0) {
        // Ripara il container
        this.toastContainer.style.width = 'auto';
        this.toastContainer.style.minWidth = '300px';
        this.toastContainer.style.maxWidth = '400px';
        this.toastContainer.style.minHeight = '1px';
        this.toastContainer.style.display = 'block';
        this.toastContainer.style.visibility = 'visible';
        
        // Forza un reflow
        this.toastContainer.offsetHeight;
      }
    }
  }

  show(message, type = 'info', duration = 5000) {
    // Se il container non è ancora pronto, metti il messaggio in coda
    if (!this.toastContainer) {
      this.messageQueue.push({ message, type, duration });
      return null;
    }

    // Assicurati che il container sia visibile
    this.ensureContainerVisible();

    const toast = this.createToast(message, type);
    
    // Verifica che il container sia visibile e abbia dimensioni
    const containerWidth = this.toastContainer.offsetWidth;
    
    // Se il container ha larghezza 0, usa il fallback
    if (containerWidth === 0) {
      return this.createFallbackToast(message, type, duration);
    }
    
    this.toastContainer.appendChild(toast);

    // Verifica che il toast sia visibile
    const toastRect = toast.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    
    // Se il toast è fuori dal viewport, usa il fallback
    if (toastRect.left < 0 || toastRect.left + toastRect.width > viewportWidth) {
      // Rimuovi il toast dal container
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
      
      // Usa il sistema di fallback
      return this.createFallbackToast(message, type, duration);
    }

    // Animazione di entrata
    setTimeout(() => {
      toast.classList.add('opacity-100', 'translate-x-0');
    }, 10);

    // Auto-rimozione
    setTimeout(() => {
      this.hide(toast);
    }, duration);

    return toast;
  }

  createFallbackToast(message, type, duration = 5000) {
    // Crea un toast semplice direttamente nel body
    const config = this.getToastConfig(type);
    
    const toast = document.createElement('div');
    toast.className = `fixed p-4 rounded-md shadow-lg z-50 ${config.classes}`;
    toast.style.minWidth = '300px';
    toast.style.maxWidth = '400px';
    
    // Calcola la posizione
    const viewportWidth = window.innerWidth;
    const toastWidth = 300;
    const margin = 16;
    const topPosition = 16;
    const leftPosition = viewportWidth - toastWidth - margin;
    
    // Applica stili
    toast.style.top = `${topPosition}px`;
    toast.style.left = `${leftPosition}px`;
    toast.style.right = 'auto';
    toast.style.opacity = '1';
    toast.style.transform = 'none';
    
    // Forza l'applicazione degli stili
    toast.style.setProperty('top', `${topPosition}px`, 'important');
    toast.style.setProperty('left', `${leftPosition}px`, 'important');
    toast.style.setProperty('right', 'auto', 'important');
    toast.style.setProperty('opacity', '1', 'important');
    toast.style.setProperty('transform', 'none', 'important');
    toast.innerHTML = `
      <div class="flex items-center">
        <div class="flex-shrink-0">
          ${config.icon}
        </div>
        <div class="ml-3 flex-1">
          <p class="text-sm font-medium ${config.textColor}">${message}</p>
        </div>
        <div class="ml-4 flex-shrink-0">
          <button type="button" class="inline-flex rounded-md p-1.5 ${config.closeButtonClasses} hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 ${config.focusRingClasses}" onclick="this.remove()">
            <span class="sr-only">Chiudi</span>
            <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(toast);



    // Auto-rimozione
    setTimeout(() => {
      this.hide(toast);
    }, duration);

    return toast;
  }

  createToast(message, type) {
    const toast = document.createElement('div');
    
    // Configurazione per tipo
    const config = this.getToastConfig(type);
    
    toast.className = `transform transition-all duration-300 ease-in-out opacity-0 translate-x-full pointer-events-auto ${config.classes}`;
    toast.style.width = '100%';
    toast.style.minWidth = '300px';
    toast.style.maxWidth = '400px';
    toast.innerHTML = `
      <div class="flex items-center p-4 rounded-md shadow-lg w-full">
        <div class="flex-shrink-0">
          ${config.icon}
        </div>
        <div class="ml-3 flex-1">
          <p class="text-sm font-medium ${config.textColor}">${message}</p>
        </div>
        <div class="ml-4 flex-shrink-0">
          <button type="button" class="inline-flex rounded-md p-1.5 ${config.closeButtonClasses} hover:bg-opacity-75 focus:outline-none focus:ring-2 focus:ring-offset-2 ${config.focusRingClasses}" onclick="this.closest('[id^=toast-]').remove()">
            <span class="sr-only">Chiudi</span>
            <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    `;

    // Aggiungi ID univoco
    toast.id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    return toast;
  }

  getToastConfig(type) {
    const configs = {
      success: {
        classes: 'bg-green-50 border border-green-200',
        textColor: 'text-green-800',
        closeButtonClasses: 'text-green-400 hover:bg-green-100',
        focusRingClasses: 'focus:ring-green-500 focus:ring-offset-green-50',
        icon: `<svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clip-rule="evenodd" />
              </svg>`
      },
      error: {
        classes: 'bg-red-50 border border-red-200',
        textColor: 'text-red-800',
        closeButtonClasses: 'text-red-400 hover:bg-red-100',
        focusRingClasses: 'focus:ring-red-500 focus:ring-offset-red-50',
        icon: `<svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
              </svg>`
      },
      warning: {
        classes: 'bg-yellow-50 border border-yellow-200',
        textColor: 'text-yellow-800',
        closeButtonClasses: 'text-yellow-400 hover:bg-yellow-100',
        focusRingClasses: 'focus:ring-yellow-500 focus:ring-offset-yellow-50',
        icon: `<svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
              </svg>`
      },
      info: {
        classes: 'bg-blue-50 border border-blue-200',
        textColor: 'text-blue-800',
        closeButtonClasses: 'text-blue-400 hover:bg-blue-100',
        focusRingClasses: 'focus:ring-blue-500 focus:ring-offset-blue-50',
        icon: `<svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h1.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd" />
              </svg>`
      }
    };

    return configs[type] || configs.info;
  }

  hide(toast) {
    if (toast && toast.parentNode) {
      toast.classList.remove('opacity-100', 'translate-x-0');
      toast.classList.add('opacity-0', 'translate-x-full');
      
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }
  }

  hideAll() {
    const toasts = this.toastContainer.querySelectorAll('[id^=toast-]');
    toasts.forEach(toast => this.hide(toast));
  }
}

// Istanza globale del ToastManager
window.toastManager = new ToastManager();



// Funzioni di utilità globali per compatibilità
window.showToast = (message, type = 'info', duration = 5000) => {
  if (window.toastManager) {
    return window.toastManager.show(message, type, duration);
  } else {
    // Fallback se il sistema non è ancora pronto
    setTimeout(() => {
      if (window.toastManager) {
        window.toastManager.show(message, type, duration);
      } else {
        console.warn('Toast system not ready, falling back to alert:', message);
        alert(message);
      }
    }, 100);
  }
};

window.showSuccessToast = (message, duration = 5000) => {
  if (window.toastManager) {
    return window.toastManager.show(message, 'success', duration);
  } else {
    setTimeout(() => {
      if (window.toastManager) {
        window.toastManager.show(message, 'success', duration);
      } else {
        console.warn('Toast system not ready, falling back to alert:', message);
        alert(message);
      }
    }, 100);
  }
};

window.showErrorToast = (message, duration = 5000) => {
  if (window.toastManager) {
    return window.toastManager.show(message, 'error', duration);
  } else {
    setTimeout(() => {
      if (window.toastManager) {
        window.toastManager.show(message, 'error', duration);
      } else {
        console.warn('Toast system not ready, falling back to alert:', message);
        alert(message);
      }
    }, 100);
  }
};

window.showWarningToast = (message, duration = 5000) => {
  if (window.toastManager) {
    return window.toastManager.show(message, 'warning', duration);
  } else {
    setTimeout(() => {
      if (window.toastManager) {
        window.toastManager.show(message, 'warning', duration);
      } else {
        console.warn('Toast system not ready, falling back to alert:', message);
        alert(message);
      }
    }, 100);
  }
};

window.showInfoToast = (message, duration = 5000) => {
  if (window.toastManager) {
    return window.toastManager.show(message, 'info', duration);
  } else {
    setTimeout(() => {
      if (window.toastManager) {
        window.toastManager.show(message, 'info', duration);
      } else {
        console.warn('Toast system not ready, falling back to alert:', message);
        alert(message);
      }
    }, 100);
  }
};

// Funzione di compatibilità con il codice esistente
window.showMessage = (message, type, duration = 5000) => {
  const toastType = type === 'success' ? 'success' : 'error';
  if (window.toastManager) {
    return window.toastManager.show(message, toastType, duration);
  } else {
    setTimeout(() => {
      if (window.toastManager) {
        window.toastManager.show(message, toastType, duration);
      } else {
        console.warn('Toast system not ready, falling back to alert:', message);
        alert(message);
      }
    }, 100);
  }
};

// Funzione per testare il sistema di toast
window.testToast = () => {
  if (window.toastManager) {
    window.toastManager.show('Test toast di successo', 'success');
    setTimeout(() => {
      window.toastManager.show('Test toast di errore', 'error');
    }, 1000);
    setTimeout(() => {
      window.toastManager.show('Test toast di warning', 'warning');
    }, 2000);
    setTimeout(() => {
      window.toastManager.show('Test toast informativo', 'info');
    }, 3000);
  } else {
    console.warn('Toast system not available');
  }
};

// Funzione per gestire messaggi flash passati direttamente alle viste
function handleDirectFlashMessages() {
  // Cerca elementi con messaggi di successo diretti
  const successMessages = document.querySelectorAll('[data-success-message], .success-message');
  successMessages.forEach(element => {
    const message = element.textContent?.trim() || element.getAttribute('data-success-message');
    if (message && message.length > 0 && message.length < 200) {
      if (window.showSuccessToast) {
        window.showSuccessToast(message);
      }
      element.style.display = 'none';
    }
  });

  // Cerca elementi con messaggi di errore diretti
  const errorMessages = document.querySelectorAll('[data-error-message], .error-message');
  errorMessages.forEach(element => {
    const message = element.textContent?.trim() || element.getAttribute('data-error-message');
    if (message && message.length > 0 && message.length < 200) {
      if (window.showErrorToast) {
        window.showErrorToast(message);
      }
      element.style.display = 'none';
    }
  });

  // Cerca messaggi flash standard del server SOLO se sono correlati all'azione
  const urlParams = new URLSearchParams(window.location.search);
  const hasSuccessParam = urlParams.has('success');
  const hasErrorParam = urlParams.has('error');
  
  if (hasSuccessParam) {
    const flashSuccess = document.querySelector('.bg-green-50, .bg-green-500');
    if (flashSuccess) {
      const message = flashSuccess.textContent?.trim();
      if (message && message.length > 0 && message.length < 200 && !message.includes('Dismiss')) {
        if (window.showSuccessToast) {
          window.showSuccessToast(message);
        }
        flashSuccess.style.display = 'none';
      }
    }
  }

  if (hasErrorParam) {
    const flashError = document.querySelector('.bg-red-50, .bg-red-500');
    if (flashError) {
      const message = flashError.textContent?.trim();
      if (message && message.length > 0 && message.length < 200 && !message.includes('Dismiss')) {
        if (window.showErrorToast) {
          window.showErrorToast(message);
        }
        flashError.style.display = 'none';
      }
    }
  }
}

// Funzione per mostrare toast dai flash message del server (MIGLIORATA)
function showFlashMessages() {
  // Cerca messaggi di successo SOLO se ci sono parametri URL correlati
  const urlParams = new URLSearchParams(window.location.search);
  const hasSuccessParam = urlParams.has('success');
  const hasErrorParam = urlParams.has('error');
  
  if (hasSuccessParam) {
    const successElements = document.querySelectorAll('.bg-green-50 .text-green-800, .bg-green-500 .text-white, .success-message');
    successElements.forEach(element => {
      const message = element.textContent?.trim();
      if (message && message.length > 0 && message.length < 200 && !message.includes('Dismiss')) {
        if (window.showSuccessToast) {
          window.showSuccessToast(message);
        }
        // Nascondi l'elemento originale dopo un breve delay
        setTimeout(() => {
          const container = element.closest('.bg-green-50, .bg-green-500, .success-message');
          if (container) {
            container.style.display = 'none';
          }
        }, 100);
      }
    });
  }

  if (hasErrorParam) {
    const errorElements = document.querySelectorAll('.bg-red-50 .text-red-800, .bg-red-500 .text-white, .error-message');
    errorElements.forEach(element => {
      const message = element.textContent?.trim();
      if (message && message.length > 0 && message.length < 200 && !message.includes('Dismiss')) {
        if (window.showErrorToast) {
          window.showErrorToast(message);
        }
        // Nascondi l'elemento originale dopo un breve delay
        setTimeout(() => {
          const container = element.closest('.bg-red-50, .bg-red-500, .error-message');
          if (container) {
            container.style.display = 'none';
          }
        }, 100);
      }
    });
  }

  // Cerca messaggi di warning (più specifico)
  const warningElements = document.querySelectorAll('.bg-yellow-50 .text-yellow-800, .bg-yellow-500 .text-white');
  warningElements.forEach(element => {
    const message = element.textContent?.trim();
    if (message && message.length > 0 && message.length < 200 && !message.includes('Dismiss')) {
      // Mostra il toast
      if (window.showWarningToast) {
        window.showWarningToast(message);
      }
      // Nascondi l'elemento originale dopo un breve delay
      setTimeout(() => {
        const container = element.closest('.bg-yellow-50, .bg-yellow-500');
        if (container) {
          container.style.display = 'none';
        }
      }, 100);
    }
  });
}

// Esegui le funzioni quando il DOM è caricato
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Delay per assicurarsi che il sistema sia pronto
    setTimeout(() => {
      showFlashMessages();
      handleDirectFlashMessages();
    }, 200);
  });
} else {
  // Delay per assicurarsi che il sistema sia pronto
  setTimeout(() => {
    showFlashMessages();
    handleDirectFlashMessages();
  }, 200);
}
