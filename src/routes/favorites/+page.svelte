<script lang="ts">
	import { base } from "$app/paths";
	import Icon from "$components/Icon.svelte";
	import PokemonImage from "$components/PokemonImage.svelte";
	import { favorites } from "$stores/favorites.svelte";
	import { artworkUrl, spriteUrl, formatDexNumber, titleCase } from "$utils/format";

	const pokemon = $derived(favorites.byKind("pokemon"));
	const berries = $derived(favorites.byKind("berry"));
	function berrySprite(name: string): string {
		return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${name}-berry.png`;
	}
</script>

<svelte:head>
	<title>Favorites — Pokédex</title>
	<meta name="description" content="Your saved favorite Pokémon and berries." />
</svelte:head>

<div class="animate-fade-in">
	<h1 class="text-3xl font-extrabold sm:text-4xl">Favorites</h1>
	<p class="text-muted mt-1">{favorites.count} saved item{favorites.count === 1 ? "" : "s"}.</p>

	{#if favorites.count === 0}
		<div class="mt-16 flex flex-col items-center gap-4 text-center">
			<Icon name="heart" size={48} class="text-slate-300 dark:text-slate-600" />
			<p class="text-muted max-w-sm">
				No favorites yet. Tap the heart on any Pokémon or berry to save it here.
			</p>
			<a href="{base}/" class="rounded-full bg-poke-red px-5 py-2 font-semibold text-white transition hover:bg-poke-dark">
				Browse Pokémon
			</a>
		</div>
	{:else}
		{#if pokemon.length > 0}
			<h2 class="mt-8 mb-3 text-xl font-bold">Pokémon</h2>
			<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
				{#each pokemon as fav (fav.id)}
					<div class="relative">
						<button
							type="button"
							onclick={() => favorites.toggle({ kind: "pokemon", id: fav.id, name: fav.name })}
							class="text-link absolute right-2 top-2 z-10 transition hover:scale-110"
							aria-label="Remove {fav.name} from favorites"
						>
							<Icon name="heart" filled size={18} />
						</button>
						<a href="{base}/pokemon/{fav.name}/" class="surface group animate-pop-in flex flex-col items-center rounded-2xl border p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
							<span class="text-muted self-start text-xs font-bold tabular-nums">{formatDexNumber(fav.id)}</span>
							<PokemonImage src={artworkUrl(fav.id)} fallback={spriteUrl(fav.id)} alt={titleCase(fav.name)} class="h-24 w-24 transition-transform group-hover:scale-110" />
							<p class="mt-2 text-center font-bold">{titleCase(fav.name)}</p>
						</a>
					</div>
				{/each}
			</div>
		{/if}
		{#if berries.length > 0}
			<h2 class="mt-8 mb-3 text-xl font-bold">Berries</h2>
			<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
				{#each berries as fav (fav.id)}
					<div class="relative">
						<button
							type="button"
							onclick={() => favorites.toggle({ kind: "berry", id: fav.id, name: fav.name })}
							class="text-link absolute right-2 top-2 z-10 transition hover:scale-110"
							aria-label="Remove {fav.name} from favorites"
						>
							<Icon name="heart" filled size={18} />
						</button>
						<a href="{base}/berries/{fav.name}/" class="surface group animate-pop-in flex flex-col items-center rounded-2xl border p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
							<img src={berrySprite(fav.name)} alt={titleCase(fav.name)} class="h-16 w-16 object-contain [image-rendering:pixelated]" loading="lazy" />
							<p class="mt-2 text-center font-bold capitalize">{titleCase(fav.name)} Berry</p>
						</a>
					</div>
				{/each}
			</div>
		{/if}
	{/if}
</div>
