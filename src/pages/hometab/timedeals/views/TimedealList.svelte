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
  import { parseQueryString } from "@app/helpers/query-string";

  import { timedealColumns } from "./components/timedealColumns";

  let productGroups: DataTableData<ProductGroup>[] = [];
  let searchFilter: SearchQueryParam = {
    offset: 0,
    limit: 50,
    searchQuery: undefined,
    groupType: GroupTypeEnum.Timedeal,
  };
  let isLoading = false;
  let totalItems = 0;

  const productGroupApi = new ProductGroupsApi();
  const location = useLocation<SearchQueryParam>();

  const load = async (params: SearchQueryParam) => {
    if (isLoading) return;
    try {
      isLoading = true;
      const res = await productGroupApi.productGroupsList({
        ...params,
        groupType: GroupTypeEnum.Timedeal,
      });
      productGroups = res.data.pgs.map((x) => ({
        ...x,
        id: x.product_group_id,
      }));
      totalItems = res.data.total_counts;
    } finally {
      isLoading = false;
    }
  };

  const handleAddClick = (event: MouseEvent) => {
    event.preventDefault();
    navigate("/hometab/timedeals/add");
  };

  const handleRowClick = (event: CustomEvent) => {
    event.preventDefault();
    navigate(`/product-groups/${event.detail.id}`);
  };

  $: if ($location) {
    const params = parseQueryString<SearchQueryParam>($location.search);
    load(params);
  }
</script>

<Nav title="타임딜 목록">
  <div class="button-right-wrapper mb10">
    <Button icon={DocumentAdd16} on:click={handleAddClick}>타임딜 추가</Button>
  </div>
  <DataTable
    data={productGroups}
    columns={timedealColumns}
    on:click:row={handleRowClick}
  />
  <div class="button-right-wrapper mt10">
    <Button icon={DocumentAdd16} on:click={handleAddClick}>타임딜 추가</Button>
  </div>
</Nav>
