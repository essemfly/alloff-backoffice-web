<script lang="ts">
  import { onMount } from "svelte";
  import { debounce } from "lodash";
  import { navigate } from "svelte-navigator";
  import { Button } from "carbon-components-svelte";
  import DocumentAdd16 from "carbon-icons-svelte/lib/DocumentAdd16";

  import { Brand, BrandsApi } from "@api";
  import Nav from "@app/components/Nav.svelte";
  import DataTable from "@app/components/DataTable/DataTable.svelte";
  import { DataTableData } from "@app/components/DataTable/helpers";

  import { brandColumns } from "./components/brandColumns";

  let brands: Brand[] = [];

  const brandsAPi = new BrandsApi();

  const handleAddClick = (event: MouseEvent) => {
    event.preventDefault();
    navigate("/brands/add");
  };

  onMount(async () => {
    const res = await brandsAPi.brandsList();
    brands = res.data.map((brand) => ({ ...brand, id: brand.brand_id }));
  });

  const handleRowClick = (event: CustomEvent<DataTableData<Brand>>) => {
    event.preventDefault();
    navigate(`/brands/${event.detail.id}`);
  };

  const handleIsLiveChange = debounce(
    async (event: CustomEvent<[boolean, number, keyof Brand]>) => {
      const [value, index, key] = event.detail;
      const brandItem = { ...brands[index], [key]: value };
      brands[index] = brandItem;
      brands = brands;

      const res = await brandsAPi.brandsPartialUpdate({
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
</script>

<Nav>
  <div class="button-right-wrapper">
    <Button on:click={handleAddClick} icon={DocumentAdd16}>브랜드 추가</Button>
  </div>
  <DataTable
    data={brands}
    columns={brandColumns}
    on:click:row={handleRowClick}
    on:change:toggle={handleIsLiveChange}
  />
</Nav>
