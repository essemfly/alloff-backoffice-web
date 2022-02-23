<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { FormGroup, Checkbox } from "carbon-components-svelte";

  import { ItemTypeEnum, OptionsEnum, Brand } from "@api";
  import { AutocompleteItem } from "@app/components/autocomplete";
  import BrandSelect from "@app/components/BrandSelect.svelte";
  import ContentBox from "@app/components/ContentBox.svelte";

  import { HometabItemType, HometabSortingOption } from "../../constants";
  import { getSortingOptionByIndex } from "../../commands/helpers";

  interface HometabExhibitionsSectionValue {
    options: OptionsEnum[];
    brand: Brand;
  }

  export let value: HometabExhibitionsSectionValue;
  export let isAdding: boolean = false;

  let options: OptionsEnum[] = [];
  let selectedBrandKeyname: string;

  const dispatch = createEventDispatcher();

  const sortingOptions = Object.keys(OptionsEnum).map((key) => ({
    key,
    label: HometabSortingOption[key as keyof typeof HometabSortingOption],
    value: OptionsEnum[key as keyof typeof OptionsEnum],
  }));

  onMount(async () => {
    options = value.options
      ? value.options.map((x) => getSortingOptionByIndex(x))
      : [];
  });

  const handleBrandChange = (
    event: CustomEvent<{ value?: AutocompleteItem }>,
  ) => {
    selectedBrandKeyname = event.detail.value?.key ?? "";
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

  $: if (selectedBrandKeyname || options) {
    dispatch("change", {
      item_type: ItemTypeEnum.ProductsBrands,
      options,
      brand_keynames: [selectedBrandKeyname],
    });
  }
</script>

<ContentBox title={`${HometabItemType.ProductsBrands} 정보`}>
  <FormGroup legendText="옵션">
    {#each sortingOptions as option}
      <Checkbox
        labelText={option.label}
        checked={options.includes(option.value)}
        disabled={!isAdding}
        on:check={handleOptionCheck(option.value)}
      />
    {/each}
  </FormGroup>

  <FormGroup legendText="브랜드">
    <BrandSelect on:change={handleBrandChange} disabled={!isAdding} />
  </FormGroup>
</ContentBox>
