<script lang="ts">
  import { toast } from "@zerodevx/svelte-toast";
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
    Tabs,
    Tab,
    TabContent,
    TextArea,
  } from "carbon-components-svelte";
  import TrashCan16 from "carbon-icons-svelte/lib/TrashCan16";
  import Launch16 from "carbon-icons-svelte/lib/Launch16";
  import ChevronUp16 from "carbon-icons-svelte/lib/ChevronUp16";
  import ChevronDown16 from "carbon-icons-svelte/lib/ChevronDown16";
  import UpToTop16 from "carbon-icons-svelte/lib/UpToTop16";
  import DownToBottom16 from "carbon-icons-svelte/lib/DownToBottom16";

  import {
    Exhibition,
    ProductGroup,
    ProductGroupsApi,
    GroupTypeEnum,
  } from "@api";
  import ContentBox from "@app/components/ContentBox.svelte";
  import ImageUploadInput from "@app/components/ImageUploadInput.svelte";
  import DateTimePicker from "@app/components/DateTimePicker.svelte";
  import { Autocomplete, AutocompleteItem } from "@app/components/autocomplete";

  import ExhibitionSectionForm from "./ExhibitionSectionForm.svelte";
  import ExhibitionSectionSearchSection from "./ExhibitionSectionSearchSection.svelte";

  export let form: Exhibition & { pg_ids: string[] };
  export let isAdding: boolean = false;

  let exhibitionSections: ProductGroup[] = [];
  let selectedExhibitionSections: ProductGroup[] = [];
  let selectedExhibitionSectionIds: string[] = [];

  let tempProductGroup: ProductGroup = {
    title: "",
    short_title: "",
    image_url: "",
    start_time: form.start_time,
    finish_time: form.finish_time,
    product_group_id: "",
    products: [],
    instruction: [],
    group_type: GroupTypeEnum.Exhibition,
  };

  onMount(async () => {
    selectedExhibitionSections = form.pgs ?? [];
    selectedExhibitionSectionIds = selectedExhibitionSections.map(
      ({ product_group_id }) => product_group_id,
    );
  });

  const handleExhibitionSectionSelect = (event: CustomEvent<ProductGroup>) => {
    const section = event.detail;
    if (section) {
      selectedExhibitionSections = [...selectedExhibitionSections, section];
    }
  };

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
    selectedExhibitionSectionIds = selectedExhibitionSections.map(
      ({ product_group_id }) => product_group_id,
    );
    form.pg_ids = selectedExhibitionSectionIds;
  }

  const handleProductGroupSubmit = async () => {
    try {
      const productGroupApi = new ProductGroupsApi();
      const { products, ...requestBody } = tempProductGroup;
      const res = await productGroupApi.productGroupsCreate({
        createProductGroupSeriazlierRequest: {
          ...requestBody,
          start_time: form.start_time,
          finish_time: form.finish_time,
        },
      });
      const newProductGroup = res.data;
      await productGroupApi.productGroupsPushProductsCreate({
        id: newProductGroup.product_group_id,
        pushProductsRequest: {
          product_group_id: newProductGroup.product_group_id,
          product_priority: products.map(({ product, priority }) => ({
            product_id: product.alloff_product_id,
            priority,
          })),
        },
      });
      selectedExhibitionSections = [
        ...selectedExhibitionSections,
        newProductGroup,
      ];
      handleExhibitionSectionAdd({
        key: newProductGroup.product_group_id,
        value: newProductGroup.title,
      });
      tempProductGroup = {
        title: "",
        short_title: "",
        image_url: "",
        start_time: form.start_time,
        finish_time: form.finish_time,
        product_group_id: "",
        products: [],
        instruction: [],
        group_type: GroupTypeEnum.Exhibition,
      };
    } catch (e) {
      toast.push(`기획전 섹션 등록에 오류가 발생했습니다.`);
    }
  };

  const handleDetailOpen = (productGroupId: string) => () => {
    window.open(`/product-groups/${productGroupId}`, "_blank"); // todo: not use window.open
  };

  const handleSort = (index: number, to: number) => () => {
    const [current] = selectedExhibitionSections.splice(index, 1);
    switch (to) {
      case 0:
        // to first
        selectedExhibitionSections = [current, ...selectedExhibitionSections];
        break;
      case 100:
        // to last
        selectedExhibitionSections = [...selectedExhibitionSections, current];
        break;
      default:
        const toIndex = index + to;
        selectedExhibitionSections.splice(toIndex, 0, current);
        selectedExhibitionSections = selectedExhibitionSections;
    }
  };
