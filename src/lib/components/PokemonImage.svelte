<script lang="ts">
	const {
		src,
		alt,
		fallback,
		class: className = "",
		eager = false,
	}: {
		src: string;
		alt: string;
		fallback?: string;
		class?: string;
		eager?: boolean;
	} = $props();

	let loaded = $state(false);
	let failed = $state(false);
	let currentSrc = $state("");

	// Reset load state whenever the incoming src prop changes (e.g. sprite switcher).
	$effect(() => {
		currentSrc = src;
		loaded = false;
		failed = false;
	});

	function onError() {
		if (fallback && currentSrc !== fallback) {
			currentSrc = fallback;
		} else {
			failed = true;
		}
	}
</script>

<div class="relative grid place-items-center {className}">
	{#if !loaded && !failed}
		<div
			class="absolute inset-0 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700"
			aria-hidden="true"
		></div>
	{/if}
	{#if failed}
		<div
			class="grid h-full w-full place-items-center text-4xl text-muted"
			role="img"
			aria-label="Image unavailable for {alt}"
		>
			<span aria-hidden="true">?</span>
		</div>
	{:else}
		<img
			src={currentSrc}
			{alt}
			loading={eager ? "eager" : "lazy"}
			decoding="async"
			class="h-full w-full object-contain transition-opacity duration-300 {loaded
				? 'opacity-100'
				: 'opacity-0'}"
			onload={() => {
				loaded = true;
			}}
			onerror={onError}
		/>
	{/if}
</div>
