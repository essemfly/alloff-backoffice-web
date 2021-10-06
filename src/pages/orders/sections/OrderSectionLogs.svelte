<script lang="ts">
  import { TabContent } from "carbon-components-svelte";
  import { OrderRetrieve } from "../../../api";
import { toLocaleDateTime } from "../../../helpers/datetime";
  import { getLogTypeLabel, getStatusLabel } from "../../../helpers/order";
  import OrderSection from "../components/OrderSection.svelte";

  export let order: OrderRetrieve;
  let size: "sm" | "md" | "lg" | "xlg" | "max";
</script>

<TabContent style="padding: 0;">
  <OrderSection
    title="관리이력"
    menuItems={[]}
    fontSize={11}
    rows={(order.logs ?? []).map((log) => ({
      header: getLogTypeLabel(log.action_type),
      body: (() => {
        const base = `by ${log.admin.profile.name} (${log.admin.username}) at ${toLocaleDateTime(log.performed_at)}`;
        const alimtalk = log.alimtalk
          ? `[ALIMTALK: type ${log.alimtalk.alimtalk_type} requestId ${log.alimtalk.request_id}] `
          : "";
        const statusChange = log.status_change
          ? `[STATUS: ${getStatusLabel(log.status_change.status_from)} -> ${getStatusLabel(log.status_change.status_to)}] `
          : "";
        const trackingChange =
          log.status_change &&
          log.status_change.delivery_tracking_number_from !==
            log.status_change.delivery_tracking_number_to
            ? `[TRACKING: tracking ${log.status_change.delivery_tracking_number_from} -> ${log.status_change.delivery_tracking_number_to}] `
            : "";
        return statusChange + trackingChange + alimtalk + base;
      })(),
    }))}
  />
</TabContent>
