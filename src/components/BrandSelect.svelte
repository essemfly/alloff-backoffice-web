<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";

  import { BrandsApi } from "@api";
  import { Autocomplete, AutocompleteItem } from "@app/components/autocomplete";

  export let selectedValue: string = "";

  let selectedItem: AutocompleteItem | undefined;
  let brands: AutocompleteItem[] = [];

  const brandsAPi = new BrandsApi();
  const dispatch = createEventDispatcher();

  const handleBrandChange = (selected?: AutocompleteItem) => {
    selectedItem = selected;
    selectedValue = selected?.value ?? "";
    dispatch("change", { value: selectedItem });
  };

  onMount(async () => {
    const res = await brandsAPi.brandsList();
    brands = res.data.map(({ brand_id, korname, keyname }) => ({
      key: brand_id,
      value: korname,
      subvalue: keyname,
    }));
  });
</script>

<Autocomplete
  options={brands}
  onSubmit={handleBrandChange}
  placeholder="브랜드 이름/Keyname/ID로 검색"
  labelText="브랜드 검색"
  bind:selectedValue
  keepValueOnSubmit
/>
