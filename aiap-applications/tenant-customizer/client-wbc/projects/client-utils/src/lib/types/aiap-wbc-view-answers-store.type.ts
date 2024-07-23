export interface ExcellExportMappedDataItem {
    key: string,
    language: string,
    value: string,
    label: string
};

export interface ExcellExportMappedData extends Array<ExcellExportMappedDataItem> { }
