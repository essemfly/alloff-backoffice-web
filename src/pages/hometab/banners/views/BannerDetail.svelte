<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { onMount } from "svelte";
  import { navigate } from "svelte-navigator";
  import { Button, InlineLoading } from "carbon-components-svelte";
  import Save16 from "carbon-icons-svelte/lib/Save16";

  import { EditTopBannerRequest, TopBannersApi } from "@app/api";
  import Nav from "@app/components/Nav.svelte";
  import {
    convertToCamelCase,
    convertToSnakeCase,
  } from "@app/helpers/change-case";

  import BannerForm from "./components/BannerForm.svelte";
  import { formStore } from "../models/schema";

  export let id: string;

  let isLoading = false;
  let isSubmitting = false;

  const bannerApi = new TopBannersApi();

  onMount(async () => {
    isLoading = true;
    try {
      const res = await bannerApi.topBannersRetrieve({ id });
      const banner = convertToCamelCase(res.data);
      formStore.update(banner);
    } finally {
      isLoading = false;
    }
  });

  const handleSubmit = async (event: MouseEvent) => {
    isSubmitting = true;
    try {
      event.preventDefault();
      const isValid = await formStore.validate($formStore.fields);
      if (!isValid) {
        toast.push("일부 항목값이 올바르지 않습니다.");
        return;
      }
      await bannerApi.topBannersUpdate({
        id: $formStore.fields.bannerId,
        editTopBannerRequest: convertToSnakeCase<EditTopBannerRequest>(
          $formStore.fields,
        ),
      });
      toast.push("배너 수정이 완료되었습니다.");
      navigate(-1);
    } catch (e) {
      toast.push(`배너 수정에 오류가 발생했습니다.`);
    } finally {
      isSubmitting = false;
    }
  };
</script>

<Nav title={`${$formStore.fields.title ?? "배너 상세"}`}>
  {#if isLoading}
    <InlineLoading status="active" description="On Loading..." />
  {:else}
    <div class="row-right-wrapper mb10">
      <Button on:click={handleSubmit} disabled={isSubmitting} icon={Save16}>
        {isSubmitting ? "수정중..." : "수정"}
      </Button>
    </div>
    <BannerForm />
    <div class="row-right-wrapper mb10">
      <Button on:click={handleSubmit} disabled={isSubmitting} icon={Save16}>
        {isSubmitting ? "수정중..." : "수정"}
      </Button>
    </div>
  {/if}
</Nav>
