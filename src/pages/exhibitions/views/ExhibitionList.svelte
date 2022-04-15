<script lang="ts">
  import { debounce } from "lodash";
  import { navigate, useLocation } from "svelte-navigator";
  import {
    Button,
    Checkbox,
    Column,
    Grid,
    Row,
    Search,
    Toolbar,
    ToolbarContent,
    ToolbarSearch,
  } from "carbon-components-svelte";

  import {
    Exhibition,
    ExhibitionsApi,
    ExhibitionsApiExhibitionsListRequest as SearchQueryParam,
    ExhibitionTypeEnum,
  } from "@lessbutter/alloff-backoffice-api";
  import { apiConfigs } from "@app/store";
  import Nav from "@app/components/Nav.svelte";
  import {
    formatQueryString,
    parseQueryString,
  } from "@app/helpers/query-string";
  import Pagination from "@app/components/Pagination.svelte";
  import { DataTableData } from "@app/components/DataTable/helpers";
  import DataTable from "@app/components/DataTable/DataTable.svelte";

  import { exhibitionColumns } from "./components/exhibitionColumns";
  import {
    getExhibitionTypeByIndex,
    getExhibitionTypeLabel,
  } from "../commands/helpers";

  export let type: ExhibitionTypeEnum = ExhibitionTypeEnum.Normal;

  let exhibitionLabel = getExhibitionTypeLabel(type);
  let exhibitions: DataTableData<Exhibition>[] = [];
  let searchFilter: SearchQueryParam = {
    offset: 0,
    limit: 50,
    exhibitionType: type,
    isLive: true,
    query: "",
  };
  let isLoading = false;
  let totalItems = 0;
  let innerSearchQuery = "";

  const exhibitionApi = new ExhibitionsApi($apiConfigs);
  const location = useLocation<SearchQueryParam>();

  const load = async (params: SearchQueryParam) => {
    if (isLoading) return;
    isLoading = true;
    try {
      const res = await exhibitionApi.exhibitionsList({
        ...searchFilter,
        ...params,
      });
      exhibitions = res.data.exhibitions.map((x) => ({
        ...x,
        id: x.exhibition_id,
      }));
      searchFilter = {
        offset: res.data.offset,
        limit: res.data.limit,
        exhibitionType: getExhibitionTypeByIndex(
          res.data.group_type as unknown as number,
        ),
        isLive: res.data.is_live,
        query: res.data.query,
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
    navigate("/exhibitions/add");

    if (type === ExhibitionTypeEnum.Timedeal) {
      navigate("/timedeals/add");
    } else if (type === ExhibitionTypeEnum.Groupdeal) {
      navigate("/groupdeals/add");
    } else {
      navigate("/exhibitions/add");
    }
  };

  const handleRowClick = (event: CustomEvent<DataTableData<Exhibition>>) => {
    event.preventDefault();
    if (type === ExhibitionTypeEnum.Timedeal) {
      navigate(`/timedeals/${event.detail.id}`);
    } else if (type === ExhibitionTypeEnum.Groupdeal) {
      navigate(`/groupdeals/${event.detail.id}`);
    } else {
      navigate(`/exhibitions/${event.detail.id}`);
    }
  };

  const handleIsLiveChange = debounce(
    async (event: CustomEvent<[boolean, number]>) => {
      const [is_live, index] = event.detail;

      let exhibitionItem = exhibitions[index];
      exhibitionItem.is_live = is_live;
      exhibitions = exhibitions;

      const res = await exhibitionApi.exhibitionsPartialUpdate({
        id: exhibitionItem.exhibition_id,
        patchedExhibitionRequest: {
          exhibition_id: exhibitionItem.exhibition_id,
          is_live,
        },
      });
    },
    500,
  );

  const handleSearchKeydown = (e: KeyboardEvent) => {
    const value = (e.target as HTMLInputElement).value.trim();
    if (e.key === "Enter") {
      searchFilter = {
        ...searchFilter,
        offset: 0,
        query: value,
      };
      handleSearch();
    }
  };

  $: if ($location) {
    const params = parseQueryString<SearchQueryParam>($location.search);
    load(params);
  }

  const handleCheck = (event: CustomEvent<boolean>) => {
    searchFilter = {
      ...searchFilter,
      isLive: !event.detail,
    };
  };
</script>

<Nav title={`${exhibitionLabel} 목록`}>
  <Grid slot="header" noGutter>
    <Row>
      <Column>
        <Checkbox
          labelText="비활성화 포함"
          checked={!searchFilter.isLive}
          on:check={handleCheck}
        />
      </Column>
    </Row>
    <Row>
      <Column>
        <Search
          labelText="검색어"
          on:keydown={handleSearchKeydown}
          bind:value={searchFilter.query}
        />
      </Column>
    </Row>
    <Row>
      <Column>
        <div class="row-right-wrapper">
          <Button on:click={handleSearch}>검색</Button>
        </div>
      </Column>
    </Row>
  </Grid>
  <DataTable
    data={exhibitions}
    columns={exhibitionColumns}
    on:click:row={handleRowClick}
    on:change:toggle={handleIsLiveChange}
  >
    <Toolbar>
      <ToolbarContent>
        <ToolbarSearch shouldFilterRows bind:value={innerSearchQuery} />
        <Button on:click={handleAddClick}>{exhibitionLabel} 추가</Button>
      </ToolbarContent>
    </Toolbar>
  </DataTable>
  <Pagination
    limit={searchFilter.limit}
    offset={searchFilter.offset}
    {totalItems}
    on:change={handlePageChange}
  />
</Nav>

<style>
  :global(.bx--data-table tr) {
    cursor: pointer;
  }
</style>
