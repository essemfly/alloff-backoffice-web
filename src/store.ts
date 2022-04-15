import { Admin, Configuration } from "@lessbutter/alloff-backoffice-api";
import { get, writable } from "svelte/store";

import { getTokens } from "./core/auth";
import { getBaseUrl } from "./core/configs";

export const admin = writable<Admin | undefined>(undefined);

const baseConfig = new Configuration({
  basePath: getBaseUrl(),
  accessToken: getTokens().access,
});
export const apiConfigs = writable<Configuration>(baseConfig);
export const apiConfigsTS = get(apiConfigs);
