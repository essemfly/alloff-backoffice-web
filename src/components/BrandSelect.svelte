<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";

  import { BrandsApi } from "@api";
  import { Autocomplete, AutocompleteItem } from "@app/components/autocomplete";

  export let size: "sm" | "lg" | undefined = undefined;
  export let value: string = "";
  export let excludes: string[] = [];
  export let keepValueOnSubmit: boolean = true;
  export let placeholder: string | undefined = "브랜드 이름/Keyname/ID로 검색";
  export let labelText: string | undefined = undefined;
  export let disabled: boolean = false;
  export let helperText: string = "";
  export let errorText: string = "";

  export let selectedBrandName: string | undefined = undefined;

  let selectedItem: AutocompleteItem | undefined;
  let brands: AutocompleteItem[] = [];
  let filteredBrands: AutocompleteItem[] = [];

  const brandsAPi = new BrandsApi();
  const dispatch = createEventDispatcher();

  onMount(async () => {
    const res = await brandsAPi.brandsList();
    brands = res.data.map(({ brand_id, korname, keyname }) => ({
      key: brand_id,
      label: korname,
      value: keyname,
      subvalue: keyname,
    }));
    filteredBrands = brands.filter(({ value }) => !excludes.includes(value!));

    if (selectedBrandName) {
      selectedItem = brands.find((x) => x.label === selectedBrandName);
      value = selectedItem?.value ?? "";
    }
  });

  const handleBrandChange = (event: CustomEvent<AutocompleteItem>) => {
    selectedItem = event.detail;
    value = selectedItem?.value ?? "";
    dispatch("change", event.detail);
  };

  $: if (selectedItem) {
    filteredBrands = brands.filter(({ value }) => !excludes.includes(value!));
  }
</script>

<Autocomplete
  options={filteredBrands}
  on:select={handleBrandChange}
  {placeholder}
  bind:value
  {keepValueOnSubmit}
  {labelText}
  {helperText}
  {errorText}
  {disabled}
  {size}
/>
