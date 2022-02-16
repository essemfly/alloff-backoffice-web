<script lang="ts">
  import { Route } from "svelte-navigator";
  import BannerAdd from "./views/BannerAdd.svelte";
  import BannerList from "./views/BannerList.svelte";
</script>

<Route path="banners/*">
  <Route path="/">
    <BannerList />
  </Route>
  <Route path="add">
    <BannerAdd />
  </Route>
</Route>
