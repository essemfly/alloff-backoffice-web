import { ItemTypeEnum, OptionsEnum } from "@api";
import { HometabItemType } from "../constants";

export function getHometabItemTypeByIndex(typeIndex: number) {
  const type = Object.keys(ItemTypeEnum)[typeIndex];
  return ItemTypeEnum[type as keyof typeof ItemTypeEnum];
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
      return HometabItemType.ProductsA;
    case ItemTypeEnum.ProductsB:
    case "ProductsB":
      return HometabItemType.ProductsB;
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
      return HometabItemType.ProductsA;
    case ItemTypeEnum.ProductsB:
      return HometabItemType.ProductsB;
    default:
      return "알 수 없음";
  }
}
export function getSortingOptionByIndex(optionIndex: number) {
  const option = Object.keys(OptionsEnum)[optionIndex];
  return OptionsEnum[option as keyof typeof OptionsEnum];
}
