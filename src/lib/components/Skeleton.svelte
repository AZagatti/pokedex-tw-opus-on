<script lang="ts">
	const {
		class: className = "",
		rounded = "rounded-lg",
	}: { class?: string; rounded?: string } = $props();
</script>

<div
	class="animate-pulse bg-slate-200 dark:bg-slate-700 {rounded} {className}"
	aria-hidden="true"
></div>
