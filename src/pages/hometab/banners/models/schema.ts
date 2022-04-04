import { boolean, InferType, number, object, string } from "yup";

import { Form, useForm } from "@app/helpers/useForm";

export const schema = object({
  bannerId: string().label("배너 ID"),
  title: string().label("제목").required(),
  subtitle: string().label("부제목").required(),
  bannerImage: string().label("배너 이미지").required(),
  exhibitionId: string().label("기획전").required(),
  isLive: boolean().label("활성화 여부").required(),
  weight: number().label("가중치").default(0).required(),
});

export type FormSchema = InferType<typeof schema>;

const defaultValues = {
  bannerId: "",
  title: "",
  subtitle: "",
  bannerImage: "",
  exhibitionId: "",
  isLive: false,
  weight: 0,
};

export const formStore: Form<FormSchema> = useForm<FormSchema>(
  schema,
  defaultValues,
);
