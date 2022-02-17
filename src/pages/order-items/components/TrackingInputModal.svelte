<script lang="ts">
  import {
  Courier,
  CouriersApi,
  OrderItemRetrieve,
  OrderItemStatusEnum
  } from "@api";
  import {
  Checkbox,
  ComposedModal,
  Dropdown,
  Link,
  ModalBody,
  ModalFooter,
  ModalHeader,
  TextInput
  } from "carbon-components-svelte";
  import { onMount } from "svelte";
  import { admin } from "../../../store";

  export let changeOrderItemStatus: (
    item: OrderItemRetrieve,
    status: OrderItemStatusEnum,
    courier_id?: number,
    tracking_number?: string,
    tracking_url?: string,
  ) => Promise<void>;

  export let handleCompanyUserSetTrackingInfo: (
    item: OrderItemRetrieve,
    courier_id: number,
    tracking_number: string,
    tracking_url?: string,
  ) => Promise<void>;

  export let item: OrderItemRetrieve;
  export let status: OrderItemStatusEnum | undefined = undefined;
  export let open = false;

  let couriers: Courier[] = [];
  let selectedCourierIndex = 0;
  let selectedCourier: Courier | undefined = undefined;
  $: {
    selectedCourier = couriers[selectedCourierIndex];
  }
  onMount(async () => {
    const courierApi = new CouriersApi();
    const res = await courierApi.couriersList();
    couriers = res.data;
  });

  let deliveryTrackingNumber = "";
  let deliveryTrackingUrl = "";
  let useManualTrackingUrl = false;

  let valid = false;
  $: valid =
    deliveryTrackingNumber.trim() !== "" &&
    (!useManualTrackingUrl || /http[s]?:\/\/.*/gm.test(deliveryTrackingUrl));
</script>

<ComposedModal
  bind:open
  on:close={() => {
    status = undefined;
  }}
  on:submit={async () => {
    if (!valid || !selectedCourier) return;

    if ($admin?.profile.is_admin) {
      if (!status) return;
      await changeOrderItemStatus(
        item,
        status,
        selectedCourier.id,
        deliveryTrackingNumber,
        useManualTrackingUrl ? deliveryTrackingUrl : undefined,
      );
    } else {
      await handleCompanyUserSetTrackingInfo(
        item,
        selectedCourier.id,
        deliveryTrackingNumber,
        useManualTrackingUrl ? deliveryTrackingUrl : undefined,
      );
    }
    window.location.reload();
  }}
>
  <ModalHeader label="주문상태변경" title="배송 정보 입력" />
  <ModalBody hasForm>
    <div class="modal-body">
      <div>
        <Dropdown
          titleText="택배사"
          items={couriers.map(({ id, name }) => ({
            id: id.toString(),
            text: name,
          }))}
          bind:selectedIndex={selectedCourierIndex}
        />
        <TextInput
          labelText="송장번호"
          placeholder="송장번호만 입력해주세요"
          bind:value={deliveryTrackingNumber}
          required
          disabled={!selectedCourier}
        />
        {#if useManualTrackingUrl}
          <TextInput
            labelText="배송추적 URL"
            bind:value={deliveryTrackingUrl}
            disabled={!selectedCourier}
            required
          />
        {/if}
      </div>
      <div>
        {#if $admin?.profile.is_admin}
          <Checkbox
            labelText="수동 배송추적 URL (기본값 미사용시 - 예: 퀵서비스)"
            bind:checked={useManualTrackingUrl}
          />
          <br />
        {/if}
        <Link
          href={useManualTrackingUrl
            ? deliveryTrackingUrl
            : selectedCourier?.tracking_url_base + deliveryTrackingNumber}
          target="_blank"
          rel="noreferrer"
          disabled={!valid}
          >URL 테스트
        </Link>
      </div>
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
  .modal-body {
    min-height: 300px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
</style>
