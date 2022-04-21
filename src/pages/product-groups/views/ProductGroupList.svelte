<script lang="ts">
  import { navigate, useLocation } from "svelte-navigator";
  import { Button } from "carbon-components-svelte";
  import DocumentAdd16 from "carbon-icons-svelte/lib/DocumentAdd16";

  import {
    GroupTypeE67Enum as GroupTypeEnum,
    ProductGroup,
  } from "@lessbutter/alloff-backoffice-api";
  import Nav from "@app/components/Nav.svelte";
  import DataTable, {
    DataTableData,
  } from "@app/components/DataTable/DataTable.svelte";
  import { formatQueryString } from "@app/helpers/query-string";
  import Pagination from "@app/components/Pagination.svelte";

  import { productGroupColumns } from "./components/productGroupColumns";
  import {
    SearchQueryParam,
    useProductGroupService,
  } from "../ProductGroupService";

  const productGroupService = useProductGroupService();

  let productGroups: DataTableData<ProductGroup>[] = [];
  let searchFilter = productGroupService.filter;
  let isLoading = false;

  const location = useLocation<SearchQueryParam>();

  const load = async (params: SearchQueryParam) => {
    if (isLoading) return;
    try {
      isLoading = true;
      await productGroupService.list({
        ...params,
        groupType: GroupTypeEnum.Exhibition,
      });
      productGroups = productGroupService.productGroups;
      searchFilter = productGroupService.filter;
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
    load(searchFilter);
  };

  const handleAddClick = (event: MouseEvent) => {
    event.preventDefault();
    navigate("/product-groups/add");
  };

  const handleRowClick = (event: CustomEvent<DataTableData<ProductGroup>>) => {
    event.preventDefault();
    navigate(`/product-groups/${event.detail.id}`);
  };
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
