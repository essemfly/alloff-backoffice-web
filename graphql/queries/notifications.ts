import { gql } from '@apollo/client';

export const Notifications = gql`
  query Notifications {
    notifications {
      id
      title
      message
      mobiles
      deviceids
      navigateto
      referenceid
      scheduleddate
      created
      updated
      Result
    }
  }
`;
