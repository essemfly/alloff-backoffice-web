<script lang="ts">
  import {
    Button,
    ComposedModal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Checkbox,
    TextInput,
    Link,
  } from "carbon-components-svelte";
  import { OrderStatusEnum } from "../../../api";

  export let changeOrderStatus: (
    status: OrderStatusEnum,
    deliveryTrackingNumber?: string,
    deliveryTrackingUrl?: string
  ) => Promise<void>;

  export let open = false;

  let deliveryTrackingNumber = "";
  let deliveryTrackingUrl = "";
  let useNaver = true;
  let valid = false;

  $: valid =
    /http[s]?:\/\/.*/gm.test(deliveryTrackingUrl) &&
    /\D+\s\d+/gm.test(deliveryTrackingNumber);

  const NAVER_URL = "https://search.naver.com/search.naver?query=";
  $: if (useNaver) {
    deliveryTrackingUrl = `https://search.naver.com/search.naver?query=${deliveryTrackingNumber}`;
  } else {
    deliveryTrackingUrl = deliveryTrackingUrl.replace(NAVER_URL, "");
  }
</script>

<ComposedModal
  bind:open
  on:submit={async () => {
    await changeOrderStatus(
      OrderStatusEnum.DeliveryStarted,
      deliveryTrackingNumber,
      deliveryTrackingUrl
    );
    open = false;
  }}
>
  <ModalHeader label="주문상태변경" title="배송 정보 입력" />
  <ModalBody hasForm>
    <div class="modal-wrapper">
      <TextInput
        labelText="송장번호"
        placeholder="우체국택배 1234567890123"
        bind:value={deliveryTrackingNumber}
        required
      />
      <Checkbox labelText="네이버 배송추적 URL 사용" bind:checked={useNaver} />
      <TextInput
        labelText="배송추적 URL"
        bind:value={deliveryTrackingUrl}
        required
      />
      <Link
        href={deliveryTrackingUrl}
        target="_blank"
        rel="noreferrer"
        disabled={!valid}>URL 테스트</Link
      >
    </div>
  </ModalBody>
  <ModalFooter
    primaryButtonText="배송 시작하기"
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
