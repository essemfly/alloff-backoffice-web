<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { onMount } from "svelte";
  import { navigate } from "svelte-navigator";
  import { Button, InlineLoading } from "carbon-components-svelte";

  import { Brand, BrandsApi } from "@api";
  import Nav from "@app/components/Nav.svelte";
  import { convertToSnakeCase } from "@app/helpers/change-case";

  import BrandForm from "./components/BrandForm.svelte";
  import { formStore, schema } from "../models/schema";

  export let brand: Brand;

  let isLoading = false;
  let isSubmitting = false;

  const brandApi = new BrandsApi();

  onMount(async () => {
    isLoading = true;
    try {
      const brandData = schema.camelCase().cast(brand);
      formStore.update(brandData);
    } finally {
      isLoading = false;
    }
  });

  const handleSubmit = async () => {
    try {
      const isValid = await formStore.validate($formStore.fields, {
        context: { isAdding: true },
      });
      if (!isValid) {
        toast.push("일부 항목값이 올바르지 않습니다.");
        return;
      }
      await brandApi.brandsCreate({
        createBrandRequest: convertToSnakeCase($formStore.fields),
      });
      toast.push("브랜드 등록이 완료되었습니다.");
      navigate(-1);
    } catch (e) {
      toast.push(`브랜드 등록에 오류가 발생했습니다.`);
    }
  };
</script>

<Nav title="브랜드 추가">
  <h1>브랜드 추가</h1>
  {#if isLoading}
    <InlineLoading status="active" description="On Loading..." />
  {:else}
    <div class="button-right-wrapper mb10">
      <Button on:click={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? "수정중..." : "수정"}
      </Button>
    </div>
    <BrandForm />
    <div class="button-right-wrapper mt10">
      <Button on:click={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? "수정중..." : "수정"}
      </Button>
    </div>
  {/if}
</Nav>
