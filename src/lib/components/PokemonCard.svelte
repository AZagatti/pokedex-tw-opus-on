<script lang="ts">
	import { base } from "$app/paths";
	import FavoriteButton from "./FavoriteButton.svelte";
	import PokemonImage from "./PokemonImage.svelte";
	import TypeBadge from "./TypeBadge.svelte";
	import {
		artworkUrl,
		spriteUrl,
		formatDexNumber,
		titleCase,
	} from "$utils/format";

	const {
		id,
		name,
		types,
		eager = false,
	}: {
		id: number;
		name: string;
		types: string[];
		eager?: boolean;
	} = $props();

	const primaryType = $derived(types[0] ?? "normal");
</script>

<div class="group relative">
	<div class="absolute right-1 top-1 z-10">
		<FavoriteButton {id} {name} />
	</div>

	<a
		href="{base}/pokemon/{name}/"
		class="surface animate-pop-in flex flex-col items-center rounded-2xl border p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl focus-visible:-translate-y-1"
		style="--card-accent: var(--color-type-{primaryType})"
		data-testid="pokemon-card"
	>
		<div
			class="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-200 group-hover:opacity-10"
			style="background: radial-gradient(circle at 50% 20%, var(--card-accent), transparent 70%)"
			aria-hidden="true"
		></div>

		<span class="text-muted self-start text-xs font-bold tabular-nums">
			{formatDexNumber(id)}
		</span>

		<PokemonImage
			src={artworkUrl(id)}
			fallback={spriteUrl(id)}
			alt={titleCase(name)}
			{eager}
			class="h-28 w-28 transition-transform duration-200 group-hover:scale-110"
		/>

		<h3 class="mt-2 text-center text-base font-bold">{titleCase(name)}</h3>

		<div class="mt-2 flex flex-wrap justify-center gap-1">
			{#each types as type (type)}
				<TypeBadge {type} size="sm" />
			{/each}
		</div>
	</a>
</div>
