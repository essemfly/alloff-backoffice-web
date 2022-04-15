<script lang="ts">
  import { FormGroup } from "carbon-components-svelte";

  import { OptionsEnum } from "@lessbutter/alloff-backoffice-api";
  import ContentBox from "@app/components/ContentBox.svelte";
  import {
    CategorySelectField,
    CheckboxGroupField,
  } from "@app/components/form";

  import { HometabItemType, HometabSortingOption } from "../../constants";
  import { schema, formStore } from "../../models/schema";

  const sortingOptions = Object.keys(OptionsEnum).map((key) => ({
    key,
    label: HometabSortingOption[key as keyof typeof HometabSortingOption],
    value: OptionsEnum[key as keyof typeof OptionsEnum],
  }));
</script>

<ContentBox title={`${HometabItemType.ProductsCategories} 정보`}>
  <FormGroup>
    <CheckboxGroupField
      options={sortingOptions}
      schema={schema.fields.contents.fields.options.required()}
      errorText={$formStore.errors.contents?.options}
      bind:value={$formStore.fields.contents.options}
    />
  </FormGroup>
  <FormGroup>
    <CategorySelectField
      schema={schema.fields.contents.fields.alloffcategoryId
        .required()
        .meta({ placeholder: "카테고리 이름/Keyname/ID로 검색" })}
      errorText={$formStore.errors.contents?.alloffcategoryId}
      bind:value={$formStore.fields.contents.alloffcategoryId}
    />
  </FormGroup>
</ContentBox>
