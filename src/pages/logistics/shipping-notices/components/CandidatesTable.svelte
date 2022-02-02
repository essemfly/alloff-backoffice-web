<script lang="ts">
  import { InlineLoading } from "carbon-components-svelte";
  import type { ShippingCandidateProto } from "../../../../api";
  import CandidatesDatatable from "./CandidatesDatatable.svelte";

  export let fulfilledCandidates: ShippingCandidateProto[];
  export let partialCandidates: ShippingCandidateProto[];
  export let loading: boolean;
  export let isMobile = false;
</script>

{#if loading}
  <div class="overlay">
    <div>
      <InlineLoading description="로딩중..." />
    </div>
  </div>
{:else}
  <h3>출고 가능 목록</h3>
  {#if fulfilledCandidates.length > 0}
    <CandidatesDatatable candidates={fulfilledCandidates} bind:isMobile />
  {:else}
    <h4>없음</h4>
  {/if}
  <div style="height: 100px;" />
  <h3>부분출고 가능 목록</h3>
  {#if partialCandidates.length === 0}
    <h4>없음</h4>
  {:else}
    <CandidatesDatatable candidates={partialCandidates} bind:isMobile />
  {/if}
{/if}

<style>
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
  }
</style>
