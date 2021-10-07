import axios from "axios";
import { TokenApi } from "./api";
import { AxiosError } from "axios";
import App from "./App.svelte";
import { getTokens, removeTokens, setTokens } from "./core/auth";

const toLogin = () => {
  window.location.href = "/login";
};

// axios.defaults.withCredentials = true;
axios.interceptors.request.use((config) => {
  const { access } = getTokens();
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
      const { refresh } = getTokens();
      if (!refresh) {
        return toLogin();
      }
      try {
        console.log("REFRESHING!");
        const api = new TokenApi();
        const { data } = await api.tokenRefreshCreate({ refresh });
        setTokens(data);
        return axios(originalRequest);
      } catch (e: any) {
        console.log("Unknown error while refreshing token", { e });
        return toLogin();
      }
    }
    // console.log("?????????????????", { error });
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
