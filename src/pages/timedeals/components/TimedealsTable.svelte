<script lang="ts">
  import {
    DataTable,
    Tag,
    Toolbar,
    ToolbarContent,
    ToolbarSearch,
  } from "carbon-components-svelte";
  import type { DataTableHeader } from "carbon-components-svelte/types/DataTable/DataTable";
  import debounce from "lodash/debounce";
  import { DateTime } from "luxon";
  import type { Timedeal } from "../../../api";
  import { getStatusBadgeColor, getStatusLabel } from "../../../helpers/order";
  import { search } from "../../orders/store";

  export let timedeals: Timedeal[] = [];
  export let isMobile: boolean = false;

  const mobileHeaders: DataTableHeader[] = [
    { key: "title", value: "제목" },
    { key: "starttime", value: "시작시간" },
  ];

  const headers: DataTableHeader[] = [
    { key: "title", value: "제목" },
    {
      key: "starttime",
      value: "시작시간",
    },
    { key: "finishtime", value: "종료시간" },
    { key: "numalarms", value: "알람신청" },
  ];

  const handleSearch = debounce((e) => {
    search.set(e.target.value);
  }, 300);
</script>

<DataTable
  headers={isMobile ? mobileHeaders : headers}
  rows={timedeals}
  sortable
  on:click:row={(e) => {
    const url = `/timedeals/${e.detail.id}`;
    if (isMobile) {
      window.location.href = url;
      return;
    }
    window.open(url, "_blank");
  }}
>
  <Toolbar>
    <ToolbarContent>
      <ToolbarSearch on:input={handleSearch} />
    </ToolbarContent>
  </Toolbar>
  <span slot="cell" let:cell let:row>
    {#if cell.key == "orderstatus"}
      <Tag type={getStatusBadgeColor(cell.value)}
        >{getStatusLabel(cell.value)}</Tag
      >
    {:else if cell.key.includes("time")}
      {DateTime.fromISO(cell.value).setLocale("ko").toLocaleString({
        month: "2-digit",
        day: "2-digit",
        weekday: "narrow",
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
      })}
    {:else}{cell.value}
    {/if}
  </span>
</DataTable>
