<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { usePokemonStore } from '@/stores/pokemon';

const store = usePokemonStore();
const { streak, currentPokemon } = storeToRefs(store);

const handleGuess = async (correctGuess: Boolean) => {
	if (!currentPokemon || store.isLoading) return;

	if (correctGuess) {
		store.increaseStreak();
	} else {
		store.resetStreak();
	}

	store.isLoading = true;
	store.currentPokemon = null;
	store.getNewPokemon();
};
</script>

<template>
	Streak {{ streak }}
	<div class="guessButtons">
		<v-btn
			variant="tonal"
			color="blue-darken-4"
			@click="handleGuess(!currentPokemon.isShiny)"
		>
			Normal
		</v-btn>
		<v-btn
			variant="tonal"
			color="yellow-darken-2"
			@click="handleGuess(currentPokemon.isShiny)"
		>
			Shiny
		</v-btn>
	</div>
</template>

<style scoped>
.guessButtons {
	display: flex;
	flex-direction: row;
	justify-content: center;
}
</style>
