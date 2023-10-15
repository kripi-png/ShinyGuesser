"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const pokemon_1 = __importDefault(require("pokemon"));
const pokenode_ts_1 = require("pokenode-ts");
const pokeApi = new pokenode_ts_1.PokemonClient();
const router = express_1.default.Router();
const getRandomFromList = (list) => {
    // generate a random number between 0 and list's length
    // and return the value with the index from the array
    const rIndex = Math.floor(Math.random() * list.length);
    return list[rIndex];
};
const getRandomSprite = (allSprites) => {
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
const requestRandomPokemon = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // get id of a random pokemon
        const pokemonName = pokemon_1.default.random();
        const pokemonId = pokemon_1.default.getId(pokemonName);
        // find out if there are varieties for the pokemon (e.g. Wormadam has 3)
        const { varieties } = yield pokeApi.getPokemonSpeciesById(pokemonId);
        const varietyNames = varieties.map((v) => v.pokemon.name);
        // get "random" variety (e.g. wormadam-trash), even if there is only one
        const varietyName = getRandomFromList(varietyNames);
        const data = yield pokeApi.getPokemonByName(varietyName);
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
    }
    catch (error) {
        console.error(error);
        throw error;
    }
});
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let validSprite = false;
        let pokemonData = null;
        while (!validSprite) {
            const randomPokemonData = yield requestRandomPokemon();
            if (randomPokemonData.sprite) {
                validSprite = true;
                pokemonData = randomPokemonData;
            }
            else {
                console.log('pokemon had invalid sprite, trying again', Object.assign({}, randomPokemonData));
            }
        }
        res.status(200).json(Object.assign({}, pokemonData));
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}));
exports.default = router;
//# sourceMappingURL=index.js.map