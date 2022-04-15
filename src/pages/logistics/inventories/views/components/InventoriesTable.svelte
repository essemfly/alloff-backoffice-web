<script lang="ts">
  import debounce from "lodash/debounce";
  import { DateTime } from "luxon";
  import {
    Button,
    DataTable,
    Toolbar,
    ToolbarContent,
    ToolbarSearch,
  } from "carbon-components-svelte";
  import type { DataTableHeader } from "carbon-components-svelte/types/DataTable/DataTable";
  import Delete16 from "carbon-icons-svelte/lib/Delete16";

  import { InventoriesApi, Inventory } from "@lessbutter/alloff-backoffice-api";
  import { getInventoryStatusLabel } from "@app/helpers/inventory";
  import { search } from "../../store";

  export let inventories: Inventory[];
  export let isMobile = false;

  const mobileHeaders: DataTableHeader[] = [
    { key: "code", value: "코드" },
    { key: "product_name", value: "상품명" },
    { key: "brand_keyname", value: "브랜드" },
  ];

  const headers: DataTableHeader[] = [
    { key: "id", value: "ID" },
    { key: "code", value: "코드" },
    { key: "product_name", value: "상품명" },
    { key: "brand_keyname", value: "브랜드" },
    { key: "size", value: "사이즈" },
    { key: "status", value: "상태" },
    { key: "color", value: "컬러" },
    { key: "images", value: "이미지" },
    { key: "delete", value: "삭제" },
  ];

  const handleSearch = debounce((e) => {
    search.set(e.target.value);
  }, 300);

  const submitDelete = async (row: any) => {
    const api = new InventoriesApi();
    if (!confirm("정말 삭제하시겠습니까?")) return;
    try {
      await api.inventoriesDestroy({ id: row.id });
      window.location.reload();
    } catch (e: any) {
      alert(e.message);
    }
  };

  $: console.log({ inventories });
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
      <img src={row.product_img} width="100" alt="Inventory images" />
    {:else if cell.key === "delete"}
      <Button
        kind="danger"
        icon={Delete16}
        size="small"
        on:click={(e) => {
          e.stopPropagation();
          submitDelete(row);
        }}
      />
    {:else if cell.key === "status"}{getInventoryStatusLabel(cell.value)}
    {:else}{cell.value}
    {/if}
  </span>
</DataTable>
