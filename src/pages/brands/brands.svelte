<script lang="ts">
  import LoggedInFrame from "../common/LoggedInFrame.svelte";
  import {
    Button,



  } from "carbon-components-svelte";

  import DocumentAdd16 from "carbon-icons-svelte/lib/DocumentAdd16";
  import { Brand, BrandsApi } from "../../api";
  import { onMount } from "svelte";
  import BrandCard from "./components/card.svelte";

  let brands: Brand[] = [];

  const brandsAPi = new BrandsApi();

  onMount(async () => {
    brands = (await brandsAPi.brandsList()).data;
  });
</script>

<LoggedInFrame>
    <div style="height: 10px" />
    <div class="button-wrapper">
      <Button
        on:click={() => (window.location.href = "/brands/new-product")}
        icon={DocumentAdd16}>브랜드 추가</Button
      >
    </div>
  <div class="brands">
    {#each brands as brand}
      <BrandCard {brand} mobile={false} />
    {/each}
  </div>
</LoggedInFrame>

<style>
  .brands {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
  }
  .button-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }
</style>
