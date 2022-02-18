export enum HometabItemType {
  BrandExhibition = "브랜드 기획전",
  Brands = "브랜드 세일",
  Exhibitions = "기획전 모음",
  Exhibition = "기획전 C",
  // Products = "큐레이션",
  // todo: remove this temp
  ProductsCategories = "카테고리 큐레이션",
  ProductsBrands = "브랜드 큐레이션",
}

export enum HometabSortingOption {
  PriceAscending = "가격 오름차순",
  PriceDescending = "가격 내림차순",
  Discount030 = "DISCOUNT_0_30",
  Discount3050 = "DISCOUNT_30_50",
  Discount5070 = "DISCOUNT_50_70",
  Discount70100 = "DISCOUNT_70_100",
  DiscountrateAscending = "할인율 오름차순",
  DiscountrateDescending = "할인율 내림차순",
}

export interface HometabBasic {
  title: string;
  description: string;
  start_time: string;
  finish_time: string;
  weight: number;
  // back_image_url: string;
}

export interface HometabBrandExhibition {
  brand_keyname: string;
  exhibition_id: string;
}

export interface HometabBrands {
  brand_keynames: string[];
}

export interface HometabExhibitions {
  exhibition_ids: string[];
}

export interface HometabExhibition {
  exhibition_id: string;
}
