<script setup lang="ts">
import PokemonName from '@/components/PokemonName.vue';
import GuessButtons from '@/components/GuessButtons.vue';
import Leaderboard from '@/components/Leaderboard.vue';
import Timer from '@/components/Timer.vue';
import { usePokemonStore } from '@/stores/pokemon';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const store = usePokemonStore();
const { currentPokemon, isLoading } = storeToRefs(store);
store.isLoading = true;
store.getNewPokemon();
</script>

<template>
	<div class="pokemonBox">
		<Timer />
		<v-img
			class="mx-auto"
			width="300"
			height="300"
			max-width="500"
			:src="currentPokemon && currentPokemon.sprite"
		>
			<template v-slot:placeholder>
				<v-progress-circular
					class="progressCircle"
					indeterminate
					color="indigo-darken-2"
				>
				</v-progress-circular>
			</template>
		</v-img>
		<PokemonName />
		<GuessButtons />
	</div>
	<Leaderboard />
</template>

<style scoped>
div {
	margin-left: auto;
	margin-right: auto;
	width: fit-content;
	display: flex;
	flex-direction: column;
}

.pokemonBox {
	text-align: center;
}

.progressCircle {
	width: 32px;
	margin-top: 50%;
}
</style>
