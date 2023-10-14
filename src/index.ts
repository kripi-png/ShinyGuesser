import dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import express, { Express } from 'express';
import router from './router/index.js';

const app: Express = express();
app.set('port', process.env.PORT || 8000);

app.use(cors());
app.use(router);

app.listen(app.get('port'), () => {
	console.log(
		`[server]: Server is running at http://localhost:${app.get('port')}`
	);
});
