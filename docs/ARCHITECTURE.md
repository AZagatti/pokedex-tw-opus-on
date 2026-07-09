# Architecture

The Pokédex is a **client-rendered SPA**. There is no application server: SvelteKit (`adapter-static`) emits a static shell that GitHub Pages serves, and all data is fetched in the browser directly from [PokeAPI](https://pokeapi.co/api/v2).

## Rendering model

- `src/routes/+layout.ts` sets `ssr = false` and `prerender = false` — pure SPA.
- `adapter-static` is configured with `fallback: "404.html"`, so deep links to dynamic routes (e.g. `/pokemon/pikachu/`) are served the SPA shell and resolved client-side by the router.
- `paths.base` is driven by `BASE_PATH` (set to `/pokedex-tw-opus-on` in CI) so all internal links and assets resolve under the project-Pages subpath.

## Data flow

```
component / load()  ->  api/client.ts  ->  api/cache.ts  ->  fetch(PokeAPI)
                              |                  |
                        zod schema         Map<url, parsed>
                        validation         + in-flight dedupe
```

- **`api/client.ts`** — one typed function per resource (`getPokemon`, `getSpecies`, `getEvolutionChain`, `getType`, `getGeneration`, `getBerry`, …). Each pipes the response through a Zod schema, so the rest of the app works with validated types.
- **`api/cache.ts`** — a `Map` keyed by URL. PokeAPI data is immutable, so entries never expire. Concurrent requests for the same URL share one in-flight promise (dedupe), and failures evict the in-flight entry so they can be retried.
- **`api/schemas.ts`** — Zod schemas + inferred TypeScript types (single source of truth).

## The search index

The list page needs id, name, types, and generation for **all 1025 Pokémon**. Fetching `/pokemon/{id}` 1025 times would be slow and hammer the API. Instead, `api/index-builder.ts` builds the index from aggregate endpoints:

- **9 generation endpoints** → which species belong to each generation (id + gen).
- **18 type endpoints** → which Pokémon have each type.

Merged into a single `IndexEntry[]` (~27 cached requests total), memoised for the page lifetime. This powers **instant** client-side search, type/generation filtering, and sorting with no further network calls. The grid then lazy-loads artwork per card and paginates via an `IntersectionObserver` sentinel (infinite scroll).

## Routes

| Route             | Rendering       | Data                                |
| ----------------- | --------------- | ----------------------------------- |
| `/`               | SPA             | search index (aggregate endpoints)  |
| `/pokemon/[name]` | SPA + `load()`  | pokemon + species + evolution chain |
| `/berries`        | SPA             | berry list                          |
| `/berries/[name]` | SPA + `load()`  | single berry                        |
| `/favorites`      | SPA             | localStorage (favorites store)      |
| `/*` (unknown)    | `+error.svelte` | —                                   |

## State

- **`stores/favorites.svelte.ts`** — a runes class (`$state`) backing an array of favorites, persisted to `localStorage` under `pokedex:favorites`.
- **`stores/theme.svelte.ts`** — light/dark theme, persisted under `pokedex:theme`, applied to `<html>` on construction; an inline script in `app.html` sets the class before hydration to prevent a flash of the wrong theme (FOUC).

## Performance notes

- In-memory cache + request dedupe eliminate duplicate network calls across navigation.
- Icons are a single local inline-SVG component — no icon library in the bundle.
- Images are lazy-loaded with a skeleton placeholder and a sprite fallback on error.
- `prefers-reduced-motion` disables animations for users who ask for it.
