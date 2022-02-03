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
    getIsForeignBadgeColor,
    getIsForeignLabel,
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
  import {
    ORDER_ITEM_ALL_STATUSES,
    ORDER_ITEM_DOMESTIC_STATUSES,
  } from "../../../constants";
import { numberWithCommas } from "../../../helpers/number";
  export let item: OrderItemRetrieve;
  export let submitting: boolean;
  export let load: () => void;
  export let api: OrderItemsApi;
  export let mobile: boolean;

  let trackingModalOpen: boolean = false;

  const changeOrderItemStatus = async (
    item: OrderItemRetrieve,
    status: OrderItemStatusEnum,
    tracking_number?: string,
    tracking_url?: string,
  ) => {
    let confirmMessage = "로 주문상태를 변경합니다 ";
    if (status === OrderItemStatusEnum.ReturnFinished) {
      confirmMessage += `(${
        numberWithCommas(item.refund_item?.refund_amount ?? 0)
      }원이 환불된다고 알림톡이 발송됩니다!)`;
    }
    if (!confirm( getStatusLabel(status) + confirmMessage)) return;
    submitting = true;
    try {
      await api.orderItemsChangeStatusCreate({
        id: item.id,
        changeStatusRequest: {
          status,
          tracking_number,
          tracking_url,
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
    console.log({ status });
    if (status === item?.order_item_status) return;
    if (
      status === OrderItemStatusEnum.DeliveryStarted ||
      status === OrderItemStatusEnum.ForeignDeliveryStarted
    ) {
      trackingModalOpen = true;
      return;
    }
    changeOrderItemStatus(item, status);
  };
</script>

<h3 style="margin-bottom: 10px;">{item.order_item_code}</h3>
<h6>🙋‍♀️{item.order.user.name} 👚{item.product_name}</h6>
<div class="title">
  <Tag type={getIsForeignBadgeColor(item.is_foreign)}
    >{getIsForeignLabel(item.is_foreign)} 소싱</Tag
  >
  <Tag type={getTypeBadgeColor(item.order_item_type)} style="margin-left: 0px;"
    >{getTypeLabel(item.order_item_type)} 주문</Tag
  >
  <Tag type="cool-gray">DB #{item.id}</Tag>
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
  {#each item.is_foreign ? ORDER_ITEM_ALL_STATUSES : ORDER_ITEM_DOMESTIC_STATUSES as status}
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
