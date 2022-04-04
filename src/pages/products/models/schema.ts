import { array, boolean, InferType, number, object, string } from "yup";

import { Form, useForm } from "@app/helpers/useForm";

export const schema = object({
  alloffProductId: string().label("상품 ID"),
  // .when("$isAdding", ([isAdding], schema) => {
  //   console.log(isAdding, schema);
  //   return isAdding ? schema.notRequired() : schema.required();
  // })
  alloffCategoryId: string().label("상품 카테고리").required(),
  alloffName: string().label("상품명").required(),
  productId: string().label("제품번호"),
  brandKeyName: string().label("브랜드").required(),
  brandKorName: string().label("브랜드명(한글)"),
  categoryName: string().label("카테고리(old)"),
  alloffCategoryName: string().label("카테고리"),
  isForeignDelivery: boolean().label("해외 배송 여부").default(true).required(),
  isRefundPossible: boolean().label("반품가능 여부").default(true).required(),
  isRemoved: boolean().label("판매불가 여부").default(false),
  isSoldout: boolean().label("품절 여부").default(false),
  originalPrice: number().label("원가").required(),
  discountedPrice: number().label("할인가").required(),
  specialPrice: number().label("우선적용가").nullable().notRequired(),
  earliestDeliveryDays: number()
    .label("가장 빠른 도착예정일")
    .default(2)
    .required(),
  latestDeliveryDays: number()
    .label("가장 느린 도착예정일")
    .default(7)
    .required(),
  refundFee: number().label("반품 비용"),
  totalScore: number().label("Total score"),
  description: array().of(string().required()).label("상품 설명").required(),
  images: array().of(string().required()).label("상품 이미지").required(),
  descriptionImages: array()
    .of(string().required())
    .label("상품 설명 이미지")
    .required(),
  inventory: array()
    .of(
      object({
        size: string().label("사이즈").required(),
        quantity: number().label("수량").required(),
      }).required(),
    )
    .label("재고")
    .required()
    .default([]),
  moduleName: string(),
  rawHtml: string().nullable(),
  productUrl: string().label("상품 URL").nullable(),
});

export type FormSchema = InferType<typeof schema>;

const defaultValues = {
  alloffProductId: "",
  alloffCategoryId: "",
  alloffName: "",
  productId: "",
  brandKorName: "",
  categoryName: "",
  alloffCategoryName: "",
  isForeignDelivery: true,
  isRefundPossible: true,
  isRemoved: false,
  isSoldout: false,
  earliestDeliveryDays: 2,
  latestDeliveryDays: 7,
  refundFee: 0,
  totalScore: 0,
  description: [],
  images: [],
  descriptionImages: [],
  inventory: [],
  moduleName: "",
};

export const formStore: Form<FormSchema> = useForm<FormSchema>(
  schema,
  defaultValues,
);
