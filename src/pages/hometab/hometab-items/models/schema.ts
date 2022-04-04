import { array, InferType, number, object, string, AnySchema } from "yup";

import { Form, useForm } from "@app/helpers/useForm";
import { ItemTypeEnum, OptionsEnum } from "@app/api";

export const schema = object({
  itemId: string(),
  title: string().label("제목").required(),
  description: string().label("설명").required(),
  backImageUrl: string()
    .label("배경 이미지")
    .when("contents", {
      is: (val: { itemType: ItemTypeEnum }) => {
        return (
          val.itemType === ItemTypeEnum.ExhibitionA ||
          val.itemType === ItemTypeEnum.Exhibition
        );
      },
      then: (schema: AnySchema) => schema.required(),
    }),
  startTime: string().label("시작일시").required(),
  finishTime: string().label("종료일시").required(),
  contents: object({
    itemType: string()
      .oneOf(Object.values(ItemTypeEnum))
      .label("홈탭 아이템 종류")
      .required(),
    options: array()
      .label("옵션")
      .of(string().oneOf(Object.values(OptionsEnum)).required())
      .when("itemType", {
        is: (val: ItemTypeEnum) =>
          val === ItemTypeEnum.ProductsBrands ||
          val === ItemTypeEnum.ProductsCategories,
        then: (schema: AnySchema) => schema.required().min(1),
      }),
    exhibitionIds: array()
      .of(string().required())
      .label("기획전")
      .when("itemType", {
        is: (val: ItemTypeEnum) =>
          val === ItemTypeEnum.ExhibitionA ||
          val === ItemTypeEnum.Exhibitions ||
          val === ItemTypeEnum.Exhibition,
        then: (schema: AnySchema) => schema.required().min(1),
      }),
    brandKeynames: array()
      .of(string().required())
      .label("브랜드")
      .when("itemType", {
        is: (val: ItemTypeEnum) =>
          val === ItemTypeEnum.Brands || val === ItemTypeEnum.ProductsBrands,
        then: (schema: AnySchema) => schema.required().min(1),
      }),
    alloffcategoryId: string()
      .label("카테고리")
      .when("itemType", {
        is: (val: ItemTypeEnum) => val === ItemTypeEnum.ProductsCategories,
        then: (schema: AnySchema) => schema.required(),
        otherwise: (schema: AnySchema) => schema.nullable(),
      }),
  }).required(),
  weight: number().label("가중치"),
  tags: array()
    .of(string().required())
    .label("태그")
    .when("contents", {
      is: (val: { itemType: ItemTypeEnum }) => {
        return val.itemType === ItemTypeEnum.Exhibition;
      },
      then: (schema: AnySchema) => schema.required().min(1),
    }),
});

export type FormSchema = InferType<typeof schema>;

const defaultValues = {
  title: "",
  description: "",
  backImageUrl: "",
  contents: {
    itemType: ItemTypeEnum.ExhibitionA,
    options: [],
    exhibitionIds: [],
  },
  weight: 0,
};

export const formStore: Form<FormSchema> = useForm<FormSchema>(
  schema,
  defaultValues,
);
