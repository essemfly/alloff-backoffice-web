/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Featureds
// ====================================================

export interface Featureds_featureds_brand {
  __typename: "Brand";
  id: string;
  korName: string;
  engName: string;
  description: string;
  maxDiscountRate: number;
  logoImgUrl: string;
  isOpen: boolean;
}

export interface Featureds_featureds {
  __typename: "FeaturedItem";
  id: string;
  brand: Featureds_featureds_brand;
  img: string;
}

export interface Featureds {
  featureds: (Featureds_featureds | null)[];
}
