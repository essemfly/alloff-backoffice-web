import { gql } from '@apollo/client';

export const CURATIONS = gql`
  query Curations {
    curations {
      id
      title
      items {
        id
        brand {
          id
          korName
          engName
          logoImgUrl
          description
          maxDiscountRate
          isOpen
        }
        img
      }
    }
  }
`;
