import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import importPlugin from "eslint-plugin-import";
import prettier from "eslint-plugin-prettier";
import airbnbBase from "eslint-config-airbnb-base";

export default [
  {
    ignores: ["dist"],
  },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
      import: importPlugin,
      prettier,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      ...importPlugin.configs.errors.rules,
      ...importPlugin.configs.warnings.rules,
      ...prettier.configs.recommended.rules,
      ...airbnbBase.rules,

      // 사용자 정의 규칙
      "no-alert": "off",
      "no-await-in-loop": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "no-unused-vars": "warn",
      "no-nested-ternary": "off",
      "import/no-extraneous-dependencies": "off",
      "prettier/prettier": ["error", { endOfLine: "auto" }],
      "import/no-unresolved": "off",
      "react/jsx-filename-extension": [
        "error",
        { extensions: [".js", ".jsx"] },
      ],
      "import/extensions": [
        "error",
        "ignorePackages",
        {
          js: "never",
          jsx: "never",
          "": "never",
        },
      ],
    },
    settings: {
      "import/extensions": [".js", ".jsx"],
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx"],
          moduleDirectory: ["node_modules"],
        },
      },
    },
  },
];
