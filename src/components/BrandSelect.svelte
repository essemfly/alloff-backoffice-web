<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";

  import { BrandsApi } from "@api";
  import { Autocomplete, AutocompleteItem } from "@app/components/autocomplete";

  export let selectedValue: string = "";
  export let excludes: string[] = [];
  export let keepValueOnSubmit: boolean = true;

  let selectedItem: AutocompleteItem | undefined;
  let brands: AutocompleteItem[] = [];
  let filteredBrands: AutocompleteItem[] = [];

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
    filteredBrands = brands.filter(
      ({ subvalue }) => !excludes.includes(subvalue!),
    );
  });

  $: if (selectedItem) {
    filteredBrands = brands.filter(
      ({ subvalue }) => !excludes.includes(subvalue!),
    );
  }
</script>

<Autocomplete
  options={filteredBrands}
  onSubmit={handleBrandChange}
  placeholder="브랜드 이름/Keyname/ID로 검색"
  labelText="브랜드 검색"
  bind:selectedValue
  {keepValueOnSubmit}
/>
