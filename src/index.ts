import cors from 'cors';
import dotenv from 'dotenv';
import express, { Express, Request, Response } from 'express';

dotenv.config();

const port = process.env.PORT;
const app: Express = express();
app.use(cors());

app.get('/', (req: Request, res: Response) => {
	res.send('Express + asd TypeScript Server');
});

app.get('/random', (req, res) => {
	const r = Math.round(Math.random() * 100);
	res.status(200).json({ random: r });
});

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
