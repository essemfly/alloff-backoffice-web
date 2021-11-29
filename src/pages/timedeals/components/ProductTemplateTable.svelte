<script lang="ts">
  import { DataTable } from "carbon-components-svelte";
  import type {
    DataTableHeader,
    DataTableValue,
  } from "carbon-components-svelte/types/DataTable/DataTable";

  let tableKeys: DataTableHeader[] = [
    { key: "brand.korname", value: "브랜드명" },
    { key: "brand.keyname", value: "KEYNAME" },
    { key: "producttype", value: "상품타입" },
    { key: "name", value: "상품명" },
    { key: "discountedprice", value: "할인가격" },
    { key: "images", value: "이미지" },
  ];
  export let templateData: DataTableValue[] = [];
</script>

<div>
  <h2>템플릿 불러오기</h2>
  <DataTable headers={tableKeys} rows={templateData} />
</div>
