import { Configuration, TokenApi } from "@lessbutter/alloff-backoffice-api";
import axios from "axios";
import { navigate } from "svelte-navigator";

import StorageService from "./StorageService";

export default class AuthService {
  private config: Configuration;
  private storageService: StorageService;
  private tokenApi: TokenApi;

  constructor(config: Configuration, storageService: StorageService) {
    this.config = config;
    this.storageService = storageService;
    this.tokenApi = new TokenApi(this.config);
  }

  public async login(username: string, password: string) {
    try {
      const { data } = await this.tokenApi.tokenCreate({
        tokenObtainPairRequestRequest: { username, password },
      });
      this.storageService.setTokens(data);
      navigate("/");
    } catch (e) {
      this.catchError(e);
    }
  }

  public async catchError(error: any) {
    console.error(error);
    console.log(typeof error);
    const originalRequest = error.config;
    const isAuth = (error.config?.url ?? "").includes("/token/");
    if (error.response && error.response.status === 401 && !isAuth) {
      const { refresh } = this.storageService.getTokens();
      if (!refresh) {
        return this.storageService.toLogin();
      }
      try {
        const api = new TokenApi(this.config);
        const { data } = await api.tokenRefreshCreate({
          tokenRefreshRequestRequest: { refresh },
        });
        this.storageService.setTokens(data);
        return axios(originalRequest);
      } catch (e: any) {
        console.log("Unknown error while refreshing token", { e });
        return this.storageService.toLogin();
      }
    }
    throw error;
  }
}

export const useAuthService = (
  config: Configuration,
  storageService: StorageService,
) => {
  return new AuthService(config, storageService);
};
