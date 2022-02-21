<script lang="ts">
  import {
    Row,
    Column,
    TextInput,
    Toggle,
    Button,
    StructuredList,
    StructuredListHead,
    StructuredListRow,
    StructuredListCell,
    StructuredListBody,
  } from "carbon-components-svelte";
  import TrashCan16 from "carbon-icons-svelte/lib/TrashCan16";

  import ContentBox from "@app/components/ContentBox.svelte";
  import ImageUploadField from "@app/components/ImageUploadField.svelte";

  export let form: any;
  export let isAdding: boolean = false;

  let tempGuide = {
    label: "",
    image_url: "",
  };

  const handleSizeGuideAdd = () => {
    form.size_guide.push(tempGuide);
    form.size_guide = form.size_guide;
    tempGuide = {
      label: "",
      image_url: "",
    };
  };

  const handleSizeGuideRemove = (index: number) => () => {
    const newSizeGuide = form.size_guide.slice();
    newSizeGuide.splice(index, 1);
    form.size_guide = newSizeGuide;
  };
</script>

<ContentBox title="기본 정보">
  {#if !isAdding}
    <Row padding>
      <Column>
        <TextInput labelText={"ID"} bind:value={form.item_id} readonly />
      </Column>
    </Row>
  {/if}
  <Row padding>
    <Column>
      <TextInput
        labelText="브랜드 키네임"
        bind:value={form.keyname}
        readonly={!isAdding}
      />
    </Column>
    <Column>
      <TextInput labelText="브랜드명(한글)" bind:value={form.korname} />
    </Column>
    <Column>
      <TextInput labelText="브랜드명(영문)" bind:value={form.engname} />
    </Column>
  </Row>
  <Row padding>
    <Column>
      <TextInput labelText="설명" bind:value={form.description} />
    </Column>
  </Row>
  <Row padding>
    <Column>
      <Toggle
        labelText="인기있는 브랜드 여부"
        labelA="No"
        labelB="Yes"
        bind:toggled={form.is_popular}
      />
    </Column>
    <Column>
      <Toggle
        labelText="브랜드 오픈 여부"
        labelA="Closed"
        labelB="Open"
        bind:toggled={form.is_open}
      />
    </Column>
    <Column>
      <Toggle
        labelText="숨김처리 여부"
        labelA="No"
        labelB="Yes"
        bind:toggled={form.in_maintenance}
      />
    </Column>
  </Row>
  <Row padding>
    <Column>
      <ImageUploadField
        label={"로고 이미지"}
        bind:value={form.logo_image_url}
      />
    </Column>
    <Column>
      <ImageUploadField
        label={"배경 이미지"}
        bind:value={form.back_image_url}
      />
    </Column>
  </Row>
</ContentBox>
<ContentBox title="사이즈 가이드">
  <h4>가이드 영역 추가</h4>
  <Row padding>
    <Column>
      <TextInput
        labelText="가이드 영역 이름"
        placeholder="가이드 영역 이름"
        bind:value={tempGuide.label}
      />
    </Column>
    <Column>
      <ImageUploadField
        label={"사이즈 가이드 이미지"}
        bind:value={tempGuide.image_url}
      />
    </Column>
  </Row>
  <div class="button-right-wrapper">
    <Button size="small" kind="secondary" on:click={handleSizeGuideAdd}>
      사이즈 가이드 추가
    </Button>
  </div>
  <hr />
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
          {#if form.size_guide.length === 0}
            <StructuredListRow>
              <StructuredListCell>No size guides</StructuredListCell>
            </StructuredListRow>
          {/if}
          {#each form.size_guide as guide, index}
            <StructuredListRow>
              <StructuredListCell noWrap>{guide.label}</StructuredListCell>
              <StructuredListCell>
                <img
                  class="cell_image"
                  src={guide.image_url}
                  alt={["Size guide", form.keyname, guide.label].join("-")}
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
