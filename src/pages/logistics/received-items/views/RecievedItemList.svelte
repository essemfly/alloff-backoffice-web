<script lang="ts">
  import Nav from "@app/components/Nav.svelte";
  import MediaQuery from "@app/helpers/MediaQuery.svelte";
  import { apiConfig } from "@app/store";
  import {
    OrderItemsApi,
    ReceivedItem,
    ReceivedItemsApi,
  } from "@lessbutter/alloff-backoffice-api";
  import { Pagination } from "carbon-components-svelte";
  import { search } from "../store";
  import ReceivedItemTable from "./components/ReceivedItemTable.svelte";

  const api = new ReceivedItemsApi(apiConfig);
  let ris: ReceivedItem[] = [];

  const load = async (p: number, size: number, search?: string) => {
    const {
      data: { count, results },
    } = await api.receivedItemsList({ page: p, search, size });

    totalItems = count ?? 0;
    ris = results ?? [];
  };

  const receive = async (id: number) =>
    await api.receivedItemsReceiveInventoryCreate({
      id,
    });

  const cancel = async (id: number) =>
    await api.receivedItemsCancelReceivingCreate({
      id,
    });

  const revert = async (id: number) =>
    await api.receivedItemsRevertInventoryCreate({
      id,
    });

  const forceReceive = async (orderItemId: number) => {
    const itemsApi = new OrderItemsApi(apiConfig);
    return await itemsApi.orderItemsForceReceiveCreate({
      id: orderItemId,
    });
  };

  let page = 1;
  let pageSize = 20;
  let totalItems = 0;
  const pageSizes = [20, 50, 100];

  $: load(page, pageSize, $search.trim() === "" ? undefined : $search);
</script>

<Nav>
  <Pagination {...{ totalItems, pageSizes }} bind:page bind:pageSize />
  <MediaQuery query="(max-width: 480px)" let:matches>
    <ReceivedItemTable
      isMobile={matches}
      {ris}
      reload={() => load(page, pageSize, $search)}
      {...{ receive, revert, forceReceive, cancel }}
    />
  </MediaQuery>
</Nav>
