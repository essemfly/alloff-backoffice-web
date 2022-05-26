import { ProductTypesEnum } from "@lessbutter/alloff-backoffice-api";


export function getProductTypeIndex(type: keyof typeof ProductTypesEnum) {
  const index = Object.keys(ProductTypesEnum).indexOf(type);
  return index;

}

export function getProductTypeByIndex(typeIndex: number) {
  const key = Object.keys(ProductTypesEnum)[typeIndex];
  return ProductTypesEnum[key as keyof typeof ProductTypesEnum];
}

export function getProductTypeLabelByIndex(typeIndex: number) {
  const type = Object.keys(ProductTypesEnum)[typeIndex];
  switch (type) {
    case ProductTypesEnum.Female:
    case "Female":
      return "여성 의류";
    case ProductTypesEnum.Male:
    case "Male":
      return "남성 의류";
    case ProductTypesEnum.Kids:
    case "Kids":
      return "키즈";
    default:
      return "여성 의류";
  }
}

export function getProductTypeLabel(type: ProductTypesEnum) {
  switch (type) {
    case ProductTypesEnum.Female:
      return "여성 의류";
    case ProductTypesEnum.Male:
      return "남성 의류";
    case ProductTypesEnum.Kids:
      return "키즈";
    default:
      return "여성 의류";
  }
}
