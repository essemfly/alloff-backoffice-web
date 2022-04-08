<script lang="ts">
  import {
    Button,
    FormGroup,
    StructuredList,
    StructuredListBody,
    StructuredListCell,
    StructuredListHead,
    StructuredListRow,
  } from "carbon-components-svelte";
  import Launch16 from "carbon-icons-svelte/lib/Launch16";

  import { Exhibition, ExhibitionsApi } from "@api";
  import ContentBox from "@app/components/ContentBox.svelte";
  import Dot from "@app/components/Dot.svelte";
  import {
    ImageUploadField,
    TextAreaField,
    TextField,
    ToggleField,
  } from "@app/components/form";
  import ExhibitionListSection from "@app/components/ExhibitionListSection.svelte";

  import { schema, formStore } from "../../models/schema";
  import { onMount } from "svelte";

  export let isAdding: boolean = false;

  let selectedExhibition: Exhibition;

  const exhibitionApi = new ExhibitionsApi();

  onMount(async () => {
    if (!isAdding) {
      const res = await exhibitionApi.exhibitionsRetrieve({
        id: $formStore.fields.exhibitionId,
      });
      selectedExhibition = res.data;
    }
  });

  const handleExhibitionChange = (event: CustomEvent<Exhibition[]>) => {
    selectedExhibition = event.detail[0];
    formStore.update({
      exhibitionId: event.detail ? selectedExhibition.exhibition_id : undefined,
    });
  };

  const handleDetailOpen = (exhibitionId: string) => () => {
    window.open(`/exhibitions/${exhibitionId}`, "_blank"); // todo: not use window.open
  };
</script>

<ContentBox title="배너 정보">
  <div class="row-right-wrapper">
    <Dot label="필수 입력 사항" />
  </div>
  {#if !isAdding}
    <FormGroup>
      <TextField
        schema={schema.fields.bannerId}
        bind:value={$formStore.fields.bannerId}
        readonly
      />
    </FormGroup>
  {/if}
  <FormGroup>
    <ImageUploadField
      schema={schema.fields.bannerImage}
      errorText={$formStore.errors.bannerImage}
      bind:value={$formStore.fields.bannerImage}
    />
  </FormGroup>
  <FormGroup>
    <TextAreaField
      schema={schema.fields.title}
      errorText={$formStore.errors.title}
      bind:value={$formStore.fields.title}
    />
  </FormGroup>
  <FormGroup>
    <TextAreaField
      schema={schema.fields.subtitle}
      bind:value={$formStore.fields.subtitle}
      errorText={$formStore.errors.subtitle}
    />
  </FormGroup>
  <FormGroup>
    <TextField
      schema={schema.fields.weight}
      bind:value={$formStore.fields.weight}
      errorText={$formStore.errors.weight}
    />
  </FormGroup>
  <FormGroup>
    <ToggleField
      schema={schema.fields.isLive}
      bind:value={$formStore.fields.isLive}
      errorText={$formStore.errors.isLive}
    />
  </FormGroup>
  {#if !isAdding}
    <h4>등록된 기획전</h4>
    <FormGroup>
      <StructuredList condensed flush>
        <StructuredListHead>
          <StructuredListRow head>
            <StructuredListCell head>Banner</StructuredListCell>
            <StructuredListCell head>Title</StructuredListCell>
            <StructuredListCell head>Actions</StructuredListCell>
          </StructuredListRow>
        </StructuredListHead>
        <StructuredListBody>
          {#if selectedExhibition}
            <StructuredListRow>
              <StructuredListCell>
                <img
                  class="logo_image"
                  src={selectedExhibition.thumbnail_image}
                  alt={[selectedExhibition.title, "banner"].join("-")}
                />
                <img
                  class="logo_image"
                  src={selectedExhibition.banner_image}
                  alt={[selectedExhibition.title, "banner"].join("-")}
                />
              </StructuredListCell>
              <StructuredListCell>
                {selectedExhibition.title}
                {selectedExhibition.subtitle}
              </StructuredListCell>
              <StructuredListCell>
                <Button
                  tooltipPosition="bottom"
                  tooltipAlignment="end"
                  iconDescription="상세"
                  icon={Launch16}
                  kind="ghost"
                  size="small"
                  on:click={handleDetailOpen(selectedExhibition.exhibition_id)}
                />
              </StructuredListCell>
            </StructuredListRow>
          {:else}
            <StructuredListRow>
              <StructuredListCell>등록된 기획전 없음</StructuredListCell>
            </StructuredListRow>
          {/if}
        </StructuredListBody>
      </StructuredList>
    </FormGroup>
  {/if}
</ContentBox>

<ContentBox subtitle="기획전 선택">
  <ExhibitionListSection
    value={$formStore.fields.exhibitionId}
    on:change={handleExhibitionChange}
    hideSelection
  />
</ContentBox>
