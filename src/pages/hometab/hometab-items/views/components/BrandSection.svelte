<script lang="ts">
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
  // import Launch16 from "carbon-icons-svelte/lib/Launch16";

  import { CreateHomeTabRequest, HomeTab, ItemTypeEnum } from "@api";
  import { AutocompleteItem } from "@app/components/autocomplete";
  import BrandSelect from "@app/components/BrandSelect.svelte";
  import ContentBox from "@app/components/ContentBox.svelte";

  import { HometabItemType } from "../../constants";
  import { onMount } from "svelte";

  export let form: CreateHomeTabRequest & HomeTab;

  export let brandKeynames: string[] = [];

  onMount(() => {
    brandKeynames = form.brands.map((x) => x.keyname);
  });

  const handleBrandChange = (
    event: CustomEvent<{ value?: AutocompleteItem }>,
  ) => {
    const selected = event.detail.value;
    if (selected) {
      brandKeynames.push(selected.subvalue!);
    }
  };

  const handleBrandDeleteClick =
    (index: number) => async (event: MouseEvent) => {
      event.preventDefault();
      const newValue = form.brands.slice();
      newValue.splice(index, 1);
      form.brands = newValue;
    };

  $: if (brandKeynames) {
    form.brand_keynames = brandKeynames;
  }
</script>

<ContentBox title={HometabItemType.Brands}>
  <Row>
    <Column>
      <div class="bx--label">브랜드 선택</div>
      <BrandSelect on:change={handleBrandChange} />
    </Column>
  </Row>
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
          {#each form.brands as brand, index}
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
                <!-- <Button
                tooltipPosition="bottom"
                tooltipAlignment="end"
                iconDescription="상세"
                icon={Launch16}
                kind="ghost"
                size="small"
                on:click={handleDetailOpen(brand.keyname)}
              /> -->
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
