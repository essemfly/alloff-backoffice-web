<script lang="ts">
  import { OrderItemRetrieve, OrderItemsApi, OrderItemStatusEnum } from "@api";
  import SquareTag from "@app/components/SquareTag.svelte";
  import TextCopy from "@app/components/CopyTextButton.svelte";
  import {
    ORDER_ITEM_ALL_STATUSES,
    ORDER_ITEM_DOMESTIC_STATUSES,
  } from "@app/constants";
  import { numberWithCommas } from "@app/helpers/number";
  import {
    getIsForeignBadgeColor,
    getIsForeignLabel,
    getOrderItemTimestampByStatus,
    // getOrderTimestampByStatus,
    getStatusBadgeColor,
    getStatusLabel,
    getTypeBadgeColor,
    getTypeLabel,
  } from "@app/helpers/order-item";
  import {
    Button,
    OverflowMenu,
    OverflowMenuItem,
    Tag,
  } from "carbon-components-svelte";
  import DeliveryTruck16 from "carbon-icons-svelte/lib/DeliveryTruck16";
  import { admin } from "../../../store";
  import TrackingInputModal from "../components/TrackingInputModal.svelte";

  export let item: OrderItemRetrieve;
  export let submitting: boolean;
  export let load: () => void;
  export let api: OrderItemsApi;
  export let mobile: boolean;

  let trackingModalOpen: boolean = false;
  let trackingModalStatus: OrderItemStatusEnum | undefined;

  const changeOrderItemStatus = async (
    item: OrderItemRetrieve,
    status: OrderItemStatusEnum,
    courier_id?: number,
    tracking_number?: string,
    tracking_url?: string,
  ) => {
    let confirmMessage = "로 주문상태를 변경합니다 ";
    if (status === OrderItemStatusEnum.ReturnFinished) {
      confirmMessage += `(${numberWithCommas(
        item.refund_item?.refund_amount ?? 0,
      )}원이 환불된다고 알림톡이 발송됩니다!)`;
    }
    if (!confirm(getStatusLabel(status) + confirmMessage)) return;
    submitting = true;
    try {
      await api.orderItemsChangeStatusCreate({
        id: item.id,
        changeStatusRequest: {
          status,
          courier_id,
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
    if (status === item?.order_item_status) return;
    if (
      status === OrderItemStatusEnum.DeliveryStarted ||
      status === OrderItemStatusEnum.ForeignDeliveryStarted
    ) {
      trackingModalOpen = true;
      trackingModalStatus = status;
      return;
    }
    changeOrderItemStatus(item, status);
  };

  const handleCompanyUserSetTrackingInfo = async (
    item: OrderItemRetrieve,
    courier_id: number,
    tracking_number: string,
    tracking_url?: string,
  ) => {
    try {
      await api.orderItemsSetTrackingInfoCreate({
        id: item.id,
        apiTrackingInfoRequest: {
          courier_id,
          tracking_number,
          tracking_url,
        },
      });
    } catch (e) {
      alert("운송장 등록 오류! " + e);
    } finally {
      trackingModalOpen = false;
      load();
    }
  };

  const getSourcingExcelRow = (item: OrderItemRetrieve) =>
    `${item.order.ordered_at ?? item.ordered_at ?? item.created_at}\t${
      item.brand_korname
    }\t${item.product_name}\t${item.color ?? "N/A"}\t${item.size}\t${
      item.order.payment.buyer_name
    }\t'${item.order.payment.buyer_mobile}\t${
      item.order.payment.buyer_address
    }\t'${item.order.payment.buyer_post_code}`;
</script>

<h3 class="mb10">
  <TextCopy value={item.order_item_code}>{item.order_item_code}</TextCopy>
</h3>
<h6>
  <TextCopy value={item.order.payment.buyer_name}
    >🙋‍♀️{item.order.payment.buyer_name}</TextCopy
  >
  <TextCopy value={item.product_name}>👚{item.product_name}</TextCopy>
</h6>
{#if $admin?.profile.is_admin}
  <h6>
    주문서 ID:
    <a href={`/items?allofforderid=${item.order.alloff_order_id}`}>
      {item.order.alloff_order_id}
    </a>
    <TextCopy value={item.order.alloff_order_id}>주문서 ID 복사</TextCopy>
    <TextCopy value={`/items?allofforderid=${item.order.alloff_order_id}`}
      >주문서 URL 복사</TextCopy
    >
  </h6>
  <div class="title">
    <Tag type={getIsForeignBadgeColor(item.is_foreign)}>
      {getIsForeignLabel(item.is_foreign)} 소싱
    </Tag>
    <Tag
      type={getTypeBadgeColor(item.order_item_type)}
      style="margin-left: 0px;"
    >
      {getTypeLabel(item.order_item_type)} 주문
    </Tag>
    <Tag type="cool-gray">DB #{item.id}</Tag>
    <OverflowMenu>
      <OverflowMenuItem
        on:click={() =>
          navigator.clipboard.writeText(getSourcingExcelRow(item))}
        text="해외소싱 엑셀 복사"
      />
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
{/if}

<div class:mobile-tags={mobile} class:tags={!mobile}>
  {#each item.is_foreign ? ORDER_ITEM_ALL_STATUSES : ORDER_ITEM_DOMESTIC_STATUSES as status}
    <SquareTag
      fullWidth={!mobile}
      onClick={$admin?.profile.is_admin
        ? () => handleChangeOrderStatus(status)
        : undefined}
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
      </div>
    </SquareTag>
  {/each}
</div>
<TrackingInputModal
  {...{ changeOrderItemStatus, handleCompanyUserSetTrackingInfo, item }}
  bind:open={trackingModalOpen}
  bind:status={trackingModalStatus}
/>
{#if !$admin?.profile.is_admin}
  <Button
    size="small"
    icon={DeliveryTruck16}
    on:click={() => (trackingModalOpen = true)}>배송정보 입력</Button
  >
{/if}

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
