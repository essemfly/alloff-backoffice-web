<script lang="ts">
  import {
    Row,
    Column,
    TextInput,
    FormGroup,
    RadioButtonGroup,
    RadioButton,
  } from "carbon-components-svelte";

  import {
    CreateHomeTabRequest,
    HomeTab,
    ItemRequesterRequest,
    ItemTypeEnum,
  } from "@api";
  import ContentBox from "@app/components/ContentBox.svelte";
  import ImageUploadField from "@app/components/ImageUploadField.svelte";
  import DateTimePicker from "@app/components/DateTimePicker.svelte";

  import { HometabItemType } from "../../constants";
  import { getHometabItemTypeByIndex } from "../../commands/helpers";
  import HometabBrandSection from "./HometabBrandSection.svelte";
  import HometabBrandExhibitionSection from "./HometabBrandExhibitionSection.svelte";

  export let form: CreateHomeTabRequest & HomeTab;
  export let isAdding: boolean = false;

  let itemType = isAdding
    ? form.contents.item_type
    : getHometabItemTypeByIndex(form.item_type);

  const itemTypeOptions = Object.keys(HometabItemType)
    .filter((key) => key !== "Products")
    .map((key) => ({
      key,
      label: HometabItemType[key as keyof typeof HometabItemType],
      value: ItemTypeEnum[key as keyof typeof ItemTypeEnum],
    }));

  const handleChange = (event: CustomEvent<Partial<CreateHomeTabRequest>>) => {
    const { back_image_url, ...contents } = event.detail;
    form = {
      ...form,
      back_image_url,
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

{#if itemType === ItemTypeEnum.BrandExhibition}
  <HometabBrandExhibitionSection
    value={{
      brand: form.brands ? form.brands[0] : undefined,
      exhibition: form.exhibitions ? form.exhibitions[0] : undefined,
    }}
    on:change={handleChange}
    {isAdding}
  />
{/if}

{#if itemType === ItemTypeEnum.Brands}
  <HometabBrandSection
    value={{ brands: form.brands }}
    on:change={handleChange}
    {isAdding}
  />
{/if}

{#if itemType === ItemTypeEnum.Exhibitions}
  <ContentBox title={HometabItemType.Exhibitions}>
    <Row>
      <Column>
        <TextInput labelText={"ID"} bind:value={form.item_id} readonly />
      </Column>
    </Row>
  </ContentBox>
{/if}

{#if itemType === ItemTypeEnum.Exhibition}
  <ContentBox title={HometabItemType.Exhibition}>
    <h3>기획전 C</h3>
    <Row>
      <Column>
        <TextInput labelText={"ID"} bind:value={form.item_id} readonly />
      </Column>
    </Row>
  </ContentBox>
{/if}

{#if itemType === ItemTypeEnum.ProductsA}
  <ContentBox title={HometabItemType.Products}>
    <Row>
      <Column>
        <TextInput labelText={"ID"} bind:value={form.item_id} readonly />
      </Column>
    </Row>
  </ContentBox>
{/if}
