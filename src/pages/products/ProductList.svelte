<script lang="ts">
  import { onMount } from "svelte";
  import { navigate } from "svelte-navigator";
  import { Button, Search } from "carbon-components-svelte";
  import DocumentAdd16 from "carbon-icons-svelte/lib/DocumentAdd16";
  import LoggedInFrame from "../common/LoggedInFrame.svelte";
  import ProductCard from "./components/ProductCard.svelte";
  import Pagination from "../../components/Pagination.svelte";

  import { Product, ProductsApi } from "../../api";

  let products: Product[] = [];
  let page = 1;
  let totalItems = 0;

  const productApi = new ProductsApi();

  onMount(async () => {
    const res = await productApi.productsList();
    products = res.data;
  });

  const handleAddClick = (event: MouseEvent) => {
    event.preventDefault();
    navigate("/products/add");
  };
</script>

<LoggedInFrame>
  <div class="button-wrapper mb10">
    <Button icon={DocumentAdd16} on:click={handleAddClick}>상품 추가</Button>
  </div>
  <Pagination {page} {totalItems} />
  <Search />
  <ul class="product-list">
    {#each products as product}
      <ProductCard {product} />
    {/each}
  </ul>
  <div class="button-wrapper mt10">
    <Button icon={DocumentAdd16} on:click={handleAddClick}>상품 추가</Button>
  </div>
  <Pagination {page} {totalItems} />
  <Search />
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
