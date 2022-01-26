<script lang="ts">
  import { onMount } from "svelte";
  import { navigate } from "svelte-navigator";
  import {
    Button,
    DataTable,
    Search,
    Toolbar,
    ToolbarContent,
    ToolbarSearch,
  } from "carbon-components-svelte";
  import type { DataTableHeader } from "carbon-components-svelte/types/DataTable/DataTable";
  import DocumentAdd16 from "carbon-icons-svelte/lib/DocumentAdd16";
  import LoggedInFrame from "../common/LoggedInFrame.svelte";
  // import ProductGroupCard from "./components/ProductGroupCard.svelte";
  import Pagination from "../../components/Pagination.svelte";

  import { ProductGroup, ProductGroupsApi } from "../../api";
  import { DateTime } from "luxon";
  import debounce from "lodash/debounce";

  let productGroups: Array<ProductGroup & { id: string }> = [];
  let page = 1;
  let totalItems = 0;

  const productGroupApi = new ProductGroupsApi();

  const headers: DataTableHeader[] = [
    { key: "image_url", value: "썸네일" },
    { key: "title", value: "타이틀" },
    { key: "short_title", value: "짧은 타이틀" },
    { key: "start_time", value: "시작일시" },
    { key: "finish_time", value: "종료일시" },
  ];

  onMount(async () => {
    const res = await productGroupApi.productGroupsList();
    productGroups = res.data.map((x) => ({ ...x, id: x.product_group_id }));
  });

  const handleAddClick = (event: MouseEvent) => {
    event.preventDefault();
    navigate("/product-groups/add");
  };

  const handleSearch = debounce((e) => {
    // search.set(e.target.value);
  }, 300);
</script>

<LoggedInFrame>
  <div class="button-wrapper mb10">
    <Button icon={DocumentAdd16} on:click={handleAddClick}>컬렉션 추가</Button>
  </div>
  <Pagination {page} {totalItems} />
  <Search />
  <DataTable {headers} rows={productGroups} sortable>
    <Toolbar>
      <ToolbarContent>
        <ToolbarSearch on:input={handleSearch} />
      </ToolbarContent>
    </Toolbar>
    <span slot="cell" let:cell let:row>
      {#if cell.key === "image_url"}
        <img src={cell.value} alt={"thumbnail"} />
      {:else if cell.key === "start_time" || cell.key === "finish_time"}
        {DateTime.fromISO(cell.value).setLocale("ko").toLocaleString({
          month: "short",
          day: "numeric",
          weekday: "narrow",
        })}
      {:else}{cell.value}
      {/if}
    </span>
  </DataTable>
  <div class="button-wrapper mt10">
    <Button icon={DocumentAdd16} on:click={handleAddClick}>컬렉션 추가</Button>
  </div>
  <Pagination {page} {totalItems} />
  <Search />
</LoggedInFrame>

<style>
  .product-group-list {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    flex: 1 0 21%; /* explanation below */
    justify-content: space-between;
  }

  .button-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }

  .mb10 {
    margin-bottom: 10px;
  }

  .mt10 {
    margin-top: 10px;
  }
</style>
