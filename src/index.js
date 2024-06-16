import Config from "./config/Config.js";
import UserController from "./controller/User.controller.js";
import Database from "./database/Database.js";
import UserRoutes from "./routes/User.routes.js";
import Server from "./server/Server.js";

Config.load();
const { PORT, HOST, DB_URI } = process.env;

const userRoutes = new UserRoutes(new UserController(), "/user");

const server = new Server(PORT, HOST, userRoutes);
const database = new Database(DB_URI);

server.start();
await database.connect();
