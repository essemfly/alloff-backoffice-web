<script lang="ts">
  import Nav from "@app/components/Nav.svelte";
  import MediaQuery from "@app/helpers/MediaQuery.svelte";
  import { apiConfig } from "@app/store";
  import {
    ShippingNoticeList,
    ShippingNoticesApi,
  } from "@lessbutter/alloff-backoffice-api";
  import { Pagination } from "carbon-components-svelte";
  import { search } from "../store";
  import ShippingNoticeTable from "./components/ShippingNoticeTable.svelte";

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

    totalItems = count ?? 0;
    notices = results ?? [];
  };

  let page = 1;
  let pageSize = 20;
  let totalItems = 0;
  const pageSizes = [20, 50, 200];

  $: load(page, pageSize, $search);
</script>

<Nav>
  <Pagination {...{ totalItems, pageSizes }} bind:page bind:pageSize />
  <MediaQuery query="(max-width: 480px)" let:matches>
    <ShippingNoticeTable isMobile={matches} {notices} />
  </MediaQuery>
</Nav>
