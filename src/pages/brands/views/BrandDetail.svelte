<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { onMount } from "svelte";
  import { navigate } from "svelte-navigator";
  import { Button, InlineLoading } from "carbon-components-svelte";

  import { Brand, BrandsApi } from "@api";
  import Nav from "@app/components/Nav.svelte";
  import {
    convertToCamelCase,
    convertToSnakeCase,
  } from "@app/helpers/change-case";

  import BrandForm from "./components/BrandForm.svelte";
  import { formStore } from "../models/schema";

  export let id: string;

  let isLoading = false;
  let isSubmitting = false;

  const brandApi = new BrandsApi();

  onMount(async () => {
    if ($formStore.fields.brandId) {
      return;
    }
    isLoading = true;
    try {
      const res = await brandApi.brandsList();
      const brand = res.data.find(({ brand_id }: Brand) => brand_id === id);
      if (brand) {
        const brandData = convertToCamelCase(brand);
        formStore.update(brandData);
      } else {
        navigate(-1);
      }
    } finally {
      isLoading = false;
    }
  });

  const handleSubmit = async () => {
    try {
      isSubmitting = true;
      const isValid = await formStore.validate($formStore.fields, {
        context: { isAdding: true },
      });
      if (!isValid) {
        toast.push("일부 항목값이 올바르지 않습니다.");
        return;
      }
      await brandApi.brandsPartialUpdate({
        id: $formStore.fields.brandId,
        patchedBrandRequest: convertToSnakeCase($formStore.fields),
      });
      toast.push("브랜드 등록이 완료되었습니다.");
      navigate(-1);
    } catch (e) {
      toast.push(`브랜드 등록에 오류가 발생했습니다.`);
    } finally {
      isSubmitting = false;
    }
  };
</script>

<Nav title={$formStore.fields.korname ?? "브랜드 상세"}>
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
