<script lang="ts">
  import { Button, DataTable, Toggle } from "carbon-components-svelte";
  import Launch16 from "carbon-icons-svelte/lib/Launch16";
  import { createEventDispatcher } from "svelte";

  import {
    DataTableColumn,
    DataTableData,
    getHeaders,
    getRows,
  } from "./helpers";

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

  const handleOpen = (path: string) => () => {
    window.open(path, "_blank"); // todo: not use window.open
  };

  $: if (data) {
    rows = getRows<T>(data, columns);
  }
</script>

<DataTable
  {headers}
  {rows}
  on:click:row={(event) => {
    dispatch("click:row", event.detail);
  }}
>
  <span
    slot="cell"
    let:cell
    let:row
    on:click={() => {
      dispatch("click", { row, cell });
      dispatch("click:cell", cell);
    }}
  >
    {#if imageColumns.includes(cell.key) && cell.value}
      <img
        src={cell.value}
        alt={[row.id, "thumbnail"].join("-")}
        class="cell_thumb"
      />
    {:else if linkColumns.includes(cell.key) && cell.value}
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
    {:else}
      {cell.value}
    {/if}
  </span>
</DataTable>

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
