<script lang="ts">
  import { Route } from "svelte-navigator";
  import BannerAdd from "./views/BannerAdd.svelte";
  import BannerList from "./views/BannerList.svelte";
  import ExhibitionList from "./views/ExhibitionList.svelte";
  import ExhibitionSectionList from "./views/ExhibitionSectionList.svelte";
  import HometabItemAdd from "./views/HometabItemAdd.svelte";
  import HometabItemList from "./views/HometabItemList.svelte";
  import TimedealList from "./views/TimedealList.svelte";
</script>

<Route path="/">
  <HometabItemList />
</Route>
<Route path="add">
  <HometabItemAdd />
</Route>
<Route path="banners/*">
  <Route path="/">
    <BannerList />
  </Route>
  <Route path="add">
    <BannerAdd />
  </Route>
</Route>
<Route path="exhibitions/*">
  <Route path="/">
    <ExhibitionList />
  </Route>
  <Route path="sections/*">
    <ExhibitionSectionList />
  </Route>
</Route>
<Route path="timedeals/*">
  <TimedealList />
</Route>
