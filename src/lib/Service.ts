import { TokenApi } from "@lessbutter/alloff-backoffice-api";
import axios from "axios";
import { writable, Writable } from "svelte/store";
import { apiConfigsTS } from "@app/store";
import StorageService from "@app/core/StorageService";

export default abstract class Service<M> {
  public storageService: StorageService;

  public entities: Writable<Record<string, M>>;

  constructor() {
    this.storageService = new StorageService();
    this.entities = writable({});
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
