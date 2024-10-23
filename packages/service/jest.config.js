const config = {
  testEnvironment: "node",
  testPathIgnorePatterns: [
    "<rootDir>/dist/",
    "<rootDir>/node_modules/",
    "__util__",
  ],
  extensionsToTreatAsEsm: [".ts"],
  transform: {
    "^.+.tsx?$": ["ts-jest", { useESM: true }],
  },
};

export default config;
