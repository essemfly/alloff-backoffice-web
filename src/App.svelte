<script lang="ts">
  import "carbon-components-svelte/css/g80.css";
  import Router from "svelte-spa-router";
  import Orders from "./pages/orders/Orders.svelte";
  const routes = {
    // Exact path
    "/orders": Orders,
    
    // Using named parameters, with last being optional
    // "/author/:first/:last?": Author,

    // Wildcard parameter
    // "/book/*": Book,

    // Catch-all
    // This is optional, but if present it must be the last
    // "*": NotFound,
  };
</script>

<main>
  <Router {routes} />
</main>

<style>
</style>
