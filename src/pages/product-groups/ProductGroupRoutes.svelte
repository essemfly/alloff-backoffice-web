<script lang="ts">
  import { Route } from "svelte-navigator";
  import ProductGroupAdd from "./views/ProductGroupAdd.svelte";
  import ProductGroupDetail from "./views/ProductGroupDetail.svelte";
  import ProductGroupList from "./views/ProductGroupList.svelte";
</script>

<Route path="/">
  <ProductGroupList />
</Route>
<Route path="add">
  <ProductGroupAdd />
</Route>
<Route path=":id" let:params>
  <ProductGroupDetail productId={params.id} />
</Route>
