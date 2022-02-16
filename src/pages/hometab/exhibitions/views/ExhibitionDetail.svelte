<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
  import { onMount } from "svelte";
  import { navigate } from "svelte-navigator";
  import { Button, InlineLoading } from "carbon-components-svelte";
  import Save16 from "carbon-icons-svelte/lib/Save16";

  import { EditExhibitionRequest, Exhibition, ExhibitionsApi } from "@api";
  import Nav from "@app/components/Nav.svelte";

  import ExhibitionForm from "./components/ExhibitionForm.svelte";

  export let id: string;

  let exhibition: Exhibition;
  let isLoading = true;

  const bannerApi = new ExhibitionsApi();

  onMount(async () => {
    const res = await bannerApi.exhibitionsRetrieve({ id });
    exhibition = res.data;
    isLoading = false;
  });

  const handleSubmit = async () => {
    try {
      const res = await bannerApi.exhibitionsUpdate({
        id: exhibition.exhibition_id,
        editExhibitionRequest: exhibition as unknown as EditExhibitionRequest,
      });
      toast.push("기획전 수정이 완료되었습니다.");
      navigate(-1);
    } catch (e) {
      toast.push(`기획전 수정에 오류가 발생했습니다.`);
    }
  };
</script>

<Nav title={`${exhibition?.title ?? "기획전 상세"}`}>
  {#if isLoading}
    <InlineLoading status="active" description="On Loading..." />
  {:else}
    <div class="button-right-wrapper mb10">
      <Button on:click={handleSubmit} icon={Save16}>수정</Button>
    </div>
    <ExhibitionForm form={exhibition} />
    <div class="button-right-wrapper mb10">
      <Button on:click={handleSubmit} icon={Save16}>수정</Button>
    </div>
  {/if}
</Nav>
