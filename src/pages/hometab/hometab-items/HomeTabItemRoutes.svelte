<script lang="ts">
  import { Route } from "svelte-navigator";
  import HometabItemAdd from "./views/HometabItemAdd.svelte";
  import HometabItemDetail from "./views/HometabItemDetail.svelte";
  import HometabItemList from "./views/HometabItemList.svelte";
</script>

<Route path="/">
  <HometabItemList />
</Route>
<Route path="add">
  <HometabItemAdd />
</Route>
<Route path=":id" let:params>
  <HometabItemDetail id={params.id} />
</Route>
