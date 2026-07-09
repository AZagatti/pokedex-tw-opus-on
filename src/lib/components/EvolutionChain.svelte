<script lang="ts">
	import { base } from "$app/paths";
	import PokemonImage from "./PokemonImage.svelte";
	import type { EvolutionChain, EvoLink } from "$api/schemas";
	import { artworkUrl, spriteUrl, idFromUrl, titleCase } from "$utils/format";

	const { chain, currentId = 0 }: { chain: EvolutionChain; currentId?: number } =
		$props();

	interface Stage { id: number; name: string }

	// Flatten the evolution tree into ordered stages (linear chains + branches).
	function collect(link: EvoLink): Stage[][] {
		const id = idFromUrl(link.species.url);
		const self: Stage = { id, name: link.species.name };
		if (link.evolves_to.length === 0) {
			return [[self]];
		}
		const paths: Stage[][] = [];
		for (const next of link.evolves_to) {
			for (const tail of collect(next)) {
				paths.push([self, ...tail]);
			}
		}
		return paths;
	}

	const paths = $derived(collect(chain.chain));
</script>

<div class="flex flex-col gap-4">
	{#each paths as path, i (i)}
		<div class="flex flex-wrap items-center justify-center gap-2">
			{#each path as stage, j (stage.id)}
				{#if j > 0}
					<span class="text-muted text-2xl" aria-hidden="true">→</span>
				{/if}
				<a
					href="{base}/pokemon/{stage.name}/"
					class="surface flex flex-col items-center rounded-xl border p-2 transition-transform hover:-translate-y-1 hover:shadow-md {stage.id ===
						currentId
						? 'ring-2 ring-poke-red'
						: ''}"
				>
					<PokemonImage
						src={artworkUrl(stage.id)}
						fallback={spriteUrl(stage.id)}
						alt={titleCase(stage.name)}
						class="h-16 w-16"
					/>
					<span class="mt-1 text-xs font-semibold">{titleCase(stage.name)}</span>
				</a>
			{/each}
		</div>
	{/each}
</div>
