<script lang="ts">
  import {
    Button,
    DataTable,
    Toolbar,
    ToolbarContent,
    ToolbarSearch,
  } from "carbon-components-svelte";
  import type { DataTableHeader } from "carbon-components-svelte/types/DataTable/DataTable";
  import Box16 from "carbon-icons-svelte/lib/Box16";
  import Reset16 from "carbon-icons-svelte/lib/Reset16";
  import debounce from "lodash/debounce";
  import { DateTime } from "luxon";
  import type { Inventory } from "../../../../api";
  import { getInventoryStatusLabel } from "../../../../helpers/inventory";
  import { search } from "../store";

  export let inventories: Inventory[] = [];
  export let isMobile: boolean = false;

  const mobileHeaders: DataTableHeader[] = [
    { key: "code", value: "코드" },
    { key: "product_name", value: "상품명" },
    { key: "product_brand", value: "브랜드" },
  ];

  const headers: DataTableHeader[] = [
    { key: "id", value: "ID" },
    { key: "code", value: "코드" },
    { key: "product_name", value: "상품명" },
    { key: "product_brand", value: "브랜드" },
    { key: "size", value: "사이즈" },
    { key: "status", value: "상태" },
    { key: "location", value: "위치" },
    { key: "images", value: "이미지" },
  ];

  const handleSearch = debounce((e) => {
    search.set(e.target.value);
  }, 300);
</script>

<DataTable
  headers={isMobile ? mobileHeaders : headers}
  rows={inventories}
  sortable
  on:click:row={(e) => {
    const url =
      e.detail.produt_type === "TIMEDEAL_PRODUCT"
        ? `/timedeal-products/${e.detail.product_id}`
        : `/orders/${e.detail.in_order_id}`;
    if (isMobile) {
      window.location.href = url;
      return;
    }
    window.open(url, "_blank");
  }}
>
  <Toolbar>
    <ToolbarContent>
      <ToolbarSearch on:input={handleSearch} />
    </ToolbarContent>
  </Toolbar>
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
    {:else if cell.key === "images"}
      <img src={row.images[0]} width="100" />
    {:else if cell.key === "status"}{getInventoryStatusLabel(cell.value)}
    {:else}{cell.value}
    {/if}
  </span>
</DataTable>
