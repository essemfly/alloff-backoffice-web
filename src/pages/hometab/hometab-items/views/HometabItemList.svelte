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
  import { debounce } from "lodash";

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
    navigate("/hometab/add");
  };

  const handleRowClick = (event: CustomEvent<DataTableData<HomeTab>>) => {
    event.preventDefault();
    navigate(`/hometab/${event.detail.id}`);
  };

  const handleWeightChange = debounce(async (event: CustomEvent<number[]>) => {
    const [weight, index] = event.detail;

    let hometabItem = hometabs[index];
    hometabItem.weight = weight;

    const { start_time, finish_time, ...requestBody } = hometabItem;

    await hometabApi.hometabsUpdate({
      id: hometabItem.item_id,
      editHomeTabRequest: {
        ...requestBody,
        hometab_id: hometabItem.item_id,
        weight,
      },
    });

    hometabs.sort((a, b) => {
      var x = b.weight;
      var y = a.weight;
      return x < y ? -1 : x > y ? 1 : 0;
    });
    hometabs = hometabs;
  }, 500);

  const handleIsLiveChange = debounce(
    async (event: CustomEvent<[boolean, number]>) => {
      const [is_live, index] = event.detail;

      let hometabItem = hometabs[index];
      hometabItem.is_live = is_live;
      hometabs = hometabs;

      const { start_time, finish_time, ...requestBody } = hometabItem;

      await hometabApi.hometabsUpdate({
        id: hometabItem.item_id,
        editHomeTabRequest: {
          ...requestBody,
          hometab_id: hometabItem.item_id,
          is_live,
        },
      });
    },
    500,
  );

  $: if ($location) {
    const params = parseQueryString<SearchQueryParam>($location.search);
    load(params);
  }
</script>

<Nav title="홈탭 아이템 관리">
  <h1>홈탭 아이템 관리</h1>
  <div class="button-right-wrapper mb10">
    <Button on:click={handleAddClick}>홈탭 아이템 추가</Button>
  </div>
  <Pagination
    limit={searchFilter.limit}
    offset={searchFilter.offset}
    {totalItems}
    on:change={handlePageChange}
  />
  <DataTable
    data={hometabs}
    columns={hometabColumns}
    on:click:row={handleRowClick}
    on:change:weight={handleWeightChange}
    on:change:toggle={handleIsLiveChange}
  />
  <div class="button-right-wrapper mt10">
    <Button on:click={handleAddClick}>홈탭 아이템 추가</Button>
  </div>
</Nav>
