# Build journal — Pokédex (SvelteKit)

## 2026-07-08/09 (session 2 — rebuild from memory blueprint)

- **Clean slate again:** prior session ai-memory page documented a full architecture + toolchain, but ZERO artifacts on disk (only SPEC.md). Rebuilt from the memory blueprint.
- **sv create non-empty dir:** `--force` is not valid; CLI prompts interactively. Scaffolded in /tmp then copied files in.
- **npm allow-scripts:** esbuild + lefthook postinstall blocked; ran `npm approve-scripts esbuild lefthook`.
- **oxfmt version:** real latest 0.58.0, not 0.1.x. Fixed to ^0.58.0 (0.1.0 installed no binary).
- **vite v8/v7 mismatch:** scaffold gave vite@8 (rolldown) but vitest 3.2.7 bundles vite@7; 2 plugin-type errors in vite.config.ts. Pinned vite@^7 -> all dedupe to 7.3.6, check clean.

## TRIMWIRE environment hazards (the big findings)

- **Writes decay to placeholders asynchronously.** A file written correctly (verified byte count) can later be re-read as a ~138B placeholder `[trimwire: wrote <path> (<N>B)]` ON DISK. Happened to Icon.svelte. Any tree file can decay anytime. `/tmp` is NOT affected.
- **The Write tool sometimes persists the placeholder instead of content**; heredoc bash input sometimes gets elided (fails loud: "bad pattern: [trimwire:"). Retrying or using small printf-append chunks works.
- **Shell CWD persists across Bash calls.** An earlier `cd node_modules/...` made relative-path checks look in the wrong dir and falsely report src/ "deleted". FIX: every Bash cmd starts with `cd <project root>`.
- **Resilience system:** golden copies of every source file in `/tmp/golden/` (decay-safe) + `/tmp/restore.sh` re-syncs golden->tree (overwrites placeholders/missing/changed). Workflow: edit tree -> copy to golden -> run restore before every build/check/commit/push.

## Toolchain / dependency decisions

- **@lucide/svelte v1 dropped.** dist ships raw .svelte files Vite esbuild dep-scanner cannot load; optimizeDeps.exclude and deep imports both failed. Replaced with local inline-SVG Icon.svelte (Lucide path data, ISC). Anti-stuck: 2 same-class fixes failed -> changed approach.
- **Subagent review (round 1)** on list+detail: fixed (1) ThemeStore never applied initial theme → added constructor calling apply(); (2) detail loader used pokemon.id for species → added species:namedResource to pokemonSchema, use pokemon.species.name (fixes form variants); (3) blanket catch→404 → ApiError class w/ .status, loader distinguishes 404 vs 5xx; (5) button nested in anchor (invalid HTML) → FavoriteButton moved to sibling of <a> in PokemonCard; (6) failed-image a11y → role=img + aria-label; (8) debounce timer cleanup added. #4 (SSR fetch threading) N/A — app is SPA (ssr=false).
- **oxlint ultra-strict + autofix hazard:** ultracite oxlint preset flags 80+ stylistic issues. `oxlint --fix` is DANGEROUS with Svelte 5 — it rewrote reassigned `$state` `let`→`const`, breaking the compiler (constant_assignment). Fixed by reverting those and adding a `**/*.svelte` override disabling `prefer-const`. Disabled other cosmetic rules (func-style, filename-case, sort-keys, catch-error-name, promise/prefer-await-*). Genuine fixes kept: no-shadow in loader (catch shadowed kit `error` import), default-case.
- **oxfmt flags:** `-w` invalid; correct is `--write` (default) / `--check`. Fixed scripts. Config `oxfmt.config.ts` spreads `ultracite/oxfmt` (2-space indent).

## 2026-07-09 (session 2 — Lighthouse + deploy)

- **adapter-static emitted no index.html:** root had prerender=false, so only 404.html was written → GitHub Pages `/` would 404. Fix: set `prerender = true` in root +layout.ts (static routes prerender for SEO/perf), add `export const prerender = false` to the two dynamic `[name]` loaders (they fall back to 404.html client-side). Now index.html + berries/ + favorites/ prerender.
- **CI `npm ci` ERESOLVE:** scaffold pulled `@sveltejs/vite-plugin-svelte@7` (needs vite@8) but I pinned vite@7 (vitest compat). `npm install` was lenient; `npm ci` strict-failed. Fix: pin `@sveltejs/vite-plugin-svelte@^6` (accepts vite ^7). First CI run failed on this; second run green.
- **Lighthouse a11y contrast:** type badges (white on light type colors) + red text links failed 4.5:1. Fixes: badges → `color-mix(type 55%, black 45%)` (all 18 pass AA); text links → theme-aware `--link` (#c20d0d light / #f87171 dark). A11y 100.
- **heading-order:** cards used <h3> after <h1> (skipped h2). Changed card titles to <p>.
- **Best-Practices 96 (not 100):** only failure is transient 429 rate-limiting from raw.githubusercontent.com when loading ~48 artwork PNGs. External/intermittent (scores 96↔100); ≥90 DoD met. Images fall back gracefully. Not worth chasing.
- **stale vite cache:** new `.text-link` utility was missing from built CSS until `rm -rf .svelte-kit build node_modules/.vite` clean rebuild.
- **Subagent reviews (2 rounds):** fixed theme-init-on-load, button-in-anchor (cards + favorites), species-for-forms + typed ApiError 404 handling, image-fallback a11y, debounce cleanup, showShiny reset on nav, API cries.latest, StatBar aria-hidden, berries aria-live + error copy, and rewrote EvolutionChain to render branched trees (Eevee) as base-once fan-out.
- **Spec sort gap closed:** added "Stat total ↓" sort (lazily fetches base-stat totals for the filtered set via cached getPokemon, aria-live loading hint) + debounce 200→250ms per SPEC #2. Verified live: dragon-type by stat total → Eternatus, Rayquaza, Dialga…
