import express, { Request } from 'express';
import { kv } from '@vercel/kv';

const router = express.Router();

// get ?count amount of scores; default to 10
// values are stored in ascending order in the database
// so by default get the entries in reversed order (descending)
// using ?reverse=true switches the order around (back to ascending)
// a little counterintuitive maybe but it is what it is
router.get('/', async (req, res) => {
	const reverse = req.query.reverse === 'true' ? true : false;
	// if not set default to 10
	const countParam = req.query.count ? req.query.count : 10;
	try {
		const count = Number(countParam);
		if (isNaN(count))
			return res.status(400).send('invalid count: needs to be a number');
		if (count < 0)
			return res.status(400).send('count must be a positive integer');

		// initially scores are returned in a list where name and score are altered
		// [name1, score1, name2, score2, ...]
		// lower count by one because the first element is also counted,
		// so actually it is 1 + count
		const flatUserScoreList = await kv.zrange('scores', 0, count - 1, {
			rev: !reverse, // method returns reversed (ascending) list by default
			withScores: true, // also return the scores themselves and not just usernames
		});

		// generate a list of objects for each user and their score and time
		const leaderboard = [];
		for (let i = 0; i < flatUserScoreList.length; i += 2) {
			const user = flatUserScoreList[i]; // i = 0, 2, 4
			const streak = flatUserScoreList[i + 1]; // i+1 = 1, 3, 5
			const time = Number((await kv.hget(`user:${user}`, 'time')) || 0);
			leaderboard.push({ user, streak, time });
		}

		return res.status(200).json({
			data: leaderboard,
			meta: {
				total: leaderboard.length,
			},
		});
	} catch (error: any) {
		console.error(error);
		return res.status(500).send(error.name + ': ' + error.message);
	}
});

// POST /api/leaderboard/:user?streak=number&time=number
router.post(
	'/:user',
	async (req: Request<{ user: string; streak: number; time: number }>, res) => {
		const user = req.params.user?.trim();
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
		} catch (error: any) {
			console.error(error);
			return res.status(500).send(error.name + ': ' + error.message);
		}
	}
);

export default router;
