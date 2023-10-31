import 'dotenv/config';
import cors from 'cors';
import express, { Express } from 'express';
import pokemon from './api/pokemon/';
import leaderboard from './api/leaderboard/';

const path = __dirname + '/views/';
const app: Express = express();

app.set('port', 8080);
app.use(cors());
app.use(express.static(path));
app.use('/api/pokemon', pokemon);
app.use('/api/leaderboard', leaderboard);

app.get('/', function (req, res) {
	res.sendFile(path + 'index.html');
});

app.listen(app.get('port'), () => {
	console.log(
		`[server]: Server is running at http://localhost:${app.get('port')}`
	);
});
