import { ProductGroup, ItemTypeEnum } from "@api";
import { DataTableColumn } from "@app/components/DataTable/helpers";
import { formatDate } from "@app/helpers/date";

export const timedealColumns: DataTableColumn<ProductGroup>[] = [
  {
    key: "image_url",
    name: "배경 이미지",
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
  {
    key: "reference",
    name: "관련",
    type: "link",
    get: (data) => {
      const { params, path } = data.reference;
      switch (data.item_type) {
        case ItemTypeEnum.Exhibition:
          return `/exhibitions/${params}`;
        case ItemTypeEnum.Exhibitions: // 기획전 모음
          return "";
        default:
          return `/${path}/${params}`;
      }
    },
  },
];
