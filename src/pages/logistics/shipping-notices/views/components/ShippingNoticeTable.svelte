<script lang="ts">
  import { debounce } from "lodash";
  import { DateTime } from "luxon";
  import {
    DataTable,
    Toolbar,
    ToolbarContent,
    ToolbarSearch,
    Button,
  } from "carbon-components-svelte";
  import type { DataTableHeader } from "carbon-components-svelte/types/DataTable/DataTable";

  import { ShippingNoticeList } from "@lessbutter/alloff-backoffice-api";
  import { getShippingNolticeStatusLabel } from "@app/helpers/shipping-notice";

  import { search } from "../../store";
  import { navigate } from "svelte-navigator";

  export let notices: ShippingNoticeList[] = [];
  export let isMobile = false;

  const mobileHeaders: DataTableHeader[] = [
    { key: "code", value: "코드" },
    { key: "status", value: "상태" },
  ];

  const headers: DataTableHeader[] = [
    { key: "id", value: "ID" },
    { key: "code", value: "코드" },
    { key: "status", value: "상태" },
    { key: "count", value: "수량" },
  ];

  const handleSearch = debounce((e) => {
    search.set(e.target.value);
  }, 300);
</script>

<DataTable
  headers={isMobile ? mobileHeaders : headers}
  rows={notices}
  sortable
  on:click:row={(e) => {
    const url = `shipping-notices/${e.detail.id}`;
    if (isMobile) {
      navigate(url);
      return;
    }
    window.open(url, "_blank");
  }}
>
  <Toolbar>
    <ToolbarContent>
      <ToolbarSearch on:input={handleSearch} />
      <Button
        on:click={(e) => {
          navigate("/logistics/shipping-notices/candidates");
        }}
      >
        출고지시서 생성
      </Button>
    </ToolbarContent>
  </Toolbar>
  <span slot="cell" let:cell let:row>
    {#if cell.key === "ordered"}
      {DateTime.fromISO(cell.value).setLocale("ko").toLocaleString({
        month: "2-digit",
        day: "2-digit",
        weekday: "narrow",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })}
    {:else if cell.key === "count"}
      {row.items.length}
    {:else if cell.key === "status"}
      {getShippingNolticeStatusLabel(cell.value)}
    {:else}{cell.value}
    {/if}
  </span>
</DataTable>
