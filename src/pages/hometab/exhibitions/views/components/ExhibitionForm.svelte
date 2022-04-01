<script lang="ts">
  import { DateTime } from "luxon";
  import { toast } from "@zerodevx/svelte-toast";
  import { onMount } from "svelte";
  import {
    Row,
    Column,
    Button,
    StructuredList,
    StructuredListBody,
    StructuredListRow,
    StructuredListCell,
    StructuredListHead,
    Tabs,
    Tab,
    TabContent,
    FormGroup,
  } from "carbon-components-svelte";
  import TrashCan16 from "carbon-icons-svelte/lib/TrashCan16";
  import Launch16 from "carbon-icons-svelte/lib/Launch16";
  import ChevronUp16 from "carbon-icons-svelte/lib/ChevronUp16";
  import ChevronDown16 from "carbon-icons-svelte/lib/ChevronDown16";
  import UpToTop16 from "carbon-icons-svelte/lib/UpToTop16";
  import DownToBottom16 from "carbon-icons-svelte/lib/DownToBottom16";

  import {
    ProductGroup,
    ProductGroupsApi,
    GroupTypeEnum,
    ProductInGroup,
  } from "@api";
  import { AutocompleteItem } from "@app/components/autocomplete";
  import ContentBox from "@app/components/ContentBox.svelte";
  import Dot from "@app/components/Dot.svelte";
  import {
    DateTimeField,
    ImageUploadField,
    TextAreaField,
    TextField,
  } from "@app/components/form";
  import { convertToSnakeCase } from "@app/helpers/change-case";

  import ExhibitionSectionForm from "./ExhibitionSectionForm.svelte";
  import ExhibitionSectionSearchSection from "./ExhibitionSectionSearchSection.svelte";
  import { formStore, schema, sectionFormStore } from "../../models/schema";

  export let isAdding: boolean = false;

  let exhibitionSections: ProductGroup[] = [];
  let selectedExhibitionSections: ProductGroup[] = [];
  let selectedExhibitionSectionIds: string[] = [];
  let productInGroups: ProductInGroup[] = [];
  let isSubmitting = false;

  const productGroupApi = new ProductGroupsApi();

  onMount(async () => {
    selectedExhibitionSections = $formStore.fields.pgs ?? [];
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
      ({ product_group_id }) => product_group_id === selectedItem?.value,
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
    formStore.update({ pgIds: selectedExhibitionSectionIds });
  }

  const handleProductGroupSubmit = async (event: MouseEvent) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    try {
      isSubmitting = true;
      const formData = {
        ...$sectionFormStore.fields,
        groupType: GroupTypeEnum.Exhibition,
        startTime: $formStore.fields.startTime
          ? $formStore.fields.startTime
          : DateTime.now().toISO(),
        finishTime: $formStore.fields.finishTime
          ? $formStore.fields.finishTime
          : DateTime.now().toISO(),
      };
      const isValid = await sectionFormStore.validate(formData, {
        context: { isAdding: true },
      });
      if (!isValid) {
        toast.push("일부 항목값이 올바르지 않습니다.");
        return;
      }
      const res = await productGroupApi.productGroupsCreate({
        createProductGroupSeriazlierRequest: convertToSnakeCase(formData),
      });
      const newProductGroup = res.data;
      await productGroupApi.productGroupsPushProductsCreate({
        id: newProductGroup.product_group_id,
        pushProductsRequest: {
          product_group_id: newProductGroup.product_group_id,
          product_priority: productInGroups.map(({ product, priority }) => ({
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
        label: newProductGroup.title,
        value: newProductGroup.product_group_id,
      });
    } catch (e) {
      toast.push(`기획전 섹션 등록에 오류가 발생했습니다.`);
    } finally {
      isSubmitting = false;
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
  <div class="button-right-wrapper">
    <Dot label="필수 입력 사항" />
  </div>
  {#if !isAdding}
    <FormGroup>
      <TextField
        schema={schema.fields.exhibitionId}
        value={$formStore.fields.exhibitionId}
        readonly
      />
    </FormGroup>
  {/if}
  <FormGroup>
    <ImageUploadField
      schema={schema.fields.bannerImage}
      bind:value={$formStore.fields.bannerImage}
      errorText={$formStore.errors.bannerImage}
    />
  </FormGroup>
  <FormGroup>
    <ImageUploadField
      schema={schema.fields.thumbnailImage}
      bind:value={$formStore.fields.thumbnailImage}
      errorText={$formStore.errors.thumbnailImage}
    />
  </FormGroup>
  <FormGroup>
    <TextField
      schema={schema.fields.title}
      bind:value={$formStore.fields.title}
      errorText={$formStore.errors.title}
    />
  </FormGroup>
  <FormGroup>
    <TextField
      schema={schema.fields.subtitle}
      bind:value={$formStore.fields.subtitle}
      errorText={$formStore.errors.subtitle}
    />
  </FormGroup>
  <FormGroup>
    <TextAreaField
      schema={schema.fields.description}
      bind:value={$formStore.fields.description}
      errorText={$formStore.errors.description}
    />
  </FormGroup>
  <Row padding>
    <Column>
      <DateTimeField
        schema={schema.fields.startTime}
        bind:value={$formStore.fields.startTime}
        errorText={$formStore.errors.startTime}
      />
    </Column>
    <Column>
      <DateTimeField
        schema={schema.fields.finishTime}
        bind:value={$formStore.fields.finishTime}
        errorText={$formStore.errors.finishTime}
      />
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
        <ExhibitionSectionForm bind:productInGroups isAdding />
        <div class="button-right-wrapper">
          <Button on:click={handleProductGroupSubmit} disabled={isSubmitting}>
            기획전 섹션 추가{isSubmitting ? "중..." : ""}
          </Button>
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
