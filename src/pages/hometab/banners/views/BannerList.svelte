<script lang="ts">
  import { navigate, useLocation } from "svelte-navigator";
  import { Button, Column, Grid, Row } from "carbon-components-svelte";

  import {
    TopBanner,
    TopBannersApi,
    TopBannersApiTopBannersListRequest as SearchQueryParam,
  } from "@api";
  import Nav from "@app/components/Nav.svelte";
  import Pagination from "@app/components/Pagination.svelte";
  import { DataTableData } from "@app/components/DataTable/helpers";
  import DataTable from "@app/components/DataTable/DataTable.svelte";
  import {
    formatQueryString,
    parseQueryString,
  } from "@app/helpers/query-string";

  import { bannerColumns } from "./components/bannerColumns";
  import { debounce } from "lodash";

  let banners: DataTableData<TopBanner>[] = [];
  let searchFilter: SearchQueryParam = { offset: 0, limit: 50 };
  let isLoading = false;
  let totalItems = 0;

  const bannerApi = new TopBannersApi();
  const location = useLocation<SearchQueryParam>();

  const load = async (params: SearchQueryParam) => {
    if (isLoading) return;
    isLoading = true;
    try {
      const res = await bannerApi.topBannersList({
        ...params,
      });
      banners = res.data.banners.map((x) => ({
        ...x,
        id: x.banner_id,
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
    navigate("/hometab/banners/add");
  };

  const handleRowClick = (event: CustomEvent<DataTableData<TopBanner>>) => {
    event.preventDefault();
    navigate(`/hometab/banners/${event.detail.id}`);
  };

  const handleIsLiveChange = debounce(
    async (event: CustomEvent<[boolean, number]>) => {
      const [is_live, index] = event.detail;

      let bannerItem = banners[index];
      bannerItem.is_live = is_live;
      banners = banners;

      const res = await bannerApi.topBannersPartialUpdate({
        id: bannerItem.banner_id,
        patchedTopBannerRequest: {
          banner_id: bannerItem.banner_id,
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

<Nav title="배너 목록">
  <Grid noGutter>
    <Row>
      <Column>
        <div class="row-right-wrapper">
          <Button on:click={handleAddClick}>배너 추가</Button>
        </div>
      </Column>
    </Row>
    <Row>
      <Column>
        <Pagination
          limit={searchFilter.limit}
          offset={searchFilter.offset}
          {totalItems}
          on:change={handlePageChange}
        />
      </Column>
    </Row>
  </Grid>
  <DataTable
    data={banners}
    columns={bannerColumns}
    on:click:row={handleRowClick}
    on:change:toggle={handleIsLiveChange}
  />
  <Grid noGutter>
    <Row>
      <Column>
        <Pagination
          limit={searchFilter.limit}
          offset={searchFilter.offset}
          {totalItems}
          on:change={handlePageChange}
        />
      </Column>
    </Row>
    <Row>
      <Column>
        <div class="row-right-wrapper">
          <Button on:click={handleAddClick}>배너 추가</Button>
        </div>
      </Column>
    </Row>
  </Grid>
</Nav>
