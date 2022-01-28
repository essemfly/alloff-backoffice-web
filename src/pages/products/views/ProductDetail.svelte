<script lang="ts">
  import { onMount } from "svelte";
  import { Grid, Button, InlineLoading } from "carbon-components-svelte";
  import Save16 from "carbon-icons-svelte/lib/Save16";

  import {
    EditProductRequestRequest,
    Product,
    ProductsApi,
  } from "../../../api";
  import LoggedInFrame from "../../common/LoggedInFrame.svelte";
  import ProductForm from "./components/ProductForm.svelte";

  const productApi = new ProductsApi();

  export let productId: string;

  let product: Product;
  let isLoading = true;
  let isTouched = true;

  onMount(async () => {
    const res = await productApi.productsRetrieve({ id: productId });
    product = res.data;
    isLoading = false;
  });

  const handleSubmit = async () => {
    const res = await productApi.productsUpdate({
      id: product.alloff_product_id,
      editProductRequestRequest:
        product as unknown as EditProductRequestRequest,
    });
  };
</script>

<LoggedInFrame>
  {#if isLoading}
    <InlineLoading status="active" description="On Loading..." />
  {:else}
    <Grid>
      <div class="button-wrapper mb10">
        <Button on:click={handleSubmit} disabled={!isTouched} icon={Save16}>
          {"수정"}
        </Button>
      </div>
      <ProductForm form={product} />
      <div class="button-wrapper mt10">
        <Button on:click={handleSubmit} disabled={!isTouched} icon={Save16}>
          {"수정"}
        </Button>
      </div>
    </Grid>
  {/if}
</LoggedInFrame>

<style>
  .button-wrapper {
    display: flex;
    justify-content: flex-end;
  }

  .mb10 {
    margin-bottom: 10px;
  }

  .mt10 {
    margin-top: 10px;
  }
</style>
