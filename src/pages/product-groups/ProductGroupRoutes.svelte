<script lang="ts">
  import { Route } from "svelte-navigator";
  import ProductGroupAdd from "./ProductGroupAdd.svelte";
  import ProductGroupDetail from "./ProductGroupDetail.svelte";
  import ProductGroupList from "./ProductGroupList.svelte";
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
