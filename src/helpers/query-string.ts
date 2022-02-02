import { parse, stringify } from "query-string";

export const formatQueryString = (params: Record<string, unknown>): string => {
  return stringify(params, { arrayFormat: "bracket" });
};

export const parseQueryString = <T>(queryString: string): T => {
  return parse(queryString, { arrayFormat: "bracket" }) as unknown as T;
};
