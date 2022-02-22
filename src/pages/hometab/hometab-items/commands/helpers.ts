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
    case ItemTypeEnum.ExhibitionA:
    case "ExhibitionA":
      return HometabItemType.ExhibitionA;
    case ItemTypeEnum.Exhibitions:
    case "Exhibitions":
      return HometabItemType.Exhibitions;
    case ItemTypeEnum.Exhibition:
    case "Exhibition":
      return HometabItemType.Exhibition;
    case ItemTypeEnum.ProductsCategories:
    case "ProductsCategories":
      return HometabItemType.ProductsCategories;
    case ItemTypeEnum.ProductsBrands:
    case "ProductsBrands":
      return HometabItemType.ProductsBrands;
    default:
      return "알 수 없음";
  }
}

export function getHometabItemTypeLabel(type: ItemTypeEnum) {
  switch (type) {
    case ItemTypeEnum.Brands:
      return HometabItemType.Brands;
    case ItemTypeEnum.ExhibitionA:
      return HometabItemType.ExhibitionA;
    case ItemTypeEnum.Exhibitions:
      return HometabItemType.Exhibitions;
    case ItemTypeEnum.Exhibition:
      return HometabItemType.Exhibition;
    case ItemTypeEnum.ProductsCategories:
      return HometabItemType.ProductsCategories;
    case ItemTypeEnum.ProductsBrands:
      return HometabItemType.ProductsBrands;
    default:
      return "알 수 없음";
  }
}
export function getSortingOptionByIndex(optionIndex: number) {
  const option = Object.keys(OptionsEnum)[optionIndex];
  return OptionsEnum[option as keyof typeof OptionsEnum];
}
