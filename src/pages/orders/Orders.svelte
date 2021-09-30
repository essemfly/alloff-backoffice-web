<script lang="ts">
  import { onMount } from "svelte";
  import { Order, OrdersApi } from "../../api";
  import MediaQuery from "../../helpers/MediaQuery.svelte";
  import OrdersTable from "./components/OrdersTable.svelte";
  interface OrderWithId extends Order {
    id: string;
  }

  onMount(() => {
    api.ordersList().then(({ data }) => {
      orders = data.map((o) => ({ ...o, id: o.id ?? "" }));
      loading = false;
    });
  });

  const api = new OrdersApi();
  let orders: OrderWithId[] = [];
  let loading = true;
</script>

<MediaQuery query="(max-width: 480px)" let:matches>
  <OrdersTable isMobile={matches} {orders} />
</MediaQuery>
