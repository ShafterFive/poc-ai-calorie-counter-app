import eslintLibraryConfig from "./library.mjs";
import typescriptEslint from "typescript-eslint";
import javascriptEslint from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
const config = typescriptEslint.config(
  {
    ignores: ["generated"],
  },
  javascriptEslint.configs.recommended,
  typescriptEslint.configs.recommended,
  ...eslintLibraryConfig,
  {
    files: ["src/**/*ts"],
    rules: {
      "turbo/no-undeclared-env-vars": [
        "error",
        {
          allowList: ["NODE_ENV"],
        },
      ],
    },
  },
);

export default config;
