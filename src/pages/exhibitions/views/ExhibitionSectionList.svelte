<script lang="ts">
  import { navigate, useLocation } from "svelte-navigator";
  import { Button } from "carbon-components-svelte";
  import DocumentAdd16 from "carbon-icons-svelte/lib/DocumentAdd16";

  import {
    GroupTypeEnum,
    ProductGroup,
    ProductGroupsApi,
    ProductGroupsApiProductGroupsListRequest as SearchQueryParam,
  } from "@api";
  import Nav from "@app/components/Nav.svelte";
  import DataTable from "@app/components/DataTable/DataTable.svelte";
  import { DataTableData } from "@app/components/DataTable/helpers";
  import {
    formatQueryString,
    parseQueryString,
  } from "@app/helpers/query-string";

  import { exhibitionColumns } from "./components/exhibitionSectionColumns";
  import Pagination from "@app/components/Pagination.svelte";

  let productGroups: DataTableData<ProductGroup>[] = [];
  let searchFilter: SearchQueryParam & { totalItems: number } = {
    offset: 0,
    limit: 50,
    searchQuery: undefined,
    groupType: GroupTypeEnum.Timedeal,
    totalItems: 0,
  };
  let isLoading = false;

  const productGroupApi = new ProductGroupsApi();
  const location = useLocation<SearchQueryParam>();

  const load = async (params: SearchQueryParam) => {
    if (isLoading) return;
    try {
      isLoading = true;
      const res = await productGroupApi.productGroupsList({
        ...params,
        groupType: GroupTypeEnum.Exhibition,
      });
      productGroups = res.data.pgs.map((x) => ({
        ...x,
        id: x.product_group_id,
      }));
      searchFilter = {
        ...params,
        totalItems: res.data.total_counts,
      };
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
    navigate("/hometab/exhibitions/sections/add");
  };

  const handleRowClick = (event: CustomEvent<DataTableData<ProductGroup>>) => {
    event.preventDefault();
    navigate(`/product-groups/${event.detail.id}`);
  };

  $: if ($location) {
    const params = parseQueryString<SearchQueryParam>($location.search);
    load(params);
  }
</script>

<Nav title="기획전 섹션 목록">
  <div class="button-right-wrapper mb10">
    <Button icon={DocumentAdd16} on:click={handleAddClick}>
      기획전 섹션 추가
    </Button>
  </div>
  <Pagination
    limit={searchFilter.limit}
    offset={searchFilter.offset}
    totalItems={searchFilter.totalItems}
    on:change={handlePageChange}
  />
  <DataTable
    data={productGroups}
    columns={exhibitionColumns}
    on:click:row={handleRowClick}
  />
  <div class="button-right-wrapper mt10">
    <Button icon={DocumentAdd16} on:click={handleAddClick}>
      기획전 섹션 추가
    </Button>
  </div>
</Nav>
