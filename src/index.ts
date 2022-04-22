import App from "./App.svelte";
import "./index.css";

import { TokenApi } from "@lessbutter/alloff-backoffice-api";
import axios, { AxiosError } from "axios";
import { useCore } from "./core/CoreProvider";

// Needs refactoring
axios.interceptors.request.use((config) => {
  const core = useCore();

  const { access } = core.storage.getTokens();
  config.headers = {
    ...config.headers,
    Authorization: `Bearer ${access}`,
  };
  return config;
});

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config;
    const isAuth = (error.config.url ?? "").includes("/token/");
    if (error.response && error.response.status === 401 && !isAuth) {
      const core = useCore();
      const { refresh } = core.storage.getTokens();

      if (!refresh) {
        return core.storage.toLogin();
      }
      try {
        console.log("REFRESHING!");
        const api = new TokenApi(core.apiConfig);

        const { data } = await api.tokenRefreshCreate({
          tokenRefreshRequestRequest: { refresh },
        });
        core.storage.setTokens(data);
        return axios(originalRequest);
      } catch (e: any) {
        console.log("Unknown error while refreshing token", { e });
        return core.storage.toLogin();
      }
    }
    // console.log("?????????????????", { error });
    throw error;
  },
);

const app = new App({
  target: document.body,
});

export default app;
