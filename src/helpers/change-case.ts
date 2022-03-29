import { transform, isArray, isObject, camelCase, snakeCase } from "lodash";

export const convertToCamelCase = (obj: any) =>
  transform(obj, (acc: any, value, key, target) => {
    const camelKey = isArray(target) ? key : camelCase(key as any);
    acc[camelKey] = isObject(value) ? convertToCamelCase(value) : value;
  });

export const convertToSnakeCase = <T>(obj: any): T =>
  transform(obj, (acc: any, value, key, target) => {
    const camelKey = isArray(target) ? key : snakeCase(key as string);
    acc[camelKey] = isObject(value) ? convertToSnakeCase(value) : value;
  }) as unknown as T;
