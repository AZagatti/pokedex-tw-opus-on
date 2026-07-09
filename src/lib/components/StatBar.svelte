<script lang="ts">
	import { statLabel, MAX_STAT, typeColor } from "$utils/format";

	const {
		name,
		value,
		accent = "water",
	}: { name: string; value: number; accent?: string } = $props();

	const pct = $derived(Math.min(100, (value / MAX_STAT) * 100));
</script>

<div class="flex items-center gap-3">
	<span class="text-muted w-16 shrink-0 text-xs font-semibold">
		{statLabel(name)}
	</span>
	<span class="w-8 shrink-0 text-right text-sm font-bold tabular-nums">
		{value}
	</span>
	<div
		class="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700"
		aria-hidden="true"
	>
		<div
			class="stat-bar-fill h-full rounded-full"
			style="width: {pct}%; background-color: {typeColor(accent)}"
		></div>
	</div>
</div>
