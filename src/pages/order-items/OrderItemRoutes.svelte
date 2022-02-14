<script lang="ts">
  import { Route } from "svelte-navigator";
  import OrderItemDetail from "./OrderItemDetail.svelte";
  import OrderItemList from "./OrderItemList.svelte";
</script>

<Route path="/">
  <OrderItemList />
</Route>
<Route path=":id" let:params>
  <OrderItemDetail idOrCode={params.id} />
</Route>
