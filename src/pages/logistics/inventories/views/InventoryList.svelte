<script lang="ts">
  import { Checkbox, Pagination } from "carbon-components-svelte";

  import {
    InventoriesApi,
    Inventory,
    InventoryStatusEnum,
  } from "@lessbutter/alloff-backoffice-api";
  import MediaQuery from "@app/helpers/MediaQuery.svelte";
  import { getInventoryStatusLabel } from "@app/helpers/inventory";
  import Nav from "@app/components/Nav.svelte";

  import InventoriesTable from "./components/InventoriesTable.svelte";
  import { search } from "../store";
  import { apiConfig } from "@app/store";

  const api = new InventoriesApi(apiConfig);
  let inventories: Inventory[] = [];

  const load = async (
    page: number,
    size: number,
    statuses: InventoryStatusEnum[],
    search?: string,
  ) => {
    const {
      data: { count, results },
    } = await api.inventoriesList({
      page,
      search,
      size,
      statuses,
    });

    totalItems = count ?? 0;
    inventories = results ?? [];
  };

  let page = 1;
  let pageSize = 50;
  let totalItems = 0;
  let statuses: InventoryStatusEnum[] = [InventoryStatusEnum.InStock];
  const pageSizes = [20, 50, 100];

  $: load(
    page,
    pageSize,
    statuses,
    $search.trim() === "" ? undefined : $search,
  );
</script>

<Nav>
  <div style="display: flex; align-items: center; flex-direction: row;">
    {#each [InventoryStatusEnum.ProcessingNeeded, InventoryStatusEnum.InStock, InventoryStatusEnum.ShippingPending, InventoryStatusEnum.Shipped] as status}
      <Checkbox
        labelText={getInventoryStatusLabel(status)}
        checked={statuses.includes(status)}
        on:check={(e) => {
          if (e.detail) {
            statuses = [...statuses, status];
          } else {
            statuses = statuses.filter((s) => s !== status);
          }
        }}
      />
    {/each}
  </div>
  <Pagination {...{ totalItems, pageSizes }} bind:page bind:pageSize />
  <MediaQuery query="(max-width: 480px)" let:matches>
    <InventoriesTable isMobile={matches} {inventories} />
  </MediaQuery>
</Nav>
