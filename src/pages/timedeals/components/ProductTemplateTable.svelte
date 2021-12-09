<script lang="ts">
  import { DataTable } from "carbon-components-svelte";
  import { createEventDispatcher } from "svelte";

  import type {
    DataTableHeader,
    DataTableRow,
    DataTableValue,
  } from "carbon-components-svelte/types/DataTable/DataTable";
  import { TimedealProductTemplate } from "../../../api";

  let tableKeys: DataTableHeader[] = [
    { key: "brand.keyname", value: "KEYNAME" },
    { key: "producttype", value: "상품타입" },
    { key: "name", value: "상품명" },
    { key: "brand.korname", value: "브랜드명" },
    { key: "discountedprice", value: "할인가격" },
    { key: "images", value: "이미지" },
  ];
  export let templateData: DataTableValue[] = [];
  export let onCloseModal: (arg: DataTableRow) => void;
  
</script>

<div>
  <DataTable
    headers={tableKeys}
    rows={templateData}
    on:click:row={(e) => {
      console.log("E", e.detail);
      onCloseModal(e.detail)
    }}
  >
    <span slot="cell" let:cell let:row>
      {#if cell.key === "images"}
        <img src={row.images[0]} width="100" alt="" />
      {:else if cell.key === "producttype"}
        {row.producttype[1]}
      {:else}{cell.value}
      {/if}
    </span>
  </DataTable>
</div>
