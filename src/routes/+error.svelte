<script lang="ts">
	import { base } from "$app/paths";
	import { page } from "$app/state";
</script>

<svelte:head>
	<title>{page.status} — Pokédex</title>
</svelte:head>

<div class="animate-fade-in flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
	<img
		src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/201.png"
		alt="Unown"
		class="h-40 w-40 opacity-80"
		loading="lazy"
	/>
	<div>
		<p class="text-6xl font-extrabold text-poke-red">{page.status}</p>
		<h1 class="mt-2 text-2xl font-bold">
			{page.status === 404 ? "Page not found" : "Something went wrong"}
		</h1>
		<p class="text-muted mx-auto mt-2 max-w-sm">
			{page.error?.message ?? "The page you are looking for does not exist."}
		</p>
	</div>
	<a href="{base}/" class="rounded-full bg-poke-red px-6 py-2.5 font-semibold text-white transition hover:bg-poke-dark">
		Back to Pokédex
	</a>
</div>
