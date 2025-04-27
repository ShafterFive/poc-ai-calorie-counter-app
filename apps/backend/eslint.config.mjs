import backendEslintConfig from '@workspace/eslint-config/backend';

/** @type {import('eslint').Linter.Config[]} */
const config = [
  {
    ignores: ['eslint.config.mjs', 'prettier.config.mjs'],
  },
  ...backendEslintConfig,
];

export default config;
