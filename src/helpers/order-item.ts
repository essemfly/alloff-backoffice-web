import { DateTime } from "luxon";
import { OrderItemRetrieve, ActionTypeEnum, OrderItemStatusEnum } from "../api";

export enum OrderItemType {
  NormalOrder = "NORMAL_ORDER",
  TimedealOrder = "TIMEDEAL_ORDER",
  ExhibitionOrder = "EXHIBITION_ORDER",
  GroupdealOrder = "GROUPDEAL_ORDER",
  UnknownOrder = "UNKNOWN_ORDER",
}

export const getTypeBadgeColor = (itemType: OrderItemType) => {
  switch (itemType) {
    case OrderItemType.NormalOrder:
      return "cyan";
    case OrderItemType.ExhibitionOrder:
      return "purple";
    case OrderItemType.TimedealOrder:
      return "magenta";
    case OrderItemType.GroupdealOrder:
      return "teal";
    case OrderItemType.UnknownOrder:
      return "cool-gray";
  }
};
export const getTypeLabel = (itemType: OrderItemType) => {
  switch (itemType) {
    case OrderItemType.NormalOrder:
      return "일반";
    case OrderItemType.ExhibitionOrder:
      return "기획전";
    case OrderItemType.TimedealOrder:
      return "타임딜";
    case OrderItemType.GroupdealOrder:
      return "그룹딜";
    case OrderItemType.UnknownOrder:
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
    case OrderItemStatusEnum.DeliveryPreparing:
      return "green";
    case OrderItemStatusEnum.ForeignProductInspecting:
      return "teal";
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
      return "항공운송중";
    case OrderItemStatusEnum.DeliveryStarted:
      return "배송중";
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

const parseISODate = (isoDate: string | null | undefined) =>
  isoDate ? DateTime.fromISO(isoDate) : undefined;

export const getOrderItemTimestampByStatus = (
  status: OrderItemStatusEnum,
  item: OrderItemRetrieve,
): DateTime | undefined => {
  switch (status) {
    case OrderItemStatusEnum.PaymentFinished:
      return parseISODate(item.ordered_at);
    case OrderItemStatusEnum.ReturnRequested:
    case OrderItemStatusEnum.ExchangeRequested:
      return parseISODate(item.cancel_requested_at);
    case OrderItemStatusEnum.CancelFinished:
      return parseISODate(item.cancel_finished_at);
    case OrderItemStatusEnum.DeliveryStarted:
      return parseISODate(item.delivery_started_at);
    case OrderItemStatusEnum.DeliveryFinished:
      return parseISODate(item.delivery_finished_at);
    case OrderItemStatusEnum.ConfirmPayment:
      return parseISODate(item.confirmed_at);
    case OrderItemStatusEnum.ReturnPending:
      return parseISODate(item.return_started_at);
    case OrderItemStatusEnum.ExchangePending:
      return parseISODate(item.exchange_started_at);
    case OrderItemStatusEnum.ReturnFinished:
      return parseISODate(item.return_finished_at);
    case OrderItemStatusEnum.ExchangeFinished:
      return parseISODate(item.exchange_finished_at);
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
    case ActionTypeEnum.GeneratedReceivedItem:
      return "입고지시";
    case ActionTypeEnum.CanceledReceivedItem:
      return "입고요청취소";
    case ActionTypeEnum.ReceivedInventory:
      return "입고처리";
    case ActionTypeEnum.RevertedInventory:
      return "재고원복입고취소";
  }
};

export const getIsForeignLabel = (isForeign: boolean) =>
  isForeign ? "해외" : "국내";
export const getIsForeignBadgeColor = (isForeign: boolean) =>
  isForeign ? "magenta" : "cyan";
