<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { usePokemonStore } from '@/stores/pokemon';

const store = usePokemonStore();
const { streak, currentPokemon } = storeToRefs(store);

const askForUsername = (): string | false => {
	let name = null;
	while (true) {
		name = prompt(
			'What is your username (max 10 characters)?\nLeave empty to cancel. You will lose the score!'
		);
		if (!name) return false;

		if (name.length > 10) {
			alert('Name is too long, max length is 10');
			continue;
		}
		// if all conditions pass, break out of loop
		break;
	}
	return name;
};

const handleGuess = async (correctGuess: Boolean) => {
	if (!currentPokemon || store.isLoading) return;

	if (correctGuess) {
		store.increaseStreak();
	} else {
		// define confirmation text before resetting score
		const scoreToBeSaved = streak.value;
		const confirmationText = `You got a streak of ${scoreToBeSaved}!\nDo you want to leave your name for the leaderboard?`;
		store.resetStreak();

		if (scoreToBeSaved <= 0) return;

		if (confirm(confirmationText)) {
			const name = askForUsername();
			if (!name) return;

			const res = await fetch(`/api/leaderboard/${name}/${scoreToBeSaved}`, {
				method: 'POST',
			});
		}
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
			:disabled="!currentPokemon"
			@click="handleGuess(!currentPokemon.isShiny)"
		>
			Normal
		</v-btn>
		<v-btn
			variant="tonal"
			color="yellow-darken-2"
			:disabled="!currentPokemon"
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
