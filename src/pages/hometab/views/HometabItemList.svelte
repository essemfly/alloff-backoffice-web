<script lang="ts">
  import { navigate, useLocation } from "svelte-navigator";
  import { Button } from "carbon-components-svelte";

  import {
    HomeTab,
    HometabsApi,
    HometabsApiHometabsListRequest as SearchQueryParam,
  } from "@api";
  import Nav from "@app/components/Nav.svelte";
  import Pagination from "@app/components/Pagination.svelte";
  import { DataTableData } from "@app/components/DataTable/helpers";
  import DataTable from "@app/components/DataTable/DataTable.svelte";
  import {
    formatQueryString,
    parseQueryString,
  } from "@app/helpers/query-string";

  import { hometabColumns } from "./components/hometabColumns";

  let hometabs: DataTableData<HomeTab>[] = [];
  let searchFilter: SearchQueryParam = { offset: 0, limit: 50 };
  let isLoading = false;
  let totalItems = 0;

  const hometabApi = new HometabsApi();
  const location = useLocation<SearchQueryParam>();

  const load = async (params: SearchQueryParam) => {
    if (isLoading) return;
    isLoading = true;
    try {
      const res = await hometabApi.hometabsList({
        ...params,
      });
      hometabs = res.data.items.map((x) => ({
        ...x,
        id: x.item_id,
      }));
      searchFilter = {
        offset: res.data.offset,
        limit: res.data.limit,
      };
      totalItems = res.data.total_counts;
    } finally {
      isLoading = false;
    }
  };

  const handlePageChange = (
    event: CustomEvent<{ offset: number; limit: number }>,
  ) => {
    const { offset, limit } = event.detail;
    searchFilter = {
      ...searchFilter,
      offset,
      limit,
    };
    handleSearch();
  };

  const handleSearch = () => {
    const queryString = formatQueryString({ ...searchFilter });
    navigate(`${$location.pathname}?${queryString}`);
  };

  const handleAddClick = (event: MouseEvent) => {
    event.preventDefault();
    navigate("/banners/add");
  };

  $: if ($location) {
    const params = parseQueryString<SearchQueryParam>($location.search);
    load(params);
  }
</script>

<Nav title="홈탭 관리">
  <h1>홈탭 관리</h1>
  <div class="button-wrapper mb10">
    <Button on:click={handleAddClick}>홈탭 아이템 추가</Button>
  </div>
  <Pagination
    limit={searchFilter.limit}
    offset={searchFilter.offset}
    {totalItems}
    on:change={handlePageChange}
  />
  <DataTable data={hometabs} columns={hometabColumns} />
  <div class="button-wrapper mt10">
    <Button on:click={handleAddClick}>홈탭 아이템 추가</Button>
  </div>
</Nav>
