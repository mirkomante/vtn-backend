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