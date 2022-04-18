<script lang="ts">
  import { navigate, useLocation } from "svelte-navigator";
  import { Button } from "carbon-components-svelte";
  import DocumentAdd16 from "carbon-icons-svelte/lib/DocumentAdd16";

  import {
    GroupTypeCbfEnum as GroupTypeEnum,
    ProductGroup,
    ProductGroupsApi,
    ProductGroupsApiProductGroupsListRequest as SearchQueryParam,
  } from "@lessbutter/alloff-backoffice-api";
  import Nav from "@app/components/Nav.svelte";
  import DataTable from "@app/components/DataTable/DataTable.svelte";
  import { DataTableData } from "@app/components/DataTable/helpers";
  import {
    formatQueryString,
    parseQueryString,
  } from "@app/helpers/query-string";
  import Pagination from "@app/components/Pagination.svelte";

  import { productGroupColumns } from "./components/productGroupColumns";
  import { apiConfig } from "@app/store";

  let productGroups: DataTableData<ProductGroup>[] = [];
  let searchFilter: SearchQueryParam & { totalCount: number } = {
    offset: 0,
    limit: 50,
    searchQuery: undefined,
    groupType: GroupTypeEnum.Timedeal,
    totalCount: 0,
  };
  let isLoading = false;

  const productGroupApi = new ProductGroupsApi(apiConfig);
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
        totalCount: res.data.total_counts,
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
    navigate("/product-groups/add");
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

<Nav title="섹션 목록">
  <div class="row-right-wrapper mb10">
    <Button icon={DocumentAdd16} on:click={handleAddClick}>섹션 추가</Button>
  </div>
  <Pagination
    limit={searchFilter.limit}
    offset={searchFilter.offset}
    totalCount={searchFilter.totalCount}
    on:change={handlePageChange}
  />
  <DataTable
    data={productGroups}
    columns={productGroupColumns}
    on:click:row={handleRowClick}
  />
  <div class="row-right-wrapper mt10">
    <Button icon={DocumentAdd16} on:click={handleAddClick}>섹션 추가</Button>
  </div>
</Nav>
