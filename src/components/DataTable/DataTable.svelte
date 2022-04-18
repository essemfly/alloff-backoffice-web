<script context="module" lang="ts">
  import type { DataTableRow } from "carbon-components-svelte/types/DataTable/DataTable.svelte";

  export type DataTableData<T> = T & { id: string };
  type DataTableColumnType =
    | "image"
    | "link"
    | "toggle"
    | "string"
    | "weight"
    | "number";

  export type DataTableColumn<T> = {
    key: keyof T;
    name: string;
    get?: (data: T) => string | number | boolean;
    type?: DataTableColumnType;
  };

  export { DataTableRow };
</script>

<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import {
    Button,
    Column,
    DataTable,
    NumberInput,
    Row,
    Tile,
    Toggle,
  } from "carbon-components-svelte";
  import Launch16 from "carbon-icons-svelte/lib/Launch16";

  import { getHeaders, getRows } from "./helpers";

  type T = any;

  export let columns: DataTableColumn<T>[] = [];
  export let data: DataTableData<T>[] = [];

  const dispatch = createEventDispatcher();

  let rows = getRows<T>(data, columns);
  const headers = getHeaders<T>(columns);
  const imageColumns = columns
    .filter(({ type }) => type === "image")
    .map(({ key }) => key);
  const linkColumns = columns
    .filter(({ type }) => type === "link")
    .map(({ key }) => key);
  const toggleColumns = columns
    .filter(({ type }) => type === "toggle")
    .map(({ key }) => key);

  const handleOpen = (path: string) => (event: MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    window.open(path, "_blank"); // todo: not use window.open
  };

  const handleWeightChange = (rowId: string) => (event: CustomEvent) => {
    event.stopPropagation();
    event.preventDefault();
    const value = event.detail;
    const rowIndex = data.findIndex(({ id }) => id === rowId);
    dispatch("change:weight", [value, rowIndex]);
  };

  const handleToggle = (row: T, value: boolean, key: keyof T) => {
    const rowIndex = data.findIndex(({ id }) => id === row.id);
    dispatch("change:toggle", [value, rowIndex, key]);
  };

  $: if (data) {
    rows = getRows<T>(data, columns);
  }
</script>

<DataTable
  {headers}
  {rows}
  sortable
  on:click:row={(event) => {
    dispatch("click:row", event.detail);
  }}
>
  <slot />
  <span
    slot="cell"
    let:cell
    let:row
    on:click={(event) => {
      if (toggleColumns.includes(cell.key)) {
        event.stopPropagation();
        event.preventDefault();
        handleToggle(row, !cell.value, cell.key);
      }
      if (cell.key === "weight") {
        event.stopPropagation();
        event.preventDefault();
      } else {
        dispatch("click", { row, cell });
        dispatch("click:cell", cell);
      }
    }}
  >
    {#if imageColumns.includes(cell.key) && cell.value}
      <img
        src={cell.value}
        alt={[row.id, "thumbnail"].join("-")}
        class="cell_thumb"
      />
    {:else if linkColumns.includes(cell.key) && cell.value !== ""}
      <Button
        tooltipPosition="bottom"
        tooltipAlignment="end"
        iconDescription="상세"
        icon={Launch16}
        kind="ghost"
        size="small"
        on:click={handleOpen(cell.value)}
      />
    {:else if toggleColumns.includes(cell.key) && cell.value !== undefined}
      <Toggle size="sm" toggled={cell.value} />
    {:else if cell.key === "weight"}
      <NumberInput
        size="sm"
        value={cell.value}
        on:change={handleWeightChange(row.id)}
      />
    {:else}
      {cell.value}
    {/if}
  </span>
</DataTable>

{#if rows.length === 0}
  <Row>
    <Column>
      <Tile>No data</Tile>
    </Column>
  </Row>
{/if}

<style>
  :global(.bx--data-table tr) {
    cursor: pointer;
  }

  .cell_thumb {
    width: 100px;
    height: 100px;
    object-fit: cover;
  }
</style>
