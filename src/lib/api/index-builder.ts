import { ALL_GENERATIONS, ALL_TYPES, idFromUrl } from "$utils/format";

import { getGeneration, getType, TOTAL_POKEMON } from "./client";

export interface IndexEntry {
  id: number;
  name: string;
  types: string[];
  generation: number;
}

let indexPromise: Promise<IndexEntry[]> | null = null;

/**
 * Build a searchable index of every Pokémon (id, name, types, generation)
 * by combining 18 type endpoints and 9 generation endpoints — roughly 27
 * cached requests instead of 1025 individual Pokémon fetches.
 *
 * The result is memoised for the lifetime of the page.
 */
export function buildIndex(): Promise<IndexEntry[]> {
  if (indexPromise) {
    return indexPromise;
  }

  indexPromise = (async () => {
    const entries = new Map<number, IndexEntry>();

    // Generation membership -> id + generation number.
    const gens = await Promise.all(
      ALL_GENERATIONS.map((g) => getGeneration(g.id))
    );
    for (const gen of gens) {
      const genNum = gen.id;
      for (const species of gen.pokemon_species) {
        const id = idFromUrl(species.url);
        if (id > TOTAL_POKEMON) {
          continue;
        }
        entries.set(id, {
          generation: genNum,
          id,
          name: species.name,
          types: [],
        });
      }
    }

    // Type membership -> attach types to each entry.
    const types = await Promise.all(ALL_TYPES.map((t) => getType(t)));
    for (const type of types) {
      for (const member of type.pokemon) {
        const id = idFromUrl(member.pokemon.url);
        const entry = entries.get(id);
        if (entry && !entry.types.includes(type.name)) {
          entry.types.push(type.name);
        }
      }
    }

    return [...entries.values()].toSorted((a, b) => a.id - b.id);
  })().catch((error) => {
    indexPromise = null;
    throw error;
  });

  return indexPromise;
}

/** Test helper — reset the memoised index. */
export function __resetIndex(): void {
  indexPromise = null;
}
