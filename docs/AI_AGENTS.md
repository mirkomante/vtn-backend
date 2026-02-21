# AI Agents Documentation

Questo file serve come punto di ingresso per gli Agenti AI che lavorano su questo repository.

## 🤖 Contesto per Agenti AI

Il progetto `vtn-backend` utilizza un'architettura fortemente opinata basata su configurazione centralizzata. Non scrivere codice "standard" Express/EJS senza prima consultare le regole.

### 1. Regole Fondamentali (.cursor/rules)
Le regole sono la fonte di verità per lo stile di codifica e l'architettura.
*   **`tech-stack.mdc`**: Panoramica delle tecnologie.
*   **`centralized-ui.mdc`**: **CRUCIALE**. Spiega come creare interfacce. Non creare form HTML a mano.
*   **`project-structure.mdc`**: Mappa del progetto.
*   **`authentication.mdc`**: Gestione Auth (Local + Google).
*   **`script-management.mdc`**: Come gestire i file JS client-side.
*   **`database.mdc`**: Pattern Prisma e Soft Delete.

### 2. Filosofia "Configuration-First"
Se devi aggiungere un nuovo campo a un form:
1.  **NON** modificare l'HTML (`.ejs`).
2.  **MODIFICA** il file di configurazione in `src/config/*FormData.ts`.
3.  Il sistema renderizzerà automaticamente il campo.

### 3. Filosofia "Soft Delete"
Se devi cancellare un record:
1.  **NON** usare `prisma.delete()`.
2.  **USA** `prisma.update({ data: { deletedAt: new Date() } })`.

### 4. Documentazione Umana
La documentazione completa per gli sviluppatori umani si trova in `docs/`. Usala come riferimento per capire la logica di business, ma segui le `.cursor/rules` per l'implementazione tecnica.
