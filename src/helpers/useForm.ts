import { writable, Writable } from "svelte/store";
import { AnyObjectSchema } from "yup";

export type FormField<T> = Partial<T>;
export type FormError<T> = Partial<Record<keyof T, string>>;
export type FormTouch<T> = Partial<Record<keyof T, boolean>>;

export interface FormStore<T> {
  fields: FormField<T>;
  errors: FormError<T>;
  // touched: FormTouch<T>;
  // isTouched: boolean;
}

export interface Form<T> extends Writable<FormStore<T>> {
  validate: (fields: FormField<T>) => Promise<boolean>;
  update: (changes: any) => void;
  // initialize: () => void;
}

export const useForm = <T>(
  schema: AnyObjectSchema,
  defaultValues: Partial<T> = {},
): Form<T> => {
  let fields: FormField<T> = {};
  let errors: FormError<T> = {};
  // let touched: FormTouch<T> = {};

  const store = writable(createFormStore(defaultValues));
  const { subscribe, set, update: updateFormStore } = store;

  subscribe((values) => {
    fields = values.fields;
    errors = values.errors;
    // touched = values.touched;
  });

  return {
    subscribe,
    set,
    update,
    validate,
    // initialize,
  };

  function update(changes: any): void {
    Object.keys(changes).forEach((key) => {
      _updateStore("fields", { ...fields, [key as keyof T]: changes[key] });
      // _touch(key);
    });
  }

  async function validate(formData: FormField<T>): Promise<boolean> {
    // _touchAll();
    _updateStore("fields", formData);
    await schema
      .validate(fields, { abortEarly: false })
      .then(() => {
        _updateStore("errors", {});
      })
      .catch((err: any) => {
        _updateStore("errors", _extractErrors(err));
      });

    return Object.keys(errors).length === 0;
  }

  function _extractErrors({ inner }: any) {
    return inner.reduce((acc: any, err: any) => {
      return { ...acc, [err.path]: err.message };
    }, {});
  }

  // function initialize(): void {
  //   Object.keys(touched)
  //     .filter((field) => touched[field as keyof FormTouch<T>])
  //     .forEach((field) => _touch(field, false));
  // }

  // function _touchAll(): void {
  //   Object.keys(fields)
  //     .filter((field) => !touched[field as keyof FormTouch<T>])
  //     .forEach((field) => _touch(field));
  // }

  // function _touch(key: string, touchedValue = true): void {
  //   _updateStore("touched", { ...touched, [key as keyof T]: touchedValue });
  // }

  function _updateStore(fieldName: string, changes: any) {
    updateFormStore((form) => ({ ...form, [fieldName]: changes }));
  }
};

function createFormStore<T>(defaultValues: Partial<T> = {}): FormStore<T> {
  const fields: FormField<T> = { ...defaultValues };
  const errors: FormError<T> = {};
  // const touched: FormTouch<T> = {};
  // const isTouched = _getIsTouched();

  return {
    fields,
    errors,
    // touched,
    // isTouched,
  };

  // function _getIsTouched() {
  //   return (
  //     Object.keys(touched).filter(
  //       (field) => touched[field as keyof FormTouch<T>],
  //     ).length > 0
  //   );
  // }
}
