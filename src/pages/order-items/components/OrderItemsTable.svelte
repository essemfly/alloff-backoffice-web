<script lang="ts">
  import debounce from "lodash/debounce";
  import { DateTime } from "luxon";
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

  import { OrderItemList } from "@api";
  import { numberWithCommas } from "@app/helpers/number";
  import {
    getIsForeignBadgeColor,
    getIsForeignLabel,
    getStatusBadgeColor,
    getStatusLabel,
    getTypeBadgeColor,
    getTypeLabel,
  } from "@app/helpers/order-item";

  import { search } from "../store";

  export let items: OrderItemList[] = [];
  export let isMobile: boolean = false;
  export let canSearch: boolean = true;

  const mobileHeaders: DataTableHeader[] = [
    { key: "code", value: "코드" },
    // { key: "orderstatus", value: "상태" },
    { key: "payment.buyername", value: "구매자" },
    // { key: "created", value: "일자" },
  ];
  const headers: DataTableHeader[] = [
    { key: "order_item_code", value: "코드" },
    { key: "is_foreign", value: "해외여부" },
    { key: "order_item_type", value: "타입" },
    { key: "order_item_status", value: "상태" },
    {
      key: "total_amount",
      value: "가액",
    },
    { key: "product_name", value: "상품" },
    { key: "order.payment.buyer_name", value: "구매자" },
    { key: "order.payment.buyer_mobile", value: "휴대폰" },
    { key: "ordered_at", value: "일자" },
  ];

  const handleSearch = debounce((e) => {
    search.set(e.target.value);
  }, 300);
</script>

<DataTable
  headers={isMobile ? mobileHeaders : headers}
  rows={items}
  sortable
  on:click:row={(e) => {
    const url = `/items/${e.detail.order_item_code}`;
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
    {#if cell.key === "order_item_status"}
      <Tag type={getStatusBadgeColor(cell.value)}
        >{getStatusLabel(cell.value)}</Tag
      >
    {:else if cell.key === "is_foreign"}
      <Tag type={getIsForeignBadgeColor(cell.value)}
        >{getIsForeignLabel(cell.value)}</Tag
      >
    {:else if cell.key === "order_item_code"}
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
    {:else if cell.key === "order_item_type"}
      <Tag type={getTypeBadgeColor(cell.value)}>{getTypeLabel(cell.value)}</Tag>
    {:else if cell.key === "total_amount"}
      {numberWithCommas(cell.value)}
    {:else if cell.key === "ordered_at"}
      {DateTime.fromISO(row.ordered_at ?? row.created_at)
        .setLocale("ko")
        .toLocaleString({
          month: "short",
          day: "numeric",
          weekday: "narrow",
        })}
    {:else}{cell.value}
    {/if}
  </span>
</DataTable>
