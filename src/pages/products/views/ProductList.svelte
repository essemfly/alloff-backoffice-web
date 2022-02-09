<script lang="ts">
  import { onMount } from "svelte";
  import { navigate, useLocation } from "svelte-navigator";
  import { Button, Search } from "carbon-components-svelte";
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

  let products: Product[] = [];
  let offset = 0;
  let limit = 50;
  let searchQuery = "";
  let totalItems = 0;

  const productApi = new ProductsApi();
  const location = useLocation<SearchQueryParam>();

  const load = async (params: SearchQueryParam) => {
    let res = await productApi.productsList({
      offset: params.offset ?? 0,
      limit: params.limit ?? 50,
      query: params.query ?? "",
    });

    res = res.data;
    products = res.products;

    // query strings
    offset = res.offset;
    limit = res.limit;
    totalItems = res.total_counts;
    searchQuery =
      params.query ??
      res.list_query.alloff_category_id ??
      res.list_query.brand_id ??
      res.list_query.category_id ??
      res.list_query.search_query;
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
    const queryString = formatQueryString({
      offset,
      limit,
      query: searchQuery,
    });
    navigate(`${$location.pathname}?${queryString}`);
  };

  const handleSearch = (e: KeyboardEvent) => {
    const value = (e.target as HTMLInputElement).value.trim();
    if (e.keyCode === 13) {
      const queryString = formatQueryString({
        offset: 0,
        limit,
        query: value,
      });

      navigate(`${$location.pathname}?${queryString}`);
    }
  };

  $: if ($location) {
    const params = parseQueryString<SearchQueryParam>($location.search);
    load(params);
  }
</script>

<Nav title="상품 목록">
  <div class="button-wrapper mb10">
    <Button icon={DocumentAdd16} on:click={handleAddClick}>상품 추가</Button>
  </div>
  <Pagination {limit} {offset} {totalItems} on:change={handlePageChange} />
  <Search on:keydown={handleSearch} bind:value={searchQuery} />
  <ul class="product-list">
    {#each products as product}
      <ProductCard {product} />
    {/each}
  </ul>
  <div class="button-wrapper mt10">
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

  .button-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }

  .mb10 {
    margin-bottom: 10px;
  }

  .mt10 {
    margin-top: 10px;
  }
</style>
