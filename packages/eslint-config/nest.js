const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "eslint-config-turbo",
  ],
  plugins: ['@typescript-eslint/eslint-plugin'],
  env: {
    node: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  ignorePatterns: [
    // Ignore dotfiles
    ".*.js",
    "node_modules/",
  ],
};
