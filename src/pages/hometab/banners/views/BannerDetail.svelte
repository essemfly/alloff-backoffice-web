<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { onMount } from "svelte";
  import { navigate } from "svelte-navigator";
  import { Button, InlineLoading } from "carbon-components-svelte";
  import Save16 from "carbon-icons-svelte/lib/Save16";

  import { EditTopBannerRequest, TopBanner, TopBannersApi } from "@app/api";
  import Nav from "@app/components/Nav.svelte";

  import BannerForm from "./components/BannerForm.svelte";

  export let id: string;

  let banner: TopBanner;
  let isLoading = true;

  const bannerApi = new TopBannersApi();

  onMount(async () => {
    const res = await bannerApi.topBannersRetrieve({ id });
    banner = res.data;
    isLoading = false;
  });

  const handleSubmit = async () => {
    try {
      const res = await bannerApi.topBannersUpdate({
        id: banner.banner_id,
        editTopBannerRequest: banner as unknown as EditTopBannerRequest,
      });
      toast.push("배너 수정이 완료되었습니다.");
      navigate(-1);
    } catch (e) {
      toast.push(`배너 수정에 오류가 발생했습니다.`);
    }
  };
</script>

<Nav title={`${banner?.title ?? "배너 상세"}`}>
  {#if isLoading}
    <InlineLoading status="active" description="On Loading..." />
  {:else}
    <div class="button-right-wrapper mb10">
      <Button on:click={handleSubmit} icon={Save16}>수정</Button>
    </div>
    <BannerForm form={banner} />
    <div class="button-right-wrapper mb10">
      <Button on:click={handleSubmit} icon={Save16}>수정</Button>
    </div>
  {/if}
</Nav>
