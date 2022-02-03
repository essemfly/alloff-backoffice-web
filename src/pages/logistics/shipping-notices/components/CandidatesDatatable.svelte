<script lang="ts">
  import {
    DataTable,
    Tag,
    Toolbar,
    ToolbarBatchActions,
    Button,
  } from "carbon-components-svelte";
  import type { DataTableHeader } from "carbon-components-svelte/types/DataTable/DataTable";
  import { DateTime } from "luxon";
  import { ShippingCandidateProto, ShippingNoticesApi } from "../../../../api";
  import Export16 from "carbon-icons-svelte/lib/Export16";

  export let candidates: ShippingCandidateProto[];
  export let isMobile = false;
  let selectedRowIds: number[] = [];
  let selectedCandidates: ShippingCandidateProto[] = [];

  const mobileHeaders: DataTableHeader[] = [
    { key: "order_item_code", value: "아이템 코드" },
    { key: "shippable_items_count", value: "현재 출고 가능 수량" },
  ];

  const headers: DataTableHeader[] = [
    { key: "order_item_code", value: "아이템 코드" },
    { key: "product_name", value: "상품명" },
    { key: "product_option", value: "옵션명" },
    { key: "brand_korname", value: "브랜드" },
    { key: "quantity", value: "총 수량" },
    { key: "shipped_items_count", value: "출고된 수량" },
    { key: "fulfillable_items_count", value: "출고 필요 잔여 수량" },
    { key: "shippable_items_count", value: "현재 출고 가능 수량" },
    { key: "ordered_at", value: "주문 일시" },
  ];

  const submitCandidates = (candiates: ShippingCandidateProto[]) => {
    const api = new ShippingNoticesApi();
    const candidateSubmissionItems: {
      order_item_id: number;
      inventory_ids: number[];
    }[] = candidates.map((c) => ({
      order_item_id: c.item.id,
      inventory_ids: c.inventories.map((inv) => inv.id),
    }));

    return api.shippingNoticesMakeShippingNoticeWithCandidatesCreate({
      shippingCandidateSubmitItemProtoRequest: candidateSubmissionItems,
    });
  };

  $: {
    selectedCandidates = selectedRowIds.map((i) => candidates[i]);
  }
</script>

{#if candidates.length > 0}
  <DataTable
    headers={isMobile ? mobileHeaders : headers}
    rows={candidates.map((c, i) => ({ ...c, id: i }))}
    sortable
    expandable
    batchSelection
    bind:selectedRowIds
  >
    <Toolbar>
      <ToolbarBatchActions>
        <Button
          icon={Export16}
          on:click={async (e) => {
            e.stopPropagation();
            const res = await submitCandidates(selectedCandidates);
            window.location.href = "/logistics/shipping-notices/" + res.data.id;
          }}>출고지시서 생성</Button
        >
      </ToolbarBatchActions>
    </Toolbar>
    <span slot="cell" let:cell let:row>
      {#if cell.key === "ordered_at"}
        {DateTime.fromISO(row.item.ordered_at).setLocale("ko").toLocaleString({
          month: "2-digit",
          day: "2-digit",
          weekday: "narrow",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })}
      {:else if cell.key === "shippable_items_count"}
        {row.inventories.length}
      {:else}{row.item[cell.key]}
      {/if}
    </span>
    <div slot="expanded-row" let:row>
      <div class="row-detail">
        <div class="image">
          <img width="200" src={row.item.product_img} alt="Product" />
        </div>
        <div class="inventories">
          {#each row.inventories as inv}
            <div class="inventory">
              <Tag style="margin-left: 0;" type="purple"
                ><strong>{inv.code}</strong></Tag
              >
              <Tag type="green">{inv.brand_keyname}</Tag><br />
              <Tag type="cyan">사이즈: {inv.size}</Tag>
              {#if inv.color && inv.color !== ""}<Tag type="red"
                  >컬러: {inv.color}</Tag
                >{/if}
              {inv.product_name}
            </div>
          {/each}
        </div>
      </div>
    </div>
  </DataTable>
{:else}
  <h4>없음</h4>
{/if}

<style>
  .image {
    flex-shrink: 0;
  }

  .row-detail {
    display: flex;
    flex-direction: row;
  }

  .inventory {
    padding: 10px;
    background-color: white;
    box-shadow: 0px 10px 15px -3px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    margin: 10px;
    display: inline-block;
  }

  .inventories {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
</style>
