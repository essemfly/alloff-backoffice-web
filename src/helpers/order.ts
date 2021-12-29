import { DateTime } from "luxon";
import {
  ActionTypeEnum,
  OrderRetrieve,
  OrderStatusEnum,
  OrdertypeEnum,
} from "../api";

export const getTypeLabel = (ordertype: OrdertypeEnum) => {
  switch (ordertype) {
    case OrdertypeEnum.NormalOrder:
      return "일반";
    case OrdertypeEnum.TimedealOrder:
      return "타임딜";
  }
};

export const getTypeBadgeColor = (ordertype: OrdertypeEnum) => {
  switch (ordertype) {
    case OrdertypeEnum.NormalOrder:
      return "cool-gray";
    case OrdertypeEnum.TimedealOrder:
      return "teal";
  }
};

export const getOrderTimestampByStatus = (
  orderstatus: OrderStatusEnum,
  order: OrderRetrieve,
): DateTime | undefined => {
  switch (orderstatus) {
    case OrderStatusEnum.PaymentFinished:
      return order.orderedAt ? DateTime.fromISO(order.orderedAt) : undefined;
    case OrderStatusEnum.CancelRequested:
      return order.cancelRequestedAt
        ? DateTime.fromISO(order.cancelRequestedAt)
        : undefined;
    case OrderStatusEnum.CancelFinished:
      return order.cancelFinishedAt
        ? DateTime.fromISO(order.cancelFinishedAt)
        : undefined;
    case OrderStatusEnum.DeliveryStarted:
      return order.deliveryStartedAt
        ? DateTime.fromISO(order.deliveryStartedAt)
        : undefined;
    case OrderStatusEnum.DeliveryFinished:
      return order.deliveryFinishedAt
        ? DateTime.fromISO(order.deliveryFinishedAt)
        : undefined;
    case OrderStatusEnum.ConfirmPayment:
      return order.confirmedAt
        ? DateTime.fromISO(order.confirmedAt)
        : undefined;
    default:
      return undefined;
  }
};

export const getStatusLabel = (orderstatus: OrderStatusEnum | undefined) => {
  switch (orderstatus) {
    case OrderStatusEnum.PaymentFinished:
      return "결제완료";
    case OrderStatusEnum.CancelRequested:
      return "취소요청";
    case OrderStatusEnum.CancelPending:
      return "취소진행중";
    case OrderStatusEnum.CancelFinished:
      return "취소완료";
    case OrderStatusEnum.DeliveryPreparing:
      return "배송준비";
    case OrderStatusEnum.DeliveryStarted:
      return "배송시작";
    case OrderStatusEnum.DeliveryFinished:
      return "배송종료";
    case OrderStatusEnum.ConfirmPayment:
      return "구매확정";
    case OrderStatusEnum.ProductPreparing:
      return "상품준비중";
    default:
      return "UNKNOWN";
  }
};

export const getStatusBadgeColor = (
  orderstatus: OrderStatusEnum | undefined,
) => {
  switch (orderstatus) {
    case OrderStatusEnum.PaymentFinished:
      return "gray";
    case OrderStatusEnum.ProductPreparing:
      return "blue";
    case OrderStatusEnum.DeliveryPreparing:
      return "teal";
    case OrderStatusEnum.DeliveryStarted:
      return "green";
    case OrderStatusEnum.DeliveryFinished:
      return "cyan";
    case OrderStatusEnum.ConfirmPayment:
      return "purple";
    case OrderStatusEnum.CancelRequested:
      return "magenta";
    case OrderStatusEnum.CancelPending:
      return "red";
    case OrderStatusEnum.CancelFinished:
      return "high-contrast";
    default:
      return "gray";
  }
};

export const toChangeStatusEnum = (
  status: OrderStatusEnum,
): OrderStatusEnum => {
  switch (status) {
    case OrderStatusEnum.PaymentFinished:
      return OrderStatusEnum.PaymentFinished;
    case OrderStatusEnum.ProductPreparing:
      return OrderStatusEnum.ProductPreparing;
    case OrderStatusEnum.DeliveryPreparing:
      return OrderStatusEnum.DeliveryPreparing;
    case OrderStatusEnum.DeliveryStarted:
      return OrderStatusEnum.DeliveryStarted;
    case OrderStatusEnum.DeliveryFinished:
      return OrderStatusEnum.DeliveryFinished;
    case OrderStatusEnum.ConfirmPayment:
      return OrderStatusEnum.ConfirmPayment;
    case OrderStatusEnum.CancelRequested:
      return OrderStatusEnum.CancelRequested;
    case OrderStatusEnum.CancelPending:
      return OrderStatusEnum.CancelPending;
    case OrderStatusEnum.CancelFinished:
      return OrderStatusEnum.CancelFinished;
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
  }
};
