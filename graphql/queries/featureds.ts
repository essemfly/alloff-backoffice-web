import { gql } from '@apollo/client';

export const FEATUREDS = gql`
  query Featureds {
    featureds {
      id
      brand {
        id
        korName
        engName
        description
        maxDiscountRate
        logoImgUrl
        isOpen
      }
      img
    }
  }
`;
