import { OrderItemStatusEnum } from "./api";

export const ORDER_ITEM_STATUSES: OrderItemStatusEnum[] = [
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