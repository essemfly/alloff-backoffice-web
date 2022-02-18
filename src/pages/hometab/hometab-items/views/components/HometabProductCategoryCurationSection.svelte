<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { FormGroup, Checkbox } from "carbon-components-svelte";

  import { ItemTypeEnum, OptionsEnum, AlloffCategoriesApi } from "@api";
  import { Autocomplete, AutocompleteItem } from "@app/components/autocomplete";
  import ContentBox from "@app/components/ContentBox.svelte";

  import { HometabItemType, HometabSortingOption } from "../../constants";
  import { getSortingOptionByIndex } from "../../commands/helpers";

  interface HometabExhibitionsSectionValue {
    categoryId: string;
    options: OptionsEnum[];
  }

  export let value: HometabExhibitionsSectionValue;
  export let isAdding: boolean = false;

  let options: OptionsEnum[] = [];
  let categories: AutocompleteItem[] = [];
  let categoryId: string;

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
      value: name,
      subvalue: keyname,
    }));
  });

  const handleCategoryChange = (selected?: AutocompleteItem) => {
    categoryId = selected?.key ?? "";
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
        disabled={!isAdding}
      />
    {/each}
  </FormGroup>
  <FormGroup legendText="카테고리">
    <Autocomplete
      options={categories}
      onSubmit={handleCategoryChange}
      placeholder="카테고리 이름/Keyname/ID로 검색"
      labelText="브랜드 검색"
      selectedValue={categoryId}
      disabled={!isAdding}
    />
  </FormGroup>
</ContentBox>
