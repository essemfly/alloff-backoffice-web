<script lang="ts">
  import { Button,TabContent } from "carbon-components-svelte";
  import Wallet16 from "carbon-icons-svelte/lib/Wallet16";
  import { OrderItemRetrieve,OrderItemsApi } from "../../../api";
  import { numberWithCommas } from "../../../helpers/number";
  import InfoSection from "../../common/InfoSection.svelte";
  import RefundModal from "../components/RefundModal.svelte";

  export let item: OrderItemRetrieve;

  export let submitting: boolean;
  export let load: () => void;
  const api = new OrderItemsApi();

  let refundModalOpen = false;
  let adjustPaymentModalOpen = false;

  const updateRefundInfo = async (refundFee: number, refundAmount: number) => {
    submitting = true;
    await api.orderItemsUpdateRefundCreate({
      id: item.id,
      updateRefundRequest: {
        refund_amount: refundAmount,
        refund_fee: refundFee,
      },
    });
    submitting = false;
    load();
  };

  // const adjustPayment = async (
  //   reason: string,
  //   method: MethodEnum,
  //   bank_account_info?: string
  // ) => {
  //   if (refundableAmount <= 0) return;
  //   submitting = true;
  //   try {
  //     await api.ordersAddPaymentAdjustmentCreate({
  //       id: order.id,
  //       addPaymentAdjustmentRequest: {
  //         amount: refundableAmount,
  //         method,
  //         reason,
  //         bank_account_info,
  //       },
  //     });
  //   } catch (e: any) {
  //     alert("결제 조정 중 오류가 발생했습니다: " + e.response.data.message);
  //   }
  //   submitting = false;
  //   load();
  // };

  // const paymentAdjustmentSum = order.payment_adjustments
  //   ? order.payment_adjustments.reduce((prev, curr) => prev + curr.amount, 0)
  //   : 0;
  // const orderBalance = order.totalprice - paymentAdjustmentSum;
  // const refundableAmount =
  //   (order.refund?.refundamount ?? 0) - paymentAdjustmentSum;
</script>

<TabContent style="padding: 0;">
  <div class="buttons">
    <Button
      kind="tertiary"
      icon={Wallet16}
      size="small"
      on:click={() => (refundModalOpen = true)}>환불정보 입력</Button
    >
    <!-- {#if order.refund}
      <Button
        disabled={refundableAmount <= 0}
        kind="danger-tertiary"
        icon={Run16}
        size="small"
        on:click={() => (adjustPaymentModalOpen = true)}>환불 실행</Button
      >
    {/if} -->
  </div>
  {#if item.refund_item}
    <InfoSection
      title="환불 실행 정보"
      rows={[
        {
          header: "주문가액",
          body: `${numberWithCommas(item.total_amount)}원`,
        },
        {
          header: "환불금액",
          body: `${numberWithCommas(item.refund_item.refund_amount)}원`,
        },
        {
          header: "환불수수료",
          body: `${numberWithCommas(item.refund_item.refund_fee ?? 0)}원`,
        },
      ]}
    />
  {/if}
  <!-- {#if order.payment_adjustments && order.payment_adjustments.length > 0}
    <InfoSection
      title={`결제조정내역 (총액: ${numberWithCommas(paymentAdjustmentSum)}원)`}
      rows={order.payment_adjustments.map((adj, i) => ({
        header: `#${i + 1}`,
        body: `${numberWithCommas(adj.amount)}원 (잔액: ${numberWithCommas(
          adj.previous_balance,
        )} -> ${numberWithCommas(adj.resulting_balance)}) 실행: ${
          adj.admin.profile.name
        }`,
      }))}
    />
  {/if} -->
  {#if item.order.payment}
    <InfoSection
      title="결제정보"
      rows={[
        {
          header: "단건 결제 금액",
          body: `${numberWithCommas(item.total_amount)}원`,
        },
        {
          header: "주문서 결제 금액",
          body: `${numberWithCommas(item.order.payment.amount ?? 0)}원`,
        },
        { header: "결제 ID", body: item.order.payment.imp_uid ?? "" },
      ]}
    />
  {/if}
  <RefundModal
    bind:open={refundModalOpen}
    {...{
      updateRefundInfo,
      totalAmount: item.total_amount,
      refundFee: item.refund_item?.refund_fee ?? 0,
      refundAmount: item.refund_item?.refund_amount ?? 0,
    }}
  />
  <!-- {#if item.refund_item}
    <AdjustPaymentModal
      bind:open={adjustPaymentModalOpen}
      {...{
        adjustPayment,
        amount: refundableAmount,
      }}
    />
  {/if} -->
</TabContent>

<style>
  .buttons {
    margin-top: 20px;
  }
</style>
