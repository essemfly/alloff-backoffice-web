export enum NotificationType {
  GeneralNotification = "일반 푸시",
  ExhibitionNotification = "기획전/타임딜/그룹딜 오픈 푸시",
  TimedealOpenNotification = "타임딜 오픈 푸시",
  EventNotification = "이벤트 푸시",
  ProductDiffNotification = "상품가격 푸시",
  BrandNewProductNotification = "브랜드 새 상품 푸시",
  BrandOpenNotification = "브랜드 오픈 푸시",
}

export enum NotificationTypeEnum {
  GeneralNotification = "GENERAL_NOTIFICATION",
  ExhibitionNotification = "EXHIBITION_NOTIFICATION",
  TimedealOpenNotification = "TIMEDEAL_OPEN_NOTIFICATION",
  EventNotification = "EVENT_NOTIFICATION",
  ProductDiffNotification = "PRODUCT_DIFF_NOTIFICATION",
  BrandNewProductNotification = "BRAND_NEW_PRODUCT_NOTIFICATION",
  BrandOpenNotification = "BRAND_OPEN_NOTIFICATION",
}

export enum NotificationStatus {
  Succeeded = "Succeeded",
  Canceled = "Canceled",
  Ready = "Ready",
  Failed = "Failed",
  InQueue = "Pending",
}

export enum NotificationStatusEnum {
  Succeeded = "SUCCEEDED",
  Canceled = "CANCELED",
  Ready = "READY",
  Failed = "FAILED",
  InQueue = "PENDING",
}
