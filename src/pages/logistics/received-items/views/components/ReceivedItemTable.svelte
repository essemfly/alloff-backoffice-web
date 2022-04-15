<script lang="ts">
  import debounce from "lodash/debounce";
  import { DateTime } from "luxon";
  import {
    Button,
    DataTable,
    Toolbar,
    InlineLoading,
    ToolbarContent,
    ToolbarSearch,
  } from "carbon-components-svelte";
  import type { DataTableHeader } from "carbon-components-svelte/types/DataTable/DataTable";
  import Box16 from "carbon-icons-svelte/lib/Box16";
  import Reset16 from "carbon-icons-svelte/lib/Reset16";
  import Close16 from "carbon-icons-svelte/lib/Close16";

  import {
    ReceivedItem,
    ReceivedItemStatusEnum,
  } from "@lessbutter/alloff-backoffice-api";
  import { getStatusLabel } from "@app/helpers/received-item";

  import { search } from "../../store";

  export let ris: ReceivedItem[] = [];
  export let isMobile = false;
  export let reload: () => Promise<void>;
  export let receive: (id: number) => Promise<void>;
  export let cancel: (id: number) => Promise<void>;
  export let revert: (id: number) => Promise<void>;
  export let forceReceive: (orderItemId: number) => Promise<void>;
  let loading = false;

  const mobileHeaders: DataTableHeader[] = [
    { key: "item_name", value: "상품명" },
    { key: "brand_keyname", value: "브랜드" },
    { key: "sourcing_code", value: "소싱코드" },
  ];

  const headers: DataTableHeader[] = [
    { key: "id", value: "ID" },
    { key: "product_name", value: "상품명" },
    { key: "brand_keyname", value: "브랜드" },
    { key: "code", value: "소싱코드" },
    { key: "size", value: "사이즈" },
    { key: "status", value: "상태" },
    { key: "created_at", value: "주문일시" },
    { key: "product_img", value: "이미지" },
    { key: "receive_button", value: "입고" },
    { key: "cancel_button", value: "취소" },
  ];

  const handleSearch = debounce((e) => {
    search.set(e.target.value);
  }, 300);
</script>

{#if loading}
  <div class="overlay">
    <div>
      <InlineLoading description="LOADING..." />
    </div>
  </div>
{:else}
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
      {#if cell.key == "receive_button" && (row.status === ReceivedItemStatusEnum.OnReceiving || row.status === ReceivedItemStatusEnum.Reverted || row.status === ReceivedItemStatusEnum.Canceled)}
        <Button
          iconDescription={row.status === ReceivedItemStatusEnum.OnReceiving
            ? "입고처리"
            : "재입고"}
          icon={row.status === ReceivedItemStatusEnum.OnReceiving
            ? Box16
            : Reset16}
          size="small"
          on:click={async (e) => {
            loading = true;
            e.stopPropagation();
            if (row.status === ReceivedItemStatusEnum.OnReceiving) {
              await receive(row.id);
              await reload();
            } else if (
              row.status === ReceivedItemStatusEnum.Reverted ||
              row.status === ReceivedItemStatusEnum.Canceled
            ) {
              await forceReceive(row.order_item.id);
              window.location.reload();
            }
            loading = false;
          }}
          kind={row.status === ReceivedItemStatusEnum.OnReceiving
            ? "primary"
            : "tertiary"}
        />
      {:else if cell.key === "cancel_button" && (row.status === ReceivedItemStatusEnum.OnReceiving || row.status === ReceivedItemStatusEnum.Received)}
        <Button
          iconDescription={row.status === ReceivedItemStatusEnum.Received
            ? "재고삭제 (입고원복)"
            : "입고요청 취소"}
          icon={row.status === ReceivedItemStatusEnum.Received
            ? Box16
            : Close16}
          size="small"
          on:click={async (e) => {
            loading = true;
            e.stopPropagation();
            if (row.status === ReceivedItemStatusEnum.Received) {
              await revert(row.id);
            } else if (row.status === ReceivedItemStatusEnum.OnReceiving) {
              await cancel(row.id);
            }
            await reload();
            loading = false;
          }}
          kind={row.status === ReceivedItemStatusEnum.Received
            ? "danger"
            : "danger-tertiary"}
        />
      {:else if cell.key === "status"}
        {getStatusLabel(row.status)}
      {:else if cell.key === "created_at"}
        {DateTime.fromISO(cell.value).setLocale("ko").toLocaleString({
          month: "2-digit",
          day: "2-digit",
          weekday: "narrow",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })}
      {:else if cell.key === "product_img"}
        <img src={row.product_img} width="100" alt="상품 이미지" />
      {:else if cell.key.includes("time")}
        {DateTime.fromISO(cell.value).setLocale("ko").toLocaleString({
          month: "2-digit",
          day: "2-digit",
          weekday: "narrow",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })}
      {:else if cell.value}{cell.value}
      {:else}
        <div />
      {/if}
    </span>
  </DataTable>
{/if}

<style>
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
  }
</style>
