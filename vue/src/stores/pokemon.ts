import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePokemonStore = defineStore('pokemons', () => {
	const streak = ref(0);
	const currentPokemon = ref(null);
	const isLoading = ref(true);

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
		isLoading,
		getNewPokemon,
		increaseStreak,
		resetStreak,
	};
});
