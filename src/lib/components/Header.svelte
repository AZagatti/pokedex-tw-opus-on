<script lang="ts">
	import { base } from "$app/paths";
	import { page } from "$app/state";
	import Icon from "./Icon.svelte";
	import { theme } from "$stores/theme.svelte";
	import { favorites } from "$stores/favorites.svelte";

	let mobileOpen = $state(false);

	const links = [
		{ href: `${base}/`, label: "Pokédex", match: (p: string) => p === `${base}/` || p === base },
		{ href: `${base}/berries/`, label: "Berries", match: (p: string) => p.startsWith(`${base}/berries`) },
		{ href: `${base}/favorites/`, label: "Favorites", match: (p: string) => p.startsWith(`${base}/favorites`) },
	];

	function isActive(link: (typeof links)[number]): boolean {
		return link.match(page.url.pathname);
	}
</script>

<header
	class="surface sticky top-0 z-40 border-b backdrop-blur-md supports-[backdrop-filter]:bg-[color-mix(in_srgb,var(--surface)_85%,transparent)]"
>
	<nav class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
		<a href="{base}/" class="flex items-center gap-2 font-extrabold tracking-tight">
			<span
				class="grid h-8 w-8 place-items-center rounded-full bg-poke-red text-lg shadow-md"
				aria-hidden="true"
			>
				<span class="h-3 w-3 rounded-full border-2 border-white bg-white"></span>
			</span>
			<span class="text-lg">Pokédex</span>
		</a>

		<div class="hidden items-center gap-1 sm:flex">
			{#each links as link (link.href)}
				<a
					href={link.href}
					class="relative rounded-lg px-3 py-2 text-sm font-semibold transition-colors hover:text-poke-red {isActive(
						link
					)
						? 'text-poke-red'
						: 'text-muted'}"
					aria-current={isActive(link) ? "page" : undefined}
				>
					{link.label}
					{#if link.label === "Favorites" && favorites.count > 0}
						<span
							class="ml-1 inline-flex min-w-5 items-center justify-center rounded-full bg-poke-red px-1.5 text-xs text-white"
						>
							{favorites.count}
						</span>
					{/if}
				</a>
			{/each}
		</div>

		<div class="flex items-center gap-1">
			<button
				type="button"
				onclick={() => theme.toggle()}
				class="grid h-10 w-10 place-items-center rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
				aria-label="Toggle {theme.value === 'dark' ? 'light' : 'dark'} mode"
				title="Toggle theme"
			>
				{#if theme.value === "dark"}
					<Icon name="sun" size={20} />
				{:else}
					<Icon name="moon" size={20} />
				{/if}
			</button>

			<button
				type="button"
				onclick={() => (mobileOpen = !mobileOpen)}
				class="grid h-10 w-10 place-items-center rounded-lg transition-colors hover:bg-slate-100 sm:hidden dark:hover:bg-slate-800"
				aria-label="Toggle menu"
				aria-expanded={mobileOpen}
			>
				{#if mobileOpen}<Icon name="x" size={20} />{:else}<Icon
						name="menu"
						size={20}
					/>{/if}
			</button>
		</div>
	</nav>

	{#if mobileOpen}
		<div class="border-t px-4 py-2 sm:hidden">
			{#each links as link (link.href)}
				<a
					href={link.href}
					onclick={() => (mobileOpen = false)}
					class="flex items-center justify-between rounded-lg px-3 py-3 text-sm font-semibold {isActive(
						link
					)
						? 'text-poke-red'
						: 'text-muted'}"
				>
					{link.label}
					{#if link.label === "Favorites" && favorites.count > 0}
						<span class="rounded-full bg-poke-red px-2 text-xs text-white">
							{favorites.count}
						</span>
					{/if}
				</a>
			{/each}
		</div>
	{/if}
</header>
