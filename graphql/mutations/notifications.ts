import { gql } from "@apollo/client";

export const ADD_NOTIFICATION = gql`
  mutation addNotification($input: NotificationInput!) {
    addNotification(input: $input) {
        id
        status
        notificationtype
        title
        message
        deviceids
        navigateto
        referenceid
        scheduleddate
        created
        updated
    }
  }
`;

export const EDIT_NOTIFICATION = gql`
  mutation editNotification($input: NotificationInput!) {
    editNotification(input: $input) {
        id
        status
        notificationtype
        title
        message
        deviceids
        navigateto
        referenceid
        scheduleddate
        created
        updated
    }
  }
`;

export const SEND_NOTIFICATION = gql`
  mutation sendNotification($id: String!) {
    sendNotification(id: $id)
  }
`;