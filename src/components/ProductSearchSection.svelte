<script lang="ts">
  import { debounce } from "lodash";
  import { createEventDispatcher, onMount } from "svelte";
  import {
    Row,
    Column,
    Button,
    StructuredList,
    StructuredListRow,
    StructuredListCell,
    StructuredListBody,
    StructuredListHead,
    Search,
    StructuredListInput,
    InlineLoading,
  } from "carbon-components-svelte";
  import Launch16 from "carbon-icons-svelte/lib/Launch16";

  import {
    ProductsApi,
    Product,
    ProductsApiProductsListRequest,
  } from "@lessbutter/alloff-backoffice-api";
  import { AutocompleteItem } from "@app/components/autocomplete";
  import BrandSelect from "@app/components/BrandSelect.svelte";
  import CategorySelect from "@app/components/CategorySelect.svelte";
  import { toast } from "@zerodevx/svelte-toast";

  const productApi = new ProductsApi();

  type SearchQueryParam = ProductsApiProductsListRequest & {
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
    brandId: "",
    alloffCategoryId: "",
    totalCount: 0,
  };

  let isLoading = false;
  let isListFilterExpanded = false;

  let products: Product[] = [];
  let filteredProduct: Product[] = [];
  let searchQuery = "";
  let listSearchQuery = "";
  let selectedBrandId = "";
  let selectedCategoryId = "";
  let selectedProducts: Product[] = [];
  let selectedProductIds: string[] = [];

  let scrollableList: HTMLDivElement;

  const dispatch = createEventDispatcher();

  onMount(() => {
    selectedProductIds = value;
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

  const handleBrandChange = (event: CustomEvent<AutocompleteItem>) => {
    selectedBrandId = event.detail?.key ?? "";
  };

  const handleCategoryChange = (event: CustomEvent<AutocompleteItem>) => {
    selectedCategoryId = event.detail?.value ?? "";
  };

  const handleProductSelect = (selectedItem: Product) => () => {
    selectedProducts = [...selectedProducts, selectedItem];
    dispatch("select", selectedItem);
  };

  const handleProductDeselect = (index: number) => () => {
    selectedProducts.splice(index, 1);
    selectedProducts = selectedProducts;
  };

  $: if (selectedProducts) {
    selectedProductIds = selectedProducts.map(
      ({ alloff_product_id }) => alloff_product_id,
    );
    filteredProduct = products.filter(
      ({ alloff_product_id }) =>
        !selectedProductIds.includes(alloff_product_id),
    );
    dispatch("change", selectedProducts);
  }

  const handleProductDetailOpen = (productId: string) => () => {
    window.open(`/products/${productId}`, "_blank"); // todo: not use window.open
  };

  const handleProductSearch = () => handleSearch(0);

  const handleSearch = async (offset: number) => {
    if (isLoading) {
      return;
    }
    try {
      isLoading = true;
      const res = await productApi.productsList({
        offset,
        limit: params.limit,
        searchQuery: searchQuery ?? "",
        brandId: selectedBrandId ?? "",
        alloffCategoryId: selectedCategoryId ?? "",
      });

      params = {
        offset: res.data.offset,
        limit: res.data.limit,
        searchQuery: res.data.list_query.search_query ?? "",
        brandId: res.data.list_query.brand_id ?? "",
        alloffCategoryId: res.data.list_query.alloff_category_id ?? "",
        totalCount: res.data.total_counts,
      };

      if (offset > 0) {
        products = [...products, ...res.data.products];
      } else {
        products = res.data.products;
      }
    } catch (e) {
      toast.push("상품 검색에 오류가 발생했습니다.");
    } finally {
      isLoading = false;
    }
  };

  const handleProductSearchResultFilter = debounce((event: Event) => {
    productSearchResultFiltering(
      (event.target as HTMLInputElement)?.value ?? "",
    );
  }, 300);

  const productSearchResultFiltering = (value: string) => {
    filteredProduct = products.filter(
      (product) =>
        product.brand_kor_name.toLocaleLowerCase().includes(value) ||
        product.alloff_name.toLocaleLowerCase().includes(value),
    );
    listSearchQuery = value;
  };
</script>

<Row padding>
  <Column sm={2}>
    <div class="bx--label">브랜드</div>
    <BrandSelect on:change={handleBrandChange} />
  </Column>
  <Column sm={2}>
    <div class="bx--label">카테고리</div>
    <CategorySelect on:change={handleCategoryChange} />
  </Column>
</Row>
<Row padding>
  <Column>
    <div class="bx--label">상품 검색</div>
    <Search bind:value={searchQuery} placeholder="상품 이름 검색" />
  </Column>
</Row>
<div class="row-right-wrapper">
  <Button on:click={handleProductSearch}>상품 검색</Button>
</div>
<Row padding>
  <Column>
    <h4>상품 검색 결과</h4>
    <div class="row-right-wrapper">
      <Search
        value={listSearchQuery}
        on:input={handleProductSearchResultFilter}
        on:clear={handleProductSearchResultFilter}
        size="sm"
        placeholder="검색결과 내 검색"
        expandable
        bind:expanded={isListFilterExpanded}
        on:expand
        on:collapse
      />
    </div>
    <div
      class="product-list"
      bind:this={scrollableList}
      on:scroll={handleScroll}
    >
      <StructuredList condensed selection flush>
        <StructuredListHead>
          <StructuredListRow head>
            <StructuredListCell head>썸네일</StructuredListCell>
            <StructuredListCell head>브랜드</StructuredListCell>
            <StructuredListCell head>제품명</StructuredListCell>
            <StructuredListCell head>재고</StructuredListCell>
            <StructuredListCell head>가격</StructuredListCell>
            <StructuredListCell head>Actions</StructuredListCell>
          </StructuredListRow>
        </StructuredListHead>
        <StructuredListBody>
          {#if params.totalCount === 0 || filteredProduct.length === 0}
            <StructuredListRow>
              <StructuredListCell>
                검색조건에 맞는 상품을 찾지 못했습니다
              </StructuredListCell>
            </StructuredListRow>
          {/if}
          {#each filteredProduct as product}
            <StructuredListRow
              on:click={handleProductSelect(product)}
              disabled={disabledIds.includes(product.alloff_product_id)}
            >
              <StructuredListInput value={product.alloff_product_id} />
              <StructuredListCell>
                <img
                  class="cell_image"
                  src={product.thumbnail_image !== ""
                    ? product.thumbnail_image
                    : product.images[0]}
                  alt={["product_preview", product.alloff_name].join("-")}
                />
                {#if product.images.length > 1}
                  <img
                    class="cell_image"
                    src={product.images[1]}
                    alt={["product_preview", product.alloff_name].join("-")}
                  />
                {/if}
              </StructuredListCell>
              <StructuredListCell noWrap>
                {product.brand_kor_name}
              </StructuredListCell>
              <StructuredListCell noWrap>
                {product.alloff_name}
              </StructuredListCell>
              <StructuredListCell noWrap>
                {#each product.inventory as inv}
                  <Row padding>
                    {inv.size} : {inv.quantity}개
                  </Row>
                {/each}
              </StructuredListCell>
              <StructuredListCell noWrap>
                {product.original_price} -> {product.discounted_price} ({(
                  ((product.original_price - product.discounted_price) /
                    product.original_price) *
                  100
                ).toFixed(0)}%)
              </StructuredListCell>
              <StructuredListCell>
                <Row padding>
                  <Button
                    tooltipPosition="bottom"
                    tooltipAlignment="end"
                    iconDescription="상품 상세"
                    icon={Launch16}
                    kind="ghost"
                    size="small"
                    on:click={handleProductDetailOpen(
                      product.alloff_product_id,
                    )}
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

  .cell_image {
    width: 200px;
    height: 200px;
    object-fit: cover;
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
