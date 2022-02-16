<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { Button } from "carbon-components-svelte";

  import { CreateHomeTabRequest, ItemTypeEnum, HometabsApi } from "@app/api";
  import Nav from "@app/components/Nav.svelte";

  import HometabItemForm from "./components/HometabItemForm.svelte";

  let hometabItem: CreateHomeTabRequest = {
    title: "",
    description: "",
    back_image_url: "",
    start_time: "",
    finish_time: "",
    contents: {
      item_type: ItemTypeEnum.BrandExhibition,
      options: [],
    },
    weight: 0,
  };

  const hometabApi = new HometabsApi();

  const handleSubmit = async () => {
    try {
      const res = hometabApi.hometabsCreate({
        createHomeTabRequest: hometabItem,
      });
      toast.push("기획전 등록이 완료되었습니다.");
      navigate(-1);
    } catch (e) {
      toast.push(`기획전 등록에 오류가 발생했습니다.`);
    }
  };
</script>

<Nav title="홈탭 아이템 추가">
  <h1>홈탭 아이템 추가</h1>
  <div class="button-right-wrapper mb10">
    <Button on:click={handleSubmit}>홈탭 아이템 등록</Button>
  </div>
  <HometabItemForm bind:form={hometabItem} isAdding />
  <div class="button-right-wrapper mt10">
    <Button on:click={handleSubmit}>홈탭 아이템 등록</Button>
  </div>
</Nav>
