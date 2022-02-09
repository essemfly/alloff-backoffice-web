<script lang="ts">
  import { SvelteToast } from "@zerodevx/svelte-toast";
  import "carbon-components-svelte/css/g10.css";
  import { Route, Router } from "svelte-navigator";
  import OrderItemDetail from "./pages/order-items/OrderItemDetail.svelte";
  // import Dashboard from "./pages/analytics/dashboard/Dashboard.svelte";
  import Login from "./pages/auth/Login.svelte";
  // import Brands from "./pages/brands/brands.svelte";
  import Inventories from "./pages/logistics/inventories/Inventories.svelte";
  import Recieve from "./pages/logistics/receive/Recieve.svelte";
  import ShippingNoticeDetail from "./pages/logistics/shipping-notices/ShippingNoticeDetail.svelte";
  import OrderItems from "./pages/order-items/OrderItems.svelte";
  import Candidates from "./pages/logistics/shipping-notices/Candidates.svelte";
  import ShippingNotices from "./pages/logistics/shipping-notices/ShippingNotices.svelte";

  // Routes
  import NotificationRoutes from "./pages/notifications/NotificationRoutes.svelte";
  import ProductRoutes from "./pages/products/ProductRoutes.svelte";
  import ProductGroupRoutes from "./pages/product-groups/ProductGroupRoutes.svelte";
  import HomeTabRoutes from "./pages/hometab/HomeTabRoutes.svelte";

  // DO NOT DELETE THIS CONSOLE LOG
  console.log(
    `%cBackoffice Web [${import.meta.env.MODE}] v${
      import.meta.env.PACKAGE_VERSION
    }`,
    "font-size: 16px; color: #a5efda; background-color: #000; padding: 2px 5px;",
  );
</script>

<SvelteToast options={{ duration: 3000 }} />

<Router primary={false}>
  <!-- <Route path="analytics/*">
    <Route path="dashboard">
      <Dashboard />
    </Route>
  </Route>
  -->
  <Route path="login">
    <Login />
  </Route>
  <!-- <Route path="brands/*">
    <Route path="/">
      <Brands />
    </Route>
  </Route> -->
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
        <ShippingNoticeDetail noticeId={parseInt(params.id)} />
      </Route>
      <Route path="candidates">
        <Candidates />
      </Route>
    </Route>
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
  <Route path="products/*">
    <ProductRoutes />
  </Route>
  <Route path="product-groups/*">
    <ProductGroupRoutes />
  </Route>
  <Route path="notifications/*">
    <NotificationRoutes />
  </Route>
  <Route path="hometab/*">
    <HomeTabRoutes />
  </Route>
</Router>

<style>
  @import url("https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css");

  :global(html, body) {
    font-family: "Pretendard", "SF Pro", "sans-serif";
  }

  :global(.noselect) {
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Old versions of Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome, Edge, Opera and Firefox */
  }
</style>
