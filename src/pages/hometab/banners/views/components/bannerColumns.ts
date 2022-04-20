import { TopBanner } from "@lessbutter/alloff-backoffice-api";
import { DataTableColumn } from "@app/components/DataTable/DataTable.svelte";

export const bannerColumns: DataTableColumn<TopBanner>[] = [
  {
    key: "banner_image",
    name: "이미지",
    type: "image",
  },
  {
    key: "title",
    name: "타이틀",
  },
  {
    key: "subtitle",
    name: "서브타이틀",
  },
  {
    key: "is_live",
    name: "활성화 여부",
    type: "toggle",
    get: (data) => data.is_live,
  },
  {
    key: "exhibition_id",
    name: "기획전",
    type: "link",
    get: (data) => `/exhibitions/${data.exhibition_id}`,
  },
];
