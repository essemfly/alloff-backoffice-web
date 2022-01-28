<script lang="ts">
  import { onMount } from "svelte";
  import { navigate, useLocation } from "svelte-navigator";
  import { Button, Search } from "carbon-components-svelte";
  import DocumentAdd16 from "carbon-icons-svelte/lib/DocumentAdd16";
  import LoggedInFrame from "../../common/LoggedInFrame.svelte";
  import Pagination from "../../../components/Pagination.svelte";
  import ProductCard from "./components/ProductCard.svelte";

  import { Product, ProductsApi } from "../../../api";
  import {
    formatQueryString,
    parseQueryString,
  } from "../../../helpers/query-string";

  interface SearchQueryParam {
    page: number;
    size: number;
    query?: string;
  }

  let products: Product[] = [];
  let page = 1;
  let size = 50;
  let totalItems = 0;

  const productApi = new ProductsApi();
  const location = useLocation<SearchQueryParam>();
  const queryParams: SearchQueryParam = parseQueryString($location.search);

  const load = async (params: SearchQueryParam) => {
    const res = await productApi.productsList({
      ...params,
      search_query: params.query,
    });
    products = res.data;
    totalItems = res.data.length; // todo: fix
  };

  onMount(async () => {
    const params = parseQueryString<SearchQueryParam>($location.search);
    await load(params);
  });

  const handleAddClick = (event: MouseEvent) => {
    event.preventDefault();
    navigate("/products/add");
  };

  const handleSearch = (e: KeyboardEvent) => {
    const value = (e.target as HTMLInputElement).value.trim();
    if (e.keyCode === 13) {
      const queryString = formatQueryString({
        page: 1,
        size,
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

<LoggedInFrame>
  <div class="button-wrapper mb10">
    <Button icon={DocumentAdd16} on:click={handleAddClick}>상품 추가</Button>
  </div>
  <Pagination {page} {totalItems} />
  <Search on:keydown={handleSearch} value={queryParams?.query ?? ""} />
  <ul class="product-list">
    {#each products as product}
      <ProductCard {product} />
    {/each}
  </ul>
  <div class="button-wrapper mt10">
    <Button icon={DocumentAdd16} on:click={handleAddClick}>상품 추가</Button>
  </div>
</LoggedInFrame>

<style>
  .product-list {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    flex: 1 0 21%; /* explanation below */
    justify-content: space-between;
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
