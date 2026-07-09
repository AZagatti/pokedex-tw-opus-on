<script lang="ts">
	import Icon from "./Icon.svelte";
	import { favorites } from '$stores/favorites.svelte';
import type { FavoriteKind } from '$stores/favorites.svelte';

	const {
		id,
		name,
		kind = "pokemon",
		size = 20,
	}: { id: number; name: string; kind?: FavoriteKind; size?: number } = $props();

	const active = $derived(favorites.has(kind, id));

	function toggle(event: MouseEvent) {
		event.preventDefault();
		event.stopPropagation();
		favorites.toggle({ id, kind, name });
	}
</script>

<button
	type="button"
	onclick={toggle}
	class="grid place-items-center rounded-full p-2 transition-transform hover:scale-110 active:scale-95 focus-visible:outline-2"
	aria-pressed={active}
	aria-label={active ? `Remove ${name} from favorites` : `Add ${name} to favorites`}
	title={active ? "Remove from favorites" : "Add to favorites"}
>
	<Icon
		name="heart"
		size={size}
		filled={active}
		class={active ? "text-poke-red" : "text-slate-400"}
	/>
</button>
