import type {
  DataTableHeader,
  DataTableRow,
} from "carbon-components-svelte/types/DataTable/DataTable";

export type DataTableData<T> = T & { id: string };
export type DataTableColumnType = "image" | "link" | "string" | "number";

export type DataTableColumn<T> = {
  key: keyof T;
  name: string;
  get?: (data: T) => string | number;
  type?: DataTableColumnType;
};

export { DataTableRow };

export const getHeaders = <T>(
  columns: DataTableColumn<T>[],
): DataTableHeader[] =>
  columns.map(({ key, name }) => ({ key: key as string, value: name }));

export const getRows = <T>(
  data: Array<T & { id: string }>,
  columns: DataTableColumn<T>[],
): DataTableRow[] => {
  return data.map((row) => {
    const rowData: DataTableRow = {
      id: row.id,
    };
    columns.forEach((x) => {
      if (x.get) {
        rowData[x.key as string] = x.get(row);
      } else {
        rowData[x.key as string] = row[x.key];
      }
    });
    return rowData;
  });
};
