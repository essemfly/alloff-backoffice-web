<script lang="ts">
  import { Route } from "svelte-navigator";
  import InventoryRoutes from "./inventories/InventoryRoutes.svelte";
  import ReceiveRoutes from "./received-items/ReceivedItemRoutes.svelte";
  import ShippingNoticeRoutes from "./shipping-notices/ShippingNoticeRoutes.svelte";
</script>

<Route path="ris/*">
  <ReceiveRoutes />
</Route>
<Route path="inventories/*">
  <InventoryRoutes />
</Route>
<Route path="shipping-notices/*">
  <ShippingNoticeRoutes />
</Route>
