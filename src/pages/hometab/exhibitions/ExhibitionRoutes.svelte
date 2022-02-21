<script lang="ts">
  import { Route } from "svelte-navigator";
  import { GroupTypeEnum } from "@api";
  import ProductGroupAdd from "@app/pages/product-groups/views/ProductGroupAdd.svelte";
  import ExhibitionAdd from "./views/ExhibitionAdd.svelte";
  import ExhibitionDetail from "./views/ExhibitionDetail.svelte";
  import ExhibitionList from "./views/ExhibitionList.svelte";
  import ExhibitionSectionList from "./views/ExhibitionSectionList.svelte";
</script>

<Route path="exhibitions/*">
  <Route path="sections/*">
    <Route path="/">
      <ExhibitionSectionList />
    </Route>
    <Route path="add">
      <ProductGroupAdd productGroupType={GroupTypeEnum.Exhibition} />
    </Route>
  </Route>
  <Route path="/">
    <ExhibitionList />
  </Route>
  <Route path="add">
    <ExhibitionAdd />
  </Route>
  <Route path=":id" let:params>
    <ExhibitionDetail id={params.id} />
  </Route>
</Route>
