<script lang="ts">
  import { Pagination } from "carbon-components-svelte";
  import { ShippingNotice, ShippingNoticesApi } from "../../../api";
  import MediaQuery from "../../../helpers/MediaQuery.svelte";
  import LoggedInFrame from "../../common/LoggedInFrame.svelte";
  import ShippingNoticeTable from "./components/ShippingNoticeTable.svelte";

  const api = new ShippingNoticesApi();
  let notices: ShippingNotice[] = [];

  const load = async (page: number, size: number) => {
    const {
      data: { count, results },
    } = await api.shippingNoticesList({
      page,
      size,
    });

    totalItems = count ?? 0;
    notices = results ?? [];
  };

  let page = 1;
  let pageSize = 20;
  let totalItems = 0;
  const pageSizes = [20, 50, 200];

  $: load(page, pageSize);
</script>

<LoggedInFrame>
  <Pagination {...{ totalItems, pageSizes }} bind:page bind:pageSize />
  <MediaQuery query="(max-width: 480px)" let:matches>
    <ShippingNoticeTable isMobile={matches} {notices} />
  </MediaQuery>
</LoggedInFrame>
