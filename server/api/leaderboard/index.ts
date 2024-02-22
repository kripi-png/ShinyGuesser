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
		if (isNaN(count))
			return res.status(400).send('invalid count: needs to be a number');
		// if not set default to 10
		if (!count) count = 10;

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

// POST /api/leaderboard/:user?streak=number&time=number
router.post(
	'/:user',
	async (req: Request<{ user: string; streak: number; time: number }>, res) => {
		const user = req.params.user;
		if (!user) return res.status(400).send('invalid username');
		if (!req.query.streak) return res.status(400).send('missing streak value');
		if (!req.query.time) return res.status(400).send('missing time value');

		try {
			// validate values
			const streak = Number(req.query.streak);
			const time = Number(req.query.time);
			if (isNaN(streak) || isNaN(time))
				throw TypeError('invalid streak or time value');
			if (streak < 0 || time < 0)
				throw RangeError('streak or time cannot be negative');

			const previousBestStreak = Number(await kv.zscore('scores', user));
			const didBeatStreak = streak > previousBestStreak;
			// time in seconds
			const previousBestTime = Number(await kv.hget(`user:${user}`, 'time'));
			const didBeatTime = time < previousBestTime;

			// if streak was better, replace both streak and time with new values
			if (didBeatStreak) {
				await kv.zadd('scores', { member: user, score: streak });
				await kv.hset(`user:${user}`, { streak, time });
				return res.status(200).send('new highscore saved');
			}

			// if streak was same as previous best but time was better, save new time
			if (streak === previousBestStreak && didBeatTime) {
				await kv.hset(`user:${user}`, { time });
				return res.status(200).send('new time saved');
			}

			return res
				.status(200)
				.send('Time/streak was not saved: worse than previous best.');
		} catch (error) {
			console.error(error);
			return res.status(500).send(error.name + ': ' + error.message);
		}
	}
);

export default router;
