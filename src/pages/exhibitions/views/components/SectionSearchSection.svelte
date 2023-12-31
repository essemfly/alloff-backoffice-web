<script lang="ts">
  import { apiConfig } from "@app/store";
  import {
    GroupTypeE67Enum as GroupTypeEnum,
    ProductGroup,
    ProductGroupsApi,
    ProductGroupsApiProductGroupsListRequest,
  } from "@lessbutter/alloff-backoffice-api";
  import { toast } from "@zerodevx/svelte-toast";
  import {
    Button,
    Column,
    InlineLoading,
    Row,
    Search,
    StructuredList,
    StructuredListBody,
    StructuredListCell,
    StructuredListHead,
    StructuredListRow,
  } from "carbon-components-svelte";
  import Launch16 from "carbon-icons-svelte/lib/Launch16";
  import debounce from "lodash/debounce";
  import { createEventDispatcher, onMount } from "svelte";

  type SearchQueryParam = ProductGroupsApiProductGroupsListRequest & {
    offset: number;
    limit: number;
    totalCounts: number;
  };

  export let type: GroupTypeEnum = GroupTypeEnum.Exhibition;
  export let value: string[] = [];
  export let disabledIds: string[] = [];

  let params: SearchQueryParam = {
    offset: 0,
    limit: 10,
    searchQuery: "",
    totalCounts: 0,
  };

  let isLoading = false;

  let sections: ProductGroup[] = [];
  let filteredSections: ProductGroup[] = [];
  let selectedSections: ProductGroup[] = [];
  let selectedSectionIds: string[] = [];
  let searchQuery = "";

  let scrollableList: HTMLDivElement;

  const dispatch = createEventDispatcher();

  const productGroupApi = new ProductGroupsApi(apiConfig);

  onMount(() => {
    selectedSectionIds = value;
  });

  const handleScroll = debounce(() => {
    const { scrollTop, scrollHeight, clientHeight } = scrollableList;
    const nextOffset = params.offset + params.limit;
    if (
      nextOffset <= params.totalCounts &&
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
        groupType: type,
        searchQuery: searchQuery ?? "",
      });

      params = {
        offset: res.data.offset,
        limit: res.data.limit,
        searchQuery: searchQuery ?? "",
        totalCounts: res.data.total_counts,
      };

      if (offset > 0) {
        sections = [...sections, ...res.data.pgs];
      } else {
        sections = res.data.pgs;
      }
    } catch (e) {
      toast.push("섹션 검색에 오류가 발생했습니다.");
    } finally {
      isLoading = false;
    }
  };
</script>

<Row padding>
  <Column>
    <div class="bx--label">섹션 검색</div>
    <Search
      bind:value={searchQuery}
      placeholder="섹션 타이틀/짧은 타이틀 검색"
    />
  </Column>
</Row>
<div class="row-right-wrapper">
  <Button on:click={handleSectionSearch}>섹션 검색</Button>
</div>

<Row padding>
  <Column>
    <h4>섹션 검색 결과</h4>
    <div
      class="product-list"
      bind:this={scrollableList}
      on:scroll={handleScroll}
    >
      <StructuredList condensed selection flush>
        <StructuredListHead>
          <StructuredListRow head>
            <StructuredListCell head>Short title</StructuredListCell>
            <StructuredListCell head>Title</StructuredListCell>
            <StructuredListCell head>Products</StructuredListCell>
            <StructuredListCell head>Actions</StructuredListCell>
          </StructuredListRow>
        </StructuredListHead>
        <StructuredListBody>
          {#if params.totalCounts === 0 || filteredSections.length === 0}
            <StructuredListRow>
              <StructuredListCell>
                검색조건에 맞는 섹션을 찾지 못했습니다
              </StructuredListCell>
            </StructuredListRow>
          {/if}
          {#each filteredSections as section}
            <StructuredListRow
              on:click={handleSectionSelect(section)}
              disabled={disabledIds.includes(section.product_group_id)}
            >
              <StructuredListCell>
                {section.short_title}
              </StructuredListCell>
              <StructuredListCell noWrap>
                {section.title}
              </StructuredListCell>
              <StructuredListCell>
                {#if section.products.length > 0}
                  <span>
                    {section.products[0].product.alloff_name}
                    {#if section.products.length > 1}
                      외 {section.products.length - 1}개의 상품
                    {/if}
                  </span>
                {:else}
                  No products
                {/if}
              </StructuredListCell>
              <StructuredListCell>
                <Row padding>
                  <Button
                    tooltipPosition="bottom"
                    tooltipAlignment="end"
                    iconDescription="상세"
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
