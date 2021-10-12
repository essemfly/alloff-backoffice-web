<script lang="ts">
  import { Pagination } from "carbon-components-svelte";
  import { OrderList, OrdersApi } from "../../api";
  import MediaQuery from "../../helpers/MediaQuery.svelte";
  import OrdersTable from "./components/OrdersTable.svelte";
  import { search } from "./store";
  import LoggedInFrame from "../common/LoggedInFrame.svelte";
  import { useLocation } from "svelte-navigator";

  const location = useLocation();
  const params = new URLSearchParams($location.search);
  const userId = params.get("userid");

  const load = async (p: number, size: number, search?: string) => {
    if (userId) {
      const res = await api.ordersByUserList({ userId });
      orders = res.data;
    } else {
      const {
        data: { count, results },
      } = await api.ordersList({ page: p, search, size });

      totalItems = count ?? 0;
      orders = results ?? [];
    }
  };

  const api = new OrdersApi();
  let orders: OrderList[] = [];
  let page = 1;
  let pageSize = 20;
  let totalItems = 0;
  const pageSizes = [20, 50, 100];

  $: load(page, pageSize, $search.trim() === "" ? undefined : $search);
</script>

<LoggedInFrame>
  {#if userId}
    <h6>USER ID: {userId}</h6>
    <div style="height:10px;" />
  {/if}
  {#if !userId}
    <Pagination {...{ totalItems, pageSizes }} bind:page bind:pageSize />
  {/if}
  <MediaQuery query="(max-width: 480px)" let:matches>
    <OrdersTable isMobile={matches} {orders} canSearch={!userId} />
  </MediaQuery>
</LoggedInFrame>
