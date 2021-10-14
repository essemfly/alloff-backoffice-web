/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ProductGroup
// ====================================================

export interface ProductGroup_productGroup_alloffproducts_brand {
  __typename: "Brand";
  id: string;
  logoImgUrl: string;
  description: string;
  korName: string;
  engName: string;
}

export interface ProductGroup_productGroup_alloffproducts_inventory {
  __typename: "Inventory";
  size: string;
  quantity: number;
}

export interface ProductGroup_productGroup_alloffproducts_instruction {
  __typename: "Instruction";
  title: string;
  thumbnail: string;
  images: string[] | null;
  description: string[] | null;
}

export interface ProductGroup_productGroup_alloffproducts_faults {
  __typename: "Faults";
  image: string | null;
  description: string;
}

export interface ProductGroup_productGroup_alloffproducts {
  __typename: "AlloffProduct";
  id: string;
  brand: ProductGroup_productGroup_alloffproducts_brand;
  name: string;
  originalPrice: number;
  discountedPrice: number;
  discountRate: number;
  images: string[];
  description: string[] | null;
  soldout: boolean;
  inventory: (ProductGroup_productGroup_alloffproducts_inventory | null)[];
  producttype: string[];
  instruction: ProductGroup_productGroup_alloffproducts_instruction;
  faults: ProductGroup_productGroup_alloffproducts_faults[] | null;
  sizeDescription: string[] | null;
  cancelDescription: string[] | null;
  deliveryDescription: string[] | null;
  productGroupId: string;
}

export interface ProductGroup_productGroup {
  __typename: "ProductGroup";
  id: string;
  title: string;
  imgUrl: string;
  startTime: any;
  finishTime: any;
  shortTitle: string;
  numAlarms: number;
  setAlarm: boolean;
  instruction: string[];
  alloffproducts: (ProductGroup_productGroup_alloffproducts | null)[];
}

export interface ProductGroup {
  productGroup: ProductGroup_productGroup;
}

export interface ProductGroupVariables {
  id: string;
}
