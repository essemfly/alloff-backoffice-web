<script lang="ts">
  import { Route } from "svelte-navigator";
  import TimedealList from "./views/TimedealList.svelte";
</script>

<Route path="timedeals/*">
  <TimedealList />
</Route>
