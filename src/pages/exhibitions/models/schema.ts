import {
  AnyObjectSchema,
  array,
  ArraySchema,
  InferType,
  number,
  object,
  string,
  StringSchema,
} from "yup";

import { Form, useForm } from "@app/helpers/useForm";
import { ExhibitionTypeEnum } from "@lessbutter/alloff-backoffice-api";
export {
  schema as sectionSchema,
  formStore as sectionFormStore,
} from "@app/pages/product-groups/models/schema";

const bannerSchema = object({
  imgUrl: string().label("배너 이미지").required(),
  title: string().label("배너 제목"),
  subtitle: string().label("배너 부제목"),
  productGroupId: string().label("섹션 ID").required(),
});

export const schema = object({
  exhibitionId: string().label("기획전 ID"),
  title: string().label("제목").required(),
  subtitle: string().label("부제목").required(),
  description: string().label("설명").required(),
  bannerImage: string()
    .label("배너 이미지")
    .when("exhibitionType", {
      is: (exhibitionType: ExhibitionTypeEnum) =>
        exhibitionType === ExhibitionTypeEnum.Timedeal,
      then: (schema: StringSchema) => schema.notRequired(),
      otherwise: (schema: StringSchema) => schema.required(),
    }),
  thumbnailImage: string()
    .label("썸네일 이미지")
    .when("exhibitionType", {
      is: (exhibitionType: ExhibitionTypeEnum) =>
        exhibitionType === ExhibitionTypeEnum.Timedeal,
      then: (schema: StringSchema) => schema.notRequired(),
      otherwise: (schema: StringSchema) => schema.required(),
    }),
  startTime: string().label("시작일시").required(),
  finishTime: string().label("종료일시").required(),
  pgIds: array().of(string().required()).label("섹션 목록").required(),
  pgs: array(),
  exhibitionType: string()
    .oneOf(Object.values(ExhibitionTypeEnum))
    .label("기획전 종류")
    .required(),
  targetSales: number().label("목표 판매량").default(1),
  currentSales: number().label("현재 판매량").default(0),
  banners: array()
    .label("배너 이미지")
    .of(bannerSchema.required())
    .default([])
    .when("exhibitionType", {
      is: (exhibitionType: ExhibitionTypeEnum) =>
        exhibitionType === ExhibitionTypeEnum.Timedeal,
      then: (schema: ArraySchema<AnyObjectSchema>) => schema.required(),
      otherwise: (schema: ArraySchema<AnyObjectSchema>) => schema.notRequired(),
    }),
});

export type FormSchema = InferType<typeof schema>;
export type BannerFormSchema = InferType<typeof bannerSchema>;

const defaultValues = {
  exhibitionId: "",
  title: "",
  subtitle: "",
  bannerImage: "",
  thumbnailImage: "",
  description: "",
  startTime: "",
  finishTime: "",
  pgIds: [],
  targetSales: 1,
  exhibitionType: "",
};

export const formStore: Form<FormSchema> = useForm<FormSchema>(
  schema,
  defaultValues,
);
