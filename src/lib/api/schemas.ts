import { z } from "zod";

const namedResource = z.object({
  name: z.string(),
  url: z.string(),
});

export const pokemonListSchema = z.object({
  count: z.number(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(namedResource),
});
export type PokemonListResponse = z.infer<typeof pokemonListSchema>;

export const pokemonSchema = z.object({
  abilities: z.array(
    z.object({
      ability: namedResource,
      is_hidden: z.boolean(),
      slot: z.number(),
    })
  ),
  base_experience: z.number().nullable().optional(),
  cries: z
    .object({
      latest: z.string().nullable().optional(),
      legacy: z.string().nullable().optional(),
    })
    .optional(),
  height: z.number(),
  id: z.number(),
  moves: z.array(
    z.object({
      move: namedResource,
    })
  ),
  name: z.string(),
  order: z.number().optional(),
  species: namedResource,
  sprites: z.object({
    front_default: z.string().nullable(),
    back_default: z.string().nullable(),
    front_shiny: z.string().nullable(),
    other: z
      .object({
        "official-artwork": z
          .object({
            front_default: z.string().nullable(),
            front_shiny: z.string().nullable().optional(),
          })
          .optional(),
        home: z
          .object({
            front_default: z.string().nullable(),
          })
          .optional(),
        showdown: z
          .object({
            front_default: z.string().nullable(),
          })
          .optional(),
      })
      .optional(),
  }),
  stats: z.array(
    z.object({
      base_stat: z.number(),
      effort: z.number(),
      stat: namedResource,
    })
  ),
  types: z.array(
    z.object({
      slot: z.number(),
      type: namedResource,
    })
  ),
  weight: z.number(),
});
export type Pokemon = z.infer<typeof pokemonSchema>;

export const speciesSchema = z.object({
  base_happiness: z.number().nullable(),
  capture_rate: z.number(),
  color: namedResource,
  evolution_chain: z.object({ url: z.string() }),
  flavor_text_entries: z.array(
    z.object({
      flavor_text: z.string(),
      language: namedResource,
      version: namedResource,
    })
  ),
  genera: z.array(
    z.object({
      genus: z.string(),
      language: namedResource,
    })
  ),
  generation: namedResource,
  habitat: namedResource.nullable(),
  id: z.number(),
  is_baby: z.boolean(),
  is_legendary: z.boolean(),
  is_mythical: z.boolean(),
  name: z.string(),
});
export type Species = z.infer<typeof speciesSchema>;

const evoLinkSchema: z.ZodType<EvoLink> = z.lazy(() =>
  z.object({
    evolution_details: z.array(
      z.object({
        min_level: z.number().nullable().optional(),
        trigger: namedResource.nullable().optional(),
        item: namedResource.nullable().optional(),
      })
    ),
    evolves_to: z.array(evoLinkSchema),
    species: namedResource,
  })
);
export interface EvoLink {
  species: { name: string; url: string };
  evolves_to: EvoLink[];
  evolution_details: {
    min_level?: number | null;
    trigger?: { name: string; url: string } | null;
    item?: { name: string; url: string } | null;
  }[];
}

export const evolutionChainSchema = z.object({
  chain: evoLinkSchema,
  id: z.number(),
});
export type EvolutionChain = z.infer<typeof evolutionChainSchema>;

export const generationSchema = z.object({
  id: z.number(),
  main_region: namedResource,
  name: z.string(),
  pokemon_species: z.array(namedResource),
});
export type Generation = z.infer<typeof generationSchema>;

export const typeSchema = z.object({
  id: z.number(),
  name: z.string(),
  pokemon: z.array(
    z.object({
      pokemon: namedResource,
      slot: z.number(),
    })
  ),
});
export type TypeResponse = z.infer<typeof typeSchema>;

export const berryListSchema = pokemonListSchema;

export const berrySchema = z.object({
  firmness: namedResource,
  flavors: z.array(
    z.object({
      potency: z.number(),
      flavor: namedResource,
    })
  ),
  growth_time: z.number(),
  id: z.number(),
  item: namedResource,
  max_harvest: z.number(),
  name: z.string(),
  natural_gift_power: z.number(),
  natural_gift_type: namedResource,
  size: z.number(),
  smoothness: z.number(),
  soil_dryness: z.number(),
});
export type Berry = z.infer<typeof berrySchema>;
