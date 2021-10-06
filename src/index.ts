import axios from "axios";
import { TokenApi } from "./api";
import App from "./App.svelte";
axios.defaults.withCredentials = true;
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const isTokenRefresh = (error?.config?.url ?? "").includes("token/refresh");
    if (error.response && error.response.status === 401 && !isTokenRefresh) {
      originalRequest.retry = true;
      try {
        console.log("REFRESHING!");
        const api = new TokenApi();
        await api.tokenRefreshCreate({});
        return axios(originalRequest);
      } catch (e: any) {
        console.log("Unknown error while refreshing token", { e });
        window.location.href = "#/login";
        return;
      }
    }
    console.log("?????????????????", { error });
    throw error;
  }
);

var app = new App({
  target: document.body,
});

export default app;

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
  import.meta.hot.dispose(() => {
    app.$destroy();
  });
}
