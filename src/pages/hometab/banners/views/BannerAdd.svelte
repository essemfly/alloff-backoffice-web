<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { navigate } from "svelte-navigator";
  import { Button } from "carbon-components-svelte";

  import { CreateTopBannerRequest, TopBanner, TopBannersApi } from "@app/api";
  import Nav from "@app/components/Nav.svelte";

  import BannerForm from "./components/BannerForm.svelte";

  let banner: TopBanner = {
    banner_id: "",
    title: "",
    subtitle: "",
    banner_image: "",
    exhibition_id: "",
    is_live: false,
    weight: 0,
  };

  const handleSubmit = async () => {
    try {
      const bannerApi = new TopBannersApi();
      const { banner_id, ...requestBody } = banner;
      const res = await bannerApi.topBannersCreate({
        createTopBannerRequest:
          requestBody as unknown as CreateTopBannerRequest,
      });
      toast.push("배너 등록이 완료되었습니다.");
      navigate(-1);
    } catch (e) {
      toast.push(`배너 등록에 오류가 발생했습니다.`);
    }
  };
</script>

<Nav title="배너 추가">
  <h1>배너 추가</h1>
  <div class="button-right-wrapper mb10">
    <Button on:click={handleSubmit}>배너 등록</Button>
  </div>
  <BannerForm form={banner} isAdding />
  <div class="button-right-wrapper mb10">
    <Button on:click={handleSubmit}>배너 등록</Button>
  </div>
</Nav>
