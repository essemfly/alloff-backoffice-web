<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { onMount } from "svelte";
  import { navigate } from "svelte-navigator";
  import { Button, Grid, InlineLoading } from "carbon-components-svelte";
  import Save16 from "carbon-icons-svelte/lib/Save16";

  import Nav from "@app/components/Nav.svelte";
  import { convertToCamelCase } from "@app/helpers/change-case";
  import { ProductTypesEnum } from "@lessbutter/alloff-backoffice-api";

  import ProductForm from "./components/ProductForm.svelte";
  import { formStore } from "../models/schema";
  import { useProductService } from "../ProductService";
  import { getProductTypeByIndex, getProductTypeIndex } from "../commands/helpers";

  const productService = useProductService();

  export let productId: string;

  let isLoading = true;
  let isSubmitting = false;

  onMount(async () => {
    const res = await productService.load(productId);
    if (res) {
      const product = convertToCamelCase({
        ...res,
        productTypes: res.product_types.map((key) => {
          return getProductTypeByIndex(key as unknown as number)
        }),
        thumbnail_image: res.main_image_url ?? res.thumbnail_image ?? undefined,
      });
      formStore.update(product);
    }
    isLoading = false;
  });

  const handleSubmit = async () => {
    isSubmitting = true;
    try {
      const isValid = await formStore.validate($formStore.fields);
      if (!isValid) {
        toast.push("일부 항목값이 올바르지 않습니다.");
        return;
      }
      
      console.log("before", $formStore.fields.productTypes)

      await productService.edit(productId, $formStore.fields);
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
