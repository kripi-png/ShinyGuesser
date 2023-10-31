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
const kv_1 = require("@vercel/kv");
const router = express_1.default.Router();
// get :count amount of scores; default to 10
// values are stored in increasing order in the database
// so by default get the entries in reversed order
// using ?reverse=true switches the order around
router.get('/:count?', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reverse = req.query.reverse === 'true' ? true : false;
    let count = Number(req.params.count);
    if (!count || isNaN(count))
        count = 10;
    // initially scores are returned in a list where name and score are altered
    // [name1, score1, name2, score2, ...]
    const flatUserScoreList = yield kv_1.kv.zrange('scores', 0, count, {
        rev: !reverse,
        withScores: true,
    });
    // convert the raw values to an array of tuples
    // [[name1, score1], [name2, score2], ...]
    const leaderboard = [];
    for (let index = 0; index < flatUserScoreList.length - 1; index++) {
        const value = flatUserScoreList[index].toString();
        const nextValue = flatUserScoreList[index + 1];
        if (typeof value === 'string' && typeof nextValue === 'number') {
            leaderboard.push([value, nextValue]);
        }
    }
    return res.status(200).json(leaderboard);
}));
router.post('/:user/:score', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.params.user;
    // check param count
    if (!user || !req.params.score)
        return res.status(400).send('missing parameter(s)');
    // validate score
    const score = Number(req.params.score);
    if (isNaN(score))
        return res.status(400).send('score is not a number: ' + score);
    try {
        // GT (greater than) does not seem to be supported, so we have to compare
        // the old score to the new score and then update the value in db
        // if new score is higher
        const oldScore = yield kv_1.kv.zscore('scores', user);
        if (oldScore >= score)
            return res
                .status(200)
                .send('score not saved: score was lower than or equal to previous value');
        // update database
        yield kv_1.kv.zadd('scores', { score, member: user });
        return res.status(204).end();
    }
    catch (error) {
        return res.status(500).send(error.message);
    }
    return res.status(200).json({ user, score });
}));
exports.default = router;
//# sourceMappingURL=index.js.map