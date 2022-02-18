export enum HometabItemType {
  BrandExhibition = "브랜드 기획전",
  Brands = "브랜드 세일",
  Exhibitions = "기획전 모음",
  Exhibition = "기획전 C",
  Products = "큐레이션",
  // todo: remove this temp
  ProductsA = "카테고리 큐레이션",
  ProductsB = "브랜드 큐레이션",
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
