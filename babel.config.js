module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    "@babel/preset-typescript",
  ],
  transformIgnorePatterns: [
    "<rootDir>/node_modules/(?!(carbon-icons-svelte))",
    "<rootDir>/node_modules/(?!(carbon-components-svelte))",
  ],
  plugins: ["babel-plugin-transform-import-meta"],
  moduleFileExtensions: ["js", "ts", "svelte"],
};
