/** @type {import("snowpack").SnowpackUserConfig } */
import baseConfig from "./snowpack.config.mjs";

export default {
  ...baseConfig,
  mode: "development",
  env: {
    ...baseConfig.env,
    ENV: "development",
  },
  mount: {
    "public-dev": { url: "/", static: true },
    src: "/dist",
  },
  routes: [
    /* Enable an SPA Fallback in development: */
    { match: "routes", src: ".*", dest: "/index.html" },
  ],
};
