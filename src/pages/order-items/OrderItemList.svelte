<script lang="ts">
  import { DateTime } from "luxon";
  import { useLocation } from "svelte-navigator";
  import {
    Checkbox,
    DatePicker,
    DatePickerInput,
    Pagination,
  } from "carbon-components-svelte";

  import { OrderItemList, OrderItemsApi, OrderItemStatusEnum } from "@api";
  import { ORDER_ITEM_ALL_STATUSES } from "@app/constants";
  import MediaQuery from "@app/helpers/MediaQuery.svelte";
  import { getStatusLabel } from "@app/helpers/order-item";
  import Nav from "@app/components/Nav.svelte";

  import { search } from "./store";
  import OrderItemsTable from "./components/OrderItemsTable.svelte";

  const location = useLocation();
  const params = new URLSearchParams($location.search);
  const userId = params.get("userid");
  const alloffOrderId = params.get("allofforderid");

  let items: OrderItemList[] = [];
  let page = 1;
  let pageSize = 20;
  let totalItems = 0;
  let createdGte = DateTime.now().minus({ days: 7 }).toISO().split("T")[0];
  let createdLte = DateTime.now().toISO().split("T")[0];

  let statuses = [...ORDER_ITEM_ALL_STATUSES];
  const pageSizes = [20, 50, 100];
  const api = new OrderItemsApi();
  const load = async (
    p: number,
    size: number,
    statuses: OrderItemStatusEnum[],
    createdGte: string,
    createdLte: string,
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
        // createdGte: DateTime.fromISO(createdGte).toISO(),
        // createdLte: DateTime.fromISO(createdLte)
        //   .plus({ days: 1 })
        //   .minus({ milliseconds: 1 })
        //   .toISO(),
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
    $search.trim() === "" ? undefined : $search,
  );
</script>

<Nav>
  <MediaQuery query="(max-width: 480px)" let:matches>
    {#if userId}
      <h6>USER ID: {userId}</h6>
      <div style="height:10px;" />
    {:else if alloffOrderId}
      <h6>주문서 ID: {alloffOrderId}</h6>
      <div style="height:10px;" />
    {/if}
    {#if !userId && !alloffOrderId}
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
        {#each ORDER_ITEM_ALL_STATUSES as status}
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
</Nav>