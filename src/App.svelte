<script lang="ts">
  import { SvelteToast } from "@zerodevx/svelte-toast";
  import "carbon-components-svelte/css/g10.css";
  import "./index.css";
  import { Route, Router } from "svelte-navigator";
  // import Dashboard from "./pages/analytics/dashboard/Dashboard.svelte";
  import Login from "./pages/auth/Login.svelte";
  // Routes
  import BrandRoutes from "./pages/brands/BrandRoutes.svelte";
  import LogisticsRoutes from "./pages/logistics/LogisticsRoutes.svelte";
  import NotificationRoutes from "./pages/notifications/NotificationRoutes.svelte";
  // default route.. todo: fix to redirect
  import OrderItems from "./pages/order-items/OrderItemList.svelte";
  import OrderItemRoutes from "./pages/order-items/OrderItemRoutes.svelte";
  import ProductGroupRoutes from "./pages/product-groups/ProductGroupRoutes.svelte";
  import HomeTabRoutes from "./pages/hometab/HomeTabRoutes.svelte";
  import ProductRoutes from "./pages/products/ProductRoutes.svelte";

  // DO NOT DELETE THIS CONSOLE LOG
  console.log(
    `%cBackoffice Web [${import.meta.env.MODE}] v${
      import.meta.env.VITE_PACKAGE_VERSION
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
  <Route path="brands/*">
    <BrandRoutes />
  </Route>
  <Route path="logistics/*">
    <LogisticsRoutes />
  </Route>
  <Route path="items/*">
    <OrderItemRoutes />
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
  <!-- default route -->
  <Route path="/">
    <OrderItems />
  </Route>
</Router>
