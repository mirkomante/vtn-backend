/**
 * Helper per la gestione dei plurali italiani
 */

/**
 * Genera il testo corretto per il conteggio di elementi in italiano
 * @param count - Numero di elementi
 * @param singular - Forma singolare (es. "allergene", "piatto", "servizio")
 * @param plural - Forma plurale (es. "allergeni", "piatti", "servizi")
 * @returns Stringa formattata correttamente
 */
export function getItalianPlural(count: number, singular: string, plural: string): string {
  if (count === 0) {
    return 'Nessuno';
  }
  if (count === 1) {
    return `1 ${singular}`;
  }
  return `${count} ${plural}`;
}

/**
 * Configurazioni predefinite per i plurali comuni
 */
export const pluralConfigs = {
  allergene: {
    singular: 'allergene',
    plural: 'allergeni'
  },
  piatto: {
    singular: 'piatto',
    plural: 'piatti'
  },
  servizio: {
    singular: 'servizio',
    plural: 'servizi'
  }
} as const;

/**
 * Funzione di convenienza per i plurali predefiniti
 * @param count - Numero di elementi
 * @param type - Tipo di elemento ('allergene', 'piatto', 'servizio')
 * @returns Stringa formattata correttamente
 */
export function getCountText(count: number, type: keyof typeof pluralConfigs): string {
  const config = pluralConfigs[type];
  return getItalianPlural(count, config.singular, config.plural);
}
