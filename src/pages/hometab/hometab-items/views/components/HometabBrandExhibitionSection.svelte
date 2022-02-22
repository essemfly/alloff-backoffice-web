<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { Row, Column } from "carbon-components-svelte";

  import {
    Brand,
    BrandsApi,
    Exhibition,
    ExhibitionsApi,
    ItemTypeEnum,
  } from "@api";
  import { Autocomplete, AutocompleteItem } from "@app/components/autocomplete";
  import ContentBox from "@app/components/ContentBox.svelte";
  import ImageUploadField from "@app/components/ImageUploadField.svelte";

  import { HometabItemType } from "../../constants";

  interface HometabExhibitionASectionValue {
    backImageUrl?: string;
    exhibition: Exhibition | undefined;
  }

  export let value: HometabExhibitionASectionValue;
  export let isAdding: boolean = false;

  let backImageUrl: string;

  let brands: Brand[] = [];
  let filteredBrands: AutocompleteItem[] = [];
  let selectedBrand: Brand | undefined;

  let exhibitions: Exhibition[] = [];
  let filteredExhibitions: AutocompleteItem[] = [];
  let selectedExhibition: Exhibition | undefined;

  const dispatch = createEventDispatcher();
  const brandsAPi = new BrandsApi();
  const exhibitionApi = new ExhibitionsApi();

  onMount(async () => {
    backImageUrl = value.backImageUrl ?? "";
    selectedExhibition = value.exhibition;

    const resExhibition = await exhibitionApi.exhibitionsList();
    exhibitions = resExhibition.data.exhibitions;
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

  $: if (backImageUrl || selectedBrand || selectedExhibition) {
    dispatch("change", {
      item_type: ItemTypeEnum.ExhibitionA,
      exhibition_ids: [selectedExhibition?.exhibition_id],
      back_image_url: backImageUrl,
    });
  }
</script>

<ContentBox title={`${HometabItemType.ExhibitionA} 정보`}>
  <Row>
    <Column>
      <ImageUploadField
        label={"배경 이미지"}
        bind:value={backImageUrl}
        disabled={!isAdding}
      />
    </Column>
  </Row>
  <h4>기획전</h4>
  <Row>
    <Column>
      <Autocomplete
        options={filteredExhibitions}
        onSubmit={handleExhibitionChange}
        placeholder="기획전 이름/ID로 검색"
        labelText="기획전 검색"
        selectedValue={selectedExhibition?.exhibition_id ?? ""}
        disabled={!isAdding}
      />
    </Column>
  </Row>
</ContentBox>
