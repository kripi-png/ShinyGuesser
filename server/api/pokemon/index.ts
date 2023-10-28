import express from 'express';
import pokemon from 'pokemon';
import { PokemonClient, PokemonSprites } from 'pokenode-ts';

const pokeApi = new PokemonClient();
const router = express.Router();

const getRandomFromList = (list: Array<string>) => {
	// generate a random number between 0 and list's length
	// and return the value with the index from the array
	const rIndex = Math.floor(Math.random() * list.length);
	return list[rIndex];
};

const parseVarietyName = (fullVariety: string) => {
	// list of pokemon names that should not be parsed
	// for example Ho-Oh would become (Oh) Ho-Oh which is kind of funny but not wanted
	const IGNORE_LIST = [
		'porygon-z',
		'porygon-2',
		'ho-oh',
		'jangmo-o',
		'Hakamo-o',
		'Kommo-o',
	];

	if (fullVariety.includes('-') && !IGNORE_LIST.includes(fullVariety)) {
		// take everything after first dash and replace the rest of possible dashes with spaces
		// e.g. gardevoir-mega -> mega
		// 			tauros-paldea-blaze-breed -> paldea blaze breed
		return fullVariety.split(/-(.*)/)[1].replace(/-/g, ' ');
	}
};

const getRandomSprite = (allSprites: PokemonSprites) => {
	// helper object for convenience
	const _sprites = {
		default: {
			normal: allSprites.front_default,
			shiny: allSprites.front_shiny,
		},
		female: {
			normal: allSprites.front_female,
			shiny: allSprites.front_shiny_female,
		},
	};

	// whether female differs from male/default
	const hasGenderDifference = allSprites.front_female !== null;
	// 50/50 to select the shiny sprite
	const shiny = Math.random() >= 0.5 ? true : false;
	// by default use default sprite
	let useDefault = true;
	if (hasGenderDifference) {
		// 50/50 to select female sprite if there's gender difference
		useDefault = Math.random() >= 0.5 ? false : true;
	}
	// select either default or female
	const defaultOrFemale = useDefault ? _sprites.default : _sprites.female;
	// select either normal or shiny version
	const finalSprite = shiny ? defaultOrFemale.shiny : defaultOrFemale.normal;

	// return all relevant information about selected sprite
	return {
		sprite: finalSprite,
		isShiny: shiny,
		isFemale: !useDefault,
	};
};

const requestRandomPokemon = async () => {
	try {
		// get id of a random pokemon
		const pokemonName = pokemon.random();
		const pokemonId = pokemon.getId(pokemonName);
		// find out if there are varieties for the pokemon (e.g. Wormadam has 3)
		const { varieties } = await pokeApi.getPokemonSpeciesById(pokemonId);
		const varietyNames = varieties.map((v) => v.pokemon.name);
		// get "random" variety (e.g. wormadam-trash), even if there is only one
		const randomVarietyName = getRandomFromList(varietyNames);
		// get actual variety name (e.g. gardevoir-mega -> mega)
		const varietyName = parseVarietyName(randomVarietyName);
		const data = await pokeApi.getPokemonByName(randomVarietyName);
		// select normal or shiny sprite of either default or female version of the pokemon
		// and also get relevant information on the selection
		const { sprite, isShiny, isFemale } = getRandomSprite(data.sprites);

		return {
			pokemonId,
			pokemonName,
			varietyName,
			sprite,
			isShiny,
			isFemale,
		};
	} catch (error: any) {
		console.error(error);
		throw error;
	}
};

router.get('/', async (req, res) => {
	try {
		let validSprite = false;
		let pokemonData = null;
		while (!validSprite) {
			const randomPokemonData = await requestRandomPokemon();
			if (randomPokemonData.sprite) {
				validSprite = true;
				pokemonData = randomPokemonData;
			} else {
				console.log('pokemon had invalid sprite, trying again', {
					...randomPokemonData,
				});
			}
		}

		res.status(200).json({
			...pokemonData,
		});
	} catch (error: any) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
});

export default router;
