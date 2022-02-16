<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { onMount } from "svelte";
  import { navigate } from "svelte-navigator";
  import { Grid, Button, InlineLoading } from "carbon-components-svelte";
  import Save16 from "carbon-icons-svelte/lib/Save16";

  import { EditProductRequestRequest, Product, ProductsApi } from "@api";
  import Nav from "@app/components/Nav.svelte";

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
    try {
      const res = await productApi.productsUpdate({
        id: product.alloff_product_id,
        editProductRequestRequest:
          product as unknown as EditProductRequestRequest,
      });
      toast.push("상품 수정이 완료되었습니다.");
      navigate(-1);
    } catch (e) {
      toast.push(`상품 수정에 오류가 발생했습니다.`);
    }
  };
</script>

<Nav title={`${product?.alloff_name ?? "상품 상세"}`}>
  {#if isLoading}
    <InlineLoading status="active" description="On Loading..." />
  {:else}
    <Grid>
      <div class="button-right-wrapper mb10">
        <Button on:click={handleSubmit} disabled={!isTouched} icon={Save16}>
          {"수정"}
        </Button>
      </div>
      <ProductForm form={product} />
      <div class="button-right-wrapper mt10">
        <Button on:click={handleSubmit} disabled={!isTouched} icon={Save16}>
          {"수정"}
        </Button>
      </div>
    </Grid>
  {/if}
</Nav>
