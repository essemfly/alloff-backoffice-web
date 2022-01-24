<script lang="ts">
  import { Route, Router, useParams } from "svelte-navigator";
  import ProductAdd from "./ProductAdd.svelte";
  import ProductDetail from "./ProductDetail.svelte";
  import ProductList from "./ProductList.svelte";
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
