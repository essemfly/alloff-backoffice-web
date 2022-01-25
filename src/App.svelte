<script lang="ts">
  import { SvelteToast } from "@zerodevx/svelte-toast";
  import "carbon-components-svelte/css/g10.css";
  import { Route, Router } from "svelte-navigator";
  import OrderItemDetail from "./pages/order-items/OrderItemDetail.svelte";
  // import Dashboard from "./pages/analytics/dashboard/Dashboard.svelte";
  import Login from "./pages/auth/Login.svelte";
  // import Brands from "./pages/brands/brands.svelte";
  // import Inventories from "./pages/logistics/inventories/Inventories.svelte";
  // import Recieve from "./pages/logistics/receive/Recieve.svelte";
  // import ShippingNoticeDetail from "./pages/logistics/shipping-notices/ShippingNoticeDetail.svelte";
  // import ShippingNotices from "./pages/logistics/shipping-notices/ShippingNotices.svelte";
  // import NotificationDetail from "./pages/notifications/NotificationDetail.svelte";
  // import Notifications from "./pages/notifications/Notifications.svelte";
  // import OrderDetail from "./pages/orders/OrderDetail.svelte";
  // import Orders from "./pages/orders/Orders.svelte";
  // import TimedealSectionProductDetail from "./pages/timedeals/sections/TimedealSectionProductDetail.svelte";
  // import TimedealDetail from "./pages/timedeals/TimedealDetail.svelte";
  // import Timedeals from "./pages/timedeals/Timedeals.svelte";
  import OrderItems from "./pages/order-items/OrderItems.svelte";
  // import ProductRoutes from "./pages/products/ProductRoutes.svelte";
</script>

<SvelteToast options={{ duration: 3000 }} />

<Router primary={false}>
  <!-- <Route path="analytics/*">
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
  <Route path="brands/*">
    <Route path="/">
      <Brands />
    </Route>
  </Route>
  <Route path="timedeals/*">
    <Route path="/">
      <Timedeals />
    </Route>
    <Route path=":id/*" let:params>
      <Route path="/">
        <TimedealDetail timedealId={params.id} />
      </Route>
    </Route>
    <Route path="new">
      <TimedealDetail />
    </Route>
    <Route path=":id/products/*" let:params>
      <Route path="/">
        <TimedealSectionProductDetail
          productId=""
          productGroupId={params.id}
          mobile={false}
        />
      </Route>
      <Route path=":productid" let:params>
        <TimedealSectionProductDetail
          productId={params.productid}
          productGroupId={params.id}
          mobile={false}
        />
      </Route>
    </Route>
  </Route>
  <Route path="notifications/*">
    <Route path="/">
      <Notifications />
    </Route>
    <Route path="new">
      <NotificationDetail />
    </Route>
  </Route>
  <Route path="timedeal-products/*">
    <Route path=":id" let:params>
      <TimedealSectionProductDetail
        productId={params.id}
        productGroupId=""
        mobile={false}
      />
    </Route>
  </Route>-->
  <!-- <Route path="products/*"> -->
    <!-- <ProductRoutes /> -->
  <!-- </Route> -->
  <Route path="login">
    <Login />
  </Route>
  <Route path="items/*">
    <Route path="/">
      <OrderItems />
    </Route>
    <Route path=":id" let:params>
      <OrderItemDetail idOrCode={params.id} />
    </Route>
  </Route>
  <Route path="/">
    <OrderItems />
  </Route>
</Router>
