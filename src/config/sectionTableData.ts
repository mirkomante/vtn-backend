import { TableDataSchema } from "./tableDataSchema";

export const utentiTableData: TableDataSchema = {
    tableHeads: [
        { label: 'Nome', sort: true, name: 'name', mobile: true },
        { label: 'Email', sort: true, name: 'email', mobile: false },
        { label: 'Ruolo', sort: true, name: 'role', mobile: false },
        { label: 'Autorizzazione', sort: true, name: 'auth', mobile: false },
        { label: '', sort: false, name: '', mobile: true }
    ],
    fields: [
        { name: 'name', label: true, edit: false, type: 'text' },
        { name: 'email', label: false, edit: false, type: 'email' },
        { name: 'role', label: false, edit: false, type: 'text' },
        { name: 'auth', label: false, edit: false, type: 'text' },
        { name: '', label: false, edit: true, type: 'button' }
    ]
}