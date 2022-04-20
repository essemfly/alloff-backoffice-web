<script lang="ts">
  import { Exhibition } from "@lessbutter/alloff-backoffice-api";
  import {
    StructuredList,
    StructuredListHead,
    StructuredListRow,
    StructuredListCell,
    StructuredListBody,
    Button,
    FormGroup,
  } from "carbon-components-svelte";
  import TrashCan16 from "carbon-icons-svelte/lib/TrashCan16";
  import Launch16 from "carbon-icons-svelte/lib/Launch16";

  import ContentBox from "@app/components/ContentBox.svelte";
  import ExhibitionListSection from "@app/components/ExhibitionListSection.svelte";
  import { convertToSnakeCase } from "@app/helpers/change-case";

  import { HometabItemType } from "../../constants";
  import { formStore } from "../../models/schema";

  let selectedExhibitions: Exhibition[] = $formStore.fields.exhibitions
    ? convertToSnakeCase($formStore.fields.exhibitions)
    : [];

  const handleExhibitionChange = (event: CustomEvent<Exhibition>) => {
    const selectedExhibition = event.detail;
    if (selectedExhibition) {
      // selectedExhibitions = [...selectedExhibitions, selectedExhibition];
      formStore.update({
        contents: {
          ...$formStore.fields.contents,
          exhibitionIds: selectedExhibitions.map(
            ({ exhibition_id }) => exhibition_id,
          ),
        },
      });
    }
  };

  const handleDeleteClick = (index: number) => async (event: MouseEvent) => {
    event.preventDefault();
    const newValue = selectedExhibitions.slice();
    newValue.splice(index, 1);
    selectedExhibitions = newValue;
    formStore.update({
      contents: {
        ...$formStore.fields.contents,
        exhibitionIds: selectedExhibitions.map(
          ({ exhibition_id }) => exhibition_id,
        ),
      },
    });
  };

  const handleDetailOpen = (exhibitionId: string) => () => {
    window.open(`/hometab/exhibitions/${exhibitionId}`, "_blank"); // todo: not use window.open
  };
</script>

<ContentBox title={`${HometabItemType.Exhibitions} 정보`}>
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
        {#if selectedExhibitions.length === 0}
          <StructuredListRow>
            <StructuredListCell>등록된 기획전 없음</StructuredListCell>
          </StructuredListRow>
        {/if}
        {#each selectedExhibitions as exhibition, index}
          <StructuredListRow>
            <StructuredListCell>
              <img
                class="logo_image"
                src={exhibition.banner_image}
                alt={[exhibition.title, "banner"].join("-")}
              />
            </StructuredListCell>
            <StructuredListCell>
              {exhibition.title}
              {exhibition.subtitle}
            </StructuredListCell>
            <StructuredListCell>
              <Button
                size="small"
                tooltipPosition="bottom"
                tooltipAlignment="end"
                iconDescription="삭제"
                icon={TrashCan16}
                kind="danger"
                on:click={handleDeleteClick(index)}
              />
              <Button
                tooltipPosition="bottom"
                tooltipAlignment="end"
                iconDescription="상세"
                icon={Launch16}
                kind="ghost"
                size="small"
                on:click={handleDetailOpen(exhibition.exhibition_id)}
              />
            </StructuredListCell>
          </StructuredListRow>
        {/each}
      </StructuredListBody>
    </StructuredList>
  </FormGroup>
</ContentBox>

<ContentBox subtitle="기획전 선택">
  <ExhibitionListSection
    value={$formStore.fields.contents.exhibitionIds}
    on:select={handleExhibitionChange}
    multiple
  />
</ContentBox>

<style>
  .logo_image {
    width: 200px;
    max-width: 100%;
  }
</style>
