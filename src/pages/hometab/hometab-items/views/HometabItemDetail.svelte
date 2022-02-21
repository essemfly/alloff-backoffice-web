<script lang="ts">
  import { onMount } from "svelte";
  import { InlineLoading } from "carbon-components-svelte";

  import { HomeTab, HometabsApi } from "@api";
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
</script>

<Nav title={`${hometabItem?.title ?? "홈탭 아이템 상세"}`}>
  {#if isLoading}
    <InlineLoading status="active" description="On Loading..." />
  {:else}
    <HometabItemForm form={hometabItem} />
  {/if}
</Nav>
