<script lang="ts">
  import { Route } from "svelte-navigator";
  import ProductGroupDetail from "./views/ProductGroupDetail.svelte";
</script>

<Route path=":id" let:params>
  <ProductGroupDetail productId={params.id} />
</Route>
