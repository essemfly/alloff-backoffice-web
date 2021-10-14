/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Curations
// ====================================================

export interface Curations_curations_items_brand {
  __typename: "Brand";
  id: string;
  korName: string;
  engName: string;
  logoImgUrl: string;
  description: string;
  maxDiscountRate: number;
  isOpen: boolean;
}

export interface Curations_curations_items {
  __typename: "CurationItem";
  id: string;
  brand: Curations_curations_items_brand;
  img: string;
}

export interface Curations_curations {
  __typename: "Curation";
  id: string;
  title: string;
  items: Curations_curations_items[];
}

export interface Curations {
  curations: (Curations_curations | null)[];
}
