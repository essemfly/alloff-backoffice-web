import { ItemTypeEnum } from "@api";
import { HometabItemType } from "../constants";

export function getHometabItemTypeByIndex(typeIndex: number) {
  const type = Object.keys(ItemTypeEnum)[typeIndex];
  switch (type) {
    case "Brands":
      return ItemTypeEnum.Brands;
    case "BrandExhibition":
      return ItemTypeEnum.BrandExhibition;
    case "Exhibitions":
      return ItemTypeEnum.Exhibitions;
    case "Exhibition":
      return ItemTypeEnum.Exhibition;
    case "ProductsA":
      return ItemTypeEnum.ProductsA;
    case "ProductsB":
      return ItemTypeEnum.ProductsB;
    default:
      return "알 수 없음";
  }
}

export function getHometabItemTypeLabelByIndex(typeIndex: number) {
  const type = Object.keys(ItemTypeEnum)[typeIndex];
  switch (type) {
    case ItemTypeEnum.Brands:
    case "Brands":
      return HometabItemType.Brands;
    case ItemTypeEnum.BrandExhibition:
    case "BrandExhibition":
      return HometabItemType.BrandExhibition;
    case ItemTypeEnum.Exhibitions:
    case "Exhibitions":
      return HometabItemType.Exhibitions;
    case ItemTypeEnum.Exhibition:
    case "Exhibition":
      return HometabItemType.Exhibition;
    case ItemTypeEnum.ProductsA:
    case "ProductsA":
    case ItemTypeEnum.ProductsB:
    case "ProductsB":
      return HometabItemType.Products;
    default:
      return "알 수 없음";
  }
}

export function getHometabItemTypeLabel(type: ItemTypeEnum) {
  switch (type) {
    case ItemTypeEnum.Brands:
      return HometabItemType.Brands;
    case ItemTypeEnum.BrandExhibition:
      return HometabItemType.BrandExhibition;
    case ItemTypeEnum.Exhibitions:
      return HometabItemType.Exhibitions;
    case ItemTypeEnum.Exhibition:
      return HometabItemType.Exhibition;
    case ItemTypeEnum.ProductsA:
    case ItemTypeEnum.ProductsB:
      return HometabItemType.Products;
    default:
      return "알 수 없음";
  }
}
