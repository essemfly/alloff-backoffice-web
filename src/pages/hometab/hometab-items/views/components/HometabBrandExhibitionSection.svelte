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

  interface HometabBrandExhibitionSectionValue {
    backImageUrl?: string;
    brand: Brand | undefined;
    exhibition: Exhibition | undefined;
  }

  export let value: HometabBrandExhibitionSectionValue;
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
    selectedBrand = value.brand;
    selectedExhibition = value.exhibition;

    const resBrand = await brandsAPi.brandsList();
    brands = resBrand.data;
    filteredBrands = brands.map(({ brand_id, keyname, korname }) => ({
      key: brand_id,
      value: korname,
      subvalue: keyname,
    }));

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

  const handleBrandChange = (selected?: AutocompleteItem) => {
    selectedBrand = brands.find(
      ({ keyname }) => keyname === selected?.subvalue,
    )!;
  };

  const handleExhibitionChange = (selected?: AutocompleteItem) => {
    selectedExhibition = exhibitions.find(
      ({ exhibition_id }) => exhibition_id === selected?.key,
    )!;
  };

  $: if (backImageUrl || selectedBrand || selectedExhibition) {
    dispatch("change", {
      item_type: ItemTypeEnum.BrandExhibition,
      brand_keynames: [selectedBrand?.keyname],
      exhibition_ids: [selectedExhibition?.exhibition_id],
      back_image_url: backImageUrl,
    });
  }
</script>

<ContentBox title={`${HometabItemType.BrandExhibition} 정보`}>
  <Row>
    <Column>
      <ImageUploadField
        label={"배경 이미지"}
        bind:value={backImageUrl}
        disabled={!isAdding}
      />
    </Column>
  </Row>
  <h4>브랜드</h4>
  <Row>
    <Column>
      <Autocomplete
        options={filteredBrands}
        onSubmit={handleBrandChange}
        placeholder="브랜드 이름/Keyname/ID로 검색"
        labelText="브랜드 검색"
        selectedValue={selectedBrand?.keyname ?? ""}
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
