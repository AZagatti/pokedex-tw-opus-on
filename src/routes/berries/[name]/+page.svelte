<script lang="ts">
	import { base } from "$app/paths";
	import Icon from "$components/Icon.svelte";
	import FavoriteButton from "$components/FavoriteButton.svelte";
	import TypeBadge from "$components/TypeBadge.svelte";
	import { titleCase } from "$utils/format";
	import type { PageData } from "./$types";

	const { data }: { data: PageData } = $props();
	const b = $derived(data.berry);
	const sprite = $derived(
		`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${b.item.name}.png`
	);
	const facts = $derived([
		{ label: "Growth time", value: `${b.growth_time} h/stage` },
		{ label: "Max harvest", value: String(b.max_harvest) },
		{ label: "Size", value: `${b.size / 10} cm` },
		{ label: "Smoothness", value: String(b.smoothness) },
		{ label: "Soil dryness", value: String(b.soil_dryness) },
		{ label: "Gift power", value: String(b.natural_gift_power) },
	]);
</script>

<svelte:head>
	<title>{titleCase(b.name)} Berry — Pokédex</title>
	<meta name="description" content="Details for the {titleCase(b.name)} Berry." />
</svelte:head>

<div class="animate-fade-in mx-auto max-w-3xl">
	<a href="{base}/berries/" class="text-muted mb-4 inline-flex items-center gap-1 text-sm font-semibold hover:text-poke-red">
		<Icon name="arrow-left" class="size-4" /> Back to berries
	</a>

	<div class="surface rounded-3xl border p-6 sm:p-8">
		<div class="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
			<div class="grid size-32 shrink-0 place-items-center rounded-2xl bg-slate-100 dark:bg-slate-800">
				<img src={sprite} alt="{titleCase(b.name)} Berry" class="size-16 [image-rendering:pixelated]" loading="eager" />
			</div>
			<div class="flex-1 text-center sm:text-left">
				<div class="flex items-center justify-center gap-3 sm:justify-start">
					<h1 class="text-3xl font-extrabold">{titleCase(b.name)} Berry</h1>
					<FavoriteButton id={b.id} name={b.name} kind="berry" />
				</div>
				<div class="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
					<TypeBadge type={b.natural_gift_type.name} />
					<span class="surface rounded-full border px-3 py-1 text-xs font-semibold capitalize">{b.firmness.name} firmness</span>
				</div>
			</div>
		</div>

		<div class="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
			{#each facts as f (f.label)}
				<div class="surface rounded-xl border p-3 text-center">
					<p class="text-muted text-xs font-semibold uppercase tracking-wide">{f.label}</p>
					<p class="mt-1 text-lg font-bold tabular-nums">{f.value}</p>
				</div>
			{/each}
		</div>

		<div class="mt-6">
			<h2 class="mb-3 text-lg font-bold">Flavors</h2>
			<div class="flex flex-col gap-2">
				{#each b.flavors.filter((fl) => fl.potency > 0) as fl (fl.flavor.name)}
					<div class="flex items-center gap-3">
						<span class="w-20 text-sm font-semibold capitalize">{fl.flavor.name}</span>
						<div class="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
							<div class="stat-bar-fill h-full rounded-full bg-poke-red" style="width: {Math.min(100, fl.potency * 2.5)}%"></div>
						</div>
						<span class="w-8 text-right text-sm font-bold tabular-nums">{fl.potency}</span>
					</div>
				{:else}
					<p class="text-muted text-sm">This berry has no notable flavors.</p>
				{/each}
			</div>
		</div>
	</div>
</div>
