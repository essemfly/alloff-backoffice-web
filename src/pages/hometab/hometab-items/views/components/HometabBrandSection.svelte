<script lang="ts">
  import { onMount } from "svelte";
  import {
    FormGroup,
    StructuredList,
    StructuredListHead,
    StructuredListRow,
    StructuredListCell,
    StructuredListBody,
    Button,
  } from "carbon-components-svelte";
  import TrashCan16 from "carbon-icons-svelte/lib/TrashCan16";

  import { Brand, BrandsApi } from "@api";
  import { BrandSelectField } from "@app/components/form";
  import { AutocompleteItem } from "@app/components/autocomplete";
  import ContentBox from "@app/components/ContentBox.svelte";

  import { HometabItemType } from "../../constants";
  import { schema, formStore } from "../../models/schema";

  let brands: Brand[] = [];
  let selectedBrands: Brand[] = [];

  const brandsAPi = new BrandsApi();

  onMount(async () => {
    const res = await brandsAPi.brandsList();
    brands = res.data;
    selectedBrands = brands.filter(({ keyname }) =>
      $formStore.fields.contents.brandKeynames?.includes(keyname),
    );
  });

  const handleBrandChange = (event: CustomEvent<AutocompleteItem>) => {
    const selected = event.detail;
    const selectedBrand = brands.find(
      ({ keyname }) => keyname === selected?.value,
    );
    if (selectedBrand) {
      selectedBrands = [...selectedBrands, selectedBrand];
    }
    const brandKeynames = selectedBrands.map(({ keyname }) => keyname);
    formStore.update({
      contents: {
        ...$formStore.fields.contents,
        brandKeynames,
      },
    });
  };

  const handleBrandDeleteClick =
    (index: number) => async (event: MouseEvent) => {
      event.preventDefault();
      const newValue = selectedBrands.slice();
      newValue.splice(index, 1);
      selectedBrands = newValue;
      const brandKeynames = selectedBrands.map(({ keyname }) => keyname);
      formStore.update({
        contents: {
          ...$formStore.fields.contents,
          brandKeynames,
        },
      });
    };
</script>

<ContentBox title={`${HometabItemType.Brands} 정보`}>
  <h4>브랜드 추가</h4>
  <FormGroup>
    <BrandSelectField
      schema={schema.fields.contents.fields.brandKeynames.required()}
      errorText={$formStore.errors.contents?.brandKeynames}
      excludes={$formStore.fields.contents.brandKeynames ?? []}
      keepValueOnSubmit={false}
      on:change={handleBrandChange}
    />
  </FormGroup>
  <FormGroup>
    <StructuredList condensed>
      <StructuredListHead>
        <StructuredListRow head>
          <StructuredListCell head>Logo</StructuredListCell>
          <StructuredListCell head>Brand</StructuredListCell>
          <StructuredListCell head>Actions</StructuredListCell>
        </StructuredListRow>
      </StructuredListHead>
      <StructuredListBody>
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
  </FormGroup>
</ContentBox>

<style>
  img.logo_image {
    width: 60px;
    height: 60px;
  }
</style>
