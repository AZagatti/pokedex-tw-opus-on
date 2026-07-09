import { defineConfig } from "oxlint";
import core from "ultracite/oxlint/core";
import svelte from "ultracite/oxlint/svelte";
import vitest from "ultracite/oxlint/vitest";

// Merge the ultracite presets, relaxing purely stylistic rules that fight
// idiomatic SvelteKit (PascalCase components, semantic key order in Zod
// schemas, reactive $state patterns the linter cannot see reassigned).
export default defineConfig({
  ...core,
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
  },
  overrides: [
    ...(core.overrides ?? []),
    ...(vitest.overrides ?? []),
    {
      // Svelte 5 runes: $state vars are reassigned in templates, which the
      // linter cannot observe, so prefer-const false-positives.
      files: ["**/*.svelte"],
      rules: { "prefer-const": "off" },
    },
  ],
});
