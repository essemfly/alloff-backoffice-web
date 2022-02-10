<script lang="ts">
  import { Route } from "svelte-navigator";
  import BannerList from "./views/BannerList.svelte";
  import CurationList from "./views/CurationList.svelte";
  import ExhibitionList from "./views/ExhibitionList.svelte";
  import TimedealList from "./views/TimedealList.svelte";
</script>

<Route path="/banners">
  <BannerList />
</Route>
<Route path="/curations/:type" let:params>
  <CurationList type={params.type.replace("type", "")} />
</Route>
<Route path="/exhibitions/:type" let:params>
  <ExhibitionList type={params.type.replace("type", "")} />
</Route>
<Route path="/timedeals">
  <TimedealList />
</Route>
