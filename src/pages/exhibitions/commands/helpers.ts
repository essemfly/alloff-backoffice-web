import { ExhibitionTypeEnum } from "@lessbutter/alloff-backoffice-api";

export function getExhibitionTypeByIndex(typeIndex: number) {
  const key = Object.keys(ExhibitionTypeEnum)[typeIndex];
  return ExhibitionTypeEnum[key as keyof typeof ExhibitionTypeEnum];
}

export function getExhibitionTypeLabelByIndex(typeIndex: number) {
  const type = Object.keys(ExhibitionTypeEnum)[typeIndex];
  switch (type) {
    case ExhibitionTypeEnum.Timedeal:
    case "Timedeal":
      return "타임딜";
    case ExhibitionTypeEnum.Groupdeal:
    case "Groupdeal":
      return "그룹딜";
    case ExhibitionTypeEnum.Normal:
    case "Normal":
      return "기획전";
    default:
      return "컬렉션";
  }
}

export function getExhibitionTypeLabel(type: ExhibitionTypeEnum) {
  switch (type) {
    case ExhibitionTypeEnum.Groupdeal:
      return "그룹딜";
    case ExhibitionTypeEnum.Timedeal:
      return "타임딜";
    case ExhibitionTypeEnum.Normal:
      return "기획전";
    default:
      return "컬렉션";
  }
}
