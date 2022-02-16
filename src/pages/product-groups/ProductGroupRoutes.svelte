<script lang="ts">
  import { Route } from "svelte-navigator";
  import ProductGroupAdd from "./views/ProductGroupAdd.svelte";
  import ProductGroupDetail from "./views/ProductGroupDetail.svelte";
</script>

<Route path="add">
  <ProductGroupAdd />
</Route>
<Route path=":id" let:params>
  <ProductGroupDetail productId={params.id} />
</Route>
