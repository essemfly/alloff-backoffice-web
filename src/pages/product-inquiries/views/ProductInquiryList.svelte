<script lang="ts">
  import {
    InquiriesApi,
    ProductInquiry,
  } from "@lessbutter/alloff-backoffice-api";
  import Nav from "@app/components/Nav.svelte";
  import MediaQuery from "@app/helpers/MediaQuery.svelte";
  import {
    Checkbox,
    DatePicker,
    DatePickerInput,
    Pagination,
  } from "carbon-components-svelte";
  import { DateTime } from "luxon";
  import { search } from "../store";
  import ProductInquiryTable from "./components/ProductInquiryTable.svelte";
  import { apiConfigs } from "@app/store";

  const api = new InquiriesApi($apiConfigs);
  let inquiries: ProductInquiry[] = [];
  let dateFrom = DateTime.now().minus({ days: 7 }).toISO().split("T")[0];
  let dateTo = DateTime.now().toISO().split("T")[0];
  let isPending: boolean | undefined = undefined;

  let showPending = true;
  let showReplied = true;

  const load = async (
    p: number,
    size: number,
    dateFrom: string,
    dateTo: string,
    isPending?: boolean,
    search?: string,
  ) => {
    const {
      data: { count, results },
    } = await api.inquiriesList({
      page: p,
      search,
      size,
      isPending,
      dateFrom: DateTime.fromISO(dateFrom).toISO(),
      dateTo: DateTime.fromISO(dateTo)
        .plus({ days: 1 })
        .minus({ milliseconds: 1 })
        .toISO(),
    });

    totalItems = count ?? 0;
    inquiries = results ?? [];
  };

  let page = 1;
  let pageSize = 20;
  let totalItems = 0;
  const pageSizes = [20, 50, 100];

  $: load(
    page,
    pageSize,
    dateFrom,
    dateTo,
    (showPending && showReplied) || (!showPending && !showReplied)
      ? undefined
      : showPending,
    $search.trim() === "" ? undefined : $search,
  );
</script>

<Nav>
  <Checkbox labelText="답변대기" bind:checked={showPending} />
  <Checkbox labelText="답변완료" bind:checked={showReplied} />
  <DatePicker
    datePickerType="range"
    bind:valueFrom={dateFrom}
    bind:valueTo={dateTo}
    dateFormat="Y-m-d"
  >
    <DatePickerInput labelText="시작일" placeholder="yyyy-mm-dd" />
    <DatePickerInput labelText="종료일" placeholder="yyyy-mm-dd" />
  </DatePicker>
  <Pagination {...{ totalItems, pageSizes }} bind:page bind:pageSize />
  <MediaQuery query="(max-width: 480px)" let:matches>
    <ProductInquiryTable
      isMobile={matches}
      {inquiries}
      reload={() =>
        load(
          page,
          pageSize,
          dateFrom,
          dateTo,
          isPending,
          $search.trim() === "" ? undefined : $search,
        )}
    />
  </MediaQuery>
</Nav>
