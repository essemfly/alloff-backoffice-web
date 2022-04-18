import { TokenApi } from "@lessbutter/alloff-backoffice-api";
import axios from "axios";
import { get, writable, Writable } from "svelte/store";

import CoreProvider, { useCore } from "@app/core/CoreProvider";

export default abstract class Service<M> {
  public core: CoreProvider;
  public _entities: Writable<Record<string, M>>;

  constructor() {
    this.core = useCore();
    this._entities = writable({});
  }

  public get entities() {
    return get(this._entities);
  }

  public _updateEntities(values: Record<string, M>) {
    this._entities.set(values);
  }

  public async catchError(error: any) {
    console.error(error);
    console.log(typeof error);
    const originalRequest = error.config;
    const isAuth = (error.config?.url ?? "").includes("/token/");
    if (error.response && error.response.status === 401 && !isAuth) {
      const { refresh } = this.core.storage.getTokens();
      if (!refresh) {
        return this.core.storage.toLogin();
      }
      try {
        const api = new TokenApi(this.core.apiConfig);
        const { data } = await api.tokenRefreshCreate({
          tokenRefreshRequestRequest: { refresh },
        });
        this.core.storage.setTokens(data);
        return axios(originalRequest);
      } catch (e: any) {
        console.log("Unknown error while refreshing token", { e });
        return this.core.storage.toLogin();
      }
    }
    throw error;
  }
}
