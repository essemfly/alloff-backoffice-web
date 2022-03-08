<script lang="ts">
  import debounce from "lodash/debounce";
  import { toast } from "@zerodevx/svelte-toast";
  import { createEventDispatcher, onMount } from "svelte";
  import {
    Row,
    Column,
    Button,
    StructuredList,
    StructuredListBody,
    StructuredListRow,
    StructuredListCell,
    StructuredListHead,
    Search,
    InlineLoading,
  } from "carbon-components-svelte";
  import Launch16 from "carbon-icons-svelte/lib/Launch16";

  import {
    ProductGroup,
    ProductGroupsApi,
    GroupTypeEnum,
    ProductGroupsApiProductGroupsListRequest,
  } from "@api";

  type SearchQueryParam = ProductGroupsApiProductGroupsListRequest & {
    offset: number;
    limit: number;
    totalCount: number;
  };

  export let value: string[] = [];
  export let disabledIds: string[] = [];

  let params: SearchQueryParam = {
    offset: 0,
    limit: 10,
    searchQuery: "",
    totalCount: 0,
  };

  let isLoading = false;

  let sections: ProductGroup[] = [];
  let filteredSections: ProductGroup[] = [];
  let selectedSections: ProductGroup[] = [];
  let selectedSectionIds: string[] = [];
  let searchQuery = "";

  let scrollableList: HTMLDivElement;

  const dispatch = createEventDispatcher();

  const productGroupApi = new ProductGroupsApi();

  onMount(() => {
    selectedSectionIds = value;
  });

  const handleScroll = debounce(() => {
    const { scrollTop, scrollHeight, clientHeight } = scrollableList;
    const nextOffset = params.offset + params.limit;
    if (
      nextOffset <= params.totalCount &&
      (scrollTop + clientHeight) / scrollHeight > 0.7
    ) {
      handleSearch(params.offset + params.limit);
    }
  }, 300);

  const handleSectionSelect = (selectedItem: ProductGroup) => () => {
    selectedSections = [...selectedSections, selectedItem];
    dispatch("select", selectedItem);
  };

  $: if (selectedSections) {
    selectedSectionIds = selectedSections.map(
      ({ product_group_id }) => product_group_id,
    );
    filteredSections = sections.filter(
      ({ product_group_id }) => !selectedSectionIds.includes(product_group_id),
    );
    dispatch("change", selectedSections);
  }

  const handleDetailOpen = (productGroupId: string) => () => {
    window.open(`/product-groups/${productGroupId}`, "_blank"); // todo: not use window.open
  };

  const handleSectionSearch = () => handleSearch(0);

  const handleSearch = async (offset: number) => {
    if (isLoading) {
      return;
    }
    try {
      isLoading = true;

      const res = await productGroupApi.productGroupsList({
        offset,
        limit: 30,
        groupType: GroupTypeEnum.Exhibition,
        searchQuery: searchQuery ?? "",
      });

      params = {
        offset: res.data.offset,
        limit: res.data.limit,
        searchQuery: searchQuery ?? "",
        totalCount: res.data.total_counts,
      };

      if (offset > 0) {
        sections = [...sections, ...res.data.pgs];
      } else {
        sections = res.data.pgs;
      }
    } catch (e) {
      toast.push("기획전 섹션 검색에 오류가 발생했습니다.");
    } finally {
      isLoading = false;
    }
  };
</script>

<Row padding>
  <Column>
    <div class="bx--label">기획전 섹션 검색</div>
    <Search
      bind:value={searchQuery}
      placeholder="기획전 섹션 제목/짧은제목 검색"
    />
  </Column>
</Row>
<div class="button-right-wrapper">
  <Button on:click={handleSectionSearch}>기획전 섹션 검색</Button>
</div>

<Row padding>
  <Column>
    <h4>기획전 섹션 검색 결과</h4>
    <div
      class="product-list"
      bind:this={scrollableList}
      on:scroll={handleScroll}
    >
      <StructuredList condensed selection flush>
        <StructuredListHead>
          <StructuredListRow head>
            <StructuredListCell head>짧은타이틀</StructuredListCell>
            <StructuredListCell head>타이틀</StructuredListCell>
            <StructuredListCell head>Actions</StructuredListCell>
          </StructuredListRow>
        </StructuredListHead>
        <StructuredListBody>
          {#if params.totalCount === 0 || filteredSections.length === 0}
            <StructuredListRow>
              <StructuredListCell>
                검색조건에 맞는 기획전 섹션을 찾지 못했습니다
              </StructuredListCell>
            </StructuredListRow>
          {/if}
          {#each filteredSections as section}
            <StructuredListRow
              on:click={handleSectionSelect(section)}
              disabled={disabledIds.includes(section.product_group_id)}
            >
              <StructuredListCell noWrap>
                {section.short_title}
              </StructuredListCell>
              <StructuredListCell noWrap>
                {section.title}
              </StructuredListCell>
              <StructuredListCell>
                <Row padding>
                  <Button
                    tooltipPosition="bottom"
                    tooltipAlignment="end"
                    iconDescription="기획전 섹션 상세"
                    icon={Launch16}
                    kind="ghost"
                    size="small"
                    on:click={handleDetailOpen(section.product_group_id)}
                  />
                </Row>
              </StructuredListCell>
            </StructuredListRow>
          {/each}
          {#if isLoading}
            <InlineLoading status="active" description="검색중..." />
          {/if}
        </StructuredListBody>
      </StructuredList>
    </div>
  </Column>
</Row>

<style>
  :global(.bx--structured-list-td) {
    vertical-align: top;
  }

  :global(.search-wrapper.bx--row) {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: flex-end;
    margin-bottom: 10px;
  }

  .product-list {
    max-height: 800px;
    overflow-y: auto;
    margin-bottom: 50px;
  }
</style>
