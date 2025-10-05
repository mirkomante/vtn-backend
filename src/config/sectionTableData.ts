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

export const serviziTableData: TableDataSchema = {
    tableHeads: [
        { label: 'Nome', sort: true, name: 'nome', mobile: true },
        { label: 'Descrizione', sort: false, name: 'descrizione', mobile: false },
        { label: 'Prezzo', sort: true, name: 'prezzo', mobile: false },
        { label: 'In Lista', sort: true, name: 'inLista', mobile: false }
    ],
    fields: [
        { name: 'nome', label: true, edit: false, type: 'text' },
        { name: 'descrizione', label: false, edit: false, type: 'text' },
        { name: 'prezzo', label: false, edit: false, type: 'currency' },
        { name: 'inLista', label: false, edit: false, type: 'boolean' }
    ]
}

export const piattiTableData: TableDataSchema = {
    tableHeads: [
        { label: 'Nome', sort: true, name: 'nome', mobile: true },
        { label: 'Categoria', sort: true, name: 'categoria_nome', mobile: false },
        { label: 'Prezzo', sort: true, name: 'prezzo', mobile: false },
        { label: 'Allergeni', sort: false, name: 'allergeni_count', mobile: false },
        { label: 'In Lista', sort: true, name: 'inLista', mobile: false }
    ],
    fields: [
        { name: 'nome', label: true, edit: false, type: 'text' },
        { name: 'categoria_nome', label: false, edit: false, type: 'text' },
        { name: 'prezzo', label: false, edit: false, type: 'currency' },
        { name: 'allergeni_count', label: false, edit: false, type: 'text' },
        { name: 'inLista', label: false, edit: false, type: 'boolean' }
    ]
}

export const menuFissiTableData: TableDataSchema = {
    tableHeads: [
        { label: 'Nome', sort: true, name: 'nome', mobile: true },
        { label: 'Categoria', sort: true, name: 'categoria_nome', mobile: false },
        { label: 'Prezzo', sort: true, name: 'prezzo', mobile: false },
        { label: 'Piatti', sort: false, name: 'piatti_count', mobile: false },
        { label: 'Servizi', sort: false, name: 'servizi_count', mobile: false },
        { label: 'In Lista', sort: true, name: 'inLista', mobile: false }
    ],
    fields: [
        { name: 'nome', label: true, edit: false, type: 'text' },
        { name: 'categoria_nome', label: false, edit: false, type: 'text' },
        { name: 'prezzo', label: false, edit: false, type: 'currency' },
        { name: 'piatti_count', label: false, edit: false, type: 'text' },
        { name: 'servizi_count', label: false, edit: false, type: 'text' },
        { name: 'inLista', label: false, edit: false, type: 'boolean' }
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