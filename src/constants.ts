import { OrderItemStatusEnum } from "./api";

export const ORDER_ITEM_ALL_STATUSES: OrderItemStatusEnum[] = [
    OrderItemStatusEnum.PaymentFinished,
    OrderItemStatusEnum.ProductPreparing,
    OrderItemStatusEnum.ForeignProductInspecting,
    OrderItemStatusEnum.DeliveryPreparing,
    OrderItemStatusEnum.ForeignDeliveryStarted,
    OrderItemStatusEnum.DeliveryStarted,
    OrderItemStatusEnum.DeliveryFinished,
    OrderItemStatusEnum.ConfirmPayment,
    OrderItemStatusEnum.CancelFinished,
    OrderItemStatusEnum.ExchangeRequested,
    OrderItemStatusEnum.ExchangePending,
    OrderItemStatusEnum.ExchangeFinished,
    OrderItemStatusEnum.ReturnRequested,
    OrderItemStatusEnum.ReturnPending,
    OrderItemStatusEnum.ReturnFinished,
  ];

export const ORDER_ITEM_DOMESTIC_STATUSES: OrderItemStatusEnum[] = [
    OrderItemStatusEnum.PaymentFinished,
    OrderItemStatusEnum.ProductPreparing,
    OrderItemStatusEnum.DeliveryPreparing,
    OrderItemStatusEnum.DeliveryStarted,
    OrderItemStatusEnum.DeliveryFinished,
    OrderItemStatusEnum.ConfirmPayment,
    OrderItemStatusEnum.CancelFinished,
    OrderItemStatusEnum.ExchangeRequested,
    OrderItemStatusEnum.ExchangePending,
    OrderItemStatusEnum.ExchangeFinished,
    OrderItemStatusEnum.ReturnRequested,
    OrderItemStatusEnum.ReturnPending,
    OrderItemStatusEnum.ReturnFinished,
  ];