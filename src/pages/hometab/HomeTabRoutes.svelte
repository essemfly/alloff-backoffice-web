<script lang="ts">
  import { Route } from "svelte-navigator";
  import CurationList from "./views/CurationList.svelte";
  import ExhibitionList from "./views/ExhibitionList.svelte";
  import TimedealList from "./views/TimedealList.svelte";
</script>

<Route path="/curations">
  <CurationList />
</Route>
<Route path="/exibitions">
  <ExhibitionList />
</Route>
<Route path="/timedeals">
  <TimedealList />
</Route>
