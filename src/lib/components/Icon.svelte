<script lang="ts">
	type IconName =
		| "heart"
		| "sun"
		| "moon"
		| "menu"
		| "x"
		| "search"
		| "sliders-horizontal"
		| "arrow-left"
		| "volume-2"
		| "chevron-right"
		| "sparkles"
		| "list";

	const {
		name,
		size = 20,
		filled = false,
		class: className = "",
	}: {
		name: IconName;
		size?: number | string;
		filled?: boolean;
		class?: string;
	} = $props();

	// Path data sourced from Lucide (ISC licensed), inlined to avoid the
	// @lucide/svelte v1 raw-.svelte Vite optimizer incompatibility.
	const paths: Record<IconName, string> = {
		"arrow-left": "M19 12H5M12 19l-7-7 7-7",
		"chevron-right": "M9 18l6-6-6-6",
		heart:
			"M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z",
		list: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
		menu: "M4 12h16M4 6h16M4 18h16",
		moon: "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z",
		search: "M21 21l-4.34-4.34M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z",
		"sliders-horizontal":
			"M10 5H3M21 5h-7M8 5a2 2 0 1 0 4 0 2 2 0 0 0-4 0ZM21 12h-7M10 12H3M8 12a2 2 0 1 0 4 0 2 2 0 0 0-4 0ZM21 19h-7M10 19H3M16 19a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z",
		sparkles:
			"M12 3l1.9 5.8L20 10l-5.9 1.9L12 18l-1.9-6.1L4 10l6.1-1.2L12 3Z",
		sun: "M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41",
		"volume-2":
			"M11 4.7 6.5 8H3v8h3.5L11 19.3V4.7ZM15.5 8.5a5 5 0 0 1 0 7M19 5a9 9 0 0 1 0 14",
		x: "M18 6 6 18M6 6l12 12",
	};
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill={filled ? "currentColor" : "none"}
	stroke="currentColor"
	stroke-width="2"
	stroke-linecap="round"
	stroke-linejoin="round"
	class={className}
	aria-hidden="true"
>
	<path d={paths[name]} />
</svg>
