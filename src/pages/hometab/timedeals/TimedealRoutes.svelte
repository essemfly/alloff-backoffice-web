<script lang="ts">
  import { GroupTypeEnum } from "@app/api";

  import ProductGroupAdd from "@app/pages/product-groups/views/ProductGroupAdd.svelte";

  import { Route } from "svelte-navigator";
  import TimedealList from "./views/TimedealList.svelte";
</script>

<Route path="timedeals/*">
  <Route path="/">
    <TimedealList />
  </Route>
  <Route path="add">
    <ProductGroupAdd productGroupType={GroupTypeEnum.Timedeal} />
  </Route>
</Route>
