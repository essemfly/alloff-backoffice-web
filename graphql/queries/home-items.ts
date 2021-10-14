import { gql } from "@apollo/client";

export const HOME_ITEMS = gql`
  query HomeItems {
    homeitems {
      priority
      title
      itemType
      targetId
      sorting
      images
      productGroups {
        id
        title
        imgUrl
        startTime
        finishTime
        shortTitle
      }
      communityItems {
        name
        target
        targetType
        imgUrl
      }
      brands {
        imgUrl
        brand {
          id
          korName
          engName
          description
          maxDiscountRate
          logoImgUrl
          isOpen
        }
      }
      products {
        id
        category {
          id
          name
        }
        brand {
          id
          korName
          engName
          logoImgUrl
          description
          maxDiscountRate
          onPopular
          isOpen
          numNewProducts
          sizeGuide {
            label
            imgUrl
          }
        }
        name
        originalPrice
        discountRate
        soldout
        images
        discountedPrice
        productUrl
        sizeAvailable
        isNewProduct
        cancelDescription
        deliveryDescription
      }
    }
  }
`;
