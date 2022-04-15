import { apiConfigs } from "@app/store";
import { get } from "svelte/store";
import { settings } from "./constants";

type Tokens = { access?: string; refresh?: string };

export const setTokens = (tokens: Tokens) => {
  if (tokens.access) {
    localStorage.setItem(
      settings.auth.accessTokenLocalStorageKey,
      tokens.access,
    );
    const config = get(apiConfigs);
    config.accessToken = tokens.access;
    apiConfigs.set(config);
  }
  if (tokens.refresh) {
    localStorage.setItem(
      settings.auth.refreshTokenLocalStorageKey,
      tokens.refresh,
    );
  }
};

export const getTokens = (): Tokens => {
  return {
    access:
      localStorage.getItem(settings.auth.accessTokenLocalStorageKey) ??
      undefined,
    refresh:
      localStorage.getItem(settings.auth.refreshTokenLocalStorageKey) ??
      undefined,
  };
};

export const removeTokens = () => {
  localStorage.removeItem(settings.auth.accessTokenLocalStorageKey);
  localStorage.removeItem(settings.auth.refreshTokenLocalStorageKey);
  const config = get(apiConfigs);
  config.accessToken = undefined;
  apiConfigs.set(config);
};
