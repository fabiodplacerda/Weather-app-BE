import { expect } from "chai";
import sinon from "sinon";
import testFavouriteCities from "../data/testCities.js";

import Config from "../../src/config/Config.js";
import FavouriteCityRoutes from "../../src/routes/FavouriteCity.routes.js";
import Database from "../../src/database/Database.js";
import Server from "../../src/server/Server.js";
import FavouriteCity from "../../src/models/favouriteCity.model.js";
import supertest from "supertest";
import FavouriteCityController from "../../src/controller/FavouriteCity.controller.js";

describe("Integration Tests", () => {
  let favouriteCityServer, database, request;

  before(async () => {
    Config.load();
    const { PORT, HOST, DB_URI } = process.env;
    const favouriteCityRoutes = new FavouriteCityRoutes(
      new FavouriteCityController(),
      "/favouriteCities"
    );
    favouriteCityServer = new Server(PORT, HOST, favouriteCityRoutes);
    database = new Database(DB_URI);
    favouriteCityServer.start();
    await database.connect();
    request = supertest(favouriteCityServer.getApp());
  });

  after(async () => {
    await favouriteCityServer.close();
    await database.close();
  });

  beforeEach(async () => {
    try {
      await FavouriteCity.deleteMany();
      console.log("Database cleared");
    } catch (e) {
      console.log(e.message);
      throw new Error();
    }
    try {
      await FavouriteCity.insertMany(testFavouriteCities);
      console.log("Database populated");
    } catch (e) {
      console.log(e.message);
      throw new Error();
    }
  });
  describe("Get request to /favouritecities/getcities", () => {
    it("should respond with a 200 status code for the path /favouritecities/getcities", async () => {
      const response = await request.get("/favouritecities/getcities");
      expect(response.status).to.equal(200);
    });
  });
});
