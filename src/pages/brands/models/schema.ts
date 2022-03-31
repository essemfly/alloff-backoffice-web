import { array, boolean, InferType, number, object, string } from "yup";

import { Form, useForm } from "@app/helpers/useForm";

export const schema = object({
  brandId: string().label("브랜드 ID"),
  keyname: string().label("브랜드 키네임").required(),
  korname: string().label("브랜드명(한글)").required(),
  engname: string().label("브랜드명(영문)").required(),
  logoImageUrl: string().label("로고 이미지").required(),
  backImageUrl: string().label("배경 이미지").required(),
  description: string().label("설명").required(),
  sizeGuide: array()
    .of(
      object({
        label: string().required(),
        imageUrl: string().required(),
      }).required(),
    )
    .label("사이즈 가이드")
    .required(),
  isPopular: boolean().label("인기있는 브랜드 여부").required(),
  isOpen: boolean().label("브랜드 오픈 여부").required(),
  inMaintenance: boolean().label("숨김처리 여부").required(),
});

export type FormSchema = InferType<typeof schema>;

const defaultValues = {
  brandId: "",
  keyname: "",
  korname: "",
  engname: "",
  logoImageUrl: "",
  backImageUrl: "",
  description: "",
  sizeGuide: [],
  isPopular: false,
  isOpen: false,
  inMaintenance: false,
};

export const formStore: Form<FormSchema> = useForm<FormSchema>(
  schema,
  defaultValues,
);
