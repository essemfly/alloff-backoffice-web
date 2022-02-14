<script lang="ts">
  import { TabContent } from "carbon-components-svelte";

  import { ActionTypeEnum, OrderItemRetrieve } from "@api";

  import { toLocaleDateTime } from "@app/helpers/datetime";
  import { getLogTypeLabel, getStatusLabel } from "@app/helpers/order-item";
  import InfoSection from "./InfoSection.svelte";

  export let item: OrderItemRetrieve;
</script>

<TabContent style="padding: 0;">
  <InfoSection
    title="관리이력"
    menuItems={[]}
    fontSize={11}
    rows={item.logs.map((log) => ({
      header: getLogTypeLabel(log.action_type) ?? "정의되지 않은 액션",
      body: (() => {
        const base = `by ${log.admin.profile.name} (${
          log.admin.username
        }) at ${toLocaleDateTime(log.created_at)}`;
        const refund =
          log.action_type === ActionTypeEnum.RefundUpdate && log.refund_update
            ? `[REFUND: ${log.refund_update.refund_amount}원 환불 (환불수수료: ${log.refund_update.refund_fee}원)] `
            : "";
        const memo =
          log.action_type === ActionTypeEnum.MemoAdd ||
          log.action_type === ActionTypeEnum.MemoDelete
            ? `[MEMO: ${log.detail ?? ""}]  `
            : "";
        const alimtalk = log.alimtalk
          ? `[ALIMTALK: type ${log.alimtalk.alimtalk_type} requestId ${log.alimtalk.request_id}] `
          : "";
        const statusChange = log.status_change
          ? `[STATUS: ${getStatusLabel(
              log.status_change.status_from,
            )} -> ${getStatusLabel(log.status_change.status_to)}] `
          : "";
        const trackingChange =
          log.status_change &&
          log.status_change.tracking_number_from !==
            log.status_change.tracking_number_to
            ? `[TRACKING: tracking ${log.status_change.tracking_number_from} -> ${log.status_change.tracking_number_to}] `
            : "";
        const generatedReceived =
          log.action_type === ActionTypeEnum.GeneratedReceivedItem
            ? `[입고지시 - ${
                log.received_item?.is_force ? "강제재입고" : "상태변경입고"
              }: ${log.detail}] `
            : "";
        const canceledReceived =
          log.action_type === ActionTypeEnum.CanceledReceivedItem
            ? `[입고요청취소: ${log.detail}] `
            : "";
        const receivedInventory =
          log.action_type === ActionTypeEnum.ReceivedInventory
            ? `[입고처리: ${log.detail} / 재고 코드: ${log.inventory?.inventory_code}] `
            : "";
        const revertedInventory =
          log.action_type === ActionTypeEnum.RevertedInventory
            ? `[재고원복입고취소: ${log.detail}] `
            : "";

        const paymentAdjustment =
          log.action_type === ActionTypeEnum.PaymentAdjustment
            ? `[결제조정: ${log.detail}] `
            : "";
        return (
          statusChange +
          generatedReceived +
          canceledReceived +
          receivedInventory +
          revertedInventory +
          refund +
          trackingChange +
          alimtalk +
          memo +
          paymentAdjustment +
          base
        );
      })(),
    }))}
  />
</TabContent>
