import { cachedFetch } from "./cache";
import {
  berrySchema,
  evolutionChainSchema,
  generationSchema,
  pokemonListSchema,
  pokemonSchema,
  speciesSchema,
  typeSchema,
  berryListSchema,
} from "./schemas";
import type {
  Berry,
  EvolutionChain,
  Generation,
  Pokemon,
  PokemonListResponse,
  Species,
  TypeResponse,
} from "./schemas";

const BASE = "https://pokeapi.co/api/v2";

/** Total number of Pokémon with a national dex number in PokeAPI. */
export const TOTAL_POKEMON = 1025;

/** Number of berries in PokeAPI. */
export const TOTAL_BERRIES = 64;

export function getPokemonList(
  limit = TOTAL_POKEMON,
  offset = 0
): Promise<PokemonListResponse> {
  return cachedFetch(`${BASE}/pokemon?limit=${limit}&offset=${offset}`, (d) =>
    pokemonListSchema.parse(d)
  );
}

export function getPokemon(nameOrId: string | number): Promise<Pokemon> {
  return cachedFetch(`${BASE}/pokemon/${nameOrId}`, (d) =>
    pokemonSchema.parse(d)
  );
}

export function getSpecies(nameOrId: string | number): Promise<Species> {
  return cachedFetch(`${BASE}/pokemon-species/${nameOrId}`, (d) =>
    speciesSchema.parse(d)
  );
}

export function getEvolutionChain(url: string): Promise<EvolutionChain> {
  return cachedFetch(url, (d) => evolutionChainSchema.parse(d));
}

export function getGeneration(idOrName: string | number): Promise<Generation> {
  return cachedFetch(`${BASE}/generation/${idOrName}`, (d) =>
    generationSchema.parse(d)
  );
}

export function getType(idOrName: string | number): Promise<TypeResponse> {
  return cachedFetch(`${BASE}/type/${idOrName}`, (d) => typeSchema.parse(d));
}

export function getBerryList(
  limit = TOTAL_BERRIES,
  offset = 0
): Promise<PokemonListResponse> {
  return cachedFetch(`${BASE}/berry?limit=${limit}&offset=${offset}`, (d) =>
    berryListSchema.parse(d)
  );
}

export function getBerry(nameOrId: string | number): Promise<Berry> {
  return cachedFetch(`${BASE}/berry/${nameOrId}`, (d) => berrySchema.parse(d));
}
