import type { Config } from "jest";

const config: Config = {
  testEnvironment: "node",
  testPathIgnorePatterns: ["<rootDir>/dist/", "<rootDir>/node_modules/"],
  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
};

export default config;
