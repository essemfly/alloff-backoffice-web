import { DateTime } from "luxon";
import {
  OrderItemRetrieve,
  OrderItemStatusEnum,
  OrderItemTypeEnum,
} from "../api";

export const getTypeBadgeColor = (itemType: OrderItemTypeEnum) => {
  switch (itemType) {
    case OrderItemTypeEnum.NormalOrder:
      return "cyan";
    case OrderItemTypeEnum.ExhibitionOrder:
      return "purple";
    case OrderItemTypeEnum.TimedealOrder:
      return "magenta";
    case OrderItemTypeEnum.UnknownOrder:
      return "cool-gray";
  }
};
export const getTypeLabel = (itemType: OrderItemTypeEnum) => {
  switch (itemType) {
    case OrderItemTypeEnum.NormalOrder:
      return "일반";
    case OrderItemTypeEnum.ExhibitionOrder:
      return "기획전";
    case OrderItemTypeEnum.TimedealOrder:
      return "타임딜";
    case OrderItemTypeEnum.UnknownOrder:
      return "UNKNOWN";
  }
};

export const getStatusBadgeColor = (
  status: OrderItemStatusEnum | undefined
) => {
  switch (status) {
    case OrderItemStatusEnum.Created:
    case OrderItemStatusEnum.Recreated:
    case OrderItemStatusEnum.PaymentPending:
      return "cool-gray";
    case OrderItemStatusEnum.PaymentFinished:
      return "high-contrast";
    case OrderItemStatusEnum.ProductPreparing:
    case OrderItemStatusEnum.ForeignProductInspecting:
    case OrderItemStatusEnum.DeliveryPreparing:
      return "green";
    case OrderItemStatusEnum.ForeignDeliveryStarted:
    case OrderItemStatusEnum.DeliveryStarted:
      return "cyan";
    case OrderItemStatusEnum.DeliveryFinished:
    case OrderItemStatusEnum.ConfirmPayment:
      return "blue";
    case OrderItemStatusEnum.CancelFinished:
    case OrderItemStatusEnum.ReturnRequested:
    case OrderItemStatusEnum.ReturnPending:
    case OrderItemStatusEnum.ReturnFinished:
      return "magenta";
    case OrderItemStatusEnum.ExchangeFinished:
    case OrderItemStatusEnum.ExchangeRequested:
    case OrderItemStatusEnum.ExchangePending:
      return "purple";
  }
};

export const getStatusLabel = (status: OrderItemStatusEnum | undefined) => {
  switch (status) {
    case OrderItemStatusEnum.Created:
      return "생성";
    case OrderItemStatusEnum.Recreated:
      return "재생성";
    case OrderItemStatusEnum.PaymentPending:
      return "결제대기";
    case OrderItemStatusEnum.PaymentFinished:
      return "결제완료";
    case OrderItemStatusEnum.ProductPreparing:
      return "상품준비중";
    case OrderItemStatusEnum.ForeignProductInspecting:
      return "해외검수중";
    case OrderItemStatusEnum.DeliveryPreparing:
      return "배송준비중";
    case OrderItemStatusEnum.ForeignDeliveryStarted:
      return "해외배송준비중";
    case OrderItemStatusEnum.DeliveryStarted:
      return "배송시작";
    case OrderItemStatusEnum.DeliveryFinished:
      return "배송완료";
    case OrderItemStatusEnum.ConfirmPayment:
      return "구매확정";
    case OrderItemStatusEnum.CancelFinished:
      return "취소완료";
    case OrderItemStatusEnum.ExchangeRequested:
      return "교환신청";
    case OrderItemStatusEnum.ExchangePending:
      return "교환중";
    case OrderItemStatusEnum.ExchangeFinished:
      return "교환완료";
    case OrderItemStatusEnum.ReturnRequested:
      return "반품신청";
    case OrderItemStatusEnum.ReturnPending:
      return "반품중";
    case OrderItemStatusEnum.ReturnFinished:
      return "반품완료";
    default:
      return "UNKNOWN";
  }
};

export const getOrderItemTimestampByStatus = (
  status: OrderItemStatusEnum,
  item: OrderItemRetrieve
): DateTime | undefined => {
  switch (status) {
    case OrderItemStatusEnum.PaymentFinished:
      return item.ordered_at ? DateTime.fromISO(item.ordered_at) : undefined;
    case OrderItemStatusEnum.ReturnRequested:
    case OrderItemStatusEnum.ExchangeRequested:
      return item.cancel_requested_at
        ? DateTime.fromISO(item.cancel_requested_at)
        : undefined;
    case OrderItemStatusEnum.CancelFinished:
      return item.cancel_finished_at
        ? DateTime.fromISO(item.cancel_finished_at)
        : undefined;
    case OrderItemStatusEnum.DeliveryStarted:
      return item.delivery_started_at
        ? DateTime.fromISO(item.delivery_started_at)
        : undefined;
    case OrderItemStatusEnum.DeliveryFinished:
      return item.delivery_finished_at
        ? DateTime.fromISO(item.delivery_finished_at)
        : undefined;
    case OrderItemStatusEnum.ConfirmPayment:
      return item.confirmed_at ? DateTime.fromISO(item.confirmed_at) : undefined;
    default:
      return undefined;
  }
};
