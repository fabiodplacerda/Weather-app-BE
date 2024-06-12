import Config from "../src/config/Config.js";
import Database from "../src/database/Database.js";
import User from "../src/models/user.model.js";
import FavouriteCity from "../src/models/favouriteCity.model.js";
import users from "./users.js";
import favouriteCities from "./favouriteCities.js";

Config.load();
const { DB_URI } = process.env;

const database = new Database(DB_URI);
await database.connect();

try {
  await User.deleteMany();
  console.log("Users database cleaned");
  await FavouriteCity.deleteMany();
  console.log("Favourite cities database cleaned");

  await User.insertMany(users);
  await FavouriteCity.insertMany(favouriteCities);
  console.log("Data base successfully seeded");
} catch (e) {
  console.log("failed to seed the database");
  console.log(e.message);
}

await database.close();
