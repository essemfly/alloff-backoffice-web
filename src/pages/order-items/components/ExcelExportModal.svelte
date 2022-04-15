<script lang="ts">
  import { OrderItemsApi } from "@lessbutter/alloff-backoffice-api";
  import {
  ComposedModal,
  DatePicker,
  DatePickerInput,
  ModalBody,
  ModalFooter,
  ModalHeader
  } from "carbon-components-svelte";
  import FileDownload from "js-file-download";
  import { DateTime } from "luxon";
  export let open = false;
  export let api: OrderItemsApi;
  let dateFrom = DateTime.now().minus({ days: 7 }).toISO().split("T")[0];
  let dateTo = DateTime.now().toISO().split("T")[0];
  let loading = false;
  const download = () =>
    api
      .orderItemsGetOrderItemExcelRetrieve(
        {
          dateFrom: DateTime.fromISO(dateFrom).toISO(),
          dateTo: DateTime.fromISO(dateTo)
            .plus({ days: 1 })
            .minus({ milliseconds: 1 })
            .toISO(),
        },
        { responseType: "blob" },
      )
      .then((res) =>
        FileDownload(
          res.data as unknown as Blob,
          `order-items_${dateFrom}-${dateTo}.xlsx`,
        ),
      );
</script>

<ComposedModal
  bind:open
  on:submit={async () => {
    loading = true;
    await download();
    loading = false;
    open = false;
  }}
>
  <ModalHeader label="주문상태변경" title="배송 정보 입력" />
  <ModalBody style="min-height: 450px;">
    <DatePicker
      flatpickrProps={{ static: true }}
      datePickerType="range"
      bind:valueFrom={dateFrom}
      bind:valueTo={dateTo}
      dateFormat="Y-m-d"
    >
      <DatePickerInput labelText="시작일" placeholder="yyyy-mm-dd" />
      <DatePickerInput labelText="종료일" placeholder="yyyy-mm-dd" />
    </DatePicker>
  </ModalBody>
  <ModalFooter
    primaryButtonText={loading ? "다운로드중..." : "엑셀 다운로드"}
    primaryButtonDisabled={loading}
    secondaryButtonText="취소"
    on:click:button--secondary={() => {
      open = false;
    }}
  />
</ComposedModal>
