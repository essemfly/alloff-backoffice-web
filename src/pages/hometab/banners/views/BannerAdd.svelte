<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { onMount } from "svelte";
  import { navigate } from "svelte-navigator";
  import { Button } from "carbon-components-svelte";

  import { CreateTopBannerRequest, TopBannersApi } from "@app/api";
  import Nav from "@app/components/Nav.svelte";
  import { convertToSnakeCase } from "@app/helpers/change-case";

  import BannerForm from "./components/BannerForm.svelte";
  import { formStore } from "../models/schema";

  let isSubmitting = false;

  const bannerApi = new TopBannersApi();

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
      await bannerApi.topBannersCreate({
        createTopBannerRequest: convertToSnakeCase<CreateTopBannerRequest>(
          $formStore.fields,
        ),
      });
      toast.push("배너 등록이 완료되었습니다.");
      navigate(-1);
    } catch (e) {
      toast.push(`배너 등록에 오류가 발생했습니다.`);
    } finally {
      isSubmitting = false;
    }
  };
</script>

<Nav title="배너 추가">
  <div class="row-right-wrapper mb10">
    <Button on:click={handleSubmit} disabled={isSubmitting}>
      {isSubmitting ? "등록중..." : "등록"}
    </Button>
  </div>
  <BannerForm isAdding />
  <div class="row-right-wrapper mt10">
    <Button on:click={handleSubmit} disabled={isSubmitting}>
      {isSubmitting ? "등록중..." : "등록"}
    </Button>
  </div>
</Nav>
