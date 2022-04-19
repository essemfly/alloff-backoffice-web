import { ProductInquiry } from "@lessbutter/alloff-backoffice-api";
import { formatDate } from "@app/helpers/date";
import { DataTableColumn } from "@app/components/DataTable/DataTable.svelte";

export const productInquiryColumns: DataTableColumn<ProductInquiry>[] = [
  { key: "id", name: "ID" },
  { key: "brand_keyname", name: "브랜드코드", hideMobile: true },
  {
    key: "is_pending",
    name: "상태",
    hideMobile: true,
    get: (data) => (data.is_pending ? "답변완료" : "답변대기"),
  },
  {
    key: "product_id",
    name: "제품명",
    get: ({ product }) => product.alloff_name,
    hideMobile: true,
  },
  { key: "body", name: "본문", maxLength: 50 },
  {
    key: "created_at",
    name: "일시",
    get: (data) =>
      formatDate(data.created_at, {
        month: "2-digit",
        day: "2-digit",
        weekday: "narrow",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    hideMobile: true,
  },
  {
    key: "product",
    name: "이미지",
    type: "image",
    get: ({ product }) =>
      product.thumbnail_image !== ""
        ? product.thumbnail_image
        : product.images[0],
    hideMobile: true,
  },
];
