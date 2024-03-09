import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

interface CurrentPokemon {
	id: string;
	varietyName: string;
	displayName: string;
	sprite: {
		isShiny: boolean;
		url: string;
	};
}
export const usePokemonStore = defineStore('pokemons', () => {
	const streak = ref(0);
	const currentPokemon = ref<CurrentPokemon | null>(null);
	const isLoading = ref(true);

	const imageUrl = computed(() => {
		return currentPokemon.value?.sprite?.url;
	});

	function increaseStreak() {
		streak.value++;
	}

	function resetStreak() {
		streak.value = 0;
	}

	async function getNewPokemon() {
		const res = await fetch('/api/pokemon/guesser');
		const { data } = await res.json();
		currentPokemon.value = data;
		isLoading.value = false;
	}

	return {
		streak,
		currentPokemon,
		imageUrl,
		isLoading,
		getNewPokemon,
		increaseStreak,
		resetStreak,
	};
});
