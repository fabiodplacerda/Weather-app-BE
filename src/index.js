import Config from "./config/Config.js";
import FavouriteCityController from "./controller/FavouriteCity.controller.js";
import Database from "./database/Database.js";
import FavouriteCityRoutes from "./routes/FavouriteCity.routes.js";
import Server from "./server/Server.js";

Config.load();
const { PORT, HOST, DB_URI } = process.env;

const favouriteCityRoutes = new FavouriteCityRoutes(
  new FavouriteCityController(),
  "/favouriteCities"
);

const server = new Server(PORT, HOST, favouriteCityRoutes);
const database = new Database(DB_URI);

server.start();
await database.connect();
