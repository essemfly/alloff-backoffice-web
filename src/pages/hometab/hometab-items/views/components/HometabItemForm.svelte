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
  import ImageUploadField from "@app/components/ImageUploadField.svelte";
  import DateTimePicker from "@app/components/DateTimePicker.svelte";
  import { HometabItemType } from "../../constants";

  export let form: CreateHomeTabRequest & HomeTab;
  export let isAdding: boolean = false;

  const itemTypeOptions = Object.keys(HometabItemType).map((key) => ({
    key,
    label: HometabItemType[key as keyof typeof HometabItemType],
    value: ItemTypeEnum[key as keyof typeof ItemTypeEnum],
  }));
  console.log(itemTypeOptions);
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
      <ImageUploadField
        label={"배경 이미지"}
        bind:value={form.back_image_url}
      />
    </Column>
  </Row>
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

  <FormGroup>
    <RadioButtonGroup
      legendText="홈탭 아이템 종류"
      bind:selected={form.contents.item_type}
    >
      {#each itemTypeOptions as { label, value }}
        <RadioButton labelText={label} {value} />
      {/each}
    </RadioButtonGroup>
  </FormGroup>
</ContentBox>

{#if form.contents.item_type === ItemTypeEnum.Brands}
  <ContentBox title={HometabItemType.Brands}>
    <Row>
      <Column>
        <TextInput labelText={"ID"} bind:value={form.item_id} readonly />
      </Column>
    </Row>
  </ContentBox>
{/if}

{#if form.contents.item_type === ItemTypeEnum.BrandExhibition}
  <ContentBox title={HometabItemType.BrandExhibition}>
    <Row>
      <Column>
        <TextInput labelText={"ID"} bind:value={form.item_id} readonly />
      </Column>
    </Row>
  </ContentBox>
{/if}

{#if form.contents.item_type === ItemTypeEnum.Exhibitions}
  <ContentBox title={HometabItemType.Exhibitions}>
    <Row>
      <Column>
        <TextInput labelText={"ID"} bind:value={form.item_id} readonly />
      </Column>
    </Row>
  </ContentBox>
{/if}

{#if form.contents.item_type === ItemTypeEnum.Exhibition}
  <ContentBox title={HometabItemType.Exhibition}>
    <h3>기획전 C</h3>
    <Row>
      <Column>
        <TextInput labelText={"ID"} bind:value={form.item_id} readonly />
      </Column>
    </Row>
  </ContentBox>
{/if}

{#if form.contents.item_type === ItemTypeEnum.ProductsA}
  <ContentBox title={HometabItemType.Products}>
    <Row>
      <Column>
        <TextInput labelText={"ID"} bind:value={form.item_id} readonly />
      </Column>
    </Row>
  </ContentBox>
{/if}
