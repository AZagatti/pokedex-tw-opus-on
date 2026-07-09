<script lang="ts">
	import { base } from "$app/paths";
	import Icon from "$components/Icon.svelte";
	import FavoriteButton from "$components/FavoriteButton.svelte";
	import PokemonImage from "$components/PokemonImage.svelte";
	import TypeBadge from "$components/TypeBadge.svelte";
	import StatBar from "$components/StatBar.svelte";
	import EvolutionChain from "$components/EvolutionChain.svelte";
	import {
		artworkUrl,
		spriteUrl,
		formatDexNumber,
		formatHeight,
		formatWeight,
		titleCase,
		englishFlavorText,
		generationLabel,
	} from "$utils/format";
	import type { PageData } from "./$types";

	const { data }: { data: PageData } = $props();

	const p = $derived(data.pokemon);
	const accent = $derived(p.types[0]?.type.name ?? "normal");
	const total = $derived(p.stats.reduce((s, st) => s + st.base_stat, 0));
	const flavor = $derived(
		data.species ? englishFlavorText(data.species.flavor_text_entries) : ""
	);
	const genus = $derived(
		data.species?.genera?.find((g) => g.language.name === "en")?.genus ?? ""
	);

	let showShiny = $state(false);
	// Reset the shiny toggle when navigating between Pokémon (same component instance).
	$effect(() => {
		void p.id;
		showShiny = false;
	});
	const heroSrc = $derived(
		showShiny
			? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${p.id}.png`
			: artworkUrl(p.id)
	);

	function playCry() {
		const url =
			p.cries?.latest ??
			p.cries?.legacy ??
			`https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${p.id}.ogg`;
		const audio = new Audio(url);
		audio.volume = 0.4;
		void audio.play().catch(() => {});
	}
</script>

<svelte:head>
	<title>{titleCase(p.name)} — Pokédex</title>
	<meta name="description" content={flavor} />
</svelte:head>

<div class="animate-fade-in">
	<a
		href="{base}/"
		class="text-muted mb-4 inline-flex items-center gap-1 text-sm font-semibold hover:text-poke-red"
	>
		<Icon name="arrow-left" class="size-4" /> Back to Pokédex
	</a>

	<div
		class="surface relative overflow-hidden rounded-3xl border p-6 sm:p-8"
		style="--accent: var(--color-type-{accent})"
	>
		<div
			class="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full opacity-20 blur-2xl"
			style="background: var(--accent)"
			aria-hidden="true"
		></div>

		<div class="relative grid gap-6 md:grid-cols-2">
			<div class="flex flex-col items-center">
				<PokemonImage
					src={heroSrc}
					fallback={spriteUrl(p.id)}
					alt={titleCase(p.name)}
					eager={true}
					class="animate-pop-in h-56 w-56 drop-shadow-xl sm:h-64 sm:w-64"
				/>
				<div class="mt-3 flex items-center gap-2">
					<button
						type="button"
						onclick={() => (showShiny = !showShiny)}
						class="surface rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors hover:border-poke-red"
						aria-pressed={showShiny}
					>
						{showShiny ? "★ Shiny" : "☆ Normal"}
					</button>
					<button
						type="button"
						onclick={playCry}
						class="surface inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors hover:border-poke-red"
					>
						<Icon name="volume-2" class="size-3.5" /> Cry
					</button>
				</div>
			</div>

			<div class="flex flex-col justify-center">
				<div class="flex items-center justify-between gap-3">
					<span class="text-muted text-lg font-bold tabular-nums">
						{formatDexNumber(p.id)}
					</span>
					<FavoriteButton id={p.id} name={p.name} />
				</div>
				<h1 class="text-4xl font-extrabold capitalize sm:text-5xl">
					{titleCase(p.name)}
				</h1>
				{#if genus}
					<p class="text-muted mt-1 text-sm font-semibold">{genus}</p>
				{/if}
				<div class="mt-3 flex flex-wrap gap-2">
					{#each p.types as t (t.type.name)}
						<TypeBadge type={t.type.name} />
					{/each}
				</div>
				{#if flavor}
					<p class="mt-4 leading-relaxed">{flavor}</p>
				{/if}
				<div class="mt-5 grid grid-cols-2 gap-4">
					<div class="surface rounded-xl border p-3 text-center">
						<p class="text-muted text-xs font-semibold uppercase">Height</p>
						<p class="text-lg font-bold">{formatHeight(p.height)}</p>
					</div>
					<div class="surface rounded-xl border p-3 text-center">
						<p class="text-muted text-xs font-semibold uppercase">Weight</p>
						<p class="text-lg font-bold">{formatWeight(p.weight)}</p>
					</div>
				</div>
				<div class="mt-4">
					<p class="text-muted text-xs font-semibold uppercase">Abilities</p>
					<div class="mt-1 flex flex-wrap gap-2">
						{#each p.abilities as a (a.ability.name)}
							<span
								class="surface rounded-lg border px-2.5 py-1 text-sm font-medium capitalize"
								class:italic={a.is_hidden}
							>
								{titleCase(a.ability.name)}{a.is_hidden ? " (hidden)" : ""}
							</span>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="mt-6 grid gap-6 lg:grid-cols-2">
		<section class="surface rounded-2xl border p-6">
			<h2 class="mb-4 text-xl font-bold">Base Stats</h2>
			<div class="space-y-3">
				{#each p.stats as st (st.stat.name)}
					<StatBar name={st.stat.name} value={st.base_stat} {accent} />
				{/each}
				<div class="flex items-center gap-3 border-t pt-3">
					<span class="text-muted w-16 shrink-0 text-xs font-semibold">Total</span>
					<span class="w-8 shrink-0 text-right text-sm font-extrabold tabular-nums">
						{total}
					</span>
				</div>
			</div>
		</section>

		<section class="surface rounded-2xl border p-6">
			<h2 class="mb-4 text-xl font-bold">Evolution</h2>
			{#if data.evolution}
				<EvolutionChain chain={data.evolution} currentId={p.id} />
			{:else}
				<p class="text-muted text-sm">No evolution data available.</p>
			{/if}
		</section>
	</div>

	{#if data.species}
		<div class="text-muted mt-6 flex flex-wrap gap-4 text-sm">
			<span>Generation: <strong>{generationLabel(data.species.generation.name)}</strong></span>
			{#if data.species.is_legendary}<span class="font-bold text-amber-500">Legendary</span>{/if}
			{#if data.species.is_mythical}<span class="font-bold text-fuchsia-500">Mythical</span>{/if}
		</div>
	{/if}
</div>
