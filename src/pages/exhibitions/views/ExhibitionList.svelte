<script lang="ts">
  import { debounce } from "lodash";
  import { navigate, useLocation } from "svelte-navigator";
  import { Button } from "carbon-components-svelte";

  import {
    Exhibition,
    ExhibitionsApi,
    ExhibitionsApiExhibitionsListRequest as SearchQueryParam,
    ExhibitionTypeEnum,
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
  import { getExhibitionTypeLabel } from "../commands/helpers";

  export let type: ExhibitionTypeEnum = ExhibitionTypeEnum.Normal;

  let exhibitionLabel = getExhibitionTypeLabel(type);
  let exhibitions: DataTableData<Exhibition>[] = [];
  let searchFilter: SearchQueryParam = {
    offset: 0,
    limit: 50,
    exhibitionType: type,
  };
  let isLoading = false;
  let totalItems = 0;

  const exhibitionApi = new ExhibitionsApi();
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
      navigate(`/hometab/exhibitions/${event.detail.id}`);
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

  $: if ($location) {
    const params = parseQueryString<SearchQueryParam>($location.search);
    load(params);
  }
</script>

<Nav title={`${exhibitionLabel} 목록`}>
  <h1>{exhibitionLabel} 목록</h1>
  <div class="button-right-wrapper mb10">
    <Button on:click={handleAddClick}>{exhibitionLabel} 추가</Button>
  </div>
  <Pagination
    limit={searchFilter.limit}
    offset={searchFilter.offset}
    {totalItems}
    on:change={handlePageChange}
  />
  <DataTable
    data={exhibitions}
    columns={exhibitionColumns}
    on:click:row={handleRowClick}
    on:change:toggle={handleIsLiveChange}
  />
  <div class="button-right-wrapper mt10">
    <Button on:click={handleAddClick}>{exhibitionLabel} 추가</Button>
  </div>
</Nav>

<style>
  :global(.bx--data-table tr) {
    cursor: pointer;
  }
</style>
