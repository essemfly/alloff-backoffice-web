/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  // setupFilesAfterEnv: ["<rootDir>/test/jestSetup.ts"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
    "^.+\\.svelte$": ["svelte-jester", { preprocess: true }],
  },
  moduleNameMapper: { "^.+\\.(css|less|scss)$": "babel-jest" },
  testRegex: "(/__tests__/.*|(\\.|/)(spec))\\.(js?|ts?|svelte?)$",
  moduleFileExtensions: ["js", "ts", "svelte"],
  modulePathIgnorePatterns: ["dist", "build"],
  globals: {
    window: {},
    "ts-jest": {
      babelConfig: true,
      tsconfig: "tsconfig.json",
    },
  },
};
