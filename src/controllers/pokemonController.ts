import { RequestHandler } from 'express';
import pokemon from 'pokemon';
import { PokemonClient } from 'pokenode-ts';
const pokeApi = new PokemonClient();

const getRandomFromList = (list: Array<string>) => {
	// generate a random number between 0 and list's length
	// and return the value with the index from the array
	const rIndex = Math.floor(Math.random() * list.length);
	return list[rIndex];
};

const getRandomPokemon: RequestHandler = async (req, res, next) => {
	try {
		const pokemonName = pokemon.random();
		const pokemonId = pokemon.getId(pokemonName);
		// first find out if there are varieties for the pokemon (e.g. Wormadam has 3)
		const { varieties } = await pokeApi.getPokemonSpeciesById(pokemonId);
		const varietyNames = varieties.map((v) => v.pokemon.name);
		// get "random" variety (e.g. wormadam-trash), even if there is only one
		const varietyName = getRandomFromList(varietyNames);
		const data = await pokeApi.getPokemonByName(varietyName);

		res.status(200).json({
			pokemonId,
			pokemonName,
			varietyName,
			// whether male and female have different sprites
			has_gender_difference: data.sprites.front_female !== null,
			sprites: {
				default: {
					normal: data.sprites.front_default,
					shiny: data.sprites.front_shiny,
				},
				female: {
					normal: data.sprites.front_female,
					shiny: data.sprites.front_shiny_female,
				}
			},
		});
	} catch (error: any) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
	next();
};

export default {
	getRandomPokemon,
};
