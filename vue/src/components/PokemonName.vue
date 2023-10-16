<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { usePokemonStore } from '@/stores/pokemon';

const store = usePokemonStore();
const { currentPokemon } = storeToRefs(store);
</script>

<template>
	<h2 v-if="currentPokemon">
		<span class="pokemonId">#{{ currentPokemon.pokemonId }}</span>
		<span v-if="currentPokemon.varietyName" class="varietyName"
			>&nbsp;({{ currentPokemon.varietyName }})</span
		>
		{{ currentPokemon.pokemonName }}
	</h2>
	<h2 v-else>Loading...</h2>
</template>

<style scoped>
.varietyName {
	text-transform: capitalize;
}
.pokemonId {
	font-size: 0.75em;
}
</style>
