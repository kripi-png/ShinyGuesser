"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const pokemon_1 = __importDefault(require("./api/pokemon/"));
const app = (0, express_1.default)();
app.set('port', 8080);
app.use((0, cors_1.default)());
app.use("/api/pokemon", pokemon_1.default);
app.listen(app.get('port'), () => {
    console.log(`[server]: Server is running at http://localhost:${app.get('port')}`);
});
//# sourceMappingURL=index.js.map