import { OrderOrderstatusEnum, OrderOrdertypeEnum } from "../api";

export const getTypeLabel = (ordertype: OrderOrdertypeEnum) => {
  switch (ordertype) {
    case OrderOrdertypeEnum.NormalOrder:
      return "일반";
    case OrderOrdertypeEnum.TimedealOrder:
      return "타임딜";
  }
};

export const getTypeBadgeColor = (ordertype: OrderOrdertypeEnum) => {
  switch (ordertype) {
    case OrderOrdertypeEnum.NormalOrder:
      return "cool-gray";
    case OrderOrdertypeEnum.TimedealOrder:
      return "teal";
  }
};

export const getStatusLabel = (orderstatus: OrderOrderstatusEnum) => {
  switch (orderstatus) {
    case OrderOrderstatusEnum.PaymentFinished:
      return "결제완료";
    case OrderOrderstatusEnum.CancelRequested:
      return "취소요청";
    case OrderOrderstatusEnum.CancelPending:
      return "취소진행중";
    case OrderOrderstatusEnum.CancelFinished:
      return "취소완료";
    case OrderOrderstatusEnum.DeliveryPreparing:
      return "배송준비";
    case OrderOrderstatusEnum.DeliveryStarted:
      return "배송시작";
    case OrderOrderstatusEnum.DeliveryFinished:
      return "배송종료";
    case OrderOrderstatusEnum.ConfirmPayment:
      return "구매확정";
    case OrderOrderstatusEnum.ProductPreparing:
      return "상품준비중";
    default:
      return "기타";
  }
};

export const getStatusBadgeColor = (orderstatus: OrderOrderstatusEnum) => {
  switch (orderstatus) {
    case OrderOrderstatusEnum.PaymentFinished:
      return "gray";
    case OrderOrderstatusEnum.ProductPreparing:
      return "blue";
    case OrderOrderstatusEnum.DeliveryPreparing:
      return "teal";
    case OrderOrderstatusEnum.DeliveryStarted:
      return "green";
    case OrderOrderstatusEnum.DeliveryFinished:
      return "cyan";
    case OrderOrderstatusEnum.ConfirmPayment:
      return "purple";
    case OrderOrderstatusEnum.CancelRequested:
      return "magenta";
    case OrderOrderstatusEnum.CancelPending:
      return "red";
    case OrderOrderstatusEnum.CancelFinished:
      return "high-contrast";
  }
};
