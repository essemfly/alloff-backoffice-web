<script lang="ts">
  import { AlloffCategoriesApi, AlloffCategory } from "@api";
  import { Autocomplete, AutocompleteItem } from "@app/components/autocomplete";
  import { createEventDispatcher, onMount } from "svelte";
  export let keepValueOnSubmit: boolean = true;
  export let disabled: boolean = false;

  let selectedFirstItem: AutocompleteItem | undefined;
  let selectedSecondItem: AutocompleteItem | undefined;
  let selectedSecondItemValue = "";
  let firstCategories: AlloffCategory[] = [];
  let firstItems: AutocompleteItem[] = [];
  let secondCategories: AlloffCategory[] = [];
  let secondItems: AutocompleteItem[] = [];
  let dirty = false;
  let selectedCategory: AlloffCategory | undefined = undefined;
  export let initialCategoryName: string | undefined = undefined;

  const api = new AlloffCategoriesApi();
  const dispatch = createEventDispatcher();
  const categoryToItem: (category: AlloffCategory) => AutocompleteItem = ({
    category_id,
    name,
    keyname,
  }) => ({
    key: category_id,
    value: name,
    subvalue: keyname,
  });
  const handleFirstChange = (selected?: AutocompleteItem) => {
    dirty = true;
    selectedFirstItem = selected;
    selectedSecondItem = undefined;
    selectedSecondItemValue = "";
    dispatch("change", { value: selected });
    if (!selected) {
      secondCategories = [];
      secondItems = [];
    }
  };

  const handleSecondChange = (selected?: AutocompleteItem) => {
    dirty = true;
    selectedSecondItem = selected;
    dispatch("change", { value: selected ?? selectedFirstItem });
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

  $: if (selectedFirstItem) {
    load(selectedFirstItem.key);
  }

  $: {
    const selectedItem = selectedSecondItem || selectedFirstItem;
    selectedCategory = (
      selectedSecondItem ? secondCategories : firstCategories
    ).find((c) => c.category_id === selectedItem?.key);
  }
</script>

<h5>
  선택된 카테고리: {!selectedCategory
    ? dirty
      ? "없음"
      : initialCategoryName ?? "없음"
    : selectedCategory.name}
</h5>

<Autocomplete
  options={firstItems}
  onSubmit={handleFirstChange}
  placeholder="1차 카테고리 이름/Keyname/ID로 검색"
  labelText="1차 카테고리 검색"
  {keepValueOnSubmit}
  {disabled}
  bind:selected={selectedFirstItem}
/>

<Autocomplete
  options={secondItems}
  onSubmit={handleSecondChange}
  placeholder="2차 카테고리 이름/Keyname/ID로 검색"
  labelText="2차 카테고리 검색"
  {keepValueOnSubmit}
  disabled={secondItems.length === 0}
  bind:selected={selectedSecondItem}
  bind:selectedValue={selectedSecondItemValue}
/>
