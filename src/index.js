import Config from "./config/Config.js";
import Database from "./database/Database.js";
import Server from "./server/Server.js";

Config.load();

const { PORT, HOST, DB_URI } = process.env;

const server = new Server(PORT, HOST);
const database = new Database(DB_URI);

server.start();
database.connect();
