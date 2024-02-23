import pokemonList from 'pokemon';
import express from 'express';
import { kv } from '@vercel/kv';
import { PokemonClient, PokemonSprites, Pokemon } from 'pokenode-ts';

const router = express.Router();
const pokeApi = new PokemonClient();

type RandomSpriteObj = { isShiny: boolean; isFemale: boolean; url: string };
const getRandomSprite = (sprites: PokemonSprites): RandomSpriteObj => {
	const helperSprites = {
		default: {
			normal: sprites.front_default,
			shiny: sprites.front_shiny,
		},
		female: {
			normal: sprites.front_female,
			shiny: sprites.front_shiny_female,
		},
	};

	const isShiny = Math.random() >= 0.5;
	const femaleDiffers = helperSprites.female.normal !== null;
	// 50/50 if there is gender diff; otherwise always male/default
	const isFemale = femaleDiffers ? Math.random() >= 0.5 : false;
	const genderSprites = (
		isFemale ? helperSprites.female : helperSprites.default
	) as { normal: string; shiny: string };
	const url = isShiny ? genderSprites.shiny : genderSprites.normal;

	return {
		isShiny,
		isFemale,
		url,
	};
};

const selectRandomPokemonVariety = async (id: number): Promise<Pokemon> => {
	const { varieties } = await pokeApi.getPokemonSpeciesById(id);
	const rIndex = Math.floor(Math.random() * varieties.length);
	const { pokemon } = varieties[rIndex];
	return await pokeApi.getPokemonByName(pokemon.name);
};

const capitalizeWord = (word: string): string => {
	return word.charAt(0).toUpperCase() + word.slice(1);
};

const isFiltered = async (name: string): Promise<boolean> => {
	// check database for filtered names such as ho-oh that should not be separated
	const isMember = await kv.sismember('dashnames', name);
	return isMember === 1;
};

type ParsedNameObj = { displayName: string; varietyName: string | null; }
const parseName = async (name: string): Promise<ParsedNameObj> => {
	if (await isFiltered(name)) {
		return {
			displayName: name,
			varietyName: null,
		}
	}

	// divide at dash and capitalize each word; if there are multiple words,
	// set last word as variety name and combine rest for display name
	const parts = name.split(/-/).map(capitalizeWord);
	let varietyName = null;
	if (parts.length > 1) {
		varietyName = <string>parts.pop();
	}

	return {
		displayName: parts.join(" "),
		varietyName: varietyName,
	}
};

// GET /api/leaderboard/guesser
// returns an object containing image of either shiny or normal pokemon
router.use('/guesser', async (_req, res) => {
	const randomId = pokemonList.getId(pokemonList.random());
	try {
		// ensure all variables are valid
		let id, name, sprite, sprites;
		while (true) {
			// destructuring into existing variables requires parentheses
			({ id, name, sprites } = await selectRandomPokemonVariety(randomId));
			sprite = getRandomSprite(sprites);
			if (id && name && sprite) break;
		}

		const { displayName, varietyName } = await parseName(name);
		return res.status(200).send({
			data: {
				id,
				name, // default name (e.g. wormadam-trash)
				displayName, // e.g. Wormadam
				varietyName, // e.g. Trash
				sprite,
			},
			meta: {},
		});
	} catch (error: any) {
		console.error(`pokemon id ${randomId} >>>`, error);
		return res.status(500).send(error.name + ': ' + error.message);
	}
});

export default router;
