import { DateTime } from "luxon";
import {
  ActionTypeEnum,
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
  status: OrderItemStatusEnum | undefined,
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
      return "현지검수중";
    case OrderItemStatusEnum.DeliveryPreparing:
      return "배송준비중";
    case OrderItemStatusEnum.ForeignDeliveryStarted:
      return "해외배송중";
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
  item: OrderItemRetrieve,
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

export const getLogTypeLabel = (logType: ActionTypeEnum) => {
  switch (logType) {
    case ActionTypeEnum.MemoAdd:
      return "메모추가";
    case ActionTypeEnum.MemoDelete:
      return "메모삭제";
    case ActionTypeEnum.PaymentAdjustment:
      return "결제조정";
    case ActionTypeEnum.RefundUpdate:
      return "환불처리";
    case ActionTypeEnum.StatusChange:
      return "상태변경";
    case ActionTypeEnum.ReceivedItem:
      return "입고지시";
    case ActionTypeEnum.ForceReceivedItem:
      return "재입고처리";
  }
};

export const getIsForeignLabel = (isForeign: boolean) => isForeign ? "해외" : "국내";
export const getIsForeignBadgeColor = (isForeign: boolean) => isForeign ? "magenta" : "cyan";
