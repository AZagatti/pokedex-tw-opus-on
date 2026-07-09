# Decisions

Why each pinned technology choice was made.

## SvelteKit + Svelte 5 (runes)

Compiler-first framework with minimal runtime — great for Lighthouse. Svelte 5 runes (`$state`, `$derived`, `$effect`) give fine-grained reactivity without boilerplate. Stores are plain classes with `$state` fields.

## TypeScript (strict)

Strict mode across the codebase. Combined with Zod, every PokeAPI response is validated at the boundary and fully typed downstream.

## adapter-static (SPA)

GitHub Pages serves static files only. `adapter-static` with `fallback: "404.html"` and `ssr = false` ships a static shell; dynamic routes resolve client-side. No server needed, and PokeAPI is queried directly from the browser.

## Tailwind CSS v4

CSS-first config via `@theme`. Type colors and design tokens are CSS variables. Note: `@theme static` is required so tokens referenced only in inline `style=` (the type-badge colors) are emitted — plain `@theme` tree-shakes unused tokens.

## Zod

Runtime validation + inferred types from one schema. Protects against PokeAPI shape drift and gives the whole app precise types for free.

## ultracite + oxlint + oxfmt

Rust-based lint/format (oxc) — dramatically faster than ESLint/Prettier. ultracite provides battle-tested presets. A few opinionated stylistic rules are relaxed where they fight idiomatic SvelteKit (PascalCase component filenames, semantic key order in Zod schemas, and `prefer-const` on `$state` vars reassigned only in templates).

## lefthook

Fast Git hooks. pre-commit runs oxlint + oxfmt + typecheck on staged files; pre-push runs the unit suite. Keeps `main` green.

## vitest + Playwright

vitest for unit/component tests (two projects: node + jsdom for `.svelte` tests). Playwright drives the built app end-to-end (list, search, detail, favorites, theme, 404) against the production preview server.

## @lucide/svelte dropped for a local Icon component

The v1 package ships raw `.svelte` icon files that Vite`s esbuild dep-scanner cannot load ("No loader configured for .svelte"); neither `optimizeDeps.exclude`nor deep per-icon imports resolved it. A tiny local inline-SVG`Icon.svelte` (Lucide path data, ISC-licensed) removed the dependency entirely and shrank the bundle.

## vite pinned to v7

The scaffold installed vite 8 (rolldown), but vitest 3 bundles vite 7 (rollup), causing plugin-type conflicts. Pinning `vite@^7` dedupes everything on 7.3.x.
