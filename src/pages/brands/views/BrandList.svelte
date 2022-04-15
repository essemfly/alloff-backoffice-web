<script lang="ts">
  import { Brand } from "@lessbutter/alloff-backoffice-api";
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

  import Nav from "@app/components/Nav.svelte";
  import DataTable from "@app/components/DataTable/DataTable.svelte";
  import { DataTableData } from "@app/components/DataTable/helpers";
  import { convertToCamelCase } from "@app/helpers/change-case";

  import { brandColumns } from "./components/brandColumns";
  import { formStore } from "../models/schema";
  import { useBrandService } from "../BrandService";

  const brandService = useBrandService();

  let brands: Brand[] = [];
  let value = "";

  const handleAddClick = (event: MouseEvent) => {
    event.preventDefault();
    navigate("/brands/add");
  };

  onMount(async () => {
    await brandService.list();
    brands = brandService.brands;
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
      await brandService.patch(brandItem.brand_id, brandItem.keyname, {
        [key]: value,
      });
      brands[index] = brandItem;
      brands = brands;
    },
    500,
  );
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
