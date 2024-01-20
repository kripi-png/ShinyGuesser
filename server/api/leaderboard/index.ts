import express, { Request } from 'express';
import { kv } from '@vercel/kv';

const router = express.Router();

const calculateScore = (streak: number, time: number) => {
	const score = Math.floor(streak / Math.log(time ** 2));
	return score;
};

// get :count amount of scores; default to 10
// values are stored in increasing order in the database
// so by default get the entries in reversed order
// using ?reverse=true switches the order around
router.get(
	'/:count?',
	async (req: Request<{ count?: number; reverse?: boolean }>, res) => {
		const reverse = req.query.reverse === 'true' ? true : false;
		let count = Number(req.params.count);
		if (!count || isNaN(count)) count = 10;

		// initially scores are returned in a list where name and score are altered
		// [name1, score1, name2, score2, ...]
		const flatUserScoreList = await kv.zrange('scores', 0, count, {
			rev: !reverse,
			withScores: true,
		});

		// convert the raw values to an array of tuples
		// [[name1, score1], [name2, score2], ...]
		const leaderboard: [string, number][] = [];
		for (let index = 0; index < flatUserScoreList.length - 1; index++) {
			const value = flatUserScoreList[index].toString();
			const nextValue = flatUserScoreList[index + 1];
			if (typeof value === 'string' && typeof nextValue === 'number') {
				leaderboard.push([value, nextValue]);
			}
		}

		return res.status(200).json(leaderboard);
	}
);

// score is calculated with :streak and :time with formula
// streak / log(time in seconds), floored
// the final score is saved to a sorted set for quick retrieving
// and hash is used for all the information (streak, time, score)
router.post(
	'/:user/:score',
	async (req: Request<{ user: string; streak: number; time: number }>, res) => {
		const user = req.params.user;
		// check param count
		if (!user || !req.params.streak || !req.params.time)
			return res.status(400).send('missing parameter(s): streak and/or time');

		// validate parameters
		const streak = Number(req.params.streak);
		if (isNaN(streak))
			return res.status(400).send('streak is not a number: ' + streak);

		const timeInSeconds = Number(req.params.time);
		if (isNaN(timeInSeconds))
			return res.status(400).send('time is not a number: ' + timeInSeconds);

		try {
			// score is saved to sorted score
			const finalScore = calculateScore(streak, timeInSeconds);
			// additionally, all score-related information is hashed
			const scoreObject = { streak, time: timeInSeconds, score: finalScore };

			// if the score is worse than or equal to the previous best, discontinue
			const oldScore = await kv.zscore('scores', user);
			if (oldScore >= finalScore) {
				return res
					.status(200)
					.send(
						'score not saved: score was lower than or equal to previous value'
					);
			}
			// save score and score object
			await kv.set(user, scoreObject);
			await kv.zadd('scores', { score: finalScore, member: user });
		} catch (error) {
			return res.status(500).send(error.message);
		}
	}
);

export default router;
