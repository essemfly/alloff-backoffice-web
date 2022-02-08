<script lang="ts">
  import { Route } from "svelte-navigator";
  import NotificationAdd from "./views/NotificationAdd.svelte";
  import NotificationList from "./views/NotificationList.svelte";
</script>

<Route path="/">
  <NotificationList />
</Route>
<Route path="add">
  <NotificationAdd />
</Route>
