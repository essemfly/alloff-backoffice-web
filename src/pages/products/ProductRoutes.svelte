<script lang="ts">
  import { Route } from "svelte-navigator";
  import ProductAdd from "./views/ProductAdd.svelte";
  import ProductDetail from "./views/ProductDetail.svelte";
  import ProductList from "./views/ProductList.svelte";
</script>

<Route path="/">
  <ProductList />
</Route>
<Route path="add">
  <ProductAdd />
</Route>
<Route path=":id" let:params>
  <ProductDetail productId={params.id} />
</Route>
