<script lang="ts">
  import { onMount } from "svelte";
  import { navigate } from "svelte-navigator";
  import { Button } from "carbon-components-svelte";
  import DocumentAdd16 from "carbon-icons-svelte/lib/DocumentAdd16";
  import LoggedInFrame from "../common/LoggedInFrame.svelte";
  import ProductCard from "./components/ProductCard.svelte";

  import { Product, ProductsApi } from "../../api";

  let products: Product[] = [];
  const productApi = new ProductsApi();

  onMount(async () => {
    const res = await productApi.productsList();
    console.log(res, res.data);
    products = (await productApi.productsList()).data;
  });

  const handleAddClick = (event: MouseEvent) => {
    event.preventDefault();
    navigate("/products/add");
  };
</script>

<LoggedInFrame>
  <div class="button-wrapper">
    <Button icon={DocumentAdd16} on:click={handleAddClick}>상품 추가</Button>
  </div>
  <ul class="product-list">
    {#each products as product}
      <ProductCard {product} />
    {/each}
  </ul>
  <div class="button-wrapper">
    <Button icon={DocumentAdd16} on:click={handleAddClick}>상품 추가</Button>
  </div>
</LoggedInFrame>

<style>
  .product-list {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
  }

  .button-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }
</style>
