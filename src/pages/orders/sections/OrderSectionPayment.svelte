<script lang="ts">
  import { Button, TabContent } from "carbon-components-svelte";
  import {
    AddPaymentAdjustmentMethodEnum,
    OrderRetrieve,
    OrdersApi,
  } from "../../../api";
  import { numberWithCommas } from "../../../helpers/number";
  import OrderSection from "../components/OrderSection.svelte";
  import RefundModal from "../components/RefundModal.svelte";
  import Wallet16 from "carbon-icons-svelte/lib/Wallet16";
  import Run16 from "carbon-icons-svelte/lib/Run16";
  import AdjustPaymentModal from "../components/AdjustPaymentModal.svelte";

  export let order: OrderRetrieve;
  export let api: OrdersApi;

  export let submitting: boolean;
  export let load: () => void;

  let refundModalOpen = false;
  let adjustPaymentModalOpen = false;

  const updateRefundInfo = async (
    refundPrice: number,
    refundDeliveryPrice: number,
    refundAmount: number
  ) => {
    submitting = true;
    await api.ordersUpdateRefund(order.id, {
      refund_amount: refundAmount,
      refund_delivery_price: refundDeliveryPrice,
      refund_price: refundPrice,
    });
    submitting = false;
    load();
  };

  const adjustPayment = async (
    reason: string,
    method: AddPaymentAdjustmentMethodEnum,
    bank_account_info?: string
  ) => {
    if (refundableAmount <= 0) return;
    submitting = true;
    await api.ordersAddPaymentAdjustment(order.id, {
      amount: refundableAmount,
      method,
      reason,
      bank_account_info,
    });
    submitting = false;
    load();
  };

  const paymentAdjustmentSum = order.payment_adjustments
    ? order.payment_adjustments.reduce((prev, curr) => prev + curr.amount, 0)
    : 0;
  const orderBalance = order.totalprice - paymentAdjustmentSum;
  const refundableAmount =
    (order.refund?.refundamount ?? 0) - paymentAdjustmentSum;
</script>

<TabContent style="padding: 0;">
  <div class="buttons">
    <Button
      kind="tertiary"
      icon={Wallet16}
      size="small"
      on:click={() => (refundModalOpen = true)}>환불정보 입력</Button
    >
    {#if order.refund}
      <Button
        disabled={refundableAmount <= 0}
        kind="danger-tertiary"
        icon={Run16}
        size="small"
        on:click={() => (adjustPaymentModalOpen = true)}>환불 실행</Button
      >
    {/if}
  </div>
  {#if order.refund}
    <OrderSection
      title="환불 실행 정보"
      rows={[
        {
          header: "설정된 환불총액",
          body: `${numberWithCommas(order.refund.refundamount)}원`,
        },
        {
          header: "기환불 총액",
          body: `${numberWithCommas(paymentAdjustmentSum)}원`,
        },
        {
          header: "환불실행 가능금액",
          body: `${numberWithCommas(refundableAmount)}원`,
        },
        { header: "주문가액", body: `${numberWithCommas(order.totalprice)}원` },
        { header: "현재 잔고", body: `${numberWithCommas(orderBalance)}원` },
        {
          header: "실행 후 잔고",
          body: `${numberWithCommas(
            order.totalprice - order.refund.refundamount
          )}원`,
        },
      ]}
    />
    <OrderSection
      title="환불정보"
      rows={[
        {
          header: "주문가액",
          body: `${numberWithCommas(order.totalprice)}원`,
        },
        {
          header: "취소수수료",
          body: `${numberWithCommas(order.refund.refundprice)}원`,
        },
        {
          header: "반품배송비",
          body: `${numberWithCommas(order.refund.refunddeliveryprice)}원`,
        },
        {
          header: "환불총액",
          body: `${numberWithCommas(
            order.refund.refundamount
          )}원 (총 ${numberWithCommas(
            order.refund.refundprice + order.refund.refunddeliveryprice
          )} 공제)`,
        },
        // {
        //   header: "환불 후 잔액",
        //   body: `${numberWithCommas(
        //     order.totalprice - order.refund.refundamount
        //   )}원`,
        // },
      ]}
    />
  {/if}
  {#if order.payment_adjustments && order.payment_adjustments.length > 0}
    <OrderSection
      title={`결제조정내역 (총액: ${numberWithCommas(paymentAdjustmentSum)}원)`}
      rows={order.payment_adjustments.map((adj, i) => ({
        header: `#${i + 1}`,
        body: `${numberWithCommas(adj.amount)}원 (잔액: ${numberWithCommas(
          adj.previous_balance
        )} -> ${numberWithCommas(adj.resulting_balance)}) 실행: ${
          adj.admin.profile.name
        }`,
      }))}
    />
  {/if}
  {#if order.payment}
    <OrderSection
      title="결제정보"
      menuItems={[
        {
          text: "결제 ID 복사",
          onClick: () => navigator.clipboard.writeText(order.payment.id),
        },
      ]}
      rows={[
        {
          header: "금액",
          body: `${numberWithCommas(order.payment.amount)}원`,
        },
        { header: "결제 ID", body: order.payment.id },
      ]}
    />
  {/if}
  <RefundModal
    bind:open={refundModalOpen}
    {...{
      updateRefundInfo,
      paymentAdjustmentSum,
      orderTotalPrice: order.totalprice,
      refundPrice: order.refund?.refundprice ?? 0,
      refundDeliveryPrice: order.refund?.refunddeliveryprice ?? 0,
      refundAmount: order.refund?.refundamount ?? order.totalprice,
    }}
  />
  {#if order.refund}
    <AdjustPaymentModal
      bind:open={adjustPaymentModalOpen}
      {...{
        adjustPayment,
        amount: refundableAmount,
      }}
    />
  {/if}
</TabContent>

<style>
  .buttons {
    margin-top: 20px;
  }
</style>
