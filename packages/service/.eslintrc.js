module.exports = {
  env: {
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
  },
  plugins: ["@typescript-eslint"],
  root: true,
  rules: {
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/no-unsafe-argument": 0,
    "@typescript-eslint/no-unused-vars": 0,
    "@typescript-eslint/no-misused-promises": 0, // disabled because I keep running into https://github.com/DefinitelyTyped/DefinitelyTyped/pull/69846
  },
};
