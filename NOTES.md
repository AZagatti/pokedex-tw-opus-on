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
