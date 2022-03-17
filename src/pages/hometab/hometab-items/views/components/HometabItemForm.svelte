<script lang="ts">
  import {
    Row,
    Column,
    TextInput,
    FormGroup,
    RadioButtonGroup,
    RadioButton,
  } from "carbon-components-svelte";

  import { CreateHomeTabRequest, HomeTab, ItemTypeEnum } from "@api";
  import ContentBox from "@app/components/ContentBox.svelte";
  import DateTimePicker from "@app/components/DateTimePicker.svelte";

  import { HometabItemType } from "../../constants";
  import { getHometabItemTypeByIndex } from "../../commands/helpers";
  import HometabBrandSection from "./HometabBrandSection.svelte";
  import HometabBrandExhibitionSection from "./HometabBrandExhibitionSection.svelte";
  import HometabExhibitionCollectionSection from "./HometabExhibitionCollectionSection.svelte";
  import HometabExhibitionSection from "./HometabExhibitionSection.svelte";
  import HometabProductCategoryCurationSection from "./HometabProductCategoryCurationSection.svelte";
  import HometabProductBrandCurationSection from "./HometabProductBrandCurationSection.svelte";

  export let form: CreateHomeTabRequest & HomeTab;
  export let isAdding: boolean = false;

  let itemType = isAdding
    ? form.contents.item_type
    : getHometabItemTypeByIndex(form.item_type as unknown as number);

  const itemTypeOptions = Object.keys(HometabItemType).map((key) => ({
    key,
    label: HometabItemType[key as keyof typeof HometabItemType],
    value: ItemTypeEnum[key as keyof typeof ItemTypeEnum],
  }));

  const handleChange = (event: CustomEvent<Partial<CreateHomeTabRequest>>) => {
    const { back_image_url, tags, ...contents } = event.detail;
    form = {
      ...form,
      back_image_url: back_image_url ?? "",
      tags: tags ?? [],
      contents: {
        ...form.contents,
        ...contents,
      },
    };
  };
</script>

<ContentBox title="기본 정보">
  {#if !isAdding}
    <Row>
      <Column>
        <TextInput labelText={"ID"} bind:value={form.item_id} readonly />
      </Column>
    </Row>
  {/if}
  <Row>
    <Column>
      <TextInput labelText={"타이틀"} bind:value={form.title} />
    </Column>
  </Row>
  <Row>
    <Column>
      <TextInput labelText={"상세"} bind:value={form.description} />
    </Column>
  </Row>
  <Row>
    <Column>
      <DateTimePicker label={"시작일"} bind:value={form.start_time} />
    </Column>
    <Column>
      <DateTimePicker label={"종료일"} bind:value={form.finish_time} />
    </Column>
  </Row>

  {#if isAdding}
    <FormGroup>
      <RadioButtonGroup legendText="홈탭 아이템 종류" bind:selected={itemType}>
        {#each itemTypeOptions as { label, value }}
          <RadioButton labelText={label} {value} />
        {/each}
      </RadioButtonGroup>
    </FormGroup>
  {/if}
</ContentBox>

{#if itemType === ItemTypeEnum.ExhibitionA}
  <HometabBrandExhibitionSection
    value={{
      exhibition: form.exhibitions ? form.exhibitions[0] : undefined,
      backImageUrl: form.back_image_url,
    }}
    on:change={handleChange}
  />
{/if}

{#if itemType === ItemTypeEnum.Brands}
  <HometabBrandSection
    value={{ brands: form.brands }}
    on:change={handleChange}
  />
{/if}

{#if itemType === ItemTypeEnum.Exhibitions}
  <HometabExhibitionCollectionSection
    value={{ exhibitions: form.exhibitions }}
    on:change={handleChange}
  />
{/if}

{#if itemType === ItemTypeEnum.Exhibition}
  <HometabExhibitionSection
    value={{
      backImageUrl: form.back_image_url ?? "",
      exhibition: form.exhibitions ? form.exhibitions[0] : undefined,
      tags: form.tags ?? [],
    }}
    on:change={handleChange}
  />
{/if}

{#if itemType === ItemTypeEnum.ProductsCategories}
  <HometabProductCategoryCurationSection
    value={{
      categoryId: form.reference?.params ?? "",
      options: form.reference?.options ?? [],
    }}
    on:change={handleChange}
  />
{/if}

{#if itemType === ItemTypeEnum.ProductsBrands}
  <HometabProductBrandCurationSection
    value={{
      brand: form.brands ? form.brands[0] : undefined,
      options: form.reference?.options ?? [],
    }}
    on:change={handleChange}
  />
{/if}
