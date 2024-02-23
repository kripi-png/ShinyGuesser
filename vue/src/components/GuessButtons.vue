<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { usePokemonStore } from '@/stores/pokemon';
import { useTimerStore } from '@/stores/timer';
const timer = useTimerStore();
const store = usePokemonStore();
const { streak, currentPokemon } = storeToRefs(store);

const askForUsername = (): string | false => {
	let name = null;
	while (true) {
		name = prompt(
			'What is your username (max 10 characters)?\nLeave empty to cancel. You will lose the score!'
		).trim();
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

const handleGuess = async (correctGuess: boolean) => {
	if (!currentPokemon || store.isLoading) return;

	if (correctGuess) {
		// start timer after first correct guess
		if (streak.value === 0) {
			timer.startTimer();
		}
		store.increaseStreak();
	} else {
		// define confirmation text and variables before resetting score
		timer.pauseTimer();
		const streakToBeSaved = streak.value;
		const timeToBeSaved = timer.secondsElapsed;
		const confirmationText = `You got a streak of ${streakToBeSaved} in ${timer.formattedTime}!\nDo you want to leave your name for the leaderboard?`;
		store.resetStreak();
		timer.resetTimer();

		if (streakToBeSaved <= 0) return;

		if (confirm(confirmationText)) {
			const name = askForUsername();
			if (!name) return;
			fetch(
				`/api/leaderboard/${name}?streak=${streakToBeSaved}&time=${timeToBeSaved}`,
				{
					method: 'POST',
				}
			);
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
			@click="handleGuess(!currentPokemon.sprite.isShiny)"
		>
			Normal
		</v-btn>
		<v-btn
			variant="tonal"
			color="yellow-darken-2"
			:disabled="!currentPokemon"
			@click="handleGuess(currentPokemon.sprite.isShiny)"
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
