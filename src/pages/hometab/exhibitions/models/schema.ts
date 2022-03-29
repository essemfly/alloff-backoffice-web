import { array, InferType, object, string } from "yup";

import { Form, useForm } from "@app/helpers/useForm";
export {
  schema as sectionSchema,
  formStore as sectionFormStore,
} from "@app/pages/product-groups/models/schema";

export const schema = object({
  exhibitionId: string().label("기획전 ID").required(),
  title: string().label("제목").required(),
  subtitle: string().label("부제목").required(),
  description: string().label("설명").required(),
  bannerImage: string().label("배너 이미지").required(),
  thumbnailImage: string().label("썸네일 이미지").required(),
  startTime: string().label("시작일시").required(),
  finishTime: string().label("종료일시").required(),
  pgIds: array().of(string().required()).label("섹션 목록").required(),
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
};

export const formStore: Form<FormSchema> = useForm<FormSchema>(
  schema,
  defaultValues,
);
