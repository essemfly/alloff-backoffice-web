import { ShippingNoticeStatusEnum } from "../api";

export const getShippingNolticeStatusLabel = (
  status: ShippingNoticeStatusEnum,
): string => {
  switch (status) {
    case ShippingNoticeStatusEnum.Created:
      return "대기";
    case ShippingNoticeStatusEnum.Locked:
      return "잠김";
    case ShippingNoticeStatusEnum.PartiallyShipped:
      return "일부배송";
    case ShippingNoticeStatusEnum.Shipped:
      return "배송";
    default:
      return "UNKNOWN";
  }
};
