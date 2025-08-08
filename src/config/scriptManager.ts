// Configurazione centralizzata per la gestione degli script JavaScript

export interface ScriptConfig {
  common: string[];
  conditional: Record<string, string>;
  pageSpecific?: Record<string, string[]>;
}

// Script comuni caricati in tutte le pagine
const commonScripts = [
  '/js/toast.js',
  '/js/sidebar.js'
];

// Script condizionali caricati solo quando necessario
const conditionalScripts: Record<string, string> = {
  'formManager': '/js/formManager.js',
  'selectableTable': '/js/selectableTable.js',
  'customFilters': '/js/customFilters.js'
};

// Script specifici per tipo di pagina
const pageSpecificScripts: Record<string, string[]> = {
  'form': ['formManager'],
  'table': ['selectableTable', 'customFilters'],
  'bulkEdit': ['formManager'],
  'dashboard': []
};

export class ScriptManager {
  private static instance: ScriptManager;
  
  private constructor() {}
  
  public static getInstance(): ScriptManager {
    if (!ScriptManager.instance) {
      ScriptManager.instance = new ScriptManager();
    }
    return ScriptManager.instance;
  }

  /**
   * Ottiene gli script necessari per una pagina
   */
  public getScriptsForPage(pageType: string, features: string[] = []): string[] {
    const scripts = [...commonScripts];
    
    // Aggiungi script specifici per il tipo di pagina
    if (pageSpecificScripts[pageType]) {
      pageSpecificScripts[pageType].forEach(feature => {
        if (conditionalScripts[feature] && !scripts.includes(conditionalScripts[feature])) {
          scripts.push(conditionalScripts[feature]);
        }
      });
    }
    
    // Aggiungi script per funzionalità specifiche
    features.forEach(feature => {
      if (conditionalScripts[feature] && !scripts.includes(conditionalScripts[feature])) {
        scripts.push(conditionalScripts[feature]);
      }
    });
    
    return scripts;
  }

  /**
   * Ottiene la configurazione JSON per le tabelle
   */
  public getTableConfigScript(tableId: string, config: any): string {
    return `
      <script>
        window['${tableId}-config'] = ${JSON.stringify(config)};
      </script>
    `;
  }

  /**
   * Ottiene script di inizializzazione per tabelle
   */
  public getTableInitScript(tableId: string): string {
    return `
      <script>
        document.addEventListener('DOMContentLoaded', function() {
          if (typeof initializeSelectableTable === 'function') {
            initializeSelectableTable('${tableId}');
          }
        });
      </script>
    `;
  }

  /**
   * Ottiene script per configurazione form bulk edit
   */
  public getBulkEditConfigScript(config: any): string {
    return `
      <script>
        window.formConfig = {
          isBulkEdit: true,
          requireAtLeastOneField: ${config.bulkEditConfig?.requireAtLeastOneField || false},
          allowPartialUpdates: ${config.bulkEditConfig?.allowPartialUpdates || false},
          config: {
            requireAtLeastOneField: ${config.bulkEditConfig?.requireAtLeastOneField || false},
            allowPartialUpdates: ${config.bulkEditConfig?.allowPartialUpdates || false}
          }
        };
      </script>
    `;
  }
}

// Esporta un'istanza singleton
export const scriptManager = ScriptManager.getInstance();
