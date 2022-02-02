<script lang="ts">
  import { Pagination } from "carbon-components-svelte";
  import { ShippingNoticeList, ShippingNoticesApi } from "../../../api";
  import MediaQuery from "../../../helpers/MediaQuery.svelte";
  import LoggedInFrame from "../../common/LoggedInFrame.svelte";
  import ShippingNoticeTable from "./components/ShippingNoticeTable.svelte";
  import { search } from "./store";

  const api = new ShippingNoticesApi();
  let notices: ShippingNoticeList[] = [];

  const load = async (page: number, size: number, search: string) => {
    const {
      data: { count, results },
    } = await api.shippingNoticesList({
      page,
      size,
      search,
    });

    totalItems = count ?? 0;
    notices = results ?? [];
  };

  let page = 1;
  let pageSize = 20;
  let totalItems = 0;
  const pageSizes = [20, 50, 200];

  $: load(page, pageSize, $search);
</script>

<LoggedInFrame>
  <Pagination {...{ totalItems, pageSizes }} bind:page bind:pageSize />
  <MediaQuery query="(max-width: 480px)" let:matches>
    <ShippingNoticeTable isMobile={matches} {notices} />
  </MediaQuery>
</LoggedInFrame>
