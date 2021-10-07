import { DateTime } from "luxon";
import {
  ChangeStatus,
  ChangeStatusStatusEnum,
  OrderActionLogActionTypeEnum,
  OrderListOrderstatusEnum,
  OrderListOrdertypeEnum,
  OrderRetrieve,
  OrderRetrieveOrderstatusEnum,
  OrderRetrieveOrdertypeEnum,
  OrderStatusChangeLogStatusFromEnum,
  OrderStatusChangeLogStatusToEnum,
} from "../api";

export const getTypeLabel = (
  ordertype: OrderListOrdertypeEnum | OrderRetrieveOrdertypeEnum
) => {
  switch (ordertype.toString()) {
    case OrderListOrdertypeEnum.NormalOrder.toString():
      return "일반";
    case OrderListOrdertypeEnum.TimedealOrder.toString():
      return "타임딜";
  }
};

export const getTypeBadgeColor = (
  ordertype: OrderListOrdertypeEnum | OrderRetrieveOrdertypeEnum
) => {
  switch (ordertype.toString()) {
    case OrderListOrdertypeEnum.NormalOrder.toString():
      return "cool-gray";
    case OrderListOrdertypeEnum.TimedealOrder.toString():
      return "teal";
  }
};

export const getOrderTimestampByStatus = (
  orderstatus: OrderRetrieveOrderstatusEnum,
  order: OrderRetrieve
): DateTime | undefined => {
  switch (orderstatus) {
    case OrderRetrieveOrderstatusEnum.PaymentFinished:
      return order.orderedAt ? DateTime.fromISO(order.orderedAt) : undefined;
    case OrderRetrieveOrderstatusEnum.CancelRequested:
      return order.cancelRequestedAt
        ? DateTime.fromISO(order.cancelRequestedAt)
        : undefined;
    case OrderRetrieveOrderstatusEnum.CancelFinished:
      return order.cancelFinishedAt
        ? DateTime.fromISO(order.cancelFinishedAt)
        : undefined;
    case OrderRetrieveOrderstatusEnum.DeliveryStarted:
      return order.deliveryStartedAt
        ? DateTime.fromISO(order.deliveryStartedAt)
        : undefined;
    case OrderRetrieveOrderstatusEnum.DeliveryFinished:
      return order.deliveryFinishedAt
        ? DateTime.fromISO(order.deliveryFinishedAt)
        : undefined;
    case OrderRetrieveOrderstatusEnum.ConfirmPayment:
      return order.confirmedAt
        ? DateTime.fromISO(order.confirmedAt)
        : undefined;
    default:
      return undefined;
  }
};

export const getStatusLabel = (
  orderstatus:
    | OrderListOrderstatusEnum
    | OrderRetrieveOrderstatusEnum
    | OrderStatusChangeLogStatusFromEnum
    | OrderStatusChangeLogStatusToEnum
) => {
  switch (orderstatus.toString()) {
    case OrderListOrderstatusEnum.PaymentFinished.toString():
      return "결제완료";
    case OrderListOrderstatusEnum.CancelRequested.toString():
      return "취소요청";
    case OrderListOrderstatusEnum.CancelPending.toString():
      return "취소진행중";
    case OrderListOrderstatusEnum.CancelFinished.toString():
      return "취소완료";
    case OrderListOrderstatusEnum.DeliveryPreparing.toString():
      return "배송준비";
    case OrderListOrderstatusEnum.DeliveryStarted.toString():
      return "배송시작";
    case OrderListOrderstatusEnum.DeliveryFinished.toString():
      return "배송종료";
    case OrderListOrderstatusEnum.ConfirmPayment.toString():
      return "구매확정";
    case OrderListOrderstatusEnum.ProductPreparing.toString():
      return "상품준비중";
    default:
      return "기타";
  }
};

export const getStatusBadgeColor = (
  orderstatus: OrderListOrderstatusEnum | OrderRetrieveOrderstatusEnum
) => {
  switch (orderstatus.toString()) {
    case OrderListOrderstatusEnum.PaymentFinished.toString():
      return "gray";
    case OrderListOrderstatusEnum.ProductPreparing.toString():
      return "blue";
    case OrderListOrderstatusEnum.DeliveryPreparing.toString():
      return "teal";
    case OrderListOrderstatusEnum.DeliveryStarted.toString():
      return "green";
    case OrderListOrderstatusEnum.DeliveryFinished.toString():
      return "cyan";
    case OrderListOrderstatusEnum.ConfirmPayment.toString():
      return "purple";
    case OrderListOrderstatusEnum.CancelRequested.toString():
      return "magenta";
    case OrderListOrderstatusEnum.CancelPending.toString():
      return "red";
    case OrderListOrderstatusEnum.CancelFinished.toString():
      return "high-contrast";
  }
};

export const toChangeStatusEnum = (
  status: OrderRetrieveOrderstatusEnum
): ChangeStatusStatusEnum => {
  switch (status) {
    case OrderRetrieveOrderstatusEnum.PaymentFinished:
      return ChangeStatusStatusEnum.PaymentFinished;
    case OrderRetrieveOrderstatusEnum.ProductPreparing:
      return ChangeStatusStatusEnum.ProductPreparing;
    case OrderRetrieveOrderstatusEnum.DeliveryPreparing:
      return ChangeStatusStatusEnum.DeliveryPreparing;
    case OrderRetrieveOrderstatusEnum.DeliveryStarted:
      return ChangeStatusStatusEnum.DeliveryStarted;
    case OrderRetrieveOrderstatusEnum.DeliveryFinished:
      return ChangeStatusStatusEnum.DeliveryFinished;
    case OrderRetrieveOrderstatusEnum.ConfirmPayment:
      return ChangeStatusStatusEnum.ConfirmPayment;
    case OrderRetrieveOrderstatusEnum.CancelRequested:
      return ChangeStatusStatusEnum.CancelRequested;
    case OrderRetrieveOrderstatusEnum.CancelPending:
      return ChangeStatusStatusEnum.CancelPending;
    case OrderRetrieveOrderstatusEnum.CancelFinished:
      return ChangeStatusStatusEnum.CancelFinished;
  }
};

export const getLogTypeLabel = (logType: OrderActionLogActionTypeEnum) => {
  switch (logType) {
    case OrderActionLogActionTypeEnum.MemoAdd:
      return "메모추가";
    case OrderActionLogActionTypeEnum.MemoDelete:
      return "메모삭제";
    case OrderActionLogActionTypeEnum.PaymentAdjustment:
      return "결제조정";
    case OrderActionLogActionTypeEnum.RefundUpdate:
      return "환불처리";
    case OrderActionLogActionTypeEnum.StatusChange:
      return "상태변경";
  }
};
