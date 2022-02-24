<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { onMount } from "svelte";
  import { navigate } from "svelte-navigator";
  import { Button, InlineLoading } from "carbon-components-svelte";

  import { EditHomeTabRequest, HomeTab, HometabsApi } from "@api";
  import Nav from "@app/components/Nav.svelte";

  import HometabItemForm from "./components/HometabItemForm.svelte";

  export let id: string;

  let hometabItem: HomeTab;
  let isLoading = true;

  const hometabApi = new HometabsApi();

  onMount(async () => {
    const res = await hometabApi.hometabsRetrieve({ id });
    hometabItem = res.data;
    isLoading = false;
  });

  const handleSubmit = async () => {
    try {
      const res = await hometabApi.hometabsUpdate({
        id: hometabItem.item_id,
        editHomeTabRequest: {
          hometab_id: hometabItem.item_id,
          ...hometabItem,
        } as unknown as EditHomeTabRequest,
      });
      toast.push("홈탭 아이템이 수정되었습니다.");
      navigate(-1);
    } catch (e) {
      toast.push(`홈탭 아이템 등록에 오류가 발생했습니다.`);
    }
  };
</script>

<Nav title={`${hometabItem?.title ?? "홈탭 아이템 상세"}`}>
  {#if isLoading}
    <InlineLoading status="active" description="On Loading..." />
  {:else}
    <div class="button-right-wrapper mb10">
      <Button on:click={handleSubmit}>홈탭 아이템 수정</Button>
    </div>
    <HometabItemForm bind:form={hometabItem} />
    <div class="button-right-wrapper mb10">
      <Button on:click={handleSubmit}>홈탭 아이템 수정</Button>
    </div>
  {/if}
</Nav>
