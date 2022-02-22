<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";

  import { AlloffCategoriesApi } from "@api";
  import { Autocomplete, AutocompleteItem } from "@app/components/autocomplete";

  export let selectedValue: string = "";
  export let excludes: string[] = [];
  export let keepValueOnSubmit: boolean = true;
  export let disabled: boolean = false;

  let selectedItem: AutocompleteItem | undefined;
  let categories: AutocompleteItem[] = [];
  let filteredCategories: AutocompleteItem[] = [];

  const categoryApi = new AlloffCategoriesApi();
  const dispatch = createEventDispatcher();

  const handleBrandChange = (selected?: AutocompleteItem) => {
    selectedItem = selected;
    selectedValue = selected?.value ?? "";
    dispatch("change", selectedItem);
  };

  onMount(async () => {
    const res = await categoryApi.alloffCategoriesList();
    categories = res.data.categories.map(({ category_id, name, keyname }) => ({
      key: category_id,
      value: name,
      subvalue: keyname,
    }));
    filteredCategories = categories.filter(
      ({ subvalue }) => !excludes.includes(subvalue!),
    );
  });

  $: if (selectedItem) {
    filteredCategories = categories.filter(
      ({ subvalue }) => !excludes.includes(subvalue!),
    );
  }
</script>

<Autocomplete
  options={filteredCategories}
  onSubmit={handleBrandChange}
  placeholder="카테고리 이름/Keyname/ID로 검색"
  labelText="카테고리 검색"
  bind:selectedValue
  {keepValueOnSubmit}
  {disabled}
/>
