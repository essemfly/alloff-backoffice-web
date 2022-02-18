<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { Row, Column } from "carbon-components-svelte";

  import { Exhibition, ExhibitionsApi, ItemTypeEnum } from "@api";
  import { Autocomplete, AutocompleteItem } from "@app/components/autocomplete";
  import ContentBox from "@app/components/ContentBox.svelte";

  import { HometabItemType } from "../../constants";
  import ImageUploadField from "@app/components/ImageUploadField.svelte";
  import MultilineTextInput from "@app/components/MultilineTextInput.svelte";

  interface HometabExhibitionSectionValue {
    backImageUrl?: string;
    tags: string[];
    exhibition: Exhibition | undefined;
  }

  export let value: HometabExhibitionSectionValue;
  export let isAdding: boolean = false;

  let backImageUrl: string;
  let tags: string[] = [];

  let exhibitions: Exhibition[] = [];
  let filteredExhibitions: AutocompleteItem[] = [];
  let selectedExhibition: Exhibition | undefined;

  const dispatch = createEventDispatcher();
  const exhibitionApi = new ExhibitionsApi();

  onMount(async () => {
    backImageUrl = value.backImageUrl ?? "";
    tags = value.tags ?? [];
    selectedExhibition = value.exhibition ?? undefined;

    const res = await exhibitionApi.exhibitionsList();
    exhibitions = res.data.exhibitions;
    filteredExhibitions = exhibitions.map(
      ({ exhibition_id, title, subtitle }) => ({
        key: exhibition_id,
        value: title,
        subvalue: subtitle,
      }),
    );
  });

  const handleExhibitionChange = (selected?: AutocompleteItem) => {
    selectedExhibition = exhibitions.find(
      ({ exhibition_id }) => exhibition_id === selected?.key,
    )!;
  };

  $: if (selectedExhibition) {
    dispatch("change", {
      item_type: ItemTypeEnum.Exhibition,
      exhibition_ids: [selectedExhibition.exhibition_id],
      back_image_url: backImageUrl,
    });
  }
</script>

<ContentBox title={`${HometabItemType.Exhibition} 정보`}>
  <Row>
    <Column>
      <ImageUploadField
        label={"배경 이미지"}
        bind:value={backImageUrl}
        disabled={!isAdding}
      />
    </Column>
  </Row>
  <Row>
    <Column>
      <MultilineTextInput label="태그" bind:value={tags} />
    </Column>
  </Row>

  <h4>기획전 선택</h4>
  <Row>
    <Column>
      <Autocomplete
        options={filteredExhibitions}
        onSubmit={handleExhibitionChange}
        placeholder="기획전 이름/ID로 검색"
        labelText="기획전 검색"
        disabled={!isAdding}
        keepValueOnSubmit
      />
    </Column>
  </Row>
</ContentBox>
