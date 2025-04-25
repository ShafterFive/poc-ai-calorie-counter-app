import turboConfig from "eslint-config-turbo/flat";
import eslintConfigPrettier from "eslint-config-prettier/flat";

/** @type {import('eslint').Linter.Config[]} */
const config = [eslintConfigPrettier, ...turboConfig];

export default config;
