<script lang="ts">
  import { Route } from "svelte-navigator";
  import BrandAdd from "./views/BrandAdd.svelte";
  import BrandDetail from "./views/BrandDetail.svelte";
  import BrandList from "./views/BrandList.svelte";
</script>

<Route path="add">
  <BrandAdd />
</Route>
<Route path=":id" let:params>
  <BrandDetail id={params.id} />
</Route>
<Route path="/">
  <BrandList />
</Route>
