<script lang="ts">
  import {
    ComposedModal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    NumberInput,
  } from "carbon-components-svelte";
  import { numberWithCommas } from "../../../helpers/number";

  export let updateRefundInfo: (
    refundDeliveryPrice: number,
    refundPrice: number,
    refundAmount: number
  ) => Promise<void>;

  export let open = false;
  export let orderTotalPrice: number;
  export let paymentAdjustmentSum: number;

  export let refundDeliveryPrice: number;
  export let refundPrice: number;
  export let refundAmount: number;
  let refundFee = refundDeliveryPrice + refundPrice;
  let refundFeeRate = Math.round((1 - refundPrice / orderTotalPrice) * 100);

  let valid = false;

  $: {
    refundFee = refundDeliveryPrice + refundPrice;
    refundAmount = orderTotalPrice - refundFee;
    refundFeeRate = Math.round((1 - refundPrice / orderTotalPrice) * 100);
  }

  $: valid =
    refundFee <= orderTotalPrice && refundAmount > paymentAdjustmentSum;
</script>

<ComposedModal
  bind:open
  on:submit={async () => {
    await updateRefundInfo(refundDeliveryPrice, refundPrice, refundAmount);
    open = false;
  }}
>
  <ModalHeader label="결제정보수정" title="환불 정보 입력" />
  <ModalBody hasForm>
    <div class="modal-wrapper">
      <NumberInput
        label="취소수수료 (원)"
        bind:value={refundPrice}
        required
        min={0}
        max={orderTotalPrice}
      />
      <p>취소수수료율: {refundFeeRate}%</p>
      <NumberInput
        label="반품배송비 (원)"
        bind:value={refundDeliveryPrice}
        required
        min={0}
        max={orderTotalPrice}
      />
      <h4>취소공제액: {numberWithCommas(refundFee)}원</h4>
      <h3>환불총액: {numberWithCommas(refundAmount)}원</h3>
      {#if refundAmount <= paymentAdjustmentSum}
        <p style="color: red;">
          새로운 환불총액은 기환불총액보다 커야합니다. (기환불총액: {numberWithCommas(
            paymentAdjustmentSum
          )}원)
        </p>
      {:else if refundFee > orderTotalPrice}
        <p style="color: red;">
          공제액은 주문가액보다 작아야합니다. (주문가액: {numberWithCommas(
            orderTotalPrice
          )}원)
        </p>
      {/if}
    </div>
  </ModalBody>
  <ModalFooter
    primaryButtonText="환불정보 저장하기"
    primaryButtonDisabled={!valid}
    secondaryButtonText="취소"
    on:click:button--secondary={() => {
      open = false;
    }}
  />
</ComposedModal>

<style>
  .modal-wrapper {
    display: flex;
    flex-direction: column;
    row-gap: 15px;
  }
</style>
