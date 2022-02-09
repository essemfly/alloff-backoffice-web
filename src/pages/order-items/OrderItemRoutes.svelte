<script lang="ts">
  import { Route } from "svelte-navigator";
  import OrderItemDetail from "./OrderItemDetail.svelte";
  import OrderItems from "./OrderItems.svelte";
</script>

<Route path="/">
  <OrderItems />
</Route>
<Route path=":id" let:params>
  <OrderItemDetail idOrCode={params.id} />
</Route>
