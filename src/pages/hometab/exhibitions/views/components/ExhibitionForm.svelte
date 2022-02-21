<script lang="ts">
  import { onMount } from "svelte";
  import {
    Row,
    Column,
    TextInput,
    Button,
    StructuredList,
    StructuredListBody,
    StructuredListRow,
    StructuredListCell,
    StructuredListHead,
  } from "carbon-components-svelte";
  import TrashCan16 from "carbon-icons-svelte/lib/TrashCan16";

  import {
    Exhibition,
    ProductGroup,
    ProductGroupsApi,
    GroupTypeEnum,
  } from "@api";
  import ContentBox from "@app/components/ContentBox.svelte";
  import ImageUploadField from "@app/components/ImageUploadField.svelte";
  import DateTimePicker from "@app/components/DateTimePicker.svelte";
  import { Autocomplete, AutocompleteItem } from "@app/components/autocomplete";

  export let form: Exhibition & { pg_ids: string[] };
  export let isAdding: boolean = false;

  let exhibitionSections: ProductGroup[] = [];
  let filteredExhibitionSections: AutocompleteItem[] = [];
  let selectedExhibitionSections: ProductGroup[] = [];

  const productGroupApi = new ProductGroupsApi();

  onMount(async () => {
    selectedExhibitionSections = form.pgs ?? [];

    const res = await productGroupApi.productGroupsList({
      groupType: GroupTypeEnum.Exhibition,
    });
    exhibitionSections = res.data.pgs;
    filteredExhibitionSections = exhibitionSections.map(
      ({ product_group_id, title, short_title }) => ({
        key: product_group_id,
        value: title,
        subvalue: short_title,
      }),
    );
  });

  const handleExhibitionSectionAdd = (selectedItem?: AutocompleteItem) => {
    const exhibitionSection = exhibitionSections.find(
      ({ product_group_id }) => product_group_id === selectedItem?.key,
    );
    if (exhibitionSection) {
      selectedExhibitionSections = [
        ...selectedExhibitionSections,
        exhibitionSection,
      ];
    }
  };

  const handleExhibitionSectionRemove = (index: number) => () => {
    const newSections = selectedExhibitionSections.slice();
    newSections.splice(index, 1);
    selectedExhibitionSections = newSections;
  };

  $: if (selectedExhibitionSections) {
    form.pg_ids = selectedExhibitionSections.map(
      ({ product_group_id }) => product_group_id,
    );
  }
</script>

<ContentBox>
  <h3>기획전 정보</h3>
  {#if !isAdding}
    <Row padding>
      <Column>
        <TextInput labelText={"ID"} bind:value={form.exhibition_id} readonly />
      </Column>
    </Row>
  {/if}
  <Row padding>
    <Column>
      <ImageUploadField label={"배너 이미지"} bind:value={form.banner_image} />
    </Column>
    <Column>
      <ImageUploadField
        label={"썸네일 이미지"}
        bind:value={form.thumbnail_image}
      />
    </Column>
  </Row>
  <Row padding>
    <Column>
      <TextInput labelText={"타이틀"} bind:value={form.title} />
    </Column>
  </Row>
  <Row padding>
    <Column>
      <TextInput labelText={"서브 타이틀"} bind:value={form.subtitle} />
    </Column>
  </Row>
  <Row padding>
    <Column>
      <TextInput labelText={"상세"} bind:value={form.description} />
    </Column>
  </Row>
  <Row padding>
    <Column>
      <DateTimePicker label={"시작일"} bind:value={form.start_time} />
    </Column>
    <Column>
      <DateTimePicker label={"종료일"} bind:value={form.finish_time} />
    </Column>
  </Row>
</ContentBox>

<ContentBox title="기획전 섹션">
  <h4>기획전 섹션</h4>
  <Row>
    <Column>
      <Autocomplete
        options={filteredExhibitionSections}
        onSubmit={handleExhibitionSectionAdd}
        placeholder="기획전 이름/ID로 검색"
        labelText="기획전 검색"
      />
    </Column>
  </Row>

  <StructuredList>
    <StructuredListHead>
      <StructuredListRow>
        <StructuredListCell head>Thumbnail</StructuredListCell>
        <StructuredListCell head>Title</StructuredListCell>
        <StructuredListCell head>Actions</StructuredListCell>
      </StructuredListRow>
    </StructuredListHead>
    <StructuredListBody>
      {#each selectedExhibitionSections as section, index}
        <StructuredListRow>
          <StructuredListCell>
            <img
              class="cell_image"
              src={section.image_url}
              alt={[section.title, "thumbnai"].join("-")}
            />
          </StructuredListCell>
          <StructuredListCell>
            {section.title}
          </StructuredListCell>
          <StructuredListCell>
            <Button
              tooltipPosition="bottom"
              tooltipAlignment="end"
              iconDescription="삭제"
              icon={TrashCan16}
              kind="danger"
              on:click={handleExhibitionSectionRemove(index)}
            />
          </StructuredListCell>
        </StructuredListRow>
      {/each}
    </StructuredListBody>
  </StructuredList>
</ContentBox>

<style>
  .cell_image {
    width: 100px;
    height: 100px;
    object-fit: cover;
  }
</style>
