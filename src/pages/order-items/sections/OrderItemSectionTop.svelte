<script lang="ts">
  import {
    OverflowMenu,
    OverflowMenuItem,
    Tag,
  } from "carbon-components-svelte";
  import {
    OrderItemRetrieve,
    OrderItemsApi,
    OrderItemStatusEnum,
  } from "../../../api";
  import {
    getOrderItemTimestampByStatus,
    // getOrderTimestampByStatus,
    getStatusBadgeColor,
    getStatusLabel,
    getTypeBadgeColor,
    getTypeLabel,
    // toChangeStatusEnum,
  } from "../../../helpers/order-item";
  import SquareTag from "../../../common/SquareTag.svelte";
  import TrackingInputModal from "../components/TrackingInputModal.svelte";
  import { ORDER_ITEM_STATUSES } from "../../../constants";
  export let item: OrderItemRetrieve;
  export let submitting: boolean;
  export let load: () => void;
  export let api: OrderItemsApi;
  export let mobile: boolean;

  let trackingModalOpen: boolean = false;

  const changeOrderItemStatus = async (
    status: OrderItemStatusEnum,
    delivery_tracking_number?: string,
    delivery_tracking_url?: string
  ) => {
    if (!confirm("주문상태를 변경합니다: " + getStatusLabel(status))) return;
    submitting = true;
    try {
      await api.orderItemsChangeStatusCreate({
        id: item.id.toString(),
        changeStatusRequest: {
          status,
          delivery_tracking_number,
          delivery_tracking_url,
        },
      });
    } catch (e: any) {
      console.log(e);
      alert("상태 변경 오류! " + e.response.data.message);
    } finally {
      submitting = false;
      load();
    }
  };

  const handleChangeOrderStatus = async (status: OrderItemStatusEnum) => {
    if (status === item?.order_item_status) return;
    if (status === OrderItemStatusEnum.DeliveryStarted) {
      trackingModalOpen = true;
      return;
    }
    changeOrderItemStatus(status);
  };
</script>

<h3 style="margin-bottom: 10px;">{item.order_item_code}</h3>
<h6>🙋‍♀️{item.order.user.name} 👚{item.product_name}</h6>
<div class="title">
  <Tag type={getTypeBadgeColor(item.order_item_type)} style="margin-left: 0px;"
    >{getTypeLabel(item.order_item_type)} 주문</Tag
  >
  <Tag type="cool-gray">{item.id}</Tag>
  <OverflowMenu>
    <OverflowMenuItem
      on:click={() => navigator.clipboard.writeText(item.order_item_code)}
      text="코드 복사"
    />
    <OverflowMenuItem
      on:click={() => navigator.clipboard.writeText(item.id.toString())}
      text="주문 ID 복사"
    />
    <OverflowMenuItem
      on:click={() => navigator.clipboard.writeText(window.location.href)}
      text="URL 복사"
    />
  </OverflowMenu>
</div>

<div class:mobile-tags={mobile} class:tags={!mobile}>
  {#each ORDER_ITEM_STATUSES as status}
    <SquareTag
      fullWidth={!mobile}
      onClick={() => handleChangeOrderStatus(status)}
      type={status === item.order_item_status
        ? getStatusBadgeColor(status)
        : undefined}
      ><div style="text-align: center;">
        {getStatusLabel(status)}
      </div>
      <div>
        {getOrderItemTimestampByStatus(status, item)
          ?.setLocale("ko")
          .toLocaleString({
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: false,
          }) ?? ""}
      </div></SquareTag
    >
  {/each}
</div>
<TrackingInputModal {changeOrderItemStatus} bind:open={trackingModalOpen} />

<style>
  .title {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .mobile-tags {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    margin-bottom: 20px;
  }

  .tags {
    display: flex;
    flex-direction: row;
    width: 100%;
    margin-top: 10px;
    margin-bottom: 20px;
  }
</style>
