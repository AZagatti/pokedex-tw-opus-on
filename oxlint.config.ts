import { defineConfig } from "oxlint";
import core from "ultracite/oxlint/core";
import svelte from "ultracite/oxlint/svelte";

// Merge the ultracite presets, relaxing purely stylistic rules that fight
// idiomatic SvelteKit + test conventions. Correctness rules stay on.
export default defineConfig({
  ...core,
  ignorePatterns: [...(core.ignorePatterns ?? []), "e2e/**", "build/**"],
  rules: {
    ...core.rules,
    ...svelte.rules,
    "func-style": "off",
    "unicorn/filename-case": "off",
    "unicorn/catch-error-name": "off",
    "sort-keys": "off",
    "class-methods-use-this": "off",
    "no-empty-function": "off",
    "unicorn/prefer-ternary": "off",
    "unicorn/no-empty-file": "off",
    "prefer-destructuring": "off",
    "require-unicode-regexp": "off",
    "promise/prefer-await-to-then": "off",
    "promise/prefer-await-to-callbacks": "off",
    "require-await": "off",
    "no-plusplus": "off",
    "unicorn/no-useless-spread": "off",
    "unicorn/numeric-separators-style": "off",
    "vitest/prefer-to-be-truthy": "off",
    "vitest/prefer-to-be-falsy": "off",
    "vitest/prefer-strict-equal": "off",
    "vitest/prefer-called-once": "off",
    "vitest/prefer-describe-function-title": "off",
    "vitest/require-mock-type-parameters": "off",
    "vitest/require-to-throw-message": "off",
  },
  overrides: [
    ...(core.overrides ?? []),
    {
      files: ["**/*.svelte"],
      rules: { "prefer-const": "off" },
    },
  ],
});
