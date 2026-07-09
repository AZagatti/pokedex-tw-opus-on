<script lang="ts">
	import { onMount } from "svelte";
	import { buildIndex } from '$api/index-builder';
import type { IndexEntry } from '$api/index-builder';
	import PokemonCard from "$components/PokemonCard.svelte";
	import Skeleton from "$components/Skeleton.svelte";
	import TypeBadge from "$components/TypeBadge.svelte";
	import { ALL_GENERATIONS, ALL_TYPES } from "$utils/format";
	import Icon from "$components/Icon.svelte";

	type SortKey = "id-asc" | "id-desc" | "name-asc" | "name-desc";

	const PAGE_SIZE = 48;

	let all = $state<IndexEntry[]>([]);
	let loading = $state(true);
	let error = $state<string | null>(null);

	let search = $state("");
	let debouncedSearch = $state("");
	let selectedGen = $state<number | null>(null);
	let selectedTypes = $state<string[]>([]);
	let sort = $state<SortKey>("id-asc");
	let showFilters = $state(false);
	let visibleCount = $state(PAGE_SIZE);

	let debounceTimer: ReturnType<typeof setTimeout>;
	$effect(() => {
		const value = search;
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			debouncedSearch = value.trim().toLowerCase();
		}, 200);
		return () => clearTimeout(debounceTimer);
	});

	onMount(async () => {
		try {
			all = await buildIndex();
		} catch (err) {
			error = err instanceof Error ? err.message : "Failed to load Pokédex.";
		} finally {
			loading = false;
		}
	});

	const filtered = $derived.by(() => {
		let list = all;
		if (debouncedSearch) {
			const q = debouncedSearch;
			const asNum = Number(q);
			list = list.filter(
				(p) =>
					p.name.includes(q) ||
					(Number.isFinite(asNum) && String(p.id).includes(q))
			);
		}
		if (selectedGen !== null) {
			list = list.filter((p) => p.generation === selectedGen);
		}
		if (selectedTypes.length > 0) {
			list = list.filter((p) =>
				selectedTypes.every((t) => p.types.includes(t))
			);
		}
		const sorted = [...list];
		switch (sort) {
			case "id-asc": {
				sorted.sort((a, b) => a.id - b.id);
				break;
			}
			case "id-desc": {
				sorted.sort((a, b) => b.id - a.id);
				break;
			}
			case "name-asc": {
				sorted.sort((a, b) => a.name.localeCompare(b.name));
				break;
			}
			case "name-desc": {
				sorted.sort((a, b) => b.name.localeCompare(a.name));
				break;
			}
			default: {
				break;
			}
		}
		return sorted;
	});

	const visible = $derived(filtered.slice(0, visibleCount));
	const hasActiveFilters = $derived(
		debouncedSearch !== "" || selectedGen !== null || selectedTypes.length > 0
	);

	// Reset pagination whenever filters change.
	$effect(() => {
		// Reference reactive deps so this re-runs on change.
		void debouncedSearch;
		void selectedGen;
		void selectedTypes;
		void sort;
		visibleCount = PAGE_SIZE;
	});

	function toggleType(type: string) {
		selectedTypes = selectedTypes.includes(type)
			? selectedTypes.filter((t) => t !== type)
			: [...selectedTypes, type];
	}

	function clearFilters() {
		search = "";
		debouncedSearch = "";
		selectedGen = null;
		selectedTypes = [];
		sort = "id-asc";
	}

	let sentinel = $state<HTMLDivElement | null>(null);
	$effect(() => {
		if (!sentinel) {
			return;
		}
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0]?.isIntersecting && visibleCount < filtered.length) {
					visibleCount = Math.min(visibleCount + PAGE_SIZE, filtered.length);
				}
			},
			{ rootMargin: "600px" }
		);
		observer.observe(sentinel);
		return () => observer.disconnect();
	});
</script>

<svelte:head>
	<title>Pokédex — Explore all 1025 Pokémon</title>
	<meta
		name="description"
		content="Browse, search, and filter every Pokémon by name, type, and generation. A fast, modern Pokédex built with SvelteKit."
	/>
</svelte:head>

<section class="mb-6">
	<h1 class="text-3xl font-black tracking-tight sm:text-4xl">Pokédex</h1>
	<p class="text-muted mt-1">
		Search and filter all {all.length || 1025} Pokémon.
	</p>
</section>

<!-- Sticky toolbar -->
<div
	class="surface sticky top-16 z-20 mb-6 rounded-xl border p-3 shadow-sm backdrop-blur"
