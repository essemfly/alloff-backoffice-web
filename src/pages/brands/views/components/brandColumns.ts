import { Brand } from "@api";
import { DataTableColumn } from "@app/components/DataTable/helpers";

export const brandColumns: DataTableColumn<Brand>[] = [
  {
    key: "logo_image_url",
    name: "로고",
    type: "image",
  },
  {
    key: "keyname",
    name: "Keyname",
  },
  {
    key: "korname",
    name: "한글 이름",
  },
  {
    key: "is_open",
    name: "브랜드 오픈 여부",
    type: "toggle",
    get: (data) => data.is_open ?? false,
    toggleOption: {
      activeLabel: "Open",
      deactiveLabel: "Closed",
    },
  },
  {
    key: "is_popular",
    name: "인기있는 브랜드 여부",
    type: "toggle",
    get: (data) => data.is_popular ?? false,
    toggleOption: {
      activeLabel: "Yes",
      deactiveLabel: "No",
    },
  },
  {
    key: "is_hide",
    name: "숨김처리 여부",
    type: "toggle",
    get: (data) => data.is_hide ?? false,
    toggleOption: {
      activeLabel: "숨겨짐",
      deactiveLabel: "보여짐",
    },
  },
  {
    key: "in_maintenance",
    name: "임시점검 여부",
    type: "toggle",
    get: (data) => data.in_maintenance ?? false,
    toggleOption: {
      activeLabel: "임시점검 중",
      deactiveLabel: "임시점검 아님",
    },
  },
];
