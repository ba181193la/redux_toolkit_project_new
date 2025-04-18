module.exports = {
  parser: "@babel/eslint-parser",
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "prettier",
    "plugin:prettier/recommended",
  ],
  plugins: ["react", "react-hooks", "prettier"],
  ignorePatterns: ["dist", ".eslintrc.cjs", "src/tinymce"],
  env: {
    browser: true,
    es2021: true,
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  rules: {
    "prettier/prettier": ["error"],
    "no-console": "warn",
    "no-debugger": "warn",
    "no-undef": "error",
    "no-unused-vars": "warn",
    "no-redeclare": "error",
    eqeqeq: "warn",
    curly: "warn",
    "no-eval": "error",
    "no-implied-eval": "error",
    "no-loop-func": "warn",
    indent: ["warn", 2],
    semi: ["warn", "always"],
    "comma-dangle": ["warn", "never"],
    "no-trailing-spaces": "warn",
    "prefer-const": "warn",
    "no-var": "error",
    "arrow-spacing": ["warn", { before: true, after: true }],
    "no-duplicate-imports": "error",
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "import/no-unresolved": "error",
  },
};
