<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { navigate } from "svelte-navigator";
  import { Button, Grid } from "carbon-components-svelte";
  import Save16 from "carbon-icons-svelte/lib/Save16";

  import { CreateProductRequestApiRequest, Product, ProductsApi } from "@api";
  import Nav from "@app/components/Nav.svelte";

  import ProductForm from "./components/ProductForm.svelte";
  import { formStore } from "../models/schema";
  import { snakeCase } from "change-case-object";

  let isSubmitting = false;

  const productApi = new ProductsApi();

  const handleSubmit = async (event: MouseEvent) => {
    isSubmitting = true;
    try {
      event.preventDefault();
      const isValid = await formStore.validate($formStore.fields, {
        context: { isAdding: true },
      });
      if (!isValid) {
        toast.push("일부 항목값이 올바르지 않습니다.");
        return;
      }
      await productApi.productsCreate({
        createProductRequestApiRequest: snakeCase(
          $formStore.fields,
        ) as unknown as CreateProductRequestApiRequest,
      });
      toast.push("상품 등록이 완료되었습니다.");
      navigate(-1);
    } catch (e) {
      toast.push(`상품 등록에 오류가 발생했습니다.`);
    } finally {
      isSubmitting = false;
    }
  };
</script>

<Nav title="상품 추가" loading={isSubmitting}>
  <Grid>
    <div class="button-right-wrapper mb10">
      <Button on:click={handleSubmit} disabled={isSubmitting} icon={Save16}>
        {isSubmitting ? "상품 등록중..." : "상품 등록"}
      </Button>
    </div>
    <ProductForm isAdding />
    <div class="button-right-wrapper mt10">
      <Button on:click={handleSubmit} disabled={isSubmitting} icon={Save16}>
        {isSubmitting ? "상품 등록중..." : "상품 등록"}
      </Button>
    </div>
  </Grid>
</Nav>
