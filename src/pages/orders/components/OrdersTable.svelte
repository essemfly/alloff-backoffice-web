<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import {
    Button,
    DataTable,
    Tag,
    Toolbar,
    ToolbarContent,
    ToolbarSearch,
  } from "carbon-components-svelte";
  import type { DataTableHeader } from "carbon-components-svelte/types/DataTable/DataTable";
  import Copy16 from "carbon-icons-svelte/lib/Copy16";
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
  export let isMobile = false;
  export let canSearch = true;

  const mobileHeaders: DataTableHeader[] = [
    { key: "code", value: "코드" },
    // { key: "orderstatus", value: "상태" },
    { key: "payment.buyername", value: "구매자" },
    // { key: "created", value: "일자" },
  ];
  const headers: DataTableHeader[] = [
    { key: "code", value: "코드" },
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
  on:click:row={(e) => {
    const url = `/orders/${e.detail.code.toLowerCase()}`;
    if (isMobile) {
      window.location.href = url;
      return;
    }
    window.open(url, "_blank");
  }}
>
  {#if canSearch}
    <Toolbar>
      <ToolbarContent>
        <ToolbarSearch on:input={handleSearch} />
      </ToolbarContent>
    </Toolbar>
  {/if}
  <span slot="cell" let:cell let:row>
    {#if cell.key === "orderstatus"}
      <Tag type={getStatusBadgeColor(cell.value)}
        >{getStatusLabel(cell.value)}</Tag
      >
    {:else if cell.key === "code"}
      <Button
        style="font-family: monospace; padding: 0;"
        size="small"
        kind="ghost"
        icon={Copy16}
        on:click={(e) => {
          e.stopPropagation();
          navigator.clipboard.writeText(cell.value);
          toast.push(`주문코드 ${cell.value}를 복사했습니다!`);
        }}>{cell.value}</Button
      >
    {:else if cell.key === "ordertype"}
      <Tag type={getTypeBadgeColor(cell.value)}>{getTypeLabel(cell.value)}</Tag>
    {:else if cell.key === "totalprice"}
      {numberWithCommas(cell.value)}
    {:else if cell.key === "created"}
      {DateTime.fromISO(cell.value).setLocale("ko").toLocaleString({
        month: "short",
        day: "numeric",
        weekday: "narrow",
      })}
    {:else}{cell.value}
    {/if}
  </span>
</DataTable>
