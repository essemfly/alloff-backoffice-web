const autoPreprocess = require("svelte-preprocess");
const {
  optimizeCarbonImports,
} = require("carbon-components-svelte/preprocess");

module.exports = {
  preprocess: [autoPreprocess(), optimizeCarbonImports()],
  kit: {
    vite: {
      optimizeDeps: {
        entries: [],
      },
    },
  },
};
