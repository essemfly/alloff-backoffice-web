<script lang="ts">
  import {
    OrderItemList,
    OrderItemsApi,
    OrderItemStatusEnum,
  } from "@lessbutter/alloff-backoffice-api";
  import { apiConfigs } from "@app/store";
  import { ORDER_ITEM_ALL_STATUSES } from "@app/constants";
  import MediaQuery from "@app/helpers/MediaQuery.svelte";
  import { getStatusLabel } from "@app/helpers/order-item";
  import {
    Checkbox,
    DatePicker,
    DatePickerInput,
    Pagination,
    Button,
  } from "carbon-components-svelte";
  import { DateTime } from "luxon";
  import TableShortcut16 from "carbon-icons-svelte/lib/TableShortcut16";
  import { useLocation } from "svelte-navigator";
  import ExcelExportModal from "./components/ExcelExportModal.svelte";
  import OrderItemsTable from "./components/OrderItemsTable.svelte";
  import { search } from "./store";
  import CheckboxGroup from "@app/components/CheckboxGroup.svelte";

  const location = useLocation();
  const params = new URLSearchParams($location.search);
  const userId = params.get("userid");
  const alloffOrderId = params.get("allofforderid");

  let items: OrderItemList[] = [];
  let page = 1;
  let pageSize = 20;
  let totalItems = 0;

  let statuses = [...ORDER_ITEM_ALL_STATUSES];
  let exportModalOpen = false;
  const pageSizes = [20, 50, 100];
  const api = new OrderItemsApi($apiConfigs);
  const load = async (
    p: number,
    size: number,
    statuses: OrderItemStatusEnum[],
    search?: string,
  ) => {
    if (userId) {
      const res = await api.orderItemsList({ userId });
      items = res.data.results;
    } else if (alloffOrderId) {
      const res = await api.orderItemsList({ alloffOrderId });
      items = res.data.results;
    } else {
      const {
        data: { count, results },
      } = await api.orderItemsList({
        page: p,
        search,
        size,
        statuses,
      });

      totalItems = count ?? 0;
      items = results ?? [];
    }
  };

  $: load(
    page,
    pageSize,
    statuses,
    $search.trim() === "" ? undefined : $search,
  );

  const handleIsClassifiedCheck = (
    event: CustomEvent<OrderItemStatusEnum[]>,
  ) => {
    if (
      event.detail.length === checkboxOptions.length ||
      event.detail.length === 0
    ) {
      // all checked
      console.log(event.detail);
      statuses = [];
    } else {
      statuses = event.detail;
    }
  };

  const checkboxOptions = ORDER_ITEM_ALL_STATUSES.map((status) => ({
    label: getStatusLabel(status),
    value: status,
  }));
</script>

<Nav title="주문 목록">
  <MediaQuery query="(max-width: 480px)" let:matches>
    {#if userId}
      <h6>USER ID: {userId}</h6>
      <div style="height:10px;" />
    {:else if alloffOrderId}
      <h6>주문서 ID: {alloffOrderId}</h6>
      <div style="height:10px;" />
    {/if}
    {#if !userId && !alloffOrderId}
      <Button icon={TableShortcut16} on:click={() => (exportModalOpen = true)}>
        엑셀 추출
      </Button>
      <CheckboxGroup
        options={checkboxOptions}
        bind:values={statuses}
        alignment={matches ? "vertical" : "horizontal"}
      />
      <Pagination {...{ totalItems, pageSizes }} bind:page bind:pageSize />
    {/if}
    <OrderItemsTable isMobile={matches} {items} canSearch={!userId} />
  </MediaQuery>
  <ExcelExportModal {api} bind:open={exportModalOpen} />
</Nav>
