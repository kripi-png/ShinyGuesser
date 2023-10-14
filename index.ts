import cors from 'cors';
import express, { Express } from 'express';
import pokemon from "./api/pokemon";

const app: Express = express();
app.set('port', 8080);
app.use(cors());
app.use("/api/pokemon", pokemon);

app.listen(app.get('port'), () => {
	console.log(
		`[server]: Server is running at http://localhost:${app.get('port')}`
	);
});
