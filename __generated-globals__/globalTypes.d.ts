/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum CommunityItemType {
  INTERNAL = "INTERNAL",
  OUTLINK = "OUTLINK",
}

export enum HomeItemType {
  BRAND = "BRAND",
  COMMUNITY = "COMMUNITY",
  IMAGE = "IMAGE",
  PRODUCT = "PRODUCT",
  TIMEDEAL = "TIMEDEAL",
}

export enum NotificationStatus {
  NOTI_CANCELED = "NOTI_CANCELED",
  NOTI_FAILED = "NOTI_FAILED",
  NOTI_READY = "NOTI_READY",
  NOTI_SUCCEEDED = "NOTI_SUCCEEDED",
}

export enum NotificationType {
  PRICE_NOTI = "PRICE_NOTI",
  SIZE_NOTI = "SIZE_NOTI",
  SOLDOUT_NOTI = "SOLDOUT_NOTI",
}

export enum SortingType {
  DISCOUNT_0_30 = "DISCOUNT_0_30",
  DISCOUNT_30_50 = "DISCOUNT_30_50",
  DISCOUNT_50_70 = "DISCOUNT_50_70",
  DISCOUNT_70_100 = "DISCOUNT_70_100",
  PRICE_ASCENDING = "PRICE_ASCENDING",
  PRICE_DESCENDING = "PRICE_DESCENDING",
}

export interface NotificationInput {
  id?: string | null;
  notificationtype: NotificationType;
  title: string;
  message: string;
  mobiles?: (string | null)[] | null;
  sendtoall?: boolean | null;
  scheduleddate: any;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
