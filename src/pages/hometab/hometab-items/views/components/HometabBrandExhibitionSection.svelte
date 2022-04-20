<script lang="ts">
  import { Exhibition } from "@lessbutter/alloff-backoffice-api";
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

  import { ImageUploadField } from "@app/components/form";
  import ContentBox from "@app/components/ContentBox.svelte";
  import ExhibitionListSection from "@app/components/ExhibitionListSection.svelte";
  import { convertToSnakeCase } from "@app/helpers/change-case";

  import { HometabItemType } from "../../constants";
  import { schema, formStore } from "../../models/schema";

  let selectedExhibition: Exhibition | undefined =
    $formStore.fields.exhibitions?.length > 0
      ? convertToSnakeCase($formStore.fields.exhibitions[0])
      : undefined;

  const handleExhibitionChange = (event: CustomEvent<Exhibition>) => {
    formStore.update({
      contents: {
        ...$formStore.fields.contents,
        exhibitionIds: event.detail ? [event.detail.exhibition_id] : [],
      },
    });
  };

  const handleDetailOpen = (exhibitionId: string) => () => {
    window.open(`/exhibitions/${exhibitionId}`, "_blank"); // todo: not use window.open
  };
</script>

<ContentBox title={`${HometabItemType.ExhibitionA} 정보`}>
  <FormGroup>
    <ImageUploadField
      schema={schema.fields.backImageUrl.required()}
      errorText={$formStore.errors.backImageUrl}
      bind:value={$formStore.fields.backImageUrl}
    />
  </FormGroup>

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
</ContentBox>

<ContentBox subtitle="기획전 선택">
  <ExhibitionListSection
    value={selectedExhibition ? [selectedExhibition?.exhibition_id] : []}
    on:select={handleExhibitionChange}
  />
</ContentBox>
