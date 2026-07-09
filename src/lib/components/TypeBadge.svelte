<script lang="ts">
	import { typeColor } from "$utils/format";

	const { type, size = "md" }: { type: string; size?: "sm" | "md" } = $props();

	// Darken the base type colour so white text always clears the WCAG AA
	// 4.5:1 contrast ratio (several type hues are too light on their own).
	const bg = $derived(
		`color-mix(in srgb, ${typeColor(type)} 55%, black 45%)`
	);
</script>

<span
	class="inline-flex items-center rounded-full font-semibold uppercase tracking-wide text-white shadow-sm {size ===
	'sm'
		? 'px-2 py-0.5 text-[10px]'
		: 'px-3 py-1 text-xs'}
"
	style="background-color: {bg}"
>
	{type}
</span>
