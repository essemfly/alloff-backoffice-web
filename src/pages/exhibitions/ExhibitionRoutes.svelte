<script lang="ts">
  import { Route } from "svelte-navigator";

  import { ExhibitionTypeEnum } from "@api";

  import ExhibitionAdd from "./views/ExhibitionAdd.svelte";
  import ExhibitionDetail from "./views/ExhibitionDetail.svelte";
  import ExhibitionList from "./views/ExhibitionList.svelte";
</script>

<Route path="timedeals/*">
  <Route path="/">
    <ExhibitionList type={ExhibitionTypeEnum.Timedeal} />
  </Route>
  <Route path="add">
    <ExhibitionAdd type={ExhibitionTypeEnum.Timedeal} />
  </Route>
  <Route path=":id" let:params>
    <ExhibitionDetail id={params.id} type={ExhibitionTypeEnum.Timedeal} />
  </Route>
</Route>

<Route path="groupdeals/*">
  <Route path="/">
    <ExhibitionList type={ExhibitionTypeEnum.Groupdeal} />
  </Route>
  <Route path="add">
    <ExhibitionAdd type={ExhibitionTypeEnum.Groupdeal} />
  </Route>
  <Route path=":id" let:params>
    <ExhibitionDetail id={params.id} type={ExhibitionTypeEnum.Groupdeal} />
  </Route>
</Route>

<Route path="exhibitions/*">
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
