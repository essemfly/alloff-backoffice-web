<script lang="ts">
  import { Pagination } from "carbon-components-svelte";

  import {
    ShippingNoticeList,
    ShippingNoticesApi,
  } from "@lessbutter/alloff-backoffice-api";
  import MediaQuery from "@app/helpers/MediaQuery.svelte";
  import Nav from "@app/components/Nav.svelte";

  import ShippingNoticeTable from "./components/ShippingNoticeTable.svelte";
  import { search } from "../store";
  import { apiConfig } from "@app/store";

  const api = new ShippingNoticesApi(apiConfig);
  let notices: ShippingNoticeList[] = [];

  const load = async (page: number, size: number, search: string) => {
    const {
      data: { count, results },
    } = await api.shippingNoticesList({
      page,
      size,
      search,
    });

    totalCount = count ?? 0;
    notices = results ?? [];
  };

  let page = 1;
  let pageSize = 20;
  let totalCount = 0;
  const pageSizes = [20, 50, 200];

  $: load(page, pageSize, $search);
</script>

<Nav>
  <Pagination {...{ totalCount, pageSizes }} bind:page bind:pageSize />
  <MediaQuery query="(max-width: 480px)" let:matches>
    <ShippingNoticeTable isMobile={matches} {notices} />
  </MediaQuery>
</Nav>
