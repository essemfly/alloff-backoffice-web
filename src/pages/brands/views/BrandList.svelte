<script lang="ts">
  import { onMount } from "svelte";
  import { navigate } from "svelte-navigator";
  import { Button } from "carbon-components-svelte";
  import DocumentAdd16 from "carbon-icons-svelte/lib/DocumentAdd16";

  import { Brand, BrandsApi } from "@api";
  import Nav from "@app/components/Nav.svelte";

  import BrandCard from "./components/BrandCard.svelte";

  let brands: Brand[] = [];

  const brandsAPi = new BrandsApi();

  const handleAddClick = (event: MouseEvent) => {
    event.preventDefault();
    navigate("/brands/add");
  };

  onMount(async () => {
    brands = (await brandsAPi.brandsList()).data;
  });
</script>

<Nav>
  <div class="button-right-wrapper">
    <Button on:click={handleAddClick} icon={DocumentAdd16}>브랜드 추가</Button>
  </div>
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
</style>