</script>

<ContentBox title="기획전 정보">
  {#if !isAdding}
    <Row padding>
      <Column>
        <TextInput labelText={"ID"} bind:value={form.exhibition_id} readonly />
      </Column>
    </Row>
  {/if}
  <Row padding>
    <Column>
      <ImageUploadInput label={"배너 이미지"} bind:value={form.banner_image} />
    </Column>
    <Column>
      <ImageUploadInput
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
      <TextArea labelText={"상세"} bind:value={form.description} />
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

<ContentBox title="기획전 섹션 목록">
  <StructuredList>
    <StructuredListHead>
      <StructuredListRow>
        <StructuredListCell head>Title</StructuredListCell>
        <StructuredListCell head>Actions</StructuredListCell>
      </StructuredListRow>
    </StructuredListHead>
    <StructuredListBody>
      {#if selectedExhibitionSections.length === 0}
        <StructuredListRow>
          <StructuredListCell>No section submitted</StructuredListCell>
        </StructuredListRow>
      {/if}
      {#each selectedExhibitionSections as section, index}
        <StructuredListRow>
          <StructuredListCell>
            {section.title}
          </StructuredListCell>
          <StructuredListCell>
            <Button
              tooltipPosition="bottom"
              tooltipAlignment="end"
              iconDescription="첫번째로"
              icon={UpToTop16}
              kind="ghost"
              size="small"
              on:click={handleSort(index, 0)}
            />
            <Button
              tooltipPosition="bottom"
              tooltipAlignment="end"
              iconDescription="위로"
              icon={ChevronUp16}
              kind="ghost"
              size="small"
              on:click={handleSort(index, -1)}
            />
            <Button
              tooltipPosition="bottom"
              tooltipAlignment="end"
              iconDescription="아래로"
              icon={ChevronDown16}
              kind="ghost"
              size="small"
              on:click={handleSort(index, +1)}
            />
            <Button
              tooltipPosition="bottom"
              tooltipAlignment="end"
              iconDescription="마지막으로"
              icon={DownToBottom16}
              kind="ghost"
              size="small"
              on:click={handleSort(index, +100)}
            />
            <Button
              tooltipPosition="bottom"
              tooltipAlignment="end"
              iconDescription="삭제"
              icon={TrashCan16}
              kind="danger"
              size="small"
              on:click={handleExhibitionSectionRemove(index)}
            />
            <Button
              tooltipPosition="bottom"
              tooltipAlignment="end"
              iconDescription="상세"
              icon={Launch16}
              kind="ghost"
              size="small"
              on:click={handleDetailOpen(section.product_group_id)}
            />
          </StructuredListCell>
        </StructuredListRow>
      {/each}
    </StructuredListBody>
  </StructuredList>
</ContentBox>

<ContentBox title="기획전 섹션">
  <h4>기획전 섹션</h4>
  <Tabs>
    <Tab label="새로운 기획전 섹션" />
    <Tab label="등록된 기획전 섹션" />
    <svelte:fragment slot="content">
      <TabContent>
        <ExhibitionSectionForm bind:form={tempProductGroup} />
        <div class="button-right-wrapper">
          <Button on:click={handleProductGroupSubmit}>기획전 섹션 추가</Button>
        </div>
      </TabContent>
      <TabContent>
        <ExhibitionSectionSearchSection
          bind:value={selectedExhibitionSectionIds}
          on:select={handleExhibitionSectionSelect}
        />
      </TabContent>
    </svelte:fragment>
  </Tabs>
</ContentBox>
