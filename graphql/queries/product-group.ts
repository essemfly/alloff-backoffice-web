import { gql } from "@apollo/client";

export const PRODUCT_GROUP = gql`
  query ProductGroup($id: String!) {
    productGroup(id: $id) {
      id
      title
      imgUrl
      startTime
      finishTime
      shortTitle
      numAlarms
      setAlarm
      instruction
      alloffproducts {
        id
        brand {
          id
          logoImgUrl
          description
          korName
          engName
        }
        name
        originalPrice
        discountedPrice
        discountRate
        images
        description
        soldout
        inventory {
          size
          quantity
        }
        producttype
        instruction {
          title
          thumbnail
          images
          description
        }
        faults {
          image
          description
        }
        sizeDescription
        cancelDescription
        deliveryDescription
        productGroupId
      }
    }
  }
`;
