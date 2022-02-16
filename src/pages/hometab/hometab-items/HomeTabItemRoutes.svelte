<script lang="ts">
  import { Route } from "svelte-navigator";
  import HometabItemAdd from "./views/HometabItemAdd.svelte";
  import HometabItemList from "./views/HometabItemList.svelte";
</script>

<Route path="/">
  <HometabItemList />
</Route>
<Route path="add">
  <HometabItemAdd />
</Route>
