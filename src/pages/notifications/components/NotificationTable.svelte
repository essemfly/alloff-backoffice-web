<script lang="ts">
  import { DataTable, Tag, Button } from "carbon-components-svelte";
  import Send16 from "carbon-icons-svelte/lib/Send16";
  import type { DataTableHeader } from "carbon-components-svelte/types/DataTable/DataTable";
  import { DateTime } from "luxon";
  import {
    getNotificationBadgeColor,
    getNotificationTypeLabel,
    getNotificationStatusColor,
    getNotificationStatusLabel,
  } from "../../../helpers/notification";
  import type { Notification } from "../../../api";
  import { NotificationsApi } from "../../../api";

  export let notifications: Notification[] = [];
  export let isMobile: boolean = false;

  const api = new NotificationsApi();

  const mobileHeaders: DataTableHeader[] = [
    { key: "orderstatus", value: "상태" },
    { key: "payment.buyername", value: "구매자" },
  ];

  const headers: DataTableHeader[] = [
    { key: "notificationtype", value: "타입" },
    { key: "status", value: "상태" },
    {
      key: "title",
      value: "제목",
    },
    { key: "deviceids", value: "대상 인원" },
    { key: "message", value: "내용" },
    { key: "created", value: "생성일자" },
    { key: "sended", value: "발송시각" },
    { key: "send", value: "발송" },
  ];

  const sendNotification = async (notificationId: string) => {
    try {
      await api.notificationsSendCreate({
        sendNotificationRequest: {
          ids: notificationId,
          is_test: false,
        },
      });
    } catch (e: any) {
      console.log(e);
    } finally {
      window.location.href = "../notifications";
    }
  };
</script>

<DataTable
  expandable
  headers={isMobile ? mobileHeaders : headers}
  rows={notifications}
  size="short"
  sortable
>
  <span slot="cell" let:cell let:row>
    {#if cell.key == "notificationtype"}
      <Tag type={getNotificationBadgeColor(cell.value)}
        >{getNotificationTypeLabel(cell.value)}</Tag
      >
    {:else if cell.key == "status"}
      <Tag type={getNotificationStatusColor(cell.value)}
        >{getNotificationStatusLabel(cell.value)}</Tag
      >
    {:else if cell.key == "deviceids"}
      {cell.value.length}
    {:else if cell.key == "created"}
      {DateTime.fromISO(cell.value).setLocale("ko").toLocaleString({
        month: "short",
        day: "numeric",
        weekday: "narrow",
      })}
    {:else if cell.key == "sended"}
      {DateTime.fromISO(cell.value).setLocale("ko").toLocaleString({
        month: "short",
        day: "numeric",
        weekday: "narrow",
        hour: "numeric",
        minute: "numeric",
      })}
    {:else if cell.key == "send"}
      <Button
        on:click={() => sendNotification(row.id)}
        kind="tertiary"
        iconDescription="send"
        icon={Send16}
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
