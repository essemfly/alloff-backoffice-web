<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { onMount } from "svelte";
  import { navigate } from "svelte-navigator";
  import { Button, Grid, InlineLoading } from "carbon-components-svelte";
  import Save16 from "carbon-icons-svelte/lib/Save16";

  import { EditProductRequestApiRequest, ProductsApi } from "@api";
  import Nav from "@app/components/Nav.svelte";
  import {
    convertToCamelCase,
    convertToSnakeCase,
  } from "@app/helpers/change-case";

  import ProductForm from "./components/ProductForm.svelte";
  import { formStore } from "../models/schema";

  const productApi = new ProductsApi();

  export let productId: string;

  let isLoading = true;
  let isSubmitting = false;

  onMount(async () => {
    const res = await productApi.productsRetrieve({ id: productId });
    const product = convertToCamelCase({
      ...res.data,
      thumbnail_image:
        res.data.main_image_url ?? res.data.thumbnail_image ?? undefined,
    });
    formStore.update(product);
    isLoading = false;
  });

  const handleSubmit = async () => {
    isSubmitting = true;
    try {
      await productApi.productsUpdate({
        id: $formStore.fields.alloffProductId,
        editProductRequestApiRequest:
          convertToSnakeCase<EditProductRequestApiRequest>(
            $formStore.fields,
          ) as unknown as EditProductRequestApiRequest,
      });
      toast.push("상품 수정이 완료되었습니다.");
      navigate(-1);
    } catch (e) {
      toast.push(`상품 수정에 오류가 발생했습니다.`);
    } finally {
      isSubmitting = false;
    }
  };
</script>

<Nav title={`${$formStore.fields.alloffName ?? "상품 상세"}`}>
  {#if isLoading}
    <InlineLoading status="active" description="On Loading..." />
  {:else}
    <Grid>
      <div class="row-right-wrapper mb10">
        <Button on:click={handleSubmit} disabled={isSubmitting} icon={Save16}>
          {isSubmitting ? "수정중..." : "수정"}
        </Button>
      </div>
      <ProductForm />
      <div class="row-right-wrapper mt10">
        <Button on:click={handleSubmit} disabled={isSubmitting} icon={Save16}>
          {isSubmitting ? "수정중..." : "수정"}
        </Button>
      </div>
    </Grid>
  {/if}
</Nav>
