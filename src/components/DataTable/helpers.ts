import type {
  DataTableHeader,
  DataTableRow,
} from "carbon-components-svelte/types/DataTable/DataTable.svelte";

import type { DataTableColumn } from "./DataTable.svelte";

export const getHeaders = <T>(
  columns: DataTableColumn<T>[],
  isMobile = false,
): DataTableHeader[] =>
  columns
    .filter((x) => (x.hideMobile && !isMobile) || !x.hideMobile)
    .map(({ key, name }) => ({ key: key as string, value: name }));

export const getRows = <T>(
  data: Array<T & { id: string }>,
  columns: DataTableColumn<T>[],
  isMobile = false,
): DataTableRow[] => {
  return data.map((row) => {
    const rowData: DataTableRow = {
      id: row.id,
    };
    columns.forEach((x) => {
      if (x.hideMobile && isMobile) {
        return;
      }
      if (x.get) {
        rowData[x.key as string] = x.get(row);
      } else {
        rowData[x.key as string] = row[x.key];
      }
      if (x.maxLength && rowData[x.key as string].length > x.maxLength) {
        rowData[x.key as string] =
          rowData[x.key as string].substring(
            0,
            Math.min(rowData[x.key as string].length, x.maxLength),
          ) + "...";
      }
    });
    return rowData;
  });
};
