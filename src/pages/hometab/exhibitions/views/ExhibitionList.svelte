<script lang="ts">
  import { navigate, useLocation } from "svelte-navigator";
  import { Button } from "carbon-components-svelte";

  import {
    Exhibition,
    ExhibitionsApi,
    ExhibitionsApiExhibitionsListRequest as SearchQueryParam,
  } from "@api";
  import Nav from "@app/components/Nav.svelte";
  import {
    formatQueryString,
    parseQueryString,
  } from "@app/helpers/query-string";
  import Pagination from "@app/components/Pagination.svelte";
  import { DataTableData } from "@app/components/DataTable/helpers";
  import DataTable from "@app/components/DataTable/DataTable.svelte";

  import { exhibitionColumns } from "./components/exhibitionColumns";

  let exhibitions: DataTableData<Exhibition>[] = [];
  let searchFilter: SearchQueryParam = { offset: 0, limit: 50 };
  let isLoading = false;
  let totalItems = 0;

  const exhibitionApi = new ExhibitionsApi();
  const location = useLocation<SearchQueryParam>();

  const load = async (params: SearchQueryParam) => {
    if (isLoading) return;
    isLoading = true;
    try {
      const res = await exhibitionApi.exhibitionsList({
        ...params,
      });
      exhibitions = res.data.exhibitions.map((x) => ({
        ...x,
        id: x.exhibition_id,
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
    navigate("/products/add");
  };

  $: if ($location) {
    const params = parseQueryString<SearchQueryParam>($location.search);
    load(params);
  }
</script>

<Nav title="기획전 목록">
  <h1>기획전 목록</h1>
  <div class="button-wrapper mb10">
    <Button on:click={handleAddClick}>기획전 추가</Button>
  </div>
  <Pagination
    limit={searchFilter.limit}
    offset={searchFilter.offset}
    {totalItems}
    on:change={handlePageChange}
  />
  <DataTable data={exhibitions} columns={exhibitionColumns} />
  <div class="button-wrapper mt10">
    <Button on:click={handleAddClick}>기획전 추가</Button>
  </div>
</Nav>

<style>
  :global(.bx--data-table tr) {
    cursor: pointer;
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
