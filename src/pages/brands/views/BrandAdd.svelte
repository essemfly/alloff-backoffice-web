<script lang="ts">
  import { apiConfigs } from "@app/store";
  import { toast } from "@zerodevx/svelte-toast";
  import { navigate } from "svelte-navigator";
  import { Button } from "carbon-components-svelte";

  import {
    BrandsApi,
    CreateBrandRequest,
  } from "@lessbutter/alloff-backoffice-api";
  import Nav from "@app/components/Nav.svelte";

  import BrandForm from "./components/BrandForm.svelte";
  import { formStore, schema } from "../models/schema";
  import { onMount } from "svelte";

  const brandApi = new BrandsApi($apiConfigs);

  onMount(() => {
    formStore.initialize();
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
        createBrandRequest: schema
          .snakeCase()
          .cast($formStore.fields) as unknown as CreateBrandRequest,
      });
      toast.push("브랜드 등록이 완료되었습니다.");
      navigate(-1);
    } catch (e) {
      toast.push(`브랜드 등록에 오류가 발생했습니다.`);
    }
  };
</script>

<Nav title="브랜드 추가">
  <div class="row-right-wrapper mb10">
    <Button on:click={handleSubmit}>브랜드 등록</Button>
  </div>
  <BrandForm isAdding />
  <div class="row-right-wrapper mt10">
    <Button on:click={handleSubmit}>브랜드 등록</Button>
  </div>
</Nav>
