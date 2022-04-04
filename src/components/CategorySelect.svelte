<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";

  import { AlloffCategoriesApi, AlloffCategory } from "@api";
  import { Autocomplete, AutocompleteItem } from "@app/components/autocomplete";

  export let size: "sm" | "lg" | undefined = undefined;
  export let keepValueOnSubmit: boolean = true;
  export let disabled: boolean = false;
  export let initialCategoryName: string | undefined = undefined;
  export let value: string = "";
  export let helperText: string = "";
  export let errorText: string = "";

  let selectedFirstItem: AutocompleteItem | undefined;
  let selectedSecondItem: AutocompleteItem | undefined;
  let selectedFirstItemValue: string = "";
  let selectedSecondItemValue: string = "";
  let firstCategories: AlloffCategory[] = [];
  let firstItems: AutocompleteItem[] = [];
  let secondCategories: AlloffCategory[] = [];
  let secondItems: AutocompleteItem[] = [];
  let dirty = false;
  let selectedCategory: AlloffCategory | undefined = undefined;

  const api = new AlloffCategoriesApi();
  const dispatch = createEventDispatcher();

  const categoryToItem: (category: AlloffCategory) => AutocompleteItem = ({
    category_id,
    name,
    keyname,
  }) => ({
    key: category_id,
    label: name,
    value: category_id,
    subvalue: keyname,
  });

  const handleFirstChange = (event: CustomEvent<AutocompleteItem>) => {
    dirty = true;
    selectedFirstItem = event.detail;
    selectedSecondItem = undefined;
    selectedSecondItemValue = "";
    value = selectedFirstItem?.value ?? "";
    dispatch("change", event.detail);

    if (selectedFirstItem) {
      load(selectedFirstItem?.key);
    } else {
      secondCategories = [];
      secondItems = [];
    }
  };

  const handleSecondChange = (event: CustomEvent<AutocompleteItem>) => {
    dirty = true;
    selectedSecondItem = event.detail;
    value = selectedSecondItem?.value ?? "";
    dispatch("change", event.detail);
  };

  const load = async (parentId?: string) => {
    const categories = (await api.alloffCategoriesList({ parentId })).data
      .categories;
    if (parentId) {
      secondCategories = categories;
      secondItems = categories.map(categoryToItem);
    } else {
      firstCategories = categories;
      firstItems = categories.map(categoryToItem);
    }
  };

  onMount(async () => {
    await load();
    if (initialCategoryName) {
      const c = firstCategories.find(
        (c) => c.category_id === initialCategoryName,
      );
      if (c) {
        selectedFirstItem = categoryToItem(c);
      }
    }
  });

  $: {
    const selectedItem = selectedSecondItem || selectedFirstItem;
    selectedCategory = (
      selectedSecondItem ? secondCategories : firstCategories
    ).find((c) => c.category_id === selectedItem?.key);
  }
</script>

<div>
  <p class="bx--label">
    선택된 카테고리: {!selectedCategory
      ? dirty
        ? "없음"
        : initialCategoryName ?? "없음"
      : selectedCategory.name}
  </p>
</div>
<div
  class={`category-select-wrapper ${
    !!errorText ? "category-select-invalid" : ""
  }`}
>
  <Autocomplete
    options={firstItems}
    on:select={handleFirstChange}
    placeholder="1차 카테고리 이름/Keyname/ID로 검색"
    labelText="1차 카테고리 검색"
    {keepValueOnSubmit}
    {disabled}
    bind:value={selectedFirstItemValue}
    {size}
  />
  <Autocomplete
    options={secondItems}
    on:select={handleSecondChange}
    placeholder="2차 카테고리 이름/Keyname/ID로 검색"
    labelText="2차 카테고리 검색"
    {keepValueOnSubmit}
    disabled={secondItems.length === 0}
    bind:value={selectedSecondItemValue}
    {size}
  />
</div>
{#if !!helperText && !errorText}
  <div class="bx--form__helper-text">{helperText}</div>
{/if}
{#if !!errorText}
  <div class="bx--form-requirement">{errorText}</div>
{/if}

<style>
  .bx--form-requirement {
    display: block;
    max-height: none;
    color: var(--danger-01);
  }

  .category-select-wrapper {
    border: 2px solid transparent;
    box-sizing: border-box;
  }
  .category-select-invalid {
    border-color: var(--danger-01);
  }
</style>
