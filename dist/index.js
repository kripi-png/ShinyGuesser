"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const pokemon_1 = __importDefault(require("./api/pokemon/"));
const leaderboard_1 = __importDefault(require("./api/leaderboard/"));
const path = __dirname + '/views/';
const app = (0, express_1.default)();
app.set('port', 8080);
app.use((0, cors_1.default)());
app.use(express_1.default.static(path));
app.use('/api/pokemon', pokemon_1.default);
app.use('/api/leaderboard', leaderboard_1.default);
app.get('/', function (_req, res) {
    res.sendFile(path + 'index.html');
});
app.listen(app.get('port'), () => {
    console.log(`[server]: Server is running at http://localhost:${app.get('port')}`);
});
