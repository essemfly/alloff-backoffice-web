<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
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

  import { Brand, BrandsApi, ItemTypeEnum } from "@api";
  import { AutocompleteItem } from "@app/components/autocomplete";
  import BrandSelect from "@app/components/BrandSelect.svelte";
  import ContentBox from "@app/components/ContentBox.svelte";

  import { HometabItemType } from "../../constants";

  interface HometabBrandSectionValue {
    brands: Brand[];
  }

  export let value: HometabBrandSectionValue;
  export let isAdding: boolean = false;

  let brands: Brand[] = [];
  let selectedBrands: Brand[] = [];
  let selectedBrandKeynames: string[] = [];

  const brandsAPi = new BrandsApi();
  const dispatch = createEventDispatcher();

  onMount(async () => {
    selectedBrandKeynames = value.brands?.map(({ keyname }) => keyname);
    const res = await brandsAPi.brandsList();
    brands = res.data.filter(
      ({ keyname }) => !selectedBrandKeynames.includes(keyname),
    );
    selectedBrands = res.data.filter(({ keyname }) =>
      selectedBrandKeynames.includes(keyname),
    );
  });

  const handleBrandChange = (
    event: CustomEvent<{ value?: AutocompleteItem }>,
  ) => {
    const selected = event.detail.value;
    const selectedBrand = brands.find(
      ({ keyname }) => keyname === selected?.subvalue,
    );
    if (selectedBrand) {
      selectedBrands = [...selectedBrands, selectedBrand];
    }
  };

  const handleBrandDeleteClick =
    (index: number) => async (event: MouseEvent) => {
      event.preventDefault();
      const newValue = selectedBrands.slice();
      newValue.splice(index, 1);
      selectedBrands = newValue;
    };

  console.log(brands);

  $: if (selectedBrands) {
    selectedBrandKeynames = selectedBrands.map(({ keyname }) => keyname);
    dispatch("change", {
      item_type: ItemTypeEnum.Brands,
      brand_keynames: selectedBrandKeynames,
    });
  }
</script>

<ContentBox title={`${HometabItemType.Brands} 정보`}>
  {#if isAdding}
    <h4>브랜드 추가</h4>
    <Row>
      <Column>
        <BrandSelect
          on:change={handleBrandChange}
          bind:excludes={selectedBrandKeynames}
          keepValueOnSubmit={false}
        />
      </Column>
    </Row>
  {/if}

  <Row>
    <Column>
      <StructuredList condensed>
        <StructuredListHead>
          <StructuredListRow head>
            <StructuredListCell head>Logo</StructuredListCell>
            <StructuredListCell head>Brand</StructuredListCell>
            <StructuredListCell head>Actions</StructuredListCell>
          </StructuredListRow>
        </StructuredListHead>
        <StructuredListBody>
          {#if value.brands?.length > 0}
            {#each value.brands as brand}
              <StructuredListRow>
                <StructuredListCell>
                  <img
                    class="logo_image"
                    src={brand.logo_image_url}
                    alt={[brand.korname, "logo"].join("-")}
                  />
                </StructuredListCell>
                <StructuredListCell>
                  {brand.korname}
                  {brand.keyname}
                </StructuredListCell>
                <StructuredListCell />
              </StructuredListRow>
            {/each}
          {/if}
          {#each selectedBrands as brand, index}
            <StructuredListRow>
              <StructuredListCell>
                <img
                  class="logo_image"
                  src={brand.logo_image_url}
                  alt={[brand.korname, "logo"].join("-")}
                />
              </StructuredListCell>
              <StructuredListCell>
                {brand.korname}
                {brand.keyname}
              </StructuredListCell>
              <StructuredListCell>
                <Button
                  size="small"
                  tooltipPosition="bottom"
                  tooltipAlignment="end"
                  iconDescription="삭제"
                  icon={TrashCan16}
                  kind="danger"
                  on:click={handleBrandDeleteClick(index)}
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
  img.logo_image {
    width: 60px;
    height: 60px;
  }
</style>
