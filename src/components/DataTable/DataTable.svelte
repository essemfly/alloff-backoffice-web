<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { DataTable } from "carbon-components-svelte";
  import type {
    DataTableHeader,
    DataTableRow,
    DataTableCell,
  } from "carbon-components-svelte/types/DataTable/DataTable";

  export type T = any;

  type TableHeader<T> = DataTableHeader & Record<keyof T, any>;
  type TableRow<T> = DataTableRow & Record<keyof T, any>;

  export let headers: TableHeader<T>[];
  export let rows: TableRow<T>[];
  export let sortable: boolean = false;

  const dispatch = createEventDispatcher();

  const handleRowClick = (event: CustomEvent<DataTableRow>) => {
    dispatch("click:row", event);
  };

  const handleCellClick = (event: CustomEvent<DataTableCell>) => {
    dispatch("click:cell", event);
  };
</script>

<DataTable
  {headers}
  {rows}
  on:click:row={handleRowClick}
  on:click:cell={handleCellClick}
  {sortable}
>
  <span slot="cell" let:cell>
    {cell.value}
  </span>
</DataTable>

<style>
  :global(.bx--data-table tr) {
    cursor: pointer;
  }
</style>
