<script lang="ts">
  import { onMount } from "svelte";
  import { navigate, useLocation } from "svelte-navigator";
  import { Button, Column, Row, Search } from "carbon-components-svelte";
  import DocumentAdd16 from "carbon-icons-svelte/lib/DocumentAdd16";

  import {
    Product,
    ProductsApi,
    ProductsApiProductsListRequest as SearchQueryParam,
  } from "@api";
  import Nav from "@app/components/Nav.svelte";
  import Pagination from "@app/components/Pagination.svelte";
  import {
    formatQueryString,
    parseQueryString,
  } from "@app/helpers/query-string";

  import ProductCard from "./components/ProductCard.svelte";
  import BrandSelect from "@app/components/BrandSelect.svelte";
  import { AutocompleteItem } from "@app/components/autocomplete";

  let products: Product[] = [];
  let searchFilter: SearchQueryParam = {
    offset: 0,
    limit: 50,
    searchQuery: "",
    brandId: "",
  };
  let totalItems = 0;

  const productApi = new ProductsApi();
  const location = useLocation<SearchQueryParam>();

  const load = async (params: SearchQueryParam) => {
    let res = await productApi.productsList({ ...searchFilter, ...params });

    products = res.data.products;

    // query strings
    searchFilter = {
      offset: res.data.offset,
      limit: res.data.limit,
      searchQuery: res.data.list_query.search_query,
      brandId: res.data.list_query.brand_id,
    };
    totalItems = res.data.total_counts;
  };

  onMount(async () => {
    const params = parseQueryString<SearchQueryParam>($location.search);
    await load(params);
  });

  const handleAddClick = (event: MouseEvent) => {
    event.preventDefault();
    navigate("/products/add");
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

  const handleBrandChange = (event: CustomEvent<AutocompleteItem>) => {
    const brandId = event.detail.key ?? "";
    searchFilter = {
      ...searchFilter,
      brandId,
    };
  };

  const handleSearchKeydown = (e: KeyboardEvent) => {
    const value = (e.target as HTMLInputElement).value.trim();
    if (e.key === "Enter") {
      searchFilter = {
        ...searchFilter,
        searchQuery: value,
      };
      handleSearch();
    }
  };

  const handleSearch = () => {
    const queryString = formatQueryString({ ...searchFilter });
    navigate(`${$location.pathname}?${queryString}`);
  };

  $: if ($location) {
    const params = parseQueryString<SearchQueryParam>($location.search);
    load(params);
  }
</script>

<Nav title="상품 목록">
  <div class="button-right-wrapper mb10">
    <Button icon={DocumentAdd16} on:click={handleAddClick}>상품 추가</Button>
  </div>
  <form class="mb10">
    <Row class="search-wrapper">
      <Column sm={1}>
        <BrandSelect size="lg" on:change={handleBrandChange} />
      </Column>
      <Column sm={3}>
        <Search
          on:keydown={handleSearchKeydown}
          bind:value={searchFilter.searchQuery}
        />
      </Column>
    </Row>
    <div class="button-wrapper">
      <Button on:click={handleSearch}>검색</Button>
    </div>
  </form>
  <Pagination
    limit={searchFilter.limit}
    offset={searchFilter.offset}
    {totalItems}
    on:change={handlePageChange}
  />
  <ul class="product-list">
    {#each products as product}
      <ProductCard {product} />
    {/each}
  </ul>
  <div class="button-right-wrapper mt10">
    <Button icon={DocumentAdd16} on:click={handleAddClick}>상품 추가</Button>
  </div>
</Nav>

<style>
  .product-list {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    flex: 1 0 21%; /* explanation below */
    justify-content: flex-start;
  }
</style>
