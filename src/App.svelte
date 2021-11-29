<script lang="ts">
  import { SvelteToast } from "@zerodevx/svelte-toast";
  import "carbon-components-svelte/css/g10.css";
  import { Route, Router } from "svelte-navigator";
  import Dashboard from "./pages/analytics/dashboard/Dashboard.svelte";
  import Login from "./pages/auth/Login.svelte";
  import Inventories from "./pages/logistics/inventories/Inventories.svelte";
  import Recieve from "./pages/logistics/receive/Recieve.svelte";
  import ShippingNoticeDetail from "./pages/logistics/shipping-notices/ShippingNoticeDetail.svelte";
  import ShippingNotices from "./pages/logistics/shipping-notices/ShippingNotices.svelte";
  import NotificationDetail from "./pages/notifications/NotificationDetail.svelte";
  import Notifications from "./pages/notifications/Notifications.svelte";
  import OrderDetail from "./pages/orders/OrderDetail.svelte";
  import Orders from "./pages/orders/Orders.svelte";
  import TimedealProductDetail from "./pages/timedeal-products/TimedealProductDetail.svelte";
  import TimedealSectionNewProduct from "./pages/timedeals/sections/TimedealSectionNewProduct.svelte";
  import TimedealDetail from "./pages/timedeals/TimedealDetail.svelte";
  import Timedeals from "./pages/timedeals/Timedeals.svelte";
</script>

<SvelteToast options={{ duration: 3000 }} />

<Router primary={false}>
  <Route path="analytics/*">
    <Route path="dashboard">
      <Dashboard />
    </Route>
  </Route>
  <Route path="orders/*">
    <Route path="/">
      <Orders />
    </Route>
    <Route path=":id" let:params>
      <OrderDetail orderIdOrCode={params.id} />
    </Route>
  </Route>
  <Route path="logistics/*">
    <Route path="ris/*">
      <Route path="/">
        <Recieve />
      </Route>
    </Route>
    <Route path="inventories/*">
      <Route path="/">
        <Inventories />
      </Route>
    </Route>
    <Route path="shipping-notices/*">
      <Route path="/">
        <ShippingNotices />
      </Route>
      <Route path=":id" let:params>
        <ShippingNoticeDetail noticeId={params.id} />
      </Route>
    </Route>
  </Route>
  <Route path="timedeals/*">
    <Route path="/">
      <Timedeals />
    </Route>
    <Route path=":id" let:params>
      <TimedealDetail timedealId={params.id} />
    </Route>
    <Route path="new">
      <TimedealDetail />
    </Route>
    <Route path=":id/new-product">
      <TimedealSectionNewProduct />
    </Route>
  </Route>
  <Route path="notifications/*">
    <Route path="/">
      <Notifications />
    </Route>
    <Route path="new">
      <NotificationDetail />
    </Route>
    <!-- <Route path=":id" let:params>
      <NotificationDetial notificationId={params.id} />
    </Route> -->
  </Route>
  <Route path="timedeal-products/*">
    <!-- <Route path="/">
      <Timedeals />
    </Route> -->
    <Route path=":id" let:params>
      <TimedealProductDetail timedealProductId={params.id} />
    </Route>
    <Route path="new">
      <TimedealProductDetail />
    </Route>
  </Route>
  <Route path="login">
    <Login />
  </Route>
  <Route path="/">
    <Orders />
  </Route>
</Router>
