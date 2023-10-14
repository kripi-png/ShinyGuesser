import express, { Request, Response } from 'express';
import pokemonController from '../controllers/pokemonController.js';

const router = express.Router();

// define routes
router.get('/', (req: Request, res: Response) => {
	res.send('Express + asd TypeScript Server');
});

router.get('/random', (req: Request, res: Response) => {
	const r = Math.round(Math.random() * 100);
	res.status(200).json({ random: r });
});

router.get('/pokemon', pokemonController.getRandomPokemon);

export default router;
