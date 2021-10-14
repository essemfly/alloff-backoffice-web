/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { NotificationInput, NotificationStatus, NotificationType } from "./../../../__generated-globals__/globalTypes.d";

// ====================================================
// GraphQL mutation operation: editNotification
// ====================================================

export interface editNotification_editNotification {
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

export interface editNotification {
  editNotification: editNotification_editNotification;
}

export interface editNotificationVariables {
  input: NotificationInput;
}
