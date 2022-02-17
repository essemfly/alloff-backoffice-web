<script lang="ts">
  import {
    Row,
    Column,
    TextInput,
    FormGroup,
    RadioButtonGroup,
    RadioButton,
    StructuredList,
    StructuredListHead,
    StructuredListRow,
    StructuredListCell,
    StructuredListBody,
    Button,
  } from "carbon-components-svelte";
  import TrashCan16 from "carbon-icons-svelte/lib/TrashCan16";
  import Launch16 from "carbon-icons-svelte/lib/Launch16";

  import { CreateHomeTabRequest, HomeTab, ItemTypeEnum } from "@api";
  import ContentBox from "@app/components/ContentBox.svelte";
  import ImageUploadField from "@app/components/ImageUploadField.svelte";
  import DateTimePicker from "@app/components/DateTimePicker.svelte";

  import { HometabItemType } from "../../constants";
  import { getHometabItemTypeByIndex } from "../../commands/helpers";
  import BrandSelect from "@app/components/BrandSelect.svelte";
  import { AutocompleteItem } from "@app/components/autocomplete";
  import BrandSection from "./HometabBrandSection.svelte";

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

  const handleBrandChange = (
    event: CustomEvent<{ value?: AutocompleteItem }>,
  ) => {
    console.log(event.detail.value);
    // form.brands.push(value);
  };

  const handleBrandDeleteClick =
    (index: number) => async (event: MouseEvent) => {
      event.preventDefault();
      const newValue = form.brands.slice();
      newValue.splice(index, 1);
      form.brands = newValue;
    };

  // const handleDetailOpen = (brandKeyname: string) => () => {
  //   window.open(`/brands/${brandKeyname}`, "_blank"); // todo: not use window.open
  // };
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

{#if itemType === ItemTypeEnum.Brands}
  <BrandSection bind:form />
{/if}

{#if itemType === ItemTypeEnum.BrandExhibition}
  <ContentBox title={HometabItemType.BrandExhibition}>
    <Row>
      <Column>
        <TextInput labelText={"ID"} bind:value={form.item_id} readonly />
      </Column>
    </Row>
  </ContentBox>
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
