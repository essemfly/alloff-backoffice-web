<script lang="ts">
  import {
    GroupTypeE67Enum as GroupTypeEnum,
    ProductGroup,
    ProductInGroup,
    ExhibitionTypeEnum,
  } from "@lessbutter/alloff-backoffice-api";
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

  import { AutocompleteItem } from "@app/components/autocomplete";
  import ContentBox from "@app/components/ContentBox.svelte";
  import Dot from "@app/components/Dot.svelte";
  import {
    DateTimeField,
    ImageUploadField,
    MultilineTextField,
    TextAreaField,
    TextField,
  } from "@app/components/form";
  import { convertToSnakeCase } from "@app/helpers/change-case";

  import SectionForm from "./SectionForm.svelte";
  import SectionSearchSection from "./SectionSearchSection.svelte";
  import { formStore, schema, sectionFormStore } from "../../models/schema";
  import { useExhibitionService } from "../../ExhibitionService";

  const exhibitionService = useExhibitionService();

  export let isAdding: boolean = false;
  export let label: string = "기획전";
  export let type: ExhibitionTypeEnum = ExhibitionTypeEnum.Normal;

  let sections: ProductGroup[] = [];
  let selectedSections: ProductGroup[] = [];
  let selectedSectionIds: string[] = [];
  let productInGroups: ProductInGroup[] = [];
  let isSubmitting = false;
  let isTimedeal = type === ExhibitionTypeEnum.Timedeal;

  onMount(async () => {
    selectedSections = $formStore.fields.pgs
      ? convertToSnakeCase($formStore.fields.pgs)
      : [];
    selectedSectionIds = selectedSections.map(
      ({ product_group_id }) => product_group_id,
    );
  });

  const handleSectionSelect = (event: CustomEvent<ProductGroup>) => {
    const section = event.detail;
    if (section) {
      selectedSections = [...selectedSections, section];
    }
  };

  const handleSectionAdd = (selectedItem?: AutocompleteItem) => {
    const exhibitionSection = sections.find(
      ({ product_group_id }) => product_group_id === selectedItem?.value,
    );
    if (exhibitionSection) {
      selectedSections = [...selectedSections, exhibitionSection];
    }
  };

  const handleSectionRemove = (index: number) => () => {
    const newSections = selectedSections.slice();
    newSections.splice(index, 1);
    selectedSections = newSections;
  };

  $: if (selectedSections) {
    selectedSectionIds = selectedSections.map(
      ({ product_group_id }) => product_group_id,
    );
    formStore.update({ pgIds: selectedSectionIds });
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
        groupType: isTimedeal
          ? GroupTypeEnum.BrandTimedeal
          : GroupTypeEnum.Exhibition,
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

      const productGroupId = await exhibitionService.createProductGroup(
        formData,
      );
      if (productGroupId) {
        const productList = productInGroups.map(({ product, priority }) => ({
          product_id: product.alloff_product_id,
          priority,
        }));
        await exhibitionService.pushProducts(productGroupId, productList);
        const productGroup = await exhibitionService.loadProductGroup(
          productGroupId,
        );
        if (productGroup) {
          selectedSections = [...selectedSections, productGroup];
          handleSectionAdd({
            key: productGroup.product_group_id,
            label: productGroup.title,
            value: productGroup.product_group_id,
          });
        }
      }
    } catch (e) {
      toast.push(`섹션 등록에 오류가 발생했습니다.`);
    } finally {
      isSubmitting = false;
    }
  };

  const handleDetailOpen = (productGroupId: string) => () => {
    window.open(`/product-groups/${productGroupId}`, "_blank"); // todo: not use window.open
  };

  const handleSort = (index: number, to: number) => () => {
    const [current] = selectedSections.splice(index, 1);
    switch (to) {
      case 0:
        // to first
        selectedSections = [current, ...selectedSections];
        break;
      case 100:
        // to last
        selectedSections = [...selectedSections, current];
        break;
      default:
        const toIndex = index + to;
        selectedSections.splice(toIndex, 0, current);
        selectedSections = selectedSections;
    }
  };
</script>

<ContentBox title={`${label} 정보`}>
  <div class="row-right-wrapper">
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
      schema={isTimedeal
        ? schema.fields.bannerImage.notRequired()
        : schema.fields.bannerImage.required()}
      bind:value={$formStore.fields.bannerImage}
      errorText={$formStore.errors.bannerImage}
    />
  </FormGroup>
  <FormGroup>
    <ImageUploadField
      schema={isTimedeal
        ? schema.fields.thumbnailImage.notRequired()
        : schema.fields.thumbnailImage.required()}
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
    <MultilineTextField
      schema={schema.fields.tags}
      bind:value={$formStore.fields.tags}
      errorText={$formStore.errors.tags}
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

<ContentBox title={`${label} 섹션 목록`}>
  <StructuredList>
    <StructuredListHead>
      <StructuredListRow>
        <StructuredListCell head>Title</StructuredListCell>
        <StructuredListCell head>Products</StructuredListCell>
        {#if isTimedeal}
          <StructuredListCell head>Banner</StructuredListCell>
        {/if}
        <StructuredListCell head>Actions</StructuredListCell>
      </StructuredListRow>
    </StructuredListHead>
    <StructuredListBody>
      {#if selectedSections.length === 0}
        <StructuredListRow>
          <StructuredListCell>No section submitted</StructuredListCell>
        </StructuredListRow>
      {/if}
      {#each selectedSections as section, index}
        <StructuredListRow>
          <StructuredListCell>
            {section.title}
          </StructuredListCell>
          <StructuredListCell>
            {#if section.products.length > 0}
              <span>
                {section.products[0].product.alloff_name}
                {#if section.products.length > 1}
                  외 {section.products.length - 1}개의 상품
                {/if}
              </span>
            {:else}
              No products
            {/if}
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
              on:click={handleSectionRemove(index)}
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

<ContentBox title={`${label} 섹션`}>
  <Tabs>
    <Tab label="새로운 섹션" />
    <Tab label="등록된 섹션" />
    <svelte:fragment slot="content">
      <TabContent>
        <SectionForm
          bind:productInGroups
          isAdding
          type={isTimedeal ? GroupTypeEnum.BrandTimedeal : undefined}
        />
        <div class="row-right-wrapper">
          <Button on:click={handleProductGroupSubmit} disabled={isSubmitting}>
            섹션 추가{isSubmitting ? "중..." : ""}
          </Button>
        </div>
      </TabContent>
      <TabContent>
        <SectionSearchSection
          type={isTimedeal ? GroupTypeEnum.BrandTimedeal : undefined}
          bind:value={selectedSectionIds}
          on:select={handleSectionSelect}
        />
      </TabContent>
    </svelte:fragment>
  </Tabs>
</ContentBox>
