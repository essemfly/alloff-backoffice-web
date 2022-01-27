<script lang="ts">
  import { TabContent } from "carbon-components-svelte";
  import { ActionTypeEnum, OrderItemRetrieve } from "../../../api";
  import { toLocaleDateTime } from "../../../helpers/datetime";
  import { getLogTypeLabel, getStatusLabel } from "../../../helpers/order-item";
  import InfoSection from "../../common/InfoSection.svelte";

  export let item: OrderItemRetrieve;
</script>

<TabContent style="padding: 0;">
  <InfoSection
    title="관리이력"
    menuItems={[]}
    fontSize={11}
    rows={item.logs.map((log) => ({
      header: getLogTypeLabel(log.action_type),
      body: (() => {
        const base = `by ${log.admin.profile.name} (${
          log.admin.username
        }) at ${toLocaleDateTime(log.performed_at)}`;
        const refund =
          log.action_type === ActionTypeEnum.RefundUpdate && log.refund_update
            ? `[REFUND: REFUND ${log.refund_update.refund_amount} / DEDUCT delivery ${log.refund_update.refund_delivery_price}] `
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
        const receivedItem =
          (log.action_type === ActionTypeEnum.GeneratedReceivedItem ||
          log.action_type === ActionTypeEnum.ForceGeneratedReceivedItem)
            ? `[입고지시서: ${log.detail}] `
            : "";
        return statusChange + receivedItem +  refund + trackingChange + alimtalk + memo + base;
      })(),
    }))}
  />
</TabContent>
