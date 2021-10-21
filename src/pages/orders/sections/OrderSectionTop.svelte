<script lang="ts">
  import {
    OverflowMenu,
    OverflowMenuItem,
    Tag,
  } from "carbon-components-svelte";
  import { OrderRetrieve, OrderStatusEnum, OrdersApi } from "../../../api";
  import {
    getOrderTimestampByStatus,
    getStatusBadgeColor,
    getStatusLabel,
    getTypeBadgeColor,
    getTypeLabel,
    toChangeStatusEnum,
  } from "../../../helpers/order";
  import SquareTag from "../../../common/SquareTag.svelte";
  import TrackingInputModal from "../components/TrackingInputModal.svelte";
  export let order: OrderRetrieve;
  export let submitting: boolean;
  export let load: () => void;
  export let api: OrdersApi;
  export let mobile: boolean;

  let trackingModalOpen: boolean = false;

  const statuses = [
    OrderStatusEnum.PaymentFinished,
    OrderStatusEnum.ProductPreparing,
    OrderStatusEnum.DeliveryPreparing,
    OrderStatusEnum.DeliveryStarted,
    OrderStatusEnum.DeliveryFinished,
    OrderStatusEnum.CancelRequested,
    OrderStatusEnum.CancelPending,
    OrderStatusEnum.CancelFinished,
    OrderStatusEnum.ConfirmPayment,
  ];

  const changeOrderStatus = async (
    status: OrderStatusEnum,
    delivery_tracking_number?: string,
    delivery_tracking_url?: string
  ) => {
    if (!confirm("주문상태를 변경합니다: " + getStatusLabel(status))) return;
    submitting = true;
    try {
      await api.ordersChangeStatusCreate({
        id: order.id,
        changeStatusRequest: {
          status: toChangeStatusEnum(status),
          delivery_tracking_number,
          delivery_tracking_url,
        },
      });
    } catch (e: any) {
      alert("상태 변경 오류! " + e.response.data.message);
    } finally {
      submitting = false;
      load();
    }
  };

  const handleChangeOrderStatus = async (status: OrderStatusEnum) => {
    if (status === order?.orderstatus) return;
    if (status === OrderStatusEnum.DeliveryStarted) {
      trackingModalOpen = true;
      return;
    }
    changeOrderStatus(status);
  };
</script>

<div class="title">
  <Tag type={getTypeBadgeColor(order.ordertype)} style="margin-left: 0px;"
    >{getTypeLabel(order.ordertype)} 주문</Tag
  >
  <OverflowMenu>
    <OverflowMenuItem
      on:click={() => navigator.clipboard.writeText(order.id)}
      text="주문번호 복사"
    />
    <OverflowMenuItem
      on:click={() => navigator.clipboard.writeText(window.location.href)}
      text="URL 복사"
    />
  </OverflowMenu>
</div>
<h5 style="margin-bottom: 10px;">{order.id}</h5>
<div class:mobile-tags={mobile} class:tags={!mobile}>
  {#each statuses as status}
    <SquareTag
      fullWidth={!mobile}
      onClick={() => handleChangeOrderStatus(status)}
      type={status === order.orderstatus
        ? status === OrderStatusEnum.PaymentFinished
          ? "high-contrast"
          : getStatusBadgeColor(status)
        : undefined}
      ><div style="text-align: center;">
        {getStatusLabel(status)}
      </div>
      <div>
        {getOrderTimestampByStatus(status, order)
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
<TrackingInputModal {changeOrderStatus} bind:open={trackingModalOpen} />

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
