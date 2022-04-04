<script lang="ts">
  import {
    Row,
    Column,
    Button,
    StructuredList,
    StructuredListHead,
    StructuredListRow,
    StructuredListCell,
    StructuredListBody,
    TextInput,
  } from "carbon-components-svelte";
  import TrashCan16 from "carbon-icons-svelte/lib/TrashCan16";

  import {
    TextField,
    ToggleField,
    ImageUploadField,
  } from "@app/components/form";
  import ContentBox from "@app/components/ContentBox.svelte";
  import ImageUploadInput from "@app/components/ImageUploadInput.svelte";

  import { formStore, schema } from "../../models/schema";

  export let isAdding: boolean = false;

  let tempGuide = {
    label: "",
    imageUrl: "",
  };

  const handleSizeGuideAdd = () => {
    const sizeGuide = $formStore.fields.sizeGuide.slice(0);
    sizeGuide.push(tempGuide);
    formStore.update({ sizeGuide });
    tempGuide = {
      label: "",
      imageUrl: "",
    };
  };

  const handleSizeGuideRemove = (index: number) => () => {
    const sizeGuide = $formStore.fields.sizeGuide.slice(0);
    sizeGuide.splice(index, 1);
    formStore.update({ sizeGuide });
  };
</script>

<ContentBox title="기본 정보">
  <Row padding>
    <Column>
      <TextField
        schema={schema.fields.keyname}
        errorText={$formStore.errors.keyname}
        bind:value={$formStore.fields.keyname}
        readonly={!isAdding}
      />
    </Column>
    <Column>
      <TextField
        schema={schema.fields.korname}
        errorText={$formStore.errors.korname}
        bind:value={$formStore.fields.korname}
      />
    </Column>
    <Column>
      <TextField
        schema={schema.fields.engname}
        errorText={$formStore.errors.engname}
        bind:value={$formStore.fields.engname}
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
      <ToggleField
        schema={schema.fields.isPopular}
        errorText={$formStore.errors.isPopular}
        bind:value={$formStore.fields.isPopular}
        labelA="No"
        labelB="Yes"
      />
    </Column>
    <Column>
      <ToggleField
        schema={schema.fields.isOpen}
        errorText={$formStore.errors.isOpen}
        bind:value={$formStore.fields.isOpen}
        labelA="Closed"
        labelB="Open"
      />
    </Column>
    <Column>
      <ToggleField
        schema={schema.fields.inMaintenance}
        errorText={$formStore.errors.inMaintenance}
        bind:value={$formStore.fields.inMaintenance}
        labelA="No"
        labelB="Yes"
      />
    </Column>
  </Row>
  <Row padding>
    <Column>
      <ImageUploadField
        schema={schema.fields.logoImageUrl}
        errorText={$formStore.errors.logoImageUrl}
        bind:value={$formStore.fields.logoImageUrl}
      />
    </Column>
    <Column>
      <ImageUploadField
        schema={schema.fields.backImageUrl}
        errorText={$formStore.errors.backImageUrl}
        bind:value={$formStore.fields.backImageUrl}
      />
    </Column>
  </Row>
</ContentBox>
<ContentBox title="사이즈 가이드">
  <h4>가이드 추가</h4>
  <Row padding>
    <Column>
      <TextInput
        labelText="가이드 영역 이름"
        placeholder="가이드 영역 이름"
        bind:value={tempGuide.label}
      />
    </Column>
    <Column>
      <ImageUploadInput
        label={"가이드 이미지"}
        bind:value={tempGuide.imageUrl}
      />
    </Column>
  </Row>
  <div class="button-right-wrapper">
    <Button size="small" kind="secondary" on:click={handleSizeGuideAdd}>
      사이즈 가이드 추가
    </Button>
  </div>
  <hr />
  <h4>사이즈 가이드</h4>
  <Row>
    <Column>
      <StructuredList condensed>
        <StructuredListHead>
          <StructuredListRow head>
            <StructuredListCell head>Label</StructuredListCell>
            <StructuredListCell head>Image</StructuredListCell>
            <StructuredListCell head>Actions</StructuredListCell>
          </StructuredListRow>
        </StructuredListHead>
        <StructuredListBody>
          {#if $formStore.fields.sizeGuide.length === 0}
            <StructuredListRow>
              <StructuredListCell>No size guides</StructuredListCell>
            </StructuredListRow>
          {/if}
          {#each $formStore.fields.sizeGuide as guide, index}
            <StructuredListRow>
              <StructuredListCell noWrap>{guide.label}</StructuredListCell>
              <StructuredListCell>
                <img
                  class="cell_image"
                  src={guide.imageUrl}
                  alt={[
                    "Size guide",
                    $formStore.fields.keyname,
                    guide.label,
                  ].join("-")}
                />
              </StructuredListCell>
              <StructuredListCell>
                <Button
                  tooltipPosition="bottom"
                  tooltipAlignment="end"
                  iconDescription="상품 삭제"
                  icon={TrashCan16}
                  kind="danger"
                  size="small"
                  on:click={handleSizeGuideRemove(index)}
                />
              </StructuredListCell>
            </StructuredListRow>
          {/each}
        </StructuredListBody>
      </StructuredList>
    </Column>
  </Row>
</ContentBox>

<style>
  .cell_image {
    width: 200px;
    height: auto;
    object-fit: cover;
  }
</style>
