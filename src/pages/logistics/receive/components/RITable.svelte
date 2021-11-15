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
  import type { ReceivedItem } from "../../../../api";
  import { search } from "../store";

  export let ris: ReceivedItem[] = [];
  export let isMobile: boolean = false;
  export let reload: () => Promise<void>;
  export let receive: (id: number) => Promise<void>;
  export let revert: (id: number) => Promise<void>;

  const mobileHeaders: DataTableHeader[] = [
    { key: "item_name", value: "상품명" },
    { key: "brand_keyname", value: "브랜드" },
    { key: "sourcing_code", value: "소싱코드" },
  ];

  const headers: DataTableHeader[] = [
    { key: "id", value: "ID" },
    { key: "item_name", value: "상품명" },
    { key: "brand_keyname", value: "브랜드" },
    { key: "sourcing_code", value: "소싱코드" },
    { key: "size", value: "사이즈" },
    { key: "status", value: "상태" },
    { key: "ordered", value: "주문일시" },
    { key: "images", value: "이미지" },
    { key: "receive_button", value: "입고처리" },
  ];

  const handleSearch = debounce((e) => {
    search.set(e.target.value);
  }, 300);
</script>

<DataTable
  headers={isMobile ? mobileHeaders : headers}
  rows={ris}
  sortable
  on:click:row={(e) => {
    const url =
      e.detail.order_type === "TIMEDEAL_ORDER"
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
    {#if cell.key == "receive_button"}
      <Button
        iconDescription="입고처리"
        icon={row.status === "RECEIVED" ? Reset16 : Box16}
        size="small"
        on:click={async (e) => {
          e.stopPropagation();
          if (row.status === "RECEIVED") {
            if (confirm("입고처리를 취소하시겠습니까?")) {
              await revert(row.id);
            }
          } else {
            await receive(row.id);
          }
          await reload();
        }}
        kind={row.status === "RECEIVED" ? "danger" : "primary"}
      />
    {:else if cell.key === "ordered"}
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
    {:else if cell.key.includes("time")}
      {DateTime.fromISO(cell.value).setLocale("ko").toLocaleString({
        month: "2-digit",
        day: "2-digit",
        weekday: "narrow",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })}
    {:else}{cell.value}
    {/if}
  </span>
</DataTable>
