// Schema per la configurazione centralizzata delle viste in dettaglio

export interface DetailViewField {
  name: string;
  label: string;
  type: 'text' | 'currency' | 'boolean' | 'date' | 'email' | 'custom';
  required?: boolean;
  conditional?: string; // campo da controllare per mostrare/nascondere
  format?: {
    currency?: {
      symbol: string;
      decimals: number;
    };
    date?: {
      locale: string;
      options?: Intl.DateTimeFormatOptions;
    };
    boolean?: {
      trueText: string;
      falseText: string;
      showBadge: boolean;
    };
  };
  customRender?: string; // nome del renderer personalizzato
}

export interface DetailViewConfig {
  fields: DetailViewField[];
  layout: 'default' | 'compact' | 'wide';
  showTimestamps?: boolean;
  timestampFields?: {
    createdAt?: string;
    updatedAt?: string;
  };
  customFields?: DetailViewField[]; // campi aggiuntivi specifici per l'entità
}

export interface DetailViewData {
  config: DetailViewConfig;
  item: any;
  itemType: string;
  title?: string;
  description?: string;
}
