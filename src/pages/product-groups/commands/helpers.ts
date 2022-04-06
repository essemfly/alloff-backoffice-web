import { GroupTypeCbfEnum as GroupTypeEnum } from "@api";

export function getGroupTypeByIndex(typeIndex: number) {
  const key = Object.keys(GroupTypeEnum)[typeIndex];
  return GroupTypeEnum[key as keyof typeof GroupTypeEnum];
}

export function getGroupTypeLabelByIndex(typeIndex: number) {
  const type = Object.keys(GroupTypeEnum)[typeIndex];
  switch (type) {
    case GroupTypeEnum.Timedeal:
    case "Timedeal":
      return "타임딜";
    case GroupTypeEnum.Exhibition:
    case "Exhibition":
      return "기획전 섹션";
    default:
      return "컬렉션";
  }
}

export function getGroupTypeLabel(type: GroupTypeEnum) {
  switch (type) {
    case GroupTypeEnum.Timedeal:
      return "타임딜";
    case GroupTypeEnum.Exhibition:
      return "기획전 섹션";
    default:
      return "컬렉션";
  }
}
