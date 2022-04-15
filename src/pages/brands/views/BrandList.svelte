<script lang="ts">
  import { Brand, BrandsApi } from "@lessbutter/alloff-backoffice-api";
  import { debounce } from "lodash";
  import { onMount } from "svelte";
  import { navigate } from "svelte-navigator";
  import {
    Button,
    Toolbar,
    ToolbarContent,
    ToolbarSearch,
  } from "carbon-components-svelte";
  import DocumentAdd16 from "carbon-icons-svelte/lib/DocumentAdd16";

  import { apiConfigs } from "@app/store";
  import Nav from "@app/components/Nav.svelte";
  import DataTable from "@app/components/DataTable/DataTable.svelte";
  import { DataTableData } from "@app/components/DataTable/helpers";
  import { convertToCamelCase } from "@app/helpers/change-case";

  import { brandColumns } from "./components/brandColumns";
  import { formStore } from "../models/schema";

  let brands: Brand[] = [];

  const brandApi = new BrandsApi($apiConfigs);

  const handleAddClick = (event: MouseEvent) => {
    event.preventDefault();
    navigate("/brands/add");
  };

  onMount(async () => {
    const res = await brandApi.brandsList();
    brands = res.data.map((brand: Brand) => ({ ...brand, id: brand.brand_id }));
  });

  const handleRowClick = (event: CustomEvent<DataTableData<Brand>>) => {
    event.preventDefault();
    const brand = brands.find(({ brand_id }) => brand_id === event.detail.id);
    if (brand) {
      const brandData = convertToCamelCase(brand);
      formStore.update(brandData);
      navigate(`/brands/${event.detail.id}`);
    }
  };

  const handleIsLiveChange = debounce(
    async (event: CustomEvent<[boolean, number, keyof Brand]>) => {
      const [value, index, key] = event.detail;
      const brandItem = { ...brands[index], [key]: value };
      brands[index] = brandItem;
      brands = brands;

      await brandApi.brandsPartialUpdate({
        id: brandItem.brand_id,
        patchedBrandRequest: {
          keyname: brandItem.keyname,
          brand_id: brandItem.brand_id,
          [key]: value,
        },
      });
    },
    500,
  );

  let value = "";
</script>

<Nav title="브랜드 목록">
  <DataTable
    data={brands}
    columns={brandColumns}
    on:click:row={handleRowClick}
    on:change:toggle={handleIsLiveChange}
  >
    <Toolbar>
      <ToolbarContent>
        <ToolbarSearch persistent shouldFilterRows bind:value />
        <Button on:click={handleAddClick} icon={DocumentAdd16}>
          브랜드 추가
        </Button>
      </ToolbarContent>
    </Toolbar>
  </DataTable>
</Nav>
