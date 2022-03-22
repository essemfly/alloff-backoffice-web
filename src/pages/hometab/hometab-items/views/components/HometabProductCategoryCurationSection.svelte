<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { FormGroup, Checkbox } from "carbon-components-svelte";

  import {
    ItemTypeEnum,
    OptionsEnum,
    AlloffCategoriesApi,
    AlloffCategory,
  } from "@api";
  import { Autocomplete, AutocompleteItem } from "@app/components/autocomplete";
  import ContentBox from "@app/components/ContentBox.svelte";

  import { HometabItemType, HometabSortingOption } from "../../constants";
  import { getSortingOptionByIndex } from "../../commands/helpers";

  interface HometabExhibitionsSectionValue {
    categoryId: string;
    options: OptionsEnum[];
  }

  export let value: HometabExhibitionsSectionValue;

  let options: OptionsEnum[] = [];
  let categories: AutocompleteItem[] = [];
  let categoryId: string;
  let selectedCategoryName: string = "";

  const dispatch = createEventDispatcher();
  const categoryApi = new AlloffCategoriesApi();

  const sortingOptions = Object.keys(OptionsEnum).map((key) => ({
    key,
    label: HometabSortingOption[key as keyof typeof HometabSortingOption],
    value: OptionsEnum[key as keyof typeof OptionsEnum],
  }));

  onMount(async () => {
    options = value.options
      ? value.options.map((x) => getSortingOptionByIndex(x))
      : [];
    categoryId = value.categoryId ?? "";

    const res = await categoryApi.alloffCategoriesList();
    categories = res.data.categories.map(({ category_id, name, keyname }) => ({
      key: category_id,
      label: name,
      value: category_id,
      subvalue: keyname,
    }));
  });

  const handleCategoryChange = (event: CustomEvent<AutocompleteItem>) => {
    categoryId = event.detail?.value ?? "";
    selectedCategoryName = event.detail?.label;
  };

  const handleOptionCheck = (option: OptionsEnum) => () => {
    const index = options.indexOf(option);
    if (index > -1) {
      options.splice(index, 1);
    } else {
      options.push(option);
    }
    options = options;
  };

  $: if (options || categoryId) {
    dispatch("change", {
      item_type: ItemTypeEnum.ProductsCategories,
      options,
      alloffcategory_id: categoryId,
    });
  }
</script>

<ContentBox title={`${HometabItemType.ProductsCategories} 정보`}>
  <FormGroup legendText="옵션">
    {#each sortingOptions as option}
      <Checkbox
        labelText={option.label}
        checked={options.includes(option.value)}
        on:check={handleOptionCheck(option.value)}
      />
    {/each}
  </FormGroup>
  <FormGroup legendText="카테고리">
    <div>선택된 카테고리: {selectedCategoryName}</div>
    <Autocomplete
      options={categories}
      on:select={handleCategoryChange}
      placeholder="카테고리 이름/Keyname/ID로 검색"
      labelText="카테고리 검색"
      value={categoryId}
    />
  </FormGroup>
</ContentBox>
