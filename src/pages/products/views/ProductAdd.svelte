<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { onMount } from "svelte";
  import { navigate } from "svelte-navigator";
  import { Button, Grid } from "carbon-components-svelte";
  import Save16 from "carbon-icons-svelte/lib/Save16";

  import Nav from "@app/components/Nav.svelte";

  import ProductForm from "./components/ProductForm.svelte";
  import { formStore } from "../models/schema";
  import { useProductService } from "../ProductService";

  let isSubmitting = false;

  const productService = useProductService();

  onMount(() => {
    formStore.initialize();
  });

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
      await productService.create($formStore.fields);
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
    <div class="row-right-wrapper mb10">
      <Button on:click={handleSubmit} disabled={isSubmitting} icon={Save16}>
        {isSubmitting ? "상품 등록중..." : "상품 등록"}
      </Button>
    </div>
    <ProductForm isAdding />
    <div class="row-right-wrapper mt10">
      <Button on:click={handleSubmit} disabled={isSubmitting} icon={Save16}>
        {isSubmitting ? "상품 등록중..." : "상품 등록"}
      </Button>
    </div>
  </Grid>
</Nav>
