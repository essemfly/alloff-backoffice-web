<script lang="ts">
  import { Route } from "svelte-navigator";
  import ProductGroupDetail from "./views/ProductGroupDetail.svelte";
  import ProductGroupList from "./views/ProductGroupList.svelte";
</script>

<Route path="/" let:params>
  <ProductGroupList />
</Route>

<Route path=":id" let:params>
  <ProductGroupDetail productId={params.id} />
</Route>
