<script lang="ts">
  import { onMount } from "svelte";
  import {
    Row,
    Column,
    StructuredList,
    StructuredListHead,
    StructuredListRow,
    StructuredListCell,
    StructuredListBody,
    Button,
  } from "carbon-components-svelte";
  import TrashCan16 from "carbon-icons-svelte/lib/TrashCan16";
  import Launch16 from "carbon-icons-svelte/lib/Launch16";

  import { Exhibition, ExhibitionsApi } from "@api";
  import { AutocompleteField } from "@app/components/form";
  import { AutocompleteItem } from "@app/components/autocomplete";
  import ContentBox from "@app/components/ContentBox.svelte";

  import { HometabItemType } from "../../constants";
  import { formStore, schema } from "../../models/schema";

  let exhibitions: Exhibition[] = [];
  let exhibitionOptions: AutocompleteItem[] = [];
  let selectedExhibitions: Exhibition[] = [];

  const exhibitionApi = new ExhibitionsApi();

  onMount(async () => {
    const res = await exhibitionApi.exhibitionsList();
    exhibitions = res.data.exhibitions;
    selectedExhibitions = exhibitions.filter(({ exhibition_id }) =>
      $formStore.fields.contents.brandKeynames?.includes(exhibition_id),
    );
    exhibitionOptions = exhibitions.map(
      ({ exhibition_id, title, subtitle }) => ({
        key: exhibition_id,
        label: title,
        value: exhibition_id,
        subvalue: subtitle,
      }),
    );
  });

  const handleExhibitionChange = (event: CustomEvent<AutocompleteItem>) => {
    const selectedExhibition = exhibitions.find(
      ({ exhibition_id }) => exhibition_id === event.detail?.value,
    )!;
    if (selectedExhibition) {
      selectedExhibitions = [...selectedExhibitions, selectedExhibition];
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
  <h4>기획전 선택</h4>
  <Row>
    <Column>
      <AutocompleteField
        schema={schema.fields.contents.fields.exhibitionIds
          .required()
          .meta({ placeholder: "기획전 이름/ID로 검색" })}
        options={exhibitionOptions}
        errorText={$formStore.errors.contents?.exhibitionIds}
        on:select={handleExhibitionChange}
      />
    </Column>
  </Row>

  <Row>
    <Column>
      <StructuredList condensed>
        <StructuredListHead>
          <StructuredListRow head>
            <StructuredListCell head>Banner</StructuredListCell>
            <StructuredListCell head>Title</StructuredListCell>
            <StructuredListCell head>Actions</StructuredListCell>
          </StructuredListRow>
        </StructuredListHead>
        <StructuredListBody>
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
    </Column>
  </Row>
</ContentBox>

<style>
  .logo_image {
    width: 200px;
    max-width: 100%;
  }
</style>
