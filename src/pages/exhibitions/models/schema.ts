import { array, InferType, number, object, string } from "yup";

import { Form, useForm } from "@app/helpers/useForm";
import { ExhibitionTypeEnum } from "@app/api";
export {
  schema as sectionSchema,
  formStore as sectionFormStore,
} from "@app/pages/product-groups/models/schema";

export const schema = object({
  exhibitionId: string().label("기획전 ID"),
  title: string().label("제목").required(),
  subtitle: string().label("부제목").required(),
  description: string().label("설명").required(),
  bannerImage: string().label("배너 이미지").required(),
  thumbnailImage: string().label("썸네일 이미지").required(),
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
});

export type FormSchema = InferType<typeof schema>;

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
};

export const formStore: Form<FormSchema> = useForm<FormSchema>(
  schema,
  defaultValues,
);
