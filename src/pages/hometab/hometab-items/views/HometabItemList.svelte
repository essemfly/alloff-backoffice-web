<script lang="ts">
  import DataTable, {
    DataTableData,
  } from "@app/components/DataTable/DataTable.svelte";
  import Nav from "@app/components/Nav.svelte";
  import Pagination from "@app/components/Pagination.svelte";
  import { formatQueryString } from "@app/helpers/query-string";
  import { HomeTab } from "@lessbutter/alloff-backoffice-api";
  import { Button, Column, Grid, Row } from "carbon-components-svelte";
  import { debounce } from "lodash";
  import { onMount } from "svelte";
  import { navigate, useLocation } from "svelte-navigator";
  import {
    SearchQueryParam,
    useHometabItemService,
  } from "../HometabItemService";
  import { hometabColumns } from "./components/hometabColumns";

  const hometabItemService = useHometabItemService();

  let hometabs: DataTableData<HomeTab>[] = [];
  let isLoading = false;
  let searchFilter = hometabItemService.filter;

  const location = useLocation<SearchQueryParam>();

  onMount(() => handleSearch());

  const load = async (params: SearchQueryParam) => {
    if (isLoading) return;
    isLoading = true;
    try {
      await hometabItemService.list(params);
      hometabs = hometabItemService.hometabItems;
      searchFilter = hometabItemService.filter;
      sortItems();
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
    await hometabItemService.patch(hometabItem.item_id, { weight });
    sortItems();
  }, 500);

  const handleIsLiveChange = debounce(
    async (event: CustomEvent<[boolean, number]>) => {
      const [is_live, index] = event.detail;
      let hometabItem = hometabs[index];
      hometabItem.is_live = is_live;
      await hometabItemService.patch(hometabItem.item_id, { is_live });
      sortItems();
    },
    500,
  );

  const sortItems = () => {
    hometabs.sort((a, b) => {
      var x = b.weight;
      var y = a.weight;
      return x < y ? -1 : x > y ? 1 : 0;
    });
    hometabs = hometabs;
  };
</script>

<Nav title="홈탭 아이템 관리">
  <Grid noGutter>
    <Row>
      <Column>
        <div class="row-right-wrapper">
          <Button on:click={handleAddClick}>홈탭 아이템 추가</Button>
        </div>
      </Column>
    </Row>
    <Row>
      <Column>
        <Pagination
          limit={searchFilter.limit}
          offset={searchFilter.offset}
          totalCounts={searchFilter.totalCounts}
          on:change={handlePageChange}
        />
      </Column>
    </Row>
  </Grid>
  <DataTable
    data={hometabs}
    columns={hometabColumns}
    on:click:row={handleRowClick}
    on:change:weight={handleWeightChange}
    on:change:toggle={handleIsLiveChange}
  />
  <Grid noGutter>
    <Row>
      <Column>
        <Pagination
          limit={searchFilter.limit}
          offset={searchFilter.offset}
          totalCounts={searchFilter.totalCounts}
          on:change={handlePageChange}
        />
      </Column>
    </Row>
    <Row>
      <Column>
        <div class="row-right-wrapper">
          <Button on:click={handleAddClick}>홈탭 아이템 추가</Button>
        </div>
      </Column>
    </Row>
  </Grid>
</Nav>
