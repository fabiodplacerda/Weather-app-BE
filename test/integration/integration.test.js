import supertest from "supertest";
import { expect, use } from "chai";
import sinon from "sinon";

// Server
import Server from "../../src/server/Server.js";
import Database from "../../src/database/Database.js";
import Config from "../../src/config/Config.js";

// Models
import FavouriteCity from "../../src/models/favouriteCity.model.js";
import User from "../../src/models/user.model.js";

// Test data
import testFavouriteCities from "../data/testCities.js";
import testUsers from "../data/testUsers.js";

// Routes
import FavouriteCityRoutes from "../../src/routes/FavouriteCity.routes.js";
import UserRoutes from "../../src/routes/User.routes.js";

//Controllers
import FavouriteCityController from "../../src/controller/FavouriteCity.controller.js";
import UserController from "../../src/controller/User.controller.js";

// Services
import FavouriteCityService from "../../src/services/FavouriteCity.service.js";
import UserService from "../../src/services/User.service.js";
import { response } from "express";

const { testCities, newTestCity } = testFavouriteCities;
const { users, newUser } = testUsers;

describe("Integration Tests", () => {
  let server, database, request, favouriteCityService, userService;

  before(async () => {
    Config.load();
    const { PORT, HOST, DB_URI } = process.env;
    favouriteCityService = new FavouriteCityService();
    userService = new UserService();

    const userController = new UserController(userService);
    const favouriteCityController = new FavouriteCityController(
      favouriteCityService
    );
    const userRoutes = new UserRoutes(userController, "/user");
    const favouriteCityRoutes = new FavouriteCityRoutes(
      favouriteCityController,
      "/favouriteCities"
    );
    server = new Server(PORT, HOST, [favouriteCityRoutes, userRoutes]);
    database = new Database(DB_URI);
    server.start();

    await database.connect();
    request = supertest(server.getApp());
  });

  after(async () => {
    await server.close();
    await database.close();
  });

  beforeEach(async () => {
    try {
      await FavouriteCity.deleteMany();
      await User.deleteMany();
    } catch (e) {
      console.log(e.message);
      throw new Error();
    }
    try {
      await FavouriteCity.insertMany(testCities);
      await User.insertMany(users);
    } catch (e) {
      console.log(e.message);
      throw new Error();
    }
  });

  describe("Favourite City", () => {
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

        stub.restore();
      });
    });

    describe("Post request to /favouritecities", () => {
      it("should respond with a 201 status code for the path /favouritecities", async () => {
        const response = await request
          .post("/favouritecities")
          .send(newTestCity);
        expect(response.status).to.equal(201);
      });
      it("should contain city in the response body when adding a new city", async () => {
        const response = await request
          .post("/favouritecities")
          .send(newTestCity);
        expect(response.body).to.include(newTestCity);
      });
      it("should add a new city to the database", async () => {
        await request.post("/favouritecities").send(newTestCity);
        const response = await request.get("/favouritecities/getcities");
        const addedCity = response.body.find(
          (city) => city.cityName === newTestCity.cityName
        );
        expect(addedCity).to.include(newTestCity);
      });
      it("should respond with a 500 status code if there is an error", async () => {
        const stub = sinon.stub(favouriteCityService, "addCity");
        stub.throws(new Error("Test error"));
        const response = await request
          .post("/favouritecities")
          .send(newTestCity);
        expect(response.status).to.equal(500);
        stub.restore();
      });
      it("should respond with a 400 status when posting a city with cityName missing", async () => {
        const invalidCity = { ...newTestCity, cityName: null };

        const response = await request
          .post("/favouritecities")
          .send(invalidCity);
        expect(response.status).to.equal(400);
      });
      it("should respond with a 400 status when posting a city with cityName that is not a string", async () => {
        const invalidCity = { ...newTestCity, cityName: 22 };

        const response = await request
          .post("/favouritecities")
          .send(invalidCity);
        expect(response.status).to.equal(400);
      });
      it("should respond with a 400 status when posting a city with cityName that is an empty string", async () => {
        const invalidCity = { ...newTestCity, cityName: "" };

        const response = await request
          .post("/favouritecities")
          .send(invalidCity);
        expect(response.status).to.equal(400);
      });
      it("should respond with a 400 status when posting a city with cityCountry missing", async () => {
        const invalidCity = { ...newTestCity, cityCountry: null };

        const response = await request
          .post("/favouritecities")
          .send(invalidCity);
        expect(response.status).to.equal(400);
      });
      it("should respond with a 400 status when posting a city with cityCountry that is not a string", async () => {
        const invalidCity = { ...newTestCity, cityCountry: 22 };

        const response = await request
          .post("/favouritecities")
          .send(invalidCity);
        expect(response.status).to.equal(400);
      });
      it("should respond with a 400 status when posting a city with cityCountry that is a empty string", async () => {
        const invalidCity = { ...newTestCity, cityCountry: 22 };

        const response = await request
          .post("/favouritecities")
          .send(invalidCity);
        expect(response.status).to.equal(400);
      });
    });
  });

  describe("User", () => {
    describe("GET request to /user/getUsers ", () => {
      it("should respond with a 200 status code for the path /user/getUsers", async () => {
        // Arrange
        // Act
        const response = await request.get("/user/getUsers");
        // Assert
        expect(response.status).to.equal(200);
      });
      it("should respond with an array", async () => {
        // Arrange
        // Act
        const response = await request.get("/user/getUsers");
        // Assert
        expect(response.body).to.be.an("array");
      });
      it("should respond with an array with users", async () => {
        // Arrange
        const response = await request.get("/user/getUsers");
        const formattedResponse = response.body.map((user) => {
          const { __v, ...formattedUser } = user;
          return formattedUser;
        });
        // Act
        // Assert
        expect(formattedResponse).to.deep.equal(users);
      });
      it("should respond with an empty array when there are no users", async () => {
        // Arrange
        await User.deleteMany();
        const response = await request.get("/user/getUsers");
        // Act
        // Assert
        expect(response.body).to.deep.equal([]);
        await User.insertMany(users);
      });
      it("should respond with 500 status code when there is an error", async () => {
        // Arrange
        const stub = sinon.stub(userService, "getUsers");
        stub.throws(new Error("Test Error"));
        const response = await request.get("/user/getUsers");
        // Act
        // Assert
        expect(response.status).to.equal(500);
        stub.restore();
      });
    });
    describe("POST request to /user", () => {
      it("should respond with a 201 for a post request", async () => {
        // Arrange
        // Act
        const response = await request.post("/user").send(newUser);
        // Assert
        expect(response.status).to.equal(201);
      });
      it("should send the new user in the body when adding a new user", async () => {
        // Arrange
        // Act
        const response = await request.post("/user").send(newUser);
        // Assert
        expect(response.body).to.include({
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
        });
        expect(response.body.favouriteCities).to.deep.equal(
          newUser.favouriteCities
        );
      });
      it("should add a new user to the database", async () => {
        // Arrange
        await request.post("/user").send(newUser);
        const response = await request.get("/user/getUsers");
        // Act
        const addedUser = response.body.find(
          (user) => user.name === newUser.name
        );
        // Assert
        expect(addedUser).to.include({
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
        });
        expect(addedUser.favouriteCities).to.deep.equal(
          newUser.favouriteCities
        );
      });
      it("should respond with a 500 status code if there is an error", async () => {
        // Arrange
        const stub = sinon.stub(userService, "addUser");
        stub.throws(new Error("test error"));
        // Act
        const response = await request.post("/user").send(newUser);
        // Assert
        expect(response.status).to.equal(500);

        stub.restore();
      });
      it("should respond with a 400 status code if email is missing", async () => {
        // Arrange
        const invalidUser = { ...newUser, email: null };
        // Act
        const response = await request.post("/user").send(invalidUser);
        // Assert
        expect(response.status).to.equal(400);
      });
      it("should respond with a 400 status code if email is not a string", async () => {
        // Arrange
        const invalidUser = { ...newUser, email: 22 };
        // Act
        const response = await request.post("/user").send(invalidUser);
        // Assert
        expect(response.status).to.equal(400);
      });
      it("should respond with a 400 status code if email is an empty string", async () => {
        // Arrange
        const invalidUser = { ...newUser, email: "" };
        // Act
        const response = await request.post("/user").send(invalidUser);
        // Assert
        expect(response.status).to.equal(400);
      });
      it("should respond with a 400 status code if name is missing", async () => {
        // Arrange
        const invalidUser = { ...newUser, name: null };
        // Act
        const response = await request.post("/user").send(invalidUser);
        // Assert
        expect(response.status).to.equal(400);
      });
      it("should respond with a 400 status code if name is not a string", async () => {
        // Arrange
        const invalidUser = { ...newUser, name: 22 };
        // Act
        const response = await request.post("/user").send(invalidUser);
        // Assert
        expect(response.status).to.equal(400);
      });
      it("should respond with a 400 status code if name is an empty string", async () => {
        // Arrange
        const invalidUser = { ...newUser, name: "" };
        // Act
        const response = await request.post("/user").send(invalidUser);
        // Assert
        expect(response.status).to.equal(400);
      });
      it("should respond with a 400 status code if password is missing", async () => {
        // Arrange
        const invalidUser = { ...newUser, password: null };
        // Act
        const response = await request.post("/user").send(invalidUser);
        // Assert
        expect(response.status).to.equal(400);
      });
      it("should respond with a 400 status code if password is not a string", async () => {
        // Arrange
        const invalidUser = { ...newUser, password: 22 };
        // Act
        const response = await request.post("/user").send(invalidUser);
        // Assert
        expect(response.status).to.equal(400);
      });
      it("should respond with a 400 status code if password is an empty string", async () => {
        // Arrange
        const invalidUser = { ...newUser, password: "" };
        // Act
        const response = await request.post("/user").send(invalidUser);
        // Assert
        expect(response.status).to.equal(400);
      });
    });
    describe("PUT request to /user/:id", () => {
      const testUser = users[0];
      const testId = users[0]._id;
      const updatedUser = {
        ...testUser,
        password: "newPassword",
      };

      it("should respond with a 200 status code for PUT /:id", async () => {
        const response = await request.put(`/user/${testId}`).send(updatedUser);
        expect(response.status).to.equal(202);
      });
      it("should respond with the updated user", async () => {
        const response = await request.put(`/user/${testId}`).send(updatedUser);
        const responseWithoutV = response.body;
        delete responseWithoutV.__v;
        expect(responseWithoutV).to.deep.equal(updatedUser);
      });
      it("should update the user in the database", async () => {
        await request.put(`/user/${testId}`).send(updatedUser);
        const response = await request.get("/user/getUsers");
        const responseWithoutV = response.body.map((user) => {
          const { __v, ...formattedUser } = user;
          return formattedUser;
        });
        expect(responseWithoutV).to.deep.include(updatedUser);
      });
      it("should respond with a 404 status code when a user does not exit", async () => {
        const noExistingId = "5ca7177e0774a968c209a928";
        const response = await request
          .put(`/user/${noExistingId}`)
          .send(updatedUser);
        expect(response.status).to.equal(404);
      });
      it("should respond with a 400 status code when one of the updated fields is invalid", async () => {
        const response = await request
          .put(`/user/${testId}`)
          .send({ ...updatedUser, name: "" });
        expect(response.status).to.equal(400);
      });
      it("should respond with a 500 status code when there is an error", async () => {
        const stub = sinon.stub(userService, "editUser");
        stub.throws(new Error("test error"));
        const response = await request.put(`/user/${testId}`).send(updatedUser);
        expect(response.status).to.equal(500);
      });
    });
  });
});
