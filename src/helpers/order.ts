import { DateTime } from "luxon";
import {
  ActionTypeEnum,
  OrderRetrieve,
  OrderstatusEnum,
  OrdertypeEnum,
  StatusEnum,
  StatusFromEnum,
  StatusToEnum,
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
  orderstatus: OrderstatusEnum,
  order: OrderRetrieve
): DateTime | undefined => {
  switch (orderstatus) {
    case OrderstatusEnum.PaymentFinished:
      return order.orderedAt ? DateTime.fromISO(order.orderedAt) : undefined;
    case OrderstatusEnum.CancelRequested:
      return order.cancelRequestedAt
        ? DateTime.fromISO(order.cancelRequestedAt)
        : undefined;
    case OrderstatusEnum.CancelFinished:
      return order.cancelFinishedAt
        ? DateTime.fromISO(order.cancelFinishedAt)
        : undefined;
    case OrderstatusEnum.DeliveryStarted:
      return order.deliveryStartedAt
        ? DateTime.fromISO(order.deliveryStartedAt)
        : undefined;
    case OrderstatusEnum.DeliveryFinished:
      return order.deliveryFinishedAt
        ? DateTime.fromISO(order.deliveryFinishedAt)
        : undefined;
    case OrderstatusEnum.ConfirmPayment:
      return order.confirmedAt
        ? DateTime.fromISO(order.confirmedAt)
        : undefined;
    default:
      return undefined;
  }
};

export const getStatusLabel = (
  orderstatus: OrderstatusEnum | StatusFromEnum | StatusToEnum
) => {
  switch (orderstatus.toString()) {
    case OrderstatusEnum.PaymentFinished.toString():
      return "결제완료";
    case OrderstatusEnum.CancelRequested.toString():
      return "취소요청";
    case OrderstatusEnum.CancelPending.toString():
      return "취소진행중";
    case OrderstatusEnum.CancelFinished.toString():
      return "취소완료";
    case OrderstatusEnum.DeliveryPreparing.toString():
      return "배송준비";
    case OrderstatusEnum.DeliveryStarted.toString():
      return "배송시작";
    case OrderstatusEnum.DeliveryFinished.toString():
      return "배송종료";
    case OrderstatusEnum.ConfirmPayment.toString():
      return "구매확정";
    case OrderstatusEnum.ProductPreparing.toString():
      return "상품준비중";
    default:
      return "기타";
  }
};

export const getStatusBadgeColor = (orderstatus: OrderstatusEnum) => {
  switch (orderstatus) {
    case OrderstatusEnum.PaymentFinished:
      return "gray";
    case OrderstatusEnum.ProductPreparing:
      return "blue";
    case OrderstatusEnum.DeliveryPreparing:
      return "teal";
    case OrderstatusEnum.DeliveryStarted:
      return "green";
    case OrderstatusEnum.DeliveryFinished:
      return "cyan";
    case OrderstatusEnum.ConfirmPayment:
      return "purple";
    case OrderstatusEnum.CancelRequested:
      return "magenta";
    case OrderstatusEnum.CancelPending:
      return "red";
    case OrderstatusEnum.CancelFinished:
      return "high-contrast";
  }
};

export const toChangeStatusEnum = (status: OrderstatusEnum): StatusEnum => {
  switch (status) {
    case OrderstatusEnum.PaymentFinished:
      return StatusEnum.PaymentFinished;
    case OrderstatusEnum.ProductPreparing:
      return StatusEnum.ProductPreparing;
    case OrderstatusEnum.DeliveryPreparing:
      return StatusEnum.DeliveryPreparing;
    case OrderstatusEnum.DeliveryStarted:
      return StatusEnum.DeliveryStarted;
    case OrderstatusEnum.DeliveryFinished:
      return StatusEnum.DeliveryFinished;
    case OrderstatusEnum.ConfirmPayment:
      return StatusEnum.ConfirmPayment;
    case OrderstatusEnum.CancelRequested:
      return StatusEnum.CancelRequested;
    case OrderstatusEnum.CancelPending:
      return StatusEnum.CancelPending;
    case OrderstatusEnum.CancelFinished:
      return StatusEnum.CancelFinished;
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
