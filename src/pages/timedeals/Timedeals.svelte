<script lang="ts">
  import { Pagination } from "carbon-components-svelte";
  import { Timedeal, TimedealsApi } from "../../api";
  import MediaQuery from "../../helpers/MediaQuery.svelte";
  import LoggedInFrame from "../common/LoggedInFrame.svelte";
  import TimedealsTable from "./components/TimedealsTable.svelte";
  import { search } from "./store";

  const load = async (p: number, size: number, search?: string) => {
    const {
      data: { count, results },
    } = await api.timedealsList({ page: p, search, size });

    totalItems = count ?? 0;
    timedeals = results ?? [];
  };

  const api = new TimedealsApi();
  let timedeals: Timedeal[] = [];
  let page = 1;
  let pageSize = 20;
  let totalItems = 0;
  const pageSizes = [20, 50, 100];

  $: load(page, pageSize, $search.trim() === "" ? undefined : $search);
</script>

<LoggedInFrame>
  <Pagination {...{ totalItems, pageSizes }} bind:page bind:pageSize />
  <MediaQuery query="(max-width: 480px)" let:matches>
    <TimedealsTable isMobile={matches} {timedeals} />
  </MediaQuery>
</LoggedInFrame>
