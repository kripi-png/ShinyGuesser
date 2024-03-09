## Todo

- work on the type guessing mode
- work on Shiny Guesser: Daily

## Gamemodes

### Shiny Guesser

- Player is prompted with an image of a pokemon.
- The player must make a guess whether the pokemon is normal or shiny.
- Correct guesses increase streak while incorrect guesses reset it. Each run is also timed.
- After run has ended, the player is asked if they want to save their score, and if so prompted for a username.
- Username is then saved with the streak and time to the database, and displayed on the leaderboard.

#### Daily mode??

- Predetermine 20-30 pokemon
- Players go through them one by one, guessing whether they are shiny or not
- Run is timed
- Display x/20 correct with time

### Some sorta type guessing game

- Hard mode:
  - A single random pokemon
  - Player has to select its type(s) from the listing
- Mid mode:
  - Display maybe 4 pokemons with question "which of these is type1/type2?"

## Development

1. Clone the repo
2. `npm i` both in the root and /vue
3. create copy `.env.example` into same dir and rename it `.env`
4. run `docker compose up -d`

- you can interact with the redis with `docker exec -i <container name / id> redis-cli`. Run `docker ps` for the name/id

5. in root run `npm run start` to start both back and front

- Check `package.json` for other commands

6. Go to `localhost:5173` for front and `localhost:8080/api/whatever` for backend

### Contribution

- Commits should follow Conventional Commits as well as possible
- **for now** final commit in pull request should include the `/dist` dir
  - `npm run build` and `npm run add-build` and `git commit`
- preferably open an issue first and then work on PR
