<script lang="ts">
  import "carbon-components-svelte/css/g10.css";
  import Router from "svelte-spa-router";
  import { wrap } from "svelte-spa-router/wrap";

  const routes = {
    // Exact path
    "/orders": wrap({
      asyncComponent: () => import("./pages/orders/Orders.svelte"),
    }),

    "/orders/:orderId": wrap({
      asyncComponent: () => import("./pages/orders/OrderDetail.svelte"),
    }),

    "/login": wrap({
      asyncComponent: () => import("./pages/auth/Login.svelte"),
    }),

    // Using named parameters, with last being optional
    // "/author/:first/:last?": Author,

    // Wildcard parameter
    // "/book/*": Book,

    // Catch-all
    // This is optional, but if present it must be the last
    // "*": NotFound,
  };
</script>

<Router {routes} />
