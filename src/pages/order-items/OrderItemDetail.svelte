<script lang="ts">
  import {
    Breakpoint,
    InlineLoading,
    Tab,
    Tabs,
  } from "carbon-components-svelte";
  import { OrderItemList, OrderItemRetrieve, OrderItemsApi } from "../../api";
  import LoggedInFrame from "../common/LoggedInFrame.svelte";
  import OrderItemSectionBasic from "./sections/OrderItemSectionBasic.svelte";
  import OrderItemSectionTop from "./sections/OrderItemSectionTop.svelte";
  import OrderItemSectionLogs from "./sections/OrderItemSectionLogs.svelte";

  export let idOrCode: string;

  let item: OrderItemRetrieve | undefined = undefined;
  let userItems: OrderItemList[] = [];
  let submitting = false;
  let loading = true;
  let mobile = false;
  let size: "sm" | "md" | "lg" | "xlg" | "max";

  const api = new OrderItemsApi();

  const load = async () => {
    loading = true;
    const { data } = await api.orderItemsRetrieve({ id: idOrCode });
    item = data;

    userItems = (
      await api.orderItemsList({
        userId: item.order.user_id,
      })
    ).data.results;

    loading = false;
  };

  $: mobile = size === "sm";
  $: {
    console.log(idOrCode);
    if (idOrCode) {
      load();
    }
  }

  let selectedIndex = 0;
</script>

<LoggedInFrame>
  {#if loading || submitting || !item}
    <div class="overlay">
      <div>
        <InlineLoading
          description={loading ? "Fetching order..." : "Updating order..."}
        />
      </div>
    </div>
  {:else}
    <Breakpoint bind:size />
    <OrderItemSectionTop {...{ item, load, api, mobile }} bind:submitting />
    <Tabs bind:selected={selectedIndex}>
      <Tab label="기본정보" />
      <Tab label="관리이력" />
      <!-- <Tab label="결제" /> -->
      <!-- <Tab label="PG" /> -->
      <div slot="content">
        <OrderItemSectionBasic
          {...{ item, mobile, load, api, userItems }}
          bind:submitting
        />
        <OrderItemSectionLogs {item} />
        <!--
        <OrderSectionPayment {...{ order, api, load }} bind:submitting />
        <OrderSectionPg {order} />
        -->
      </div>
    </Tabs>
  {/if}
</LoggedInFrame>

<style>
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
  }
</style>
