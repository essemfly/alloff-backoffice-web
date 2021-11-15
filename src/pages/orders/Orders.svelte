<script lang="ts">
  import {
    Checkbox,
    DatePicker,
    DatePickerInput,
    Pagination,
  } from "carbon-components-svelte";
  import { OrderList, OrdersApi, OrderStatusEnum } from "../../api";
  import MediaQuery from "../../helpers/MediaQuery.svelte";
  import OrdersTable from "./components/OrdersTable.svelte";
  import { search } from "./store";
  import LoggedInFrame from "../common/LoggedInFrame.svelte";
  import { useLocation } from "svelte-navigator";
  import { getStatusLabel } from "../../helpers/order";
  import { DateTime } from "luxon";

  const location = useLocation();
  const params = new URLSearchParams($location.search);
  const userId = params.get("userid");

  const load = async (
    p: number,
    size: number,
    statuses: OrderStatusEnum[],
    createdGte: string,
    createdLte: string,
    search?: string
  ) => {
    if (userId) {
      const res = await api.ordersByUserList({ userId });
      orders = res.data;
    } else {
      const {
        data: { count, results },
      } = await api.ordersList({
        page: p,
        search,
        size,
        statuses,
        createdGte: DateTime.fromISO(createdGte).toISO(),
        createdLte: DateTime.fromISO(createdLte)
          .plus({ days: 1 })
          .minus({ milliseconds: 1 })
          .toISO(),
      });

      totalItems = count ?? 0;
      orders = results ?? [];
    }
  };

  const api = new OrdersApi();
  let orders: OrderList[] = [];
  let page = 1;
  let pageSize = 20;
  let totalItems = 0;
  let createdGte = DateTime.now().minus({ days: 7 }).toISO().split("T")[0];
  let createdLte = DateTime.now().toISO().split("T")[0];
  let statuses: OrderStatusEnum[] = [
    OrderStatusEnum.PaymentFinished,
    OrderStatusEnum.ProductPreparing,
    OrderStatusEnum.DeliveryPreparing,
    OrderStatusEnum.DeliveryStarted,
    OrderStatusEnum.DeliveryFinished,
    OrderStatusEnum.ConfirmPayment,
    OrderStatusEnum.CancelRequested,
    OrderStatusEnum.CancelPending,
    OrderStatusEnum.CancelFinished,
  ];
  const pageSizes = [20, 50, 100];

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
    <div style={`margin-top: 10px; margin-bottom: 5px; display: flex; align-items: center; flex-direction: ${matches ? "column" : "row"};`}>
      {#each [OrderStatusEnum.PaymentFinished, OrderStatusEnum.ProductPreparing, OrderStatusEnum.DeliveryPreparing, OrderStatusEnum.DeliveryStarted, OrderStatusEnum.DeliveryFinished, OrderStatusEnum.ConfirmPayment, OrderStatusEnum.CancelRequested, OrderStatusEnum.CancelPending, OrderStatusEnum.CancelFinished] as status}
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
    <OrdersTable isMobile={matches} {orders} canSearch={!userId} />
  </MediaQuery>
</LoggedInFrame>
