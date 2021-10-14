/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { NotificationInput, NotificationStatus, NotificationType } from "./../../../__generated-globals__/globalTypes.d";

// ====================================================
// GraphQL mutation operation: addNotification
// ====================================================

export interface addNotification_addNotification {
  __typename: "Notification";
  id: string;
  status: NotificationStatus;
  notificationtype: NotificationType;
  title: string;
  message: string;
  deviceids: (string | null)[];
  navigateto: string;
  referenceid: string;
  scheduleddate: any;
  created: any;
  updated: any;
}

export interface addNotification {
  addNotification: addNotification_addNotification;
}

export interface addNotificationVariables {
  input: NotificationInput;
}
