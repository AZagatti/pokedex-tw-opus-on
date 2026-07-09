<script lang="ts">
	import { base } from "$app/paths";
	import PokemonImage from "./PokemonImage.svelte";
	import type { EvolutionChain, EvoLink } from "$api/schemas";
	import { artworkUrl, spriteUrl, idFromUrl, titleCase } from "$utils/format";

	const { chain, currentId = 0 }: { chain: EvolutionChain; currentId?: number } =
		$props();

	interface Stage {
		id: number;
		name: string;
	}

	// Group the evolution tree into levels (columns): base, stage 2, stage 3.
	// Branched families (e.g. Eevee) show the base once, fanning out to all
	// evolutions in the next column instead of repeating the base per branch.
	function toLevels(root: EvoLink): Stage[][] {
		const levels: Stage[][] = [];
		let current: EvoLink[] = [root];
		while (current.length > 0) {
			const seen = new Set<number>();
			const row: Stage[] = [];
			const next: EvoLink[] = [];
			for (const link of current) {
				const id = idFromUrl(link.species.url);
				if (!seen.has(id)) {
					seen.add(id);
					row.push({ id, name: link.species.name });
				}
				next.push(...link.evolves_to);
			}
			levels.push(row);
			current = next;
		}
		return levels;
	}

	const levels = $derived(toLevels(chain.chain));
</script>

<div class="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
	{#each levels as level, i (i)}
		{#if i > 0}
			<span class="text-muted text-2xl" aria-hidden="true">→</span>
		{/if}
		<div class="flex flex-col gap-3">
			{#each level as stage (stage.id)}
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
