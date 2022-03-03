<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { DataTable, Tag, Button } from "carbon-components-svelte";
  import type { DataTableHeader } from "carbon-components-svelte/types/DataTable/DataTable";
  import Send16 from "carbon-icons-svelte/lib/Send16";

  import { Noti } from "../../../../api";
  import { formatDate } from "../../../../helpers/date";
  import {
    NotificationStatus,
    NotificationStatusEnum,
    NotificationType,
    NotificationTypeEnum,
  } from "../../models/Notification";

  export const getNotificationTypeLabel = (notiType: NotificationTypeEnum) => {
    switch (notiType) {
      case NotificationTypeEnum.EventNotification:
        return NotificationType.EventNotification;
      case NotificationTypeEnum.ProductDiffNotification:
        return NotificationType.ProductDiffNotification;
      case NotificationTypeEnum.BrandNewProductNotification:
        return NotificationType.BrandNewProductNotification;
      case NotificationTypeEnum.BrandOpenNotification:
        return NotificationType.BrandOpenNotification;
      case NotificationTypeEnum.GeneralNotification:
        return NotificationType.GeneralNotification;
      case NotificationTypeEnum.TimedealOpenNotification:
        return NotificationType.TimedealOpenNotification;
      case NotificationTypeEnum.ExhibitionNotification:
        return NotificationType.ExhibitionNotification;
      default:
        return "기타";
    }
  };

  export const getNotificationBadgeColor = (notiType: NotificationTypeEnum) => {
    switch (notiType) {
      case NotificationTypeEnum.EventNotification:
        return "gray";
      case NotificationTypeEnum.ProductDiffNotification:
        return "blue";
      case NotificationTypeEnum.BrandNewProductNotification:
        return "teal";
      case NotificationTypeEnum.BrandOpenNotification:
        return "green";
      case NotificationTypeEnum.GeneralNotification:
        return "cyan";
      case NotificationTypeEnum.TimedealOpenNotification:
        return "purple";
      case NotificationTypeEnum.ExhibitionNotification:
        return "magenta";
      default:
        return "cool-gray";
    }
  };

  export const getNotificationStatusColor = (
    notiStatus: NotificationStatusEnum,
  ) => {
    switch (notiStatus) {
      case NotificationStatusEnum.Succeeded:
        return "green";
      case NotificationStatusEnum.Canceled:
        return "magenta";
      case NotificationStatusEnum.Ready:
        return "teal";
      case NotificationStatusEnum.Failed:
        return "red";
      case NotificationStatusEnum.InQueue:
        return "blue";
      default:
        return "cyan";
    }
  };

  export const getNotificationStatusLabel = (
    notiStatus: NotificationStatusEnum,
  ) => {
    switch (notiStatus) {
      case NotificationStatusEnum.Succeeded:
        return NotificationStatus.Succeeded;
      case NotificationStatusEnum.Canceled:
        return NotificationStatus.Canceled;
      case NotificationStatusEnum.Ready:
        return NotificationStatus.Ready;
      case NotificationStatusEnum.Failed:
        return NotificationStatus.Failed;
      case NotificationStatusEnum.InQueue:
        return NotificationStatus.InQueue;
      default:
        return "etc";
    }
  };

  export let notifications: Array<Noti & { id: string }> = [];

  const dispatch = createEventDispatcher();

  const headers: DataTableHeader[] = [
    { key: "noti_type", value: "타입" },
    { key: "status", value: "상태" },
    {
      key: "title",
      value: "제목",
    },
    { key: "message", value: "내용" },
    { key: "sended_at", value: "발송일시" },
    { key: "actions", value: "Actions" },
  ];

  const handleSendClick = (id: string) => () => {
    dispatch("send", { id });
  };
</script>

<DataTable expandable {headers} rows={notifications} size="short" sortable>
  <span slot="cell" let:cell let:row>
    {#if cell.key == "noti_type"}
      <Tag type={getNotificationBadgeColor(cell.value)}>
        {getNotificationTypeLabel(cell.value)}
      </Tag>
    {:else if cell.key == "status"}
      <Tag type={getNotificationStatusColor(cell.value)}>
        {getNotificationStatusLabel(cell.value)}
      </Tag>
    {:else if cell.key == "sended_at"}
      {row.status === NotificationStatusEnum.Succeeded
        ? formatDate(cell.value, {
            month: "short",
            day: "numeric",
            weekday: "narrow",
            hour: "numeric",
            minute: "numeric",
          })
        : ""}
    {:else if cell.key == "actions"}
      <Button
        on:click={handleSendClick(row.id)}
        kind="tertiary"
        iconDescription="send"
        icon={Send16}
        disabled={row.status !== NotificationStatusEnum.Ready}
      />
    {:else}{cell.value}
    {/if}
  </span>
  <div slot="expanded-row" let:row>
    <pre>
      {JSON.stringify(row, null, 2)}
    </pre>
  </div>
</DataTable>
