import StorageService from "@app/core/StorageService";
import { apiConfigs, apiConfigsTS } from "@app/store";
import { TokenApi } from "@lessbutter/alloff-backoffice-api";
import axios from "axios";
import { get } from "svelte/store";

export default abstract class Service {
  public storageService: StorageService;

  constructor() {
    this.storageService = new StorageService();
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
        const api = new TokenApi(apiConfigsTS);
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
