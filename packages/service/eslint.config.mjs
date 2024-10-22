// @ts-check
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintConfigPrettier,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    ignores: ["**/node_modules", "**/dist", "**/scripts"],
  },
  {
    rules: {
      // disabled because I prefer to have all 3 args defined in route handlers
      "@typescript-eslint/no-unused-vars": ["off"],
      // disabled because I keep running into https://github.com/DefinitelyTyped/DefinitelyTyped/pull/69846
      "@typescript-eslint/no-misused-promises": ["off"],
    },
  },
);
