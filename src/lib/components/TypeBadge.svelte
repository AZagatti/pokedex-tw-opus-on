<script lang="ts">
	import { typeColor } from "$utils/format";

	const { type, size = "md" }: { type: string; size?: "sm" | "md" } = $props();
</script>

<span
	class="inline-flex items-center rounded-full font-semibold uppercase tracking-wide text-white shadow-sm {size ===
	'sm'
		? 'px-2 py-0.5 text-[10px]'
		: 'px-3 py-1 text-xs'}"
	style="background-color: {typeColor(type)}"
>
	{type}
</span>
