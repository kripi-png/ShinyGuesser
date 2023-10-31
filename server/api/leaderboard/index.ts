import express, { Request } from 'express';
import { kv } from '@vercel/kv';

const router = express.Router();

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

router.post(
	'/:user/:score',
	async (req: Request<{ user: string; score: number }>, res) => {
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
			const oldScore = await kv.zscore('scores', user);
			if (oldScore >= score)
				return res
					.status(200)
					.send(
						'score not saved: score was lower than or equal to previous value'
					);

			// update database
			await kv.zadd('scores', { score, member: user });
			return res.status(204).end();
		} catch (error) {
			return res.status(500).send(error.message);
		}

		return res.status(200).json({ user, score });
	}
);

export default router;