>
	<div class="flex flex-col gap-3 sm:flex-row sm:items-center">
		<div class="relative flex-1">
			<Icon
				name="search"
				class="text-muted pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2"
			/>
			<input
				type="search"
				bind:value={search}
				placeholder="Search by name or number…"
				aria-label="Search Pokémon"
				class="surface w-full rounded-lg border py-2 pl-9 pr-3 text-sm outline-none focus:border-poke-red"
			/>
		</div>

		<select
			bind:value={sort}
			aria-label="Sort order"
			class="surface rounded-lg border px-3 py-2 text-sm outline-none focus:border-poke-red"
		>
			<option value="id-asc">Number ↑</option>
			<option value="id-desc">Number ↓</option>
			<option value="name-asc">Name A–Z</option>
			<option value="name-desc">Name Z–A</option>
		</select>

		<button
			type="button"
			onclick={() => (showFilters = !showFilters)}
			aria-expanded={showFilters}
			class="surface inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:border-poke-red"
		>
			<Icon name="sliders-horizontal" class="size-4" />
			Filters
			{#if selectedTypes.length + (selectedGen !== null ? 1 : 0) > 0}
				<span
					class="rounded-full bg-poke-red px-1.5 text-xs font-bold text-white"
				>
					{selectedTypes.length + (selectedGen !== null ? 1 : 0)}
				</span>
			{/if}
		</button>
	</div>

	{#if showFilters}
		<div class="mt-3 space-y-3 border-t pt-3">
			<div>
				<p class="mb-1.5 text-xs font-semibold uppercase text-muted">
					Generation
				</p>
				<div class="flex flex-wrap gap-1.5">
					{#each ALL_GENERATIONS as gen (gen.id)}
						<button
							type="button"
							onclick={() =>
								(selectedGen = selectedGen === gen.id ? null : gen.id)}
							aria-pressed={selectedGen === gen.id}
							class="rounded-full border px-3 py-1 text-xs font-medium transition {selectedGen ===
							gen.id
								? 'border-poke-red bg-poke-red text-white'
								: 'surface hover:border-poke-red'}"
						>
							{gen.label}
						</button>
					{/each}
				</div>
			</div>

			<div>
				<p class="mb-1.5 text-xs font-semibold uppercase text-muted">Type</p>
				<div class="flex flex-wrap gap-1.5">
					{#each ALL_TYPES as type (type)}
						<button
							type="button"
							onclick={() => toggleType(type)}
							aria-pressed={selectedTypes.includes(type)}
							class="rounded-full transition {selectedTypes.includes(type)
								? 'ring-2 ring-offset-1 ring-poke-red'
								: 'opacity-70 hover:opacity-100'}"
						>
							<TypeBadge {type} size="sm" />
						</button>
					{/each}
				</div>
			</div>
		</div>
	{/if}
</div>

<!-- Active filter summary -->
{#if hasActiveFilters}
	<div class="mb-4 flex items-center justify-between gap-2">
		<p class="text-muted text-sm" aria-live="polite">
			{filtered.length}
			{filtered.length === 1 ? "result" : "results"}
		</p>
		<button
			type="button"
			onclick={clearFilters}
			class="inline-flex items-center gap-1 text-sm font-medium text-poke-red hover:underline"
		>
			<Icon name="x" class="size-3.5" /> Clear filters
		</button>
	</div>
{/if}

<!-- Content -->
{#if error}
	<div
		class="surface rounded-xl border border-red-300 p-8 text-center"
		role="alert"
	>
		<p class="font-semibold text-poke-red">Couldn't load the Pokédex</p>
		<p class="text-muted mt-1 text-sm">{error}</p>
		<button
			type="button"
			onclick={() => location.reload()}
			class="mt-4 rounded-lg bg-poke-red px-4 py-2 text-sm font-semibold text-white"
		>
			Retry
		</button>
	</div>
{:else if loading}
	<div
		class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
	>
		{#each Array(PAGE_SIZE) as _, i (i)}
			<Skeleton class="aspect-[3/4] w-full" rounded="rounded-xl" />
		{/each}
	</div>
{:else if filtered.length === 0}
	<div class="surface rounded-xl border p-12 text-center">
		<p class="text-5xl">🔍</p>
		<p class="mt-3 font-semibold">No Pokémon found</p>
		<p class="text-muted mt-1 text-sm">
			Try a different search or clear your filters.
		</p>
		{#if hasActiveFilters}
			<button
				type="button"
				onclick={clearFilters}
				class="mt-4 rounded-lg bg-poke-red px-4 py-2 text-sm font-semibold text-white"
			>
				Clear filters
			</button>
		{/if}
	</div>
{:else}
	<div
		class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
	>
		{#each visible as entry (entry.id)}
			<PokemonCard
				id={entry.id}
				name={entry.name}
				types={entry.types}
			/>
		{/each}
	</div>

	{#if visibleCount < filtered.length}
		<div bind:this={sentinel} class="h-20"></div>
		<div class="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
			{#each Array(12) as _, i (i)}
				<Skeleton class="aspect-[3/4] w-full" rounded="rounded-xl" />
			{/each}
		</div>
	{/if}
{/if}
