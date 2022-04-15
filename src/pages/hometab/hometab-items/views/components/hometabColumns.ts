import { HomeTab } from "@lessbutter/alloff-backoffice-api";
import { DataTableColumn } from "@app/components/DataTable/helpers";
import { formatDate } from "@app/helpers/date";
import { getHometabItemTypeLabelByIndex } from "../../commands/helpers";

export const hometabColumns: DataTableColumn<HomeTab>[] = [
  {
    key: "item_type",
    name: "종류",
    get: (data) => {
      return getHometabItemTypeLabelByIndex(
        data.item_type as unknown as number,
      );
    },
  },

  {
    key: "back_image_url",
    name: "배경 이미지",
    type: "image",
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
  {
    key: "is_live",
    name: "활성화 여부",
    type: "toggle",
    get: (data) => data.is_live,
  },
  {
    key: "weight",
    name: "정렬",
    type: "weight",
    get: (data) => data.weight,
  },
  // {
  //   key: "reference",
  //   name: "관련",
  //   type: "link",
  //   get: (data) => {
  //     const { params, path } = data.reference;
  //     switch (data.item_type) {
  //       case ItemTypeEnum.Exhibition:
  //         return `/product-groups/${params}`;
  //       case ItemTypeEnum.Exhibitions: // 기획전 모음
  //       case ItemTypeEnum.Brands:
  //         return "";
  //       default:
  //         return `/${path}/${params}`;
  //     }
  //   },
  // },
];
