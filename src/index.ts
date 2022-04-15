import { TokenApi } from "@lessbutter/alloff-backoffice-api";
import axios, { AxiosError } from "axios";
import { get } from "svelte/store";
import { navigate } from "svelte-navigator";

import { getTokens, setTokens } from "./core/auth";
import { apiConfigs } from "./store";
import App from "./App.svelte";
import "./index.css";

const toLogin = () => {
  navigate("/login");
};

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;
    const isAuth = (error.config?.url ?? "").includes("/token/");
    if (error.response && error.response.status === 401 && !isAuth) {
      const { refresh } = getTokens();
      if (!refresh) {
        return toLogin();
      }
      try {
        const api = new TokenApi(get(apiConfigs));
        const { data } = await api.tokenRefreshCreate({
          tokenRefreshRequestRequest: { refresh },
        });
        setTokens(data);
        return axios(originalRequest);
      } catch (e: any) {
        console.log("Unknown error while refreshing token", { e });
        return toLogin();
      }
    }
    throw error;
  },
);

const app = new App({
  target: document.body,
});

export default app;
