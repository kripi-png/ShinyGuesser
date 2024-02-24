"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pokemon_1 = __importDefault(require("pokemon"));
const express_1 = __importDefault(require("express"));
const kv_1 = require("@vercel/kv");
const pokenode_ts_1 = require("pokenode-ts");
const router = express_1.default.Router();
const pokeApi = new pokenode_ts_1.PokemonClient();
const getRandomSprite = (sprites) => {
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
    const genderSprites = (isFemale ? helperSprites.female : helperSprites.default);
    const url = isShiny ? genderSprites.shiny : genderSprites.normal;
    return {
        isShiny,
        isFemale,
        url,
    };
};
const selectRandomPokemonVariety = async (id) => {
    const { varieties } = await pokeApi.getPokemonSpeciesById(id);
    const rIndex = Math.floor(Math.random() * varieties.length);
    const { pokemon } = varieties[rIndex];
    return await pokeApi.getPokemonByName(pokemon.name);
};
const capitalizeWord = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
};
const isFiltered = async (name) => {
    // check database for filtered names such as ho-oh that should not be separated
    const isMember = await kv_1.kv.sismember('dashnames', name);
    return isMember === 1;
};
// simple map for names requiring special attention when it comes to capitalization or such
const MEGA_SPECIALS = {
    'type-null': 'Type: Null',
    'ho-oh': 'Ho-Oh',
    'jangmo-o': 'Jangmo-o',
    'hakamo-o': 'Hakamo-o',
    'kommo-o': 'Kommo-o',
};
const parseName = async (name) => {
    if (await isFiltered(name)) {
        if (Object.keys(MEGA_SPECIALS).includes(name)) {
            name = MEGA_SPECIALS[name];
        }
        return {
            displayName: name,
            varietyName: null,
        };
    }
    // divide at dash and capitalize each word; if there are multiple words,
    // set last word as variety name and combine rest for display name
    const parts = name.split(/-/).map(capitalizeWord);
    let varietyName = null;
    if (parts.length > 1) {
        varietyName = parts.pop();
    }
    return {
        displayName: parts.join(' '),
        varietyName: varietyName,
    };
};
// GET /api/leaderboard/guesser
// returns an object containing image of either shiny or normal pokemon
router.use('/guesser', async (_req, res) => {
    const randomId = pokemon_1.default.getId(pokemon_1.default.random());
    try {
        // ensure all variables are valid
        let id, name, sprite, sprites;
        while (true) {
            // destructuring into existing variables requires parentheses
            ({ id, name, sprites } = await selectRandomPokemonVariety(randomId));
            sprite = getRandomSprite(sprites);
            if (id && name && sprite)
                break;
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
    }
    catch (error) {
        console.error(`pokemon id ${randomId} >>>`, error);
        return res.status(500).send(error.name + ': ' + error.message);
    }
});
exports.default = router;
