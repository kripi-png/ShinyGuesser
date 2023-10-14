<script lang="ts">
	import { pokemonStore } from './pokemonStore';

	const handleGuess = (correctGuess: Boolean) => {
		if (!$pokemonStore.currentPokemon) return;

		if (correctGuess) {
			pokemonStore.increaseStreak();
		} else {
			pokemonStore.resetStreak();
		}

		pokemonStore.getNewPokemon();
	};
</script>

<div class="flex flex-col items-center">
	<img
		src={$pokemonStore.currentPokemon?.sprite}
		alt={$pokemonStore.currentPokemon?.pokemonName}
		width="500px"
	/>
	<h1 class="text-3xl">
		#{$pokemonStore.currentPokemon?.pokemonId}
		<span class="font-bold">{$pokemonStore.currentPokemon?.pokemonName}</span>
	</h1>
	<!-- Debug - Shiny: {$pokemonStore.currentPokemon?.isShiny} -->

	<h1 class="text-4xl">Streak: {$pokemonStore.streak}</h1>
	<div>
		<button
			type="button"
			class="btn variant-filled"
			on:click={() => handleGuess(!$pokemonStore.currentPokemon?.isShiny)}
			>Regular</button
		>
		<button
			type="button"
			class="btn variant-filled-secondary"
			on:click={() => handleGuess($pokemonStore.currentPokemon?.isShiny)}
			>Shiny</button
		>
	</div>
</div>
