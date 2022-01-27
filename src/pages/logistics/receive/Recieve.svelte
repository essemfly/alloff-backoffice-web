<script lang="ts">
  import { Pagination } from "carbon-components-svelte";
  import { ReceivedItem, ReceivedItemsApi } from "../../../api";
  import MediaQuery from "../../../helpers/MediaQuery.svelte";
  import LoggedInFrame from "../../common/LoggedInFrame.svelte";
  import RiTable from "./components/RITable.svelte";
  import { search } from "./store";

  const api = new ReceivedItemsApi();
  let ris: ReceivedItem[] = [];

  const load = async (p: number, size: number, search?: string) => {
    const {
      data: { count, results },
    } = await api.receivedItemsList({ page: p, search, size });

    totalItems = count ?? 0;
    ris = results ?? [];
    
  };

  const receive = async (id: number) => {
    await api.receivedItemsMakeInventoryCreate({
      id: id.toString(),
    });
  };

  const revert = async (id: number) => {
    await api.receivedItemsRevertInventoryCreate({
      id: id.toString(),
    });
  };

  let page = 1;
  let pageSize = 20;
  let totalItems = 0;
  const pageSizes = [20, 50, 100];

  $: load(page, pageSize, $search.trim() === "" ? undefined : $search);
</script>

<LoggedInFrame>
  <Pagination {...{ totalItems, pageSizes }} bind:page bind:pageSize />
  <MediaQuery query="(max-width: 480px)" let:matches>
    <RiTable
      isMobile={matches}
      {ris}
      reload={() => load(page, pageSize, $search)}
      {receive}
      {revert}
    />
  </MediaQuery>
</LoggedInFrame>
