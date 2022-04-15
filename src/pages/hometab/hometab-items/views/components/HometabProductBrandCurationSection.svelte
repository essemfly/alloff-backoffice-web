<script lang="ts">
  import { FormGroup, Checkbox } from "carbon-components-svelte";

  import { OptionsEnum } from "@lessbutter/alloff-backoffice-api";
  import { AutocompleteItem } from "@app/components/autocomplete";
  import { BrandSelectField, CheckboxGroupField } from "@app/components/form";
  import ContentBox from "@app/components/ContentBox.svelte";

  import { HometabItemType, HometabSortingOption } from "../../constants";
  import { schema, formStore } from "../../models/schema";

  const sortingOptions = Object.keys(OptionsEnum).map((key) => ({
    key,
    label: HometabSortingOption[key as keyof typeof HometabSortingOption],
    value: OptionsEnum[key as keyof typeof OptionsEnum],
  }));

  const handleBrandChange = (event: CustomEvent<AutocompleteItem>) => {
    const selected = event.detail;
    const brandKeynames = [
      ...($formStore.fields.contents.brandKeynames ?? []),
      selected.value,
    ];
    formStore.update({
      contents: {
        ...$formStore.fields.contents,
        brandKeynames,
      },
    });
  };

  const handleOptionCheck = (option: OptionsEnum) => () => {
    const options = $formStore.fields.contents?.options?.slice(0) ?? [];
    const index = options.indexOf(option);
    if (index > -1) {
      options.splice(index, 1);
    } else {
      options.push(option);
    }
    formStore.update({
      contents: {
        ...$formStore.fields.contents,
        options,
      },
    });
  };
</script>

<ContentBox title={`${HometabItemType.ProductsBrands} 정보`}>
  <FormGroup>
    <CheckboxGroupField
      options={sortingOptions}
      schema={schema.fields.contents.fields.options.required()}
      errorText={$formStore.errors.contents?.options}
      bind:value={$formStore.fields.contents.options}
    />
  </FormGroup>
  <FormGroup>
    <BrandSelectField
      schema={schema.fields.contents.fields.brandKeynames.required()}
      errorText={$formStore.errors.contents?.brandKeynames}
      on:change={handleBrandChange}
    />
  </FormGroup>
</ContentBox>
