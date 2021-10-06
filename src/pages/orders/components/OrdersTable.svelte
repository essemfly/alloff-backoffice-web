<script lang="ts">
  import {
    DataTable,
    Tag,
    Toolbar,
    ToolbarContent,
    ToolbarSearch,
  } from "carbon-components-svelte";
  import type { DataTableHeader } from "carbon-components-svelte/types/DataTable/DataTable";
  import debounce from "lodash/debounce";
  import { DateTime } from "luxon";
  import type { OrderList } from "../../../api";
  import { numberWithCommas } from "../../../helpers/number";
  import {
    getStatusBadgeColor,
    getStatusLabel,
    getTypeBadgeColor,
    getTypeLabel,
  } from "../../../helpers/order";
  import { search } from "../store";

  export let orders: OrderList[] = [];
  export let isMobile: boolean = false;

  const mobileHeaders: DataTableHeader[] = [
    { key: "orderstatus", value: "상태" },
    { key: "payment.buyername", value: "구매자" },
    // { key: "created", value: "일자" },
  ];

  const headers: DataTableHeader[] = [
    { key: "ordertype", value: "타입" },
    { key: "orderstatus", value: "상태" },
    {
      key: "totalprice",
      value: "가액",
    },
    { key: "payment.name", value: "상품" },
    { key: "payment.buyername", value: "구매자" },
    { key: "user.mobile", value: "휴대폰" },
    { key: "created", value: "일자" },
  ];

  const handleSearch = debounce((e) => {
    search.set(e.target.value);
  }, 300);
</script>

<DataTable
  headers={isMobile ? mobileHeaders : headers}
  rows={orders}
  sortable
  on:click:row={(e) => window.open(`${window.location.href}/${e.detail.id}`, "_blank")}
>
  <Toolbar>
    <ToolbarContent>
      <ToolbarSearch on:input={handleSearch} />
    </ToolbarContent>
  </Toolbar>
  <span slot="cell" let:cell let:row>
    {#if cell.key == "orderstatus"}
      <Tag type={getStatusBadgeColor(cell.value)}
        >{getStatusLabel(cell.value)}</Tag
      >
    {:else if cell.key == "ordertype"}
      <Tag type={getTypeBadgeColor(cell.value)}>{getTypeLabel(cell.value)}</Tag>
    {:else if cell.key == "totalprice"}
      {numberWithCommas(cell.value)}
    {:else if cell.key == "created"}
      {DateTime.fromISO(cell.value).setLocale("ko").toLocaleString({
        month: "short",
        day: "numeric",
        weekday: "narrow",
      })}
    {:else}{cell.value}
    {/if}
  </span>
</DataTable>

