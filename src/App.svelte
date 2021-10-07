<script lang="ts">
  import "carbon-components-svelte/css/g10.css";
  import { Router, Route } from "svelte-navigator";
  import Orders from "./pages/orders/Orders.svelte";
  import OrderDetail from "./pages/orders/OrderDetail.svelte";
  import Login from "./pages/auth/Login.svelte";
</script>

<Router primary={false}>
  <Route path="orders/*">
    <Route path="/">
      <Orders />
    </Route>
    <Route path=":id" let:params>
      <OrderDetail orderId={params.id} />
    </Route>
  </Route>
  <Route path="login">
    <Login />
  </Route>
</Router>
