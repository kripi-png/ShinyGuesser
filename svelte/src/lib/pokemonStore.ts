import { writable } from 'svelte/store';

const createPokemonStore = () => {
	const { subscribe, set, update } = writable({
		streak: 0,
		currentPokemon: null,
	});

	const increaseStreak = () => {
		update((state) => {
			state.streak++;
			return state;
		});
	};

	const resetStreak = () => {
		update((state) => {
			state.streak = 0;
			return state;
		});
	};

	const getNewPokemon = async () => {
		const res = await fetch('http://localhost:8000/pokemon');
		const data = await res.json();
		console.log('new pokemon', { ...data });

		update((state) => {
			state.currentPokemon = data;
			return state;
		});
	};

	getNewPokemon();

	return {
		subscribe,
		set,
		update,
		increaseStreak,
		resetStreak,
		getNewPokemon,
	};
};

export const pokemonStore = createPokemonStore();
