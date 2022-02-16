<script lang="ts">
  import { Route } from "svelte-navigator";
  import BannerAdd from "./views/BannerAdd.svelte";
  import BannerDetail from "./views/BannerDetail.svelte";
  import BannerList from "./views/BannerList.svelte";
</script>

<Route path="banners/*">
  <Route path="/">
    <BannerList />
  </Route>
  <Route path="add">
    <BannerAdd />
  </Route>
  <Route path=":id" let:params>
    <BannerDetail id={params.id} />
  </Route>
</Route>
