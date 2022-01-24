<script lang="ts">
  import { Checkbox, Pagination } from "carbon-components-svelte";
  import { InventoriesApi, Inventory, InventoryStatusEnum } from "../../../api";
  import LoggedInFrame from "../../common/LoggedInFrame.svelte";
  import MediaQuery from "../../../helpers/MediaQuery.svelte";
  import InventoriesTable from "./components/InventoriesTable.svelte";
  import { search } from "./store";
  import { getInventoryStatusLabel } from "../../../helpers/inventory";

  const api = new InventoriesApi();
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
      location,
      statuses,
    });

    totalItems = count ?? 0;
    inventories = results ?? [];
  };

  let page = 1;
  let pageSize = 50;
  let totalItems = 0;
  const location: string | undefined = undefined;
  let statuses: InventoryStatusEnum[] = [InventoryStatusEnum.InStock];
  const pageSizes = [50, 100, 200];

  $: load(
    page,
    pageSize,
    statuses,
    $search.trim() === "" ? undefined : $search,
  );
</script>

<LoggedInFrame>
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
</LoggedInFrame>
