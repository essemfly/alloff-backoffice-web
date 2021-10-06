<script lang="ts">
  import { Pagination } from "carbon-components-svelte";
  import { OrderList, OrdersApi } from "../../api";
  import MediaQuery from "../../helpers/MediaQuery.svelte";
  import OrdersTable from "./components/OrdersTable.svelte";
  import { search } from "./store";
  import LoggedInFrame from "../common/LoggedInFrame.svelte";

  const load = async (p: number, size: number, search?: string) => {
    const {
      data: { count, results },
    } = await api.ordersList(search, p, size);

    totalItems = count;
    orders = results;
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
  <Pagination {...{ totalItems, pageSizes }} bind:page bind:pageSize />
  <MediaQuery query="(max-width: 480px)" let:matches>
    <OrdersTable isMobile={matches} {orders} />
  </MediaQuery>
</LoggedInFrame>
