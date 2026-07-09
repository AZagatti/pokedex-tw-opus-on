<script lang="ts">
	import { onMount } from "svelte";
	import { base } from "$app/paths";
	import { getBerryList } from "$api/client";
	import { idFromUrl, titleCase } from "$utils/format";
	import Skeleton from "$components/Skeleton.svelte";

	interface BerryItem { id: number; name: string }
	let berries = $state<BerryItem[]>([]);
	let loading = $state(true);
	let errored = $state(false);
	let search = $state("");

	const filtered = $derived(
		berries.filter((b) => b.name.includes(search.trim().toLowerCase()))
	);

	onMount(async () => {
		try {
			const list = await getBerryList();
			berries = list.results.map((r) => ({
				id: idFromUrl(r.url),
				name: r.name,
			}));
		} catch {
			errored = true;
		} finally {
			loading = false;
		}
	});
</script>

<svelte:head>
	<title>Berries — Pokédex</title>
	<meta name="description" content="Browse all Pokémon berries." />
</svelte:head>

<section class="animate-fade-in">
	<div class="mb-6">
		<h1 class="text-3xl font-extrabold sm:text-4xl">Berries</h1>
		<p class="text-muted mt-1">Browse all {berries.length || 64} berries.</p>
	</div>

	<input
		type="search"
		bind:value={search}
		placeholder="Search berries…"
		aria-label="Search berries"
		class="surface mb-6 w-full max-w-sm rounded-xl border px-4 py-2.5 text-sm shadow-sm focus:outline-none"
	/>

	{#if loading}
		<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
			{#each Array(15) as _, i (i)}
				<Skeleton class="h-32" rounded="rounded-2xl" />
			{/each}
		</div>
	{:else if errored}
		<p class="text-muted py-12 text-center">Could not load berries. Please try again later.</p>
	{:else if filtered.length === 0}
		<p class="text-muted py-12 text-center">No berries match “{search}”.</p>
	{:else}
		<div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
			{#each filtered as berry (berry.id)}
				<a
					href="{base}/berries/{berry.name}/"
					class="group surface animate-pop-in flex flex-col items-center rounded-2xl border p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
				>
					<img
						src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/{berry.name}-berry.png"
						alt={titleCase(berry.name)}
						loading="lazy"
						class="h-16 w-16 transition-transform group-hover:scale-110"
						style="image-rendering: pixelated"
					/>
					<span class="mt-2 text-center text-sm font-semibold">{titleCase(berry.name)}</span>
				</a>
			{/each}
		</div>
	{/if}
</section>
