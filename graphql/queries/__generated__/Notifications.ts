/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Notifications
// ====================================================

export interface Notifications_notifications {
  __typename: "Notification";
  id: string;
  title: string;
  message: string;
  mobiles: (string | null)[] | null;
  deviceids: (string | null)[];
  navigateto: string;
  referenceid: string;
  scheduleddate: any;
  created: any;
  updated: any;
  Result: string | null;
}

export interface Notifications {
  notifications: (Notifications_notifications | null)[];
}
