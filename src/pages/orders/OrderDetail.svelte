<script lang="ts">
  import {
    Breakpoint,
    InlineLoading,
    Tab,
    Tabs,
  } from "carbon-components-svelte";
  import { Configuration, OrderRetrieve, OrdersApi } from "../../api";
  import OrderSectionBasic from "./sections/OrderSectionBasic.svelte";
  import OrderSectionLogs from "./sections/OrderSectionLogs.svelte";
  import OrderSectionPayment from "./sections/OrderSectionPayment.svelte";
  import OrderSectionPg from "./sections/OrderSectionPG.svelte";
  import OrderSectionTop from "./sections/OrderSectionTop.svelte";
  import LoggedInFrame from "../common/LoggedInFrame.svelte";
  import { onMount } from "svelte";

  export let orderId: string;

  let order: OrderRetrieve | undefined = undefined;
  let submitting = false;
  let loading = true;
  let mobile = false;
  let size: "sm" | "md" | "lg" | "xlg" | "max";

  const api = new OrdersApi();

  const load = async () => {
    loading = true;
    const { data } = await api.ordersRetrieve(orderId);
    order = data;
    loading = false;
  };

  $: mobile = size === "sm";
  $: {
    if (orderId) {
      load();
    }
  }

  let selectedIndex = 0;
</script>

<LoggedInFrame>
  {#if loading || submitting || !order}
    <div class="overlay">
      <div>
        <InlineLoading
          description={loading ? "Fetching order..." : "Updating order..."}
        />
      </div>
    </div>
  {:else}
    <Breakpoint bind:size />
    <OrderSectionTop {...{ order, load, api, mobile }} bind:submitting />
    <Tabs bind:selected={selectedIndex}>
      <Tab label="기본정보" />
      <Tab label="결제" />
      <Tab label="PG" />
      <Tab label="관리이력" />
      <div slot="content">
        <OrderSectionBasic {...{ order, mobile, load, api }} bind:submitting />
        <OrderSectionPayment {...{ order, api, load }} bind:submitting />
        <OrderSectionPg {order} />
        <OrderSectionLogs {order} />
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
