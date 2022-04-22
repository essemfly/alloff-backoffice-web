import { array, InferType, object, string, StringSchema } from "yup";

import { Form, useForm } from "@app/helpers/useForm";
import { GroupTypeE67Enum as GroupTypeEnum } from "@lessbutter/alloff-backoffice-api";

export const schema = object({
  productGroupId: string().label("섹션 ID"),
  groupType: string()
    .oneOf(Object.values(GroupTypeEnum))
    .label("종류")
    .required(),
  title: string().label("제목").required().max(50),
  shortTitle: string().label("짧은 제목").max(20),
  instruction: array().of(string().required()).label("설명"),
  imageUrl: string()
    .label("이미지")
    .when("groupType", {
      is: (groupType: GroupTypeEnum) =>
        groupType === GroupTypeEnum.Timedeal ||
        groupType === GroupTypeEnum.BrandTimedeal,
      then: (schema: StringSchema) => schema.required(),
    }),
  startTime: string()
    .label("시작일시")
    .when("groupType", {
      is: (groupType: GroupTypeEnum) => groupType === GroupTypeEnum.Timedeal,
      then: (schema: StringSchema) => schema.required(),
    }),
  finishTime: string()
    .label("종료일시")
    .when("groupType", {
      is: (groupType: GroupTypeEnum) => groupType === GroupTypeEnum.Timedeal,
      then: (schema: StringSchema) => schema.required(),
    }),
  brandId: string()
    .label("브랜드")
    .when("groupType", {
      is: (groupType: GroupTypeEnum) =>
        groupType === GroupTypeEnum.BrandTimedeal,
      then: (schema: StringSchema) => schema.required(),
    }),
});

export type FormSchema = InferType<typeof schema>;

const defaultValues = {
  productGroupId: "",
  title: "",
  shortTitle: "",
  imageUrl: "",
  startTime: "",
  finishTime: "",
  instruction: [],
};

export const formStore: Form<FormSchema> = useForm<FormSchema>(
  schema,
  defaultValues,
);
