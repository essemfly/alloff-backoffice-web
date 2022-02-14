<script lang="ts">
  import { onMount } from "svelte";
  import { Button } from "carbon-components-svelte";
  import DocumentAdd16 from "carbon-icons-svelte/lib/DocumentAdd16";

  import { Brand, BrandsApi } from "@api";
  import Nav from "@app/components/Nav.svelte";

  import BrandCard from "./components/BrandCard.svelte";
  import BrandModal from "./components/BrandModal.svelte";

  let brands: Brand[] = [];

  let createBrandModalOpen = false;
  const brandsAPi = new BrandsApi();

  const closeModal = () => {
    createBrandModalOpen = false;
  };

  onMount(async () => {
    brands = (await brandsAPi.brandsList()).data;
  });
</script>

<Nav>
  <div style="height: 10px" />
  <div class="button-wrapper">
    <Button
      on:click={() => (createBrandModalOpen = true)}
      icon={DocumentAdd16}
      disabled
    >
      브랜드 추가
    </Button>
  </div>
  <BrandModal isModalOpen={createBrandModalOpen} onCloseModal={closeModal} />
  <div class="brands">
    {#each brands as brand}
      <BrandCard {brand} mobile={false} />
    {/each}
  </div>
</Nav>

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
