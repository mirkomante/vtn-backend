export interface TableDataSchema {
    tableHeads: TableHeader[];
    fields: TableField[];
    labels?: TableLabel[];
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
}
export interface TableLabel {
    name: string;
    label: string;
    edit: boolean;
}