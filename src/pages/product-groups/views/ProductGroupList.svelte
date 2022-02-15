<script lang="ts">
  import { navigate, useLocation } from "svelte-navigator";
  import { Button, DataTable } from "carbon-components-svelte";
  import type { DataTableHeader } from "carbon-components-svelte/types/DataTable/DataTable";
  import DocumentAdd16 from "carbon-icons-svelte/lib/DocumentAdd16";

  import {
    ProductGroup,
    ProductGroupsApi,
    ProductGroupsApiProductGroupsListRequest as SearchQueryParam,
  } from "@api";
  import Nav from "@app/components/Nav.svelte";
  import { parseQueryString } from "@app/helpers/query-string";
  import { formatDate } from "@app/helpers/date";
  // import Pagination from "@app/components/Pagination.svelte";

  let productGroups: Array<ProductGroup & { id: string }> = [];
  let searchFilter: SearchQueryParam = {
    offset: 0,
    limit: 50,
    searchQuery: undefined,
    groupType: undefined,
  };
  let totalItems = 0;

  const productGroupApi = new ProductGroupsApi();
  const location = useLocation<SearchQueryParam>();

  const headers: DataTableHeader[] = [
    { key: "image_url", value: "썸네일" },
    { key: "title", value: "타이틀" },
    { key: "short_title", value: "짧은 타이틀" },
    { key: "start_time", value: "시작일시" },
    { key: "finish_time", value: "종료일시" },
  ];

  const load = async (params: SearchQueryParam) => {
    const res = await productGroupApi.productGroupsList(params);
    // productGroups = res.data.pgs.map((x) => ({ ...x, id: x.product_group_id }));
    // totalItems = res.data.total_counts;

    productGroups = res.data.map((x) => ({ ...x, id: x.product_group_id }));
    totalItems = res.data.length;
  };

  // const handleSearch = debounce((e) => {
  //   const value = e.target.value.trim();
  //   load(1, pageSize, value);
  // }, 300);

  const handleAddClick = (event: MouseEvent) => {
    event.preventDefault();
    navigate("/product-groups/add");
  };

  const handleRowClick = (event: CustomEvent) => {
    event.preventDefault();
    navigate(`/product-groups/${event.detail.product_group_id}`);
  };

  $: if ($location) {
    const params = parseQueryString<SearchQueryParam>($location.search);
    load(params);
  }
</script>

<Nav title="컬렉션 목록">
  <div class="button-wrapper mb10">
    <Button icon={DocumentAdd16} on:click={handleAddClick}>컬렉션 추가</Button>
  </div>
  <!-- Pagination 및 검색은 차후 추가 -->
  <!-- <Pagination {page} {totalItems} />
  <Search on:input={handleSearch} /> -->
  <DataTable
    {headers}
    rows={productGroups}
    on:click:row={handleRowClick}
    sortable
  >
    <span slot="cell" let:cell>
      {#if cell.key === "image_url"}
        <img src={cell.value} alt={"thumbnail"} class="cell_thumb" />
      {:else if cell.key === "start_time" || cell.key === "finish_time"}
        {formatDate(cell.value)}
      {:else}{cell.value}
      {/if}
    </span>
  </DataTable>
  <div class="button-wrapper mt10">
    <Button icon={DocumentAdd16} on:click={handleAddClick}>컬렉션 추가</Button>
  </div>
</Nav>

<style>
  :global(.bx--data-table tr) {
    cursor: pointer;
  }

  .cell_thumb {
    width: 100px;
    height: 100px;
    object-fit: cover;
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
