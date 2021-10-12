<script lang="ts">
  import {
    DataTable,
    Tag,
    Toolbar,
    ToolbarContent,
    ToolbarSearch,
    ToolbarMenu,
    ToolbarMenuItem,
    ToolbarBatchActions,
    Button,
  } from "carbon-components-svelte";
  import Save16 from "carbon-icons-svelte/lib/Save16";
  import type { DataTableHeader } from "carbon-components-svelte/types/DataTable/DataTable";
  import debounce from "lodash/debounce";
  import { DateTime } from "luxon";
  import {
    getNotificationBadgeColor,
    getNotificationTypeLabel,
    getNotificationStatusColor,
    getNotificationStatusLabel,
  } from "../../../helpers/notification";
  import type { Notification } from "../../../api";
  import { numberWithCommas } from "../../../helpers/number";

  export let notifications: Notification[] = [];
  export let isMobile: boolean = false;

  const mobileHeaders: DataTableHeader[] = [
    { key: "orderstatus", value: "상태" },
    { key: "payment.buyername", value: "구매자" },
    // { key: "created", value: "일자" },
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
    { key: "scheduleddate", value: "발송예정시각" },
    { key: "created", value: "생성일자" },
  ];

  const handleSearch = debounce((e) => {
    console.log(e);
  }, 300);
</script>

<DataTable
  expandable
  headers={isMobile ? mobileHeaders : headers}
  rows={notifications}
  size="short"
  sortable
>
  <Toolbar>
    <ToolbarBatchActions>
      <Button icon={Save16}>Save</Button>
    </ToolbarBatchActions>
    <ToolbarContent>
      <ToolbarSearch />
      <Button on:click={() => {
        console.log("HOIT")
      }}>Search</Button>
    </ToolbarContent>
  </Toolbar>
  <span slot="cell" let:cell>
    {#if cell.key == "notificationtype"}
      <Tag type={getNotificationBadgeColor(cell.value)}
        >{getNotificationTypeLabel(cell.value)}</Tag
      >
    {:else if cell.key == "status"}
      <Tag type={getNotificationStatusColor(cell.value)}
        >{getNotificationStatusLabel(cell.value)}</Tag
      >
    {:else if cell.key == "deviceids"}
      {cell.value}
    {:else if cell.key == "created"}
      {DateTime.fromISO(cell.value).setLocale("ko").toLocaleString({
        month: "short",
        day: "numeric",
        weekday: "narrow",
      })}
    {:else if cell.key == "scheduleddate"}
      {DateTime.fromISO(cell.value).setLocale("ko").toLocaleString({
        month: "short",
        day: "numeric",
        weekday: "narrow",
        hour: "numeric",
        minute: "numeric",
      })}
    {:else}{cell.value}
    {/if}
  </span>
  <div slot="expanded-row" let:row>
    <pre>
      {JSON.stringify(row, null, 2)}
    </pre>
  </div>
</DataTable>
