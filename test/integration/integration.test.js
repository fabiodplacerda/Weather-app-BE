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
import FavouriteCityService from "../../src/services/FavouriteCity.service.js";

const { testCities, newTestCity } = testFavouriteCities;

describe("Integration Tests", () => {
  let favouriteCityServer, database, request, favouriteCityService;

  before(async () => {
    Config.load();
    const { PORT, HOST, DB_URI } = process.env;
    favouriteCityService = new FavouriteCityService();
    const favouriteCityController = new FavouriteCityController(
      favouriteCityService
    );
    const favouriteCityRoutes = new FavouriteCityRoutes(
      favouriteCityController,
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
    } catch (e) {
      console.log(e.message);
      throw new Error();
    }
    try {
      await FavouriteCity.insertMany(testCities);
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
    it("should respond with an array of favourite cities", async () => {
      const response = await request.get("/favouritecities/getcities");
      expect(response.body).to.be.an("array");
    });
    it("should respond with the right data", async () => {
      const response = await request.get("/favouritecities/getcities");
      const responseWithoutId = response.body.map((element) => {
        const { __v, _id, ...elementNoId } = element;
        return elementNoId;
      });
      it("should respond an empty array if there are no favourite cities", async () => {
        await FavouriteCity.deleteMany();
        const response = await request.get("/favouritecities/getcities");

        expect(response.body).to.deep.equal([]);
        expect(response.body).to.have.length(0);
      });

      expect(responseWithoutId).to.deep.equal(testCities);
    });
    it("should should respond with a 500 status code when there is an error", async () => {
      const stub = sinon.stub(favouriteCityService, "getCities");
      stub.throws(new Error("Test error"));
      const response = await request.get("/favouritecities/getcities");

      expect(response.status).to.equal(500);
    });
  });

  describe("Post request to /favouritecities", () => {
    it("should respond with a 201 status code for the path /favouritecities", async () => {
      const response = await request.post("/favouritecities").send(newTestCity);
      expect(response.status).to.equal(201);
    });
  });
});
