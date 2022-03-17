import { InferType, object, string, lazy } from "yup";

import { Form, useForm } from "@app/helpers/useForm";

import { NotificationTypeEnum } from "./Notification";

export const schema = object({
  title: string().required().label("제목"),
  message: string().required().label("메시지"),
  notiType: string()
    .oneOf(Object.values(NotificationTypeEnum))
    .required()
    .label("푸시알림 종류")
    .default(NotificationTypeEnum.GeneralNotification),
  referenceId: string()
    .label("관련 ID")
    .when("notiType", (notiType) => {
      switch (notiType) {
        case NotificationTypeEnum.TimedealOpenNotification:
          return string().label("관련 ID").required();
        case NotificationTypeEnum.GeneralNotification:
        default:
          return string().label("관련 ID").notRequired();
      }
    }),
});

export type FormSchema = InferType<typeof schema>;

const defaultValues = {
  title: "",
  message: "",
  notiType: NotificationTypeEnum.GeneralNotification,
  referenceId: "",
};

export const formStore: Form<FormSchema> = useForm<FormSchema>(
  schema,
  defaultValues,
);
