<script lang="ts">
  import { DataTable } from "carbon-components-svelte";
  import type { DataTableHeader } from "carbon-components-svelte/types/DataTable/DataTable";
  import { DateTime } from "luxon";
  type DataItem = { count: number; amount: number };
  export let data: { id: Date; nominal: DataItem; noncancel: DataItem }[] = [];

  const headers: DataTableHeader[] = [
    { key: "id", value: "일자" },
    { key: "nominalAmount", value: "전체거래액" },
    { key: "nominalCount", value: "전체건수" },
    { key: "noncancelAmount", value: "유효거래액" },
    { key: "noncancelCount", value: "유효건수" },
  ];
</script>

<DataTable {headers} rows={data} sortable>
  <span slot="cell" let:cell let:row>
    {#if cell.key === "id"}
      {DateTime.fromJSDate(cell.value).setLocale("ko").toLocaleString({
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })}
    {:else if cell.key === "nominalCount"}
      {row.nominal.count}
    {:else if cell.key === "nominalAmount"}
      {row.nominal.amount}
    {:else if cell.key === "noncancelCount"}
      {row.noncancel.count}
    {:else if cell.key === "noncancelAmount"}
      {row.noncancel.amount}
    {:else}{cell.value}
    {/if}
  </span>
</DataTable>
