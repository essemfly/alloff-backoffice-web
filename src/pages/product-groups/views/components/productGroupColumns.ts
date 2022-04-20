import { ProductGroup } from "@lessbutter/alloff-backoffice-api";
import { DataTableColumn } from "@app/components/DataTable/DataTable.svelte";
import { formatDate } from "@app/helpers/date";

export const productGroupColumns: DataTableColumn<ProductGroup>[] = [
  {
    key: "short_title",
    name: "짧은 타이틀",
  },
  {
    key: "title",
    name: "타이틀",
  },
  {
    key: "start_time",
    name: "시작일시",
    get: (data) => formatDate(data.start_time),
  },
  {
    key: "finish_time",
    name: "종료일시",
    get: (data) => formatDate(data.finish_time),
  },
];
