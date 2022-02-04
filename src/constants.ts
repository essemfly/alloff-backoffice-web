import { OrderItemStatusEnum } from "./api";

export const ORDER_ITEM_ALL_STATUSES: OrderItemStatusEnum[] = [
  OrderItemStatusEnum.PaymentFinished,
  OrderItemStatusEnum.ProductPreparing,
  OrderItemStatusEnum.ForeignProductInspecting,
  OrderItemStatusEnum.ForeignDeliveryStarted,
  OrderItemStatusEnum.DeliveryPreparing,
  OrderItemStatusEnum.DeliveryStarted,
  OrderItemStatusEnum.DeliveryFinished,
  OrderItemStatusEnum.ConfirmPayment,
  OrderItemStatusEnum.ExchangeRequested,
  OrderItemStatusEnum.ExchangePending,
  OrderItemStatusEnum.ExchangeFinished,
  OrderItemStatusEnum.ReturnRequested,
  OrderItemStatusEnum.ReturnPending,
  OrderItemStatusEnum.ReturnFinished,
  OrderItemStatusEnum.CancelFinished,
];

export const ORDER_ITEM_DOMESTIC_STATUSES: OrderItemStatusEnum[] = [
  OrderItemStatusEnum.PaymentFinished,
  OrderItemStatusEnum.ProductPreparing,
  OrderItemStatusEnum.DeliveryPreparing,
  OrderItemStatusEnum.DeliveryStarted,
  OrderItemStatusEnum.DeliveryFinished,
  OrderItemStatusEnum.ConfirmPayment,
  OrderItemStatusEnum.ExchangeRequested,
  OrderItemStatusEnum.ExchangePending,
  OrderItemStatusEnum.ExchangeFinished,
  OrderItemStatusEnum.ReturnRequested,
  OrderItemStatusEnum.ReturnPending,
  OrderItemStatusEnum.ReturnFinished,
  OrderItemStatusEnum.CancelFinished,
];

export const ORDER_ITEM_FOREIGN_STATUSES: OrderItemStatusEnum[] = [
  OrderItemStatusEnum.PaymentFinished,
  OrderItemStatusEnum.ProductPreparing,
  OrderItemStatusEnum.ForeignProductInspecting,
  OrderItemStatusEnum.ForeignDeliveryStarted,
  OrderItemStatusEnum.DeliveryStarted,
  OrderItemStatusEnum.DeliveryFinished,
  OrderItemStatusEnum.ConfirmPayment,
  OrderItemStatusEnum.ExchangeRequested,
  OrderItemStatusEnum.ExchangePending,
  OrderItemStatusEnum.ExchangeFinished,
  OrderItemStatusEnum.ReturnRequested,
  OrderItemStatusEnum.ReturnPending,
  OrderItemStatusEnum.ReturnFinished,
  OrderItemStatusEnum.CancelFinished,
];
