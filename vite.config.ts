import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";
const pkg = require("./package.json");

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, VITE_PACKAGE_VERSION: pkg.version };

  let publicDir = "public";
  if (mode === "development") {
    publicDir += "-dev";
  }
  
  return defineConfig({
    plugins: [svelte()],
    publicDir,
    resolve: {
      alias: [
        { find: "@app", replacement: "/src" },
        { find: "@api", replacement: "/src/api" },
      ],
    },
  });
};
