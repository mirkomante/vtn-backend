import { TableDataSchema } from "./tableDataSchema";

export const utentiTableData: TableDataSchema = {
    tableHeads: [
        { label: 'Nome', sort: true, name: 'givenName', mobile: true },
        { label: 'Email', sort: true, name: 'email', mobile: false },
        { label: 'Autenticazione', sort: true, name: 'authProvider', mobile: false },
        { label: 'Ruolo', sort: true, name: 'role', mobile: false }
    ],
    fields: [
        { name: 'givenName', label: true, edit: false, type: 'text' },
        { name: 'email', label: false, edit: false, type: 'email' },
        { name: 'authProvider', label: false, edit: false, type: 'text' },
        { name: 'role', label: false, edit: false, type: 'text' }
    ]
}

export const elementiCancellatiTableData: TableDataSchema = {
    tableHeads: [
        { label: 'Nome', sort: true, name: 'nome', mobile: true },
        { label: 'Tipo', sort: true, name: 'type_label', mobile: false },
        { label: 'Descrizione', sort: false, name: 'descrizione', mobile: false },
        { label: 'Categoria', sort: false, name: 'categoria_nome', mobile: false },
        { label: 'Data Cancellazione', sort: true, name: 'deletedAt', mobile: false }
    ],
    fields: [
        { name: 'nome', label: true, edit: false, type: 'text' },
        { name: 'type_label', label: false, edit: false, type: 'text' },
        { name: 'descrizione', label: false, edit: false, type: 'text' },
        { name: 'categoria_nome', label: false, edit: false, type: 'text' },
        { name: 'deletedAt', label: false, edit: false, type: 'date' }
    ]
}