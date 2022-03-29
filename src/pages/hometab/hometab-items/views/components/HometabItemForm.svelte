<script lang="ts">
  import { onMount } from "svelte";
  import { Row, Column, FormGroup } from "carbon-components-svelte";

  import { ItemTypeEnum } from "@api";
  import { DateTimeField, RadioField, TextField } from "@app/components/form";
  import ContentBox from "@app/components/ContentBox.svelte";
  import Dot from "@app/components/Dot.svelte";

  import { HometabItemType } from "../../constants";
  import { formStore, schema } from "../../models/schema";
  import HometabBrandSection from "./HometabBrandSection.svelte";
  import HometabBrandExhibitionSection from "./HometabBrandExhibitionSection.svelte";
  import HometabExhibitionCollectionSection from "./HometabExhibitionCollectionSection.svelte";
  import HometabExhibitionSection from "./HometabExhibitionSection.svelte";
  import HometabProductCategoryCurationSection from "./HometabProductCategoryCurationSection.svelte";
  import HometabProductBrandCurationSection from "./HometabProductBrandCurationSection.svelte";

  export let isAdding: boolean = false;

  const itemTypeOptions = Object.keys(HometabItemType).map((key) => ({
    key,
    label: HometabItemType[key as keyof typeof HometabItemType],
    value: ItemTypeEnum[key as keyof typeof ItemTypeEnum],
  }));

  onMount(() => {
    formStore.initialize();
  });

  $: itemType = $formStore.fields.contents.itemType;
</script>

<ContentBox title="기본 정보">
  <div class="button-right-wrapper">
    <Dot label="필수 입력 사항" />
  </div>
  {#if !isAdding}
    <Row padding>
      <Column>
        <TextField
          schema={schema.fields.itemId}
          errorText={$formStore.errors.itemId}
          bind:value={$formStore.fields.itemId}
          readonly
        />
      </Column>
    </Row>
  {/if}
  <Row padding>
    <Column>
      <TextField
        schema={schema.fields.title}
        errorText={$formStore.errors.title}
        bind:value={$formStore.fields.title}
      />
    </Column>
  </Row>
  <Row padding>
    <Column>
      <TextField
        schema={schema.fields.description}
        errorText={$formStore.errors.description}
        bind:value={$formStore.fields.description}
      />
    </Column>
  </Row>
  <Row padding>
    <Column>
      <DateTimeField
        schema={schema.fields.startTime}
        errorText={$formStore.errors.startTime}
        bind:value={$formStore.fields.startTime}
      />
    </Column>
    <Column>
      <DateTimeField
        schema={schema.fields.finishTime}
        errorText={$formStore.errors.finishTime}
        bind:value={$formStore.fields.finishTime}
      />
    </Column>
  </Row>

  {#if isAdding}
    <FormGroup>
      <RadioField
        schema={schema.fields.contents.fields.itemType}
        errorText={$formStore.errors.contents?.itemType ?? ""}
        bind:value={$formStore.fields.contents.itemType}
        options={itemTypeOptions}
      />
    </FormGroup>
  {/if}
</ContentBox>

{#if itemType === ItemTypeEnum.ExhibitionA}
  <HometabBrandExhibitionSection />
{/if}

{#if itemType === ItemTypeEnum.Brands}
  <HometabBrandSection />
{/if}

{#if itemType === ItemTypeEnum.Exhibitions}
  <HometabExhibitionCollectionSection />
{/if}

{#if itemType === ItemTypeEnum.Exhibition}
  <HometabExhibitionSection />
{/if}

{#if itemType === ItemTypeEnum.ProductsCategories}
  <HometabProductCategoryCurationSection />
{/if}

{#if itemType === ItemTypeEnum.ProductsBrands}
  <HometabProductBrandCurationSection />
{/if}
