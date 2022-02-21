<script lang="ts">
  import { Route } from "svelte-navigator";
  import { GroupTypeEnum } from "@api";
  import ProductGroupAdd from "@app/pages/product-groups/views/ProductGroupAdd.svelte";
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
