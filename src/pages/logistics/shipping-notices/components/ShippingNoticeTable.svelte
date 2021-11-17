<script lang="ts">
  import { DataTable } from "carbon-components-svelte";
  import type { DataTableHeader } from "carbon-components-svelte/types/DataTable/DataTable";
  import { DateTime } from "luxon";
  import type { ShippingNotice } from "../../../../api";

  export let notices: ShippingNotice[] = [];
  export let isMobile: boolean = false;

  const mobileHeaders: DataTableHeader[] = [
    { key: "code", value: "코드" },
    { key: "status", value: "상태" },
  ];

  const headers: DataTableHeader[] = [
    { key: "id", value: "ID" },
    { key: "code", value: "코드" },
    { key: "status", value: "상태" },
    { key: "count", value: "수량" },
  ];
</script>

<DataTable
  headers={isMobile ? mobileHeaders : headers}
  rows={notices}
  sortable
  on:click:row={(e) => {
    const url = `shipping-notices/${e.detail.id}`;
    if (isMobile) {
      window.location.href = url;
      return;
    }
    window.open(url, "_blank");
  }}
>
  <span slot="cell" let:cell let:row>
    {#if cell.key === "ordered"}
      {DateTime.fromISO(cell.value).setLocale("ko").toLocaleString({
        month: "2-digit",
        day: "2-digit",
        weekday: "narrow",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })}
    {:else if cell.key === "count"}
      {row.items.length}
    {:else}{cell.value}
    {/if}
  </span>
</DataTable>
