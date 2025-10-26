export interface TableDataSchema {
    tableHeads: TableHeader[];
    fields: TableField[];
    labels?: TableLabel[];
    layout?: 'default' | 'toggle';
    toggleableFields?: string[];
}

export interface TableHeader {
    label: string;
    sort: boolean;
    name: string;
    mobile: boolean;
    icon?: string;
}
export interface TableField {
    name: string;
    label: boolean;
    edit: boolean;
    type: string;
    toggleable?: boolean;
}
export interface TableLabel {
    name: string;
    label: string;
    edit: boolean;
}