import { ProductGroup } from "@api";
import { DataTableColumn } from "@app/components/DataTable/helpers";
import { formatDate } from "@app/helpers/date";

export const timedealColumns: DataTableColumn<ProductGroup>[] = [
  {
    key: "image_url",
    name: "이미지",
    type: "image",
  },
  {
    key: "title",
    name: "타이틀",
  },
  { key: "short_title", name: "짧은 타이틀" },
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
