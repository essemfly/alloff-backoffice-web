/** @type {import("snowpack").SnowpackUserConfig } */
import { createRequire } from "module";
const requireCommand = createRequire(import.meta.url);
const pkg = requireCommand("./package.json");

export default {
  env: {
    PACKAGE_VERSION: pkg.version,
  },
  mount: {
    public: { url: "/", static: true },
    src: { url: "/dist" },
  },
  plugins: [
    "@snowpack/plugin-svelte",
    "@snowpack/plugin-dotenv",
    [
      "@snowpack/plugin-typescript",
      {
        /* Yarn PnP workaround: see https://www.npmjs.com/package/@snowpack/plugin-typescript */
        ...(process.versions.pnp ? { tsc: "yarn pnpify tsc" } : {}),
      },
    ],
  ],
  routes: [
    /* Enable an SPA Fallback in development: */
    { match: "routes", src: ".*", dest: "/index.html" },
  ],
  alias: {
    "@app": "./src",
    "@api": "./src/api",
  },
  optimize: {
    /* Example: Bundle your final build: */
    // "bundle": true,
  },
  packageOptions: {
    knownEntrypoints: [
      "svelte/transition",
      "svelte/animate",
      "svelte/motion",
      "svelte/easing",
    ],
  },
  devOptions: {
    /* ... */
  },
  buildOptions: {
    /* ... */
  },
};
