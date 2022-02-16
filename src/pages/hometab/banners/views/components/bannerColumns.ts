import { TopBanner } from "@api";
import { DataTableColumn } from "@app/components/DataTable/helpers";

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
    key: "exhibition_id",
    name: "기획전",
    type: "link",
    get: (data) => `/exhibitions/${data.exhibition_id}`,
  },
];