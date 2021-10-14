/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { HomeItemType, SortingType, CommunityItemType } from "./../../../__generated-globals__/globalTypes.d";

// ====================================================
// GraphQL query operation: HomeItems
// ====================================================

export interface HomeItems_homeitems_productGroups {
  __typename: "ProductGroup";
  id: string;
  title: string;
  imgUrl: string;
  startTime: any;
  finishTime: any;
  shortTitle: string;
}

export interface HomeItems_homeitems_communityItems {
  __typename: "CommunityItem";
  name: string;
  target: string;
  targetType: CommunityItemType;
  imgUrl: string;
}

export interface HomeItems_homeitems_brands_brand {
  __typename: "Brand";
  id: string;
  korName: string;
  engName: string;
  description: string;
  maxDiscountRate: number;
  logoImgUrl: string;
  isOpen: boolean;
}

export interface HomeItems_homeitems_brands {
  __typename: "BrandItem";
  imgUrl: string;
  brand: HomeItems_homeitems_brands_brand;
}

export interface HomeItems_homeitems_products_category {
  __typename: "Category";
  id: string;
  name: string;
}

export interface HomeItems_homeitems_products_brand_sizeGuide {
  __typename: "SizeGuide";
  label: string;
  imgUrl: string;
}

export interface HomeItems_homeitems_products_brand {
  __typename: "Brand";
  id: string;
  korName: string;
  engName: string;
  logoImgUrl: string;
  description: string;
  maxDiscountRate: number;
  onPopular: boolean;
  isOpen: boolean;
  numNewProducts: number;
  sizeGuide: (HomeItems_homeitems_products_brand_sizeGuide | null)[];
}

export interface HomeItems_homeitems_products {
  __typename: "Product";
  id: string;
  category: HomeItems_homeitems_products_category;
  brand: HomeItems_homeitems_products_brand;
  name: string;
  originalPrice: number;
  discountRate: number | null;
  soldout: boolean;
  images: string[];
  discountedPrice: number | null;
  productUrl: string;
  sizeAvailable: string[];
  isNewProduct: boolean;
  cancelDescription: string[] | null;
  deliveryDescription: string[] | null;
}

export interface HomeItems_homeitems {
  __typename: "HomeItem";
  priority: number;
  title: string;
  itemType: HomeItemType;
  targetId: string;
  sorting: SortingType[] | null;
  images: string[] | null;
  productGroups: (HomeItems_homeitems_productGroups | null)[] | null;
  communityItems: (HomeItems_homeitems_communityItems | null)[] | null;
  brands: (HomeItems_homeitems_brands | null)[] | null;
  products: (HomeItems_homeitems_products | null)[] | null;
}

export interface HomeItems {
  homeitems: (HomeItems_homeitems | null)[];
}
