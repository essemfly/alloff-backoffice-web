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
    refundFee: number,
    refundAmount: number,
  ) => Promise<void>;

  export let open = false;
  export let totalAmount: number;

  export let refundFee: number;
  export let refundAmount: number;

  export let formRefundFee: number = refundFee;
  export let formRefundAmount: number = totalAmount;

  let refundFeeRate = Math.round((1 - formRefundFee / totalAmount) * 100);

  let valid = false;

  $: {
    formRefundFee = totalAmount - formRefundAmount;
    refundFeeRate = Math.round((1 - formRefundAmount / totalAmount) * 100);
  }

  $: valid = formRefundAmount <= totalAmount && formRefundAmount > refundAmount;
</script>

<ComposedModal
  bind:open
  on:submit={async () => {
    await updateRefundInfo(formRefundFee, formRefundAmount);
    open = false;
  }}
>
  <ModalHeader label="결제정보수정" title="환불 정보 입력" />
  <ModalBody hasForm>
    <div class="modal-wrapper">
      <NumberInput
        label="환불총액 (원)"
        bind:value={formRefundAmount}
        required
        min={0}
        max={totalAmount}
      />
      <h5>
        취소수수료: {numberWithCommas(formRefundFee)}원 ({refundFeeRate}%)
      </h5>
      {#if formRefundAmount <= refundAmount}
        <p style="color: red;">
          환불총액을 줄일 수는 없습니다. (기존 환불총액: {numberWithCommas(
            refundAmount,
          )}원)
        </p>
      {:else if formRefundAmount > totalAmount}
        <p style="color: red;">
          주문가액보다 더 많이 환불할 수 없습니다. (주문가액: {numberWithCommas(
            totalAmount,
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
