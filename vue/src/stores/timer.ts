import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

const padNumber = (number: number) => {
	return number.toString().padStart(2, '0');
};

export const useTimerStore = defineStore('timer', () => {
	const secondsElapsed = ref(0);
	let intervalId = null;

	const formattedTime = computed(() => {
		let minutes = padNumber(Math.floor(secondsElapsed.value / 60));
		let seconds = padNumber(secondsElapsed.value - minutes * 60);
		return `${minutes}:${seconds}`;
	});

	function _addSecond() {
		secondsElapsed.value++;
	}

	function startTimer() {
		if (intervalId !== null) return;
		intervalId = setInterval(_addSecond, 1000);
	}

	function pauseTimer() {
		if (intervalId === null) return;
		clearInterval(intervalId);
		intervalId = null;
	}

	function resetTimer() {
		pauseTimer();
		secondsElapsed.value = 0;
	}

	return {
		secondsElapsed,
		formattedTime,

		startTimer,
		pauseTimer,
		resetTimer,
	};
});
