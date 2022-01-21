<script lang="ts">
  import {
    Checkbox,
    DatePicker,
    DatePickerInput,
    Pagination,
  } from "carbon-components-svelte";
  import MediaQuery from "../../helpers/MediaQuery.svelte";
  import OrderItemsTable from "./components/OrderItemsTable.svelte";
  import { search } from "./store";
  import LoggedInFrame from "../common/LoggedInFrame.svelte";
  import { useLocation } from "svelte-navigator";
  import { getStatusLabel } from "../../helpers/order-item";
  import { DateTime } from "luxon";
  import { OrderItemList, OrderItemsApi, OrderItemStatusEnum } from "../../api";

  const location = useLocation();
  const params = new URLSearchParams($location.search);
  const userId = params.get("userid");

  let items: OrderItemList[] = [];
  let page = 1;
  let pageSize = 20;
  let totalItems = 0;
  let createdGte = DateTime.now().minus({ days: 7 }).toISO().split("T")[0];
  let createdLte = DateTime.now().toISO().split("T")[0];
  const _statuses: OrderItemStatusEnum[] = [
    OrderItemStatusEnum.PaymentFinished,
    OrderItemStatusEnum.ProductPreparing,
    OrderItemStatusEnum.ForeignProductInspecting,
    OrderItemStatusEnum.DeliveryPreparing,
    OrderItemStatusEnum.ForeignDeliveryStarted,
    OrderItemStatusEnum.DeliveryStarted,
    OrderItemStatusEnum.DeliveryFinished,
    OrderItemStatusEnum.ConfirmPayment,
    OrderItemStatusEnum.CancelFinished,
    OrderItemStatusEnum.ExchangeRequested,
    OrderItemStatusEnum.ExchangePending,
    OrderItemStatusEnum.ExchangeFinished,
    OrderItemStatusEnum.ReturnRequested,
    OrderItemStatusEnum.ReturnPending,
    OrderItemStatusEnum.ReturnFinished,
  ];
  let statuses = [..._statuses];
  const pageSizes = [20, 50, 100];
  const api = new OrderItemsApi();
  const load = async (
    p: number,
    size: number,
    statuses: OrderItemStatusEnum[],
    createdGte: string,
    createdLte: string,
    search?: string
  ) => {
    if (userId) {
      // const res = await api.ordersByUserList({ userId });
      // orders = res.data;
    } else {
      const {
        data: { count, results },
      } = await api.orderItemsList({
        page: p,
        // search,
        size,
        statuses,
        createdGte: DateTime.fromISO(createdGte).toISO(),
        createdLte: DateTime.fromISO(createdLte)
          .plus({ days: 1 })
          .minus({ milliseconds: 1 })
          .toISO(),
      });

      totalItems = count ?? 0;
      items = results ?? [];
    }
  };

  $: load(
    page,
    pageSize,
    statuses,
    createdGte,
    createdLte,
    $search.trim() === "" ? undefined : $search
  );
</script>

<LoggedInFrame>
  <MediaQuery query="(max-width: 480px)" let:matches>
    {#if userId}
      <h6>USER ID: {userId}</h6>
      <div style="height:10px;" />
    {/if}
    {#if !userId}
      <DatePicker
        datePickerType="range"
        bind:valueFrom={createdGte}
        bind:valueTo={createdLte}
        dateFormat="Y-m-d"
      >
        <DatePickerInput labelText="시작일" placeholder="yyyy-mm-dd" />
        <DatePickerInput labelText="종료일" placeholder="yyyy-mm-dd" />
      </DatePicker>
      <div
        style={`margin-top: 10px; margin-bottom: 5px; display: flex; align-items: center; flex-direction: ${
          matches ? "column" : "row"
        };`}
      >
        {#each _statuses as status}
          <Checkbox
            labelText={getStatusLabel(status)}
            checked={statuses.includes(status)}
            on:check={(e) => {
              if (e.detail) {
                statuses = [...statuses, status];
              } else {
                statuses = statuses.filter((s) => s !== status);
              }
            }}
          />
        {/each}
      </div>
      <Pagination {...{ totalItems, pageSizes }} bind:page bind:pageSize />
    {/if}
    <OrderItemsTable isMobile={matches} {items} canSearch={!userId} />
  </MediaQuery>
</LoggedInFrame>
