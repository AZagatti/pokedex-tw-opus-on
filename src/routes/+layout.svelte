<script lang="ts">
	import "../app.css";
	import Header from "$components/Header.svelte";

	const { children } = $props();
</script>

<a
	href="#main"
	class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-poke-red focus:px-4 focus:py-2 focus:text-white"
>
	Skip to content
</a>

<div class="flex min-h-dvh flex-col">
	<Header />

	<main id="main" class="mx-auto w-full max-w-6xl flex-1 px-4 py-6">
		{@render children()}
	</main>

	<footer class="surface border-t">
		<div
			class="text-muted mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm sm:flex-row"
		>
			<p>
				Data from
				<a
					href="https://pokeapi.co"
					target="_blank"
					rel="noreferrer"
					class="font-semibold text-link hover:underline">PokeAPI</a
				>. Not affiliated with Nintendo/Game Freak.
			</p>
			<p>Built with SvelteKit</p>
		</div>
	</footer>
</div>
