<script lang="ts">
  import { Route } from "svelte-navigator";
  import ExhibitionList from "./views/ExhibitionList.svelte";
  import ExhibitionSectionList from "./views/ExhibitionSectionList.svelte";
</script>

<Route path="exhibitions/*">
  <Route path="/">
    <ExhibitionList />
  </Route>
  <Route path="sections/*">
    <ExhibitionSectionList />
  </Route>
</Route>
