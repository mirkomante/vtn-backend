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
        { label: 'Prezzo', sort: true, name: 'prezzo', mobile: false },
        { label: 'In Lista', sort: true, name: 'inLista', mobile: false }
    ],
    fields: [
        { name: 'nome', label: true, edit: false, type: 'text' },
        { name: 'prezzo', label: false, edit: false, type: 'currency' },
        { name: 'inLista', label: false, edit: false, type: 'boolean', toggleable: true }
    ],
    layout: 'toggle',
    toggleableFields: ['inLista']
}

export const piattiTableData: TableDataSchema = {
    tableHeads: [
        { label: 'Nome', sort: true, name: 'nome', mobile: true },
        { label: 'Categoria', sort: true, name: 'categoria_nome', mobile: false },
        { label: 'Prezzo', sort: true, name: 'prezzo', mobile: false },
        { label: 'In Lista', sort: true, name: 'inLista', mobile: false }
    ],
    fields: [
        { name: 'nome', label: true, edit: false, type: 'text' },
        { name: 'categoria_nome', label: false, edit: false, type: 'text' },
        { name: 'prezzo', label: false, edit: false, type: 'currency' },
        { name: 'inLista', label: false, edit: false, type: 'boolean', toggleable: true }
    ],
    layout: 'toggle',
    toggleableFields: ['inLista']
}

export const menuFissiTableData: TableDataSchema = {
    tableHeads: [
        { label: 'Nome', sort: true, name: 'nome', mobile: true },
        { label: 'Categoria', sort: true, name: 'categoria_nome', mobile: false },
        { label: 'Prezzo', sort: true, name: 'prezzo', mobile: false },
        { label: 'In Lista', sort: true, name: 'inLista', mobile: false }
    ],
    fields: [
        { name: 'nome', label: true, edit: false, type: 'text' },
        { name: 'categoria_nome', label: false, edit: false, type: 'text' },
        { name: 'prezzo', label: false, edit: false, type: 'currency' },
        { name: 'inLista', label: false, edit: false, type: 'boolean', toggleable: true }
    ],
    layout: 'toggle',
    toggleableFields: ['inLista']
}

export const viniTableData: TableDataSchema = {
    tableHeads: [
        { label: 'Nome', sort: true, name: 'nome', mobile: true },
        { label: 'Tipologia', sort: true, name: 'tipologia_nome', mobile: false },
        { label: 'Prezzo Bottiglia', sort: true, name: 'prezzo', mobile: false },
        { label: 'Prezzo Calice', sort: true, name: 'prezzoCalice', mobile: false },
        { label: 'In Lista', sort: true, name: 'inLista', mobile: false }
    ],
    fields: [
        { name: 'nome', label: true, edit: false, type: 'text' },
        { name: 'tipologia_nome', label: false, edit: false, type: 'text' },
        { name: 'prezzo', label: false, edit: false, type: 'currency' },
        { name: 'prezzoCalice', label: false, edit: false, type: 'currency' },
        { name: 'inLista', label: false, edit: false, type: 'boolean', toggleable: true }
    ],
    layout: 'toggle',
    toggleableFields: ['inLista']
}

export const birreTableData: TableDataSchema = {
    tableHeads: [
        { label: 'Nome', sort: true, name: 'nome', mobile: true },
        { label: 'Tipologia', sort: true, name: 'tipologia_nome', mobile: false },
        { label: 'Prezzo', sort: true, name: 'prezzo', mobile: false },
        { label: 'In Lista', sort: true, name: 'inLista', mobile: false }
    ],
    fields: [
        { name: 'nome', label: true, edit: false, type: 'text' },
        { name: 'tipologia_nome', label: false, edit: false, type: 'text' },
        { name: 'prezzo', label: false, edit: false, type: 'currency' },
        { name: 'inLista', label: false, edit: false, type: 'boolean', toggleable: true }
    ],
    layout: 'toggle',
    toggleableFields: ['inLista']
}

export const liquoriTableData: TableDataSchema = {
    tableHeads: [
        { label: 'Nome', sort: true, name: 'nome', mobile: true },
        { label: 'Tipologia', sort: true, name: 'tipologia_nome', mobile: false },
        { label: 'Prezzo', sort: true, name: 'prezzo', mobile: false },
        { label: 'In Lista', sort: true, name: 'inLista', mobile: false }
    ],
    fields: [
        { name: 'nome', label: true, edit: false, type: 'text' },
        { name: 'tipologia_nome', label: false, edit: false, type: 'text' },
        { name: 'prezzo', label: false, edit: false, type: 'currency' },
        { name: 'inLista', label: false, edit: false, type: 'boolean', toggleable: true }
    ],
    layout: 'toggle',
    toggleableFields: ['inLista']
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

export const cocktailsTableData: TableDataSchema = {
    tableHeads: [
        { label: 'Nome', sort: true, name: 'nome', mobile: true },
        { label: 'Tipologia', sort: true, name: 'tipologia_nome', mobile: false },
        { label: 'Prezzo', sort: true, name: 'prezzo', mobile: false },
        { label: 'In Lista', sort: true, name: 'inLista', mobile: false }
    ],
    fields: [
        { name: 'nome', label: true, edit: false, type: 'text' },
        { name: 'tipologia_nome', label: false, edit: false, type: 'text' },
        { name: 'prezzo', label: false, edit: false, type: 'currency' },
        { name: 'inLista', label: false, edit: false, type: 'boolean', toggleable: true }
    ],
    layout: 'toggle',
    toggleableFields: ['inLista']
}

export const bevandeTableData: TableDataSchema = {
    tableHeads: [
        { label: 'Nome', sort: true, name: 'nome', mobile: true },
        { label: 'Tipologia', sort: true, name: 'tipologia_nome', mobile: false },
        { label: 'Prezzo', sort: true, name: 'prezzo', mobile: false },
        { label: 'In Lista', sort: true, name: 'inLista', mobile: false }
    ],
    fields: [
        { name: 'nome', label: true, edit: false, type: 'text' },
        { name: 'tipologia_nome', label: false, edit: false, type: 'text' },
        { name: 'prezzo', label: false, edit: false, type: 'currency' },
        { name: 'inLista', label: false, edit: false, type: 'boolean', toggleable: true }
    ],
    layout: 'toggle',
    toggleableFields: ['inLista']
}