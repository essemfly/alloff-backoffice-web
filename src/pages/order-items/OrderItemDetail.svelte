<script lang="ts">
  import {
    OrderItemList,
    OrderItemRetrieve,
    OrderItemsApi,
  } from "@lessbutter/alloff-backoffice-api";
  import Nav from "@app/components/Nav.svelte";
  import {
    Breakpoint,
    InlineLoading,
    Tab,
    Tabs,
  } from "carbon-components-svelte";
  import { onMount } from "svelte";
  import { admin } from "../../store";
  import OrderItemSectionBasic from "./components/OrderItemSectionBasic.svelte";
  import OrderItemSectionLogs from "./components/OrderItemSectionLogs.svelte";
  import OrderItemSectionPayment from "./components/OrderItemSectionPayment.svelte";
  import OrderItemSectionPG from "./components/OrderItemSectionPG.svelte";
  import OrderItemSectionTop from "./components/OrderItemSectionTop.svelte";
  import { apiConfig } from "@app/store";

  export let idOrCode: string;

  let item: OrderItemRetrieve | undefined = undefined;
  let userItems: OrderItemList[] = [];
  let submitting = false;
  let loading = true;
  let mobile = false;
  let size: "sm" | "md" | "lg" | "xlg" | "max";

  const api = new OrderItemsApi(apiConfig);

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

  onMount(() => {
    if (idOrCode) {
      load();
    }
  });

  let selectedIndex = 0;

  $: mobile = size === "sm";
  $: pageTitle = idOrCode ? `${idOrCode} :: 주문 상세` : "주문 상세";
</script>

<Nav title={pageTitle} hidePageTitle>
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
      {#if $admin?.profile.is_admin}
        <Tab label="결제" />
        <Tab label="PG" />
        <Tab label="관리이력" />
      {/if}
      <div slot="content">
        <OrderItemSectionBasic
          {...{ item, mobile, load, api, userItems }}
          bind:submitting
        />
        {#if $admin?.profile.is_admin}
          <OrderItemSectionPayment {...{ item, load }} bind:submitting />
          <OrderItemSectionPG {item} />
          <OrderItemSectionLogs {item} />
        {/if}
      </div>
    </Tabs>
  {/if}
</Nav>

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
