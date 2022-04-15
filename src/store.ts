import { Admin, Configuration } from "@lessbutter/alloff-backoffice-api";
import { writable } from "svelte/store";

import { getTokens } from "./core/auth";
import { getBaseUrl } from "./core/configs";

export const admin = writable<Admin | undefined>(undefined);

const baseConfig = new Configuration({
  basePath: getBaseUrl(),
  accessToken: getTokens().access,
});
export const apiConfigs = writable<Configuration>(baseConfig);
