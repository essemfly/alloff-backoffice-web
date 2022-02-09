/** @type {import("snowpack").SnowpackUserConfig } */
import baseConfig from "./snowpack.config.mjs";

export default {
  ...baseConfig,
  mode: "production",
  env: {
    ...baseConfig.env,
    ENV: "production",
  },
};
