import { getEvolutionChain, getPokemon, getSpecies } from "$api/client";
import { error } from "@sveltejs/kit";
import type { NumericRange } from "@sveltejs/kit";

import type { PageLoad } from "./$types";

interface HttpError {
  status?: number;
}

export const load: PageLoad = async ({ params }) => {
  try {
    const pokemon = await getPokemon(params.name);
    const species = await getSpecies(pokemon.species.name);
    const evolution = await getEvolutionChain(species.evolution_chain.url);
    return { evolution, pokemon, species };
  } catch (err) {
    const status = (err as HttpError).status;
    if (status === 404) {
      throw error(404, `Pokémon "${params.name}" not found`);
    }
    const code = (status ?? 500) as NumericRange<400, 599>;
    throw error(code, `Failed to load "${params.name}"`);
  }
};
