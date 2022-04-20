import { navigate } from "svelte-navigator";

import { settings } from "../constants";

type Tokens = { access?: string; refresh?: string };

export default class StorageService {
  public setTokens = (tokens: Tokens) => {
    if (tokens.access) {
      localStorage.setItem(
        settings.auth.accessTokenLocalStorageKey,
        tokens.access,
      );
    }
    if (tokens.refresh) {
      localStorage.setItem(
        settings.auth.refreshTokenLocalStorageKey,
        tokens.refresh,
      );
    }
  };

  public getTokens = (): Tokens => {
    return {
      access:
        localStorage.getItem(settings.auth.accessTokenLocalStorageKey) ??
        undefined,
      refresh:
        localStorage.getItem(settings.auth.refreshTokenLocalStorageKey) ??
        undefined,
    };
  };

  public removeTokens = () => {
    localStorage.removeItem(settings.auth.accessTokenLocalStorageKey);
    localStorage.removeItem(settings.auth.refreshTokenLocalStorageKey);
  };

  public toLogin = () => {
    navigate("/login");
  };
}

export const useStorageService = () => {
  return new StorageService();
};
