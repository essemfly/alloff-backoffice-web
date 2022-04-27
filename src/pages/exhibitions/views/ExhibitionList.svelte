<script lang="ts">
  import DataTable, {
    DataTableData,
  } from "@app/components/DataTable/DataTable.svelte";
  import Nav from "@app/components/Nav.svelte";
  import Pagination from "@app/components/Pagination.svelte";
  import { formatQueryString } from "@app/helpers/query-string";
  import {
    Exhibition,
    ExhibitionTypeEnum,
  } from "@lessbutter/alloff-backoffice-api";
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
  import { debounce } from "lodash";
  import { onMount } from "svelte";
  import { navigate, useLocation } from "svelte-navigator";
  import { getExhibitionTypeLabel } from "../commands/helpers";
  import { SearchQueryParam, useExhibitionService } from "../ExhibitionService";
  import { exhibitionColumns } from "./components/exhibitionColumns";

  export let type: ExhibitionTypeEnum = ExhibitionTypeEnum.Normal;

  const exhibitionService = useExhibitionService();

  let exhibitionLabel = getExhibitionTypeLabel(type);
  let exhibitions: DataTableData<Exhibition>[] = [];
  let isLoading = false;
  let innerSearchQuery = "";
  let searchFilter = exhibitionService.filter;

  const location = useLocation<SearchQueryParam>();

  onMount(() => handleSearch());

  const load = async (params: SearchQueryParam) => {
    if (isLoading) return;
    isLoading = true;
    try {
      await exhibitionService.list({ ...params, exhibitionType: type });
      exhibitions = exhibitionService.exhibitions;
      searchFilter = exhibitionService.filter;
    } finally {
      isLoading = false;
    }
  };

  const handlePageChange = (
    event: CustomEvent<{ offset: number; limit: number }>,
  ) => {
    const { offset, limit } = event.detail;
    searchFilter = { ...searchFilter, offset, limit };
    handleSearch();
  };

  const handleSearchKeydown = (e: KeyboardEvent) => {
    const value = (e.target as HTMLInputElement).value.trim();
    if (e.key === "Enter") {
      searchFilter = { ...searchFilter, offset: 0, query: value };
      handleSearch();
    }
  };

  const handleCheck = (event: CustomEvent<boolean>) => {
    searchFilter = {
      ...searchFilter,
      isLive: !event.detail,
    };
  };

  const handleSearch = () => {
    const queryString = formatQueryString({ ...searchFilter });
    if (`?${queryString}` !== $location.search) {
      navigate(`${$location.pathname}?${queryString}`);
    }
    load(searchFilter);
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
      exhibitionService.patch(exhibitionItem.exhibition_id, {
        is_live,
      });
    },
    500,
  );
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
          <Button on:click={() => handleSearch()}>검색</Button>
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
  <Pagination {...searchFilter} on:change={handlePageChange} />
</Nav>

<style>
  :global(.bx--data-table tr) {
    cursor: pointer;
  }
</style>
