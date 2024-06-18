import supertest from "supertest";
import { expect } from "chai";
import sinon from "sinon";

// Server
import Server from "../../src/server/Server.js";
import Database from "../../src/database/Database.js";
import Config from "../../src/config/Config.js";

// Models
import User from "../../src/models/user.model.js";

// Test data

import testUsers from "../data/testUsers.js";

// Routes

import UserRoutes from "../../src/routes/User.routes.js";

//Controllers

import UserController from "../../src/controller/User.controller.js";

// Services

import UserService from "../../src/services/User.service.js";

const { users, newUser } = testUsers;

describe("Integration Tests", () => {
  let server, database, request, userService;

  before(async () => {
    Config.load();
    const { PORT, HOST, DB_URI } = process.env;
    userService = new UserService();
    const userController = new UserController(userService);
    const userRoutes = new UserRoutes(userController, "/user");

    server = new Server(PORT, HOST, userRoutes);
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
      await User.deleteMany();
    } catch (e) {
      console.log(e.message);
      throw new Error();
    }
    try {
      await User.insertMany(users);
    } catch (e) {
      console.log(e.message);
      throw new Error();
    }
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
          const { __v, favouriteCities, ...formattedUser } = user;
          const formattedCities = favouriteCities.map(
            ({ _id, ...city }) => city
          );
          return { ...formattedUser, favouriteCities: formattedCities };
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
    describe("GET request to /user/findUserByEmail/:email", () => {
      it("should respond with a 200 status code when a used is found", async () => {
        const testEmail = "user1@example.com";
        const response = await request.get(
          `/user/findUserByEmail/${testEmail}`
        );
        expect(response.status).to.equal(200);
      });
      it("should respond back with an user if user was found", async () => {
        const testEmail = "user1@example.com";
        const response = await request.get(
          `/user/findUserByEmail/${testEmail}`
        );
        const { body } = response;
        const { favouriteCities } = body;

        const formattedFavourites = favouriteCities.map((city) => {
          const { _id, ...cityWithoutId } = city;
          return cityWithoutId;
        });
        expect({ ...body, favouriteCities: formattedFavourites }).to.deep.equal(
          { ...users[0], __v: 0 }
        );
      });
      it("should respond with a 404 if user was found", async () => {
        const testEmail = "testEmail@example.com";
        const response = await request.get(
          `/user/findUserByEmail/${testEmail}`
        );
        expect(response.status).to.equal(404);
        expect(response.body).to.deep.equal({ message: "user not found" });
      });
      it("should respond with 500 status code when there is an error", async () => {
        const stub = sinon.stub(userService, "findUserByEmail");
        stub.throws(new Error("Test error"));

        const testEmail = "testEmail@example.com";
        const response = await request.get(
          `/user/findUserByEmail/${testEmail}`
        );
        expect(response.status).to.equal(500);
        expect(response.body).to.deep.equal({ message: "Test error" });

        stub.restore();
      });
    });
    describe("GET request to /user/login", () => {
      const testUser = users[0];

      it("should respond with a 200 status code when a email was found and password matches", async () => {
        const response = await request
          .post(`/user/login`)
          .send({ email: testUser.email, password: testUser.password });
        expect(response.status).to.equal(200);
      });
      it("should respond back with an user if email and password matches to a user", async () => {
        const response = await request
          .post(`/user/login`)
          .send({ email: testUser.email, password: testUser.password });
        const { body } = response;
        const { favouriteCities } = body;

        const formattedFavourites = favouriteCities.map((city) => {
          const { _id, ...cityWithoutId } = city;
          return cityWithoutId;
        });
        expect({ ...body, favouriteCities: formattedFavourites }).to.deep.equal(
          { ...users[0], __v: 0 }
        );
      });
      it("should respond with a 404 if email was not found", async () => {
        const testEmail = "testEmail@example.com";
        const response = await request
          .post(`/user/login`)
          .send({ email: testEmail, password: testUser.password });
        expect(response.status).to.equal(404);
        expect(response.body).to.deep.equal({
          message: "email or password are incorrect",
        });
      });
      it("should respond with a 404 if password doesn't match", async () => {
        const password = "password1234!";
        const response = await request
          .post(`/user/login`)
          .send({ email: testUser.email, password: password });
        expect(response.status).to.equal(404);
        expect(response.body).to.deep.equal({
          message: "email or password are incorrect",
        });
      });
      it("should respond with a 400 if email wasn't provided", async () => {
        const response = await request
          .post(`/user/login`)
          .send({ email: null, password: "Password1213!" });
        expect(response.status).to.equal(400);
        expect(response.body).to.deep.equal({
          message: "Invalid request: body parameters are missing",
        });
      });
      it("should respond with a 400 if password wasn't provided", async () => {
        const response = await request
          .post(`/user/login`)
          .send({ email: "test@email.com", password: null });
        expect(response.status).to.equal(400);
        expect(response.body).to.deep.equal({
          message: "Invalid request: body parameters are missing",
        });
      });
      it("should respond with 500 status code when there is an error", async () => {
        const stub = sinon.stub(userService, "login");
        stub.throws(new Error("Test error"));
        const response = await request
          .post(`/user/login`)
          .send({ email: testUser.email, password: testUser.password });
        expect(response.status).to.equal(500);
        expect(response.body).to.deep.equal({ message: "Test error" });

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
        const { body } = response;
        const formattedCities = body.favouriteCities.map((city) => {
          const { _id, ...cityWithoutV } = city;
          return cityWithoutV;
        });
        // Assert
        expect(body).to.include({
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
        });

        expect(formattedCities).to.deep.equal(newUser.favouriteCities);
      });
      it("should add a new user to the database", async () => {
        // Arrange
        await request.post("/user").send(newUser);
        const response = await request.get("/user/getUsers");
        const { body } = response;

        // Act
        const addedUser = response.body.find(
          (user) => user.name === newUser.name
        );
        const formattedCities = addedUser.favouriteCities.map((city) => {
          const { _id, ...cityWithoutV } = city;
          return cityWithoutV;
        });

        // Assert
        expect(addedUser).to.include({
          name: newUser.name,
          email: newUser.email,
          password: newUser.password,
        });
        expect(formattedCities).to.deep.equal(newUser.favouriteCities);
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
    describe("PATCH request to /user/updatePassword/:id", () => {
      const testUser = users[0];
      const testId = users[0]._id;
      const testUserPassword = testUser.password;
      const newPassword = "newPassword1!";
      const updatedUser = {
        ...testUser,
        password: "newPassword1!",
      };

      it("should respond with a 202 status code for PATCH /user/updatePassword/:id", async () => {
        const response = await request
          .patch(`/user/updatePassword/${testId}`)
          .send({
            password: testUserPassword,
            newPassword: newPassword,
          });
        expect(response.status).to.equal(202);
      });
      it("should respond with the updated user", async () => {
        const response = await request
          .patch(`/user/updatePassword/${testId}`)
          .send({
            password: testUserPassword,
            newPassword: newPassword,
          });

        const { body } = response;

        const formattedCities = body.favouriteCities.map((city) => {
          const { _id, ...cityWithoutV } = city;
          return cityWithoutV;
        });
        const responseWithoutV = body;
        delete responseWithoutV.__v;
        expect({
          ...responseWithoutV,
          favouriteCities: formattedCities,
        }).to.deep.equal(updatedUser);
      });
      it("should update the user in the database", async () => {
        await await request.patch(`/user/updatePassword/${testId}`).send({
          password: testUserPassword,
          newPassword: newPassword,
        });
        const response = await request.get("/user/getUsers");

        const formattedResponse = response.body.map((user) => {
          const { __v, favouriteCities, ...formattedUser } = user;

          const formattedCities = favouriteCities.map(
            ({ _id, ...city }) => city
          );
          return { ...formattedUser, favouriteCities: formattedCities };
        });
        expect(formattedResponse).to.deep.include(updatedUser);
      });
      it("should respond with a 401 if password doesn't match", async () => {
        const response = await request
          .patch(`/user/updatePassword/${testId}`)
          .send({
            password: "NotMatchingPassword",
            newPassword: newPassword,
          });
        expect(response.status).to.equal(401);
        expect(response.body).to.deep.equal({ message: "Auth Error" });
      });
      it("should respond with a 400 status code when password is invalid", async () => {
        const response = await request
          .patch(`/user/updatePassword/${testId}`)
          .send({
            password: testUserPassword,
            newPassword: "invalidPassword",
          });

        expect(response.status).to.equal(400);
      });
      it("should respond with a 500 status code when there is an error", async () => {
        const stub = sinon.stub(userService, "updatePassword");
        stub.throws(new Error("test error"));
        const response = await request
          .patch(`/user/updatePassword/${testId}`)
          .send({
            password: testUserPassword,
            newPassword: newPassword,
          });
        expect(response.status).to.equal(500);
      });
    });
    describe("PATCH request to /user/updateFavouriteCities/:id", () => {
      const testUser = users[0];
      const testId = users[0]._id;
      const testPassword = testUser.password;
      const newCity = {
        city: "Sydney",
        country: "Australia",
        latitude: -33.8688,
        longitude: 151.2093,
      };
      const updatedUser = {
        ...testUser,
        favouriteCities: [...testUser.favouriteCities, newCity],
      };

      it("should respond with a 202 status code for PATCH the path /user/updateFavouriteCities/:id", async () => {
        const response = await request
          .patch(`/user/updateFavouriteCities/${testId}`)
          .send({
            newFavouriteCity: newCity,
            password: testPassword,
          });

        expect(response.status).to.equal(202);
      });
      it("should respond with an updated user", async () => {
        const response = await request
          .patch(`/user/updateFavouriteCities/${testId}`)
          .send({
            newFavouriteCity: newCity,
            password: testPassword,
          });

        const { body } = response;
        const { __v, ...formattedResponse } = body;

        const formattedCities = body.favouriteCities.map((city) => {
          const { _id, ...cityWithoutId } = city;
          return cityWithoutId;
        });

        expect({
          ...formattedResponse,
          favouriteCities: formattedCities,
        }).to.deep.equal(updatedUser);
      });
      it("should update the user in the database", async () => {
        const addedUser = await request
          .patch(`/user/updateFavouriteCities/${testId}`)
          .send({
            newFavouriteCity: newCity,
            password: testPassword,
          });
        const { name } = addedUser.body;
        const response = await request.get("/user/getUsers");
        const { body } = response;

        const findUser = body.find((user) => user.name === name);

        expect(body).to.deep.include(findUser);
      });
      it("should update the user in the database when cities array is empty", async () => {
        const updatedUser3 = {
          ...users[3],
          favouriteCities: [newCity],
        };
        await request
          .patch(`/user/updateFavouriteCities/${users[3]._id}`)
          .send({
            newFavouriteCity: newCity,
            password: users[3].password,
          });
        const response = await request.get("/user/getUsers");
        const bodyResponse = response.body[3];
        const formattedCities = bodyResponse.favouriteCities.map((city) => {
          const { _id, ...cityWithoutId } = city;
          return cityWithoutId;
        });

        expect({
          ...bodyResponse,
          favouriteCities: formattedCities,
        }).to.deep.equal({ ...updatedUser3, __v: 0 });
      });
      it("should respond with a 400 status code if new city has invalid fields", async () => {
        const invalidNewCity = { city: "", country: "" };
        const response = await request
          .patch(`/user/updateFavouriteCities/${testId}`)
          .send({
            newFavouriteCity: invalidNewCity,
            password: testPassword,
          });

        expect(response.status).to.equal(400);
      });
      it("should respond with a 401 if user is not authenticated", async () => {
        const response = await request
          .patch(`/user/updateFavouriteCities/${testId}`)
          .send({
            newFavouriteCity: newCity,
            password: users[3].password,
          });

        expect(response.status).to.equal(401);
        expect(response.body).to.deep.equal({ message: "Auth Error" });
      });
      it("should respond with a 500 status code when there is an error", async () => {
        const stub = sinon.stub(userService, "updateFavouriteCities");
        stub.throws(new Error("test error"));
        const response = await request
          .patch(`/user/updateFavouriteCities/${testId}`)
          .send({
            newFavouriteCity: newCity,
            password: testPassword,
          });
        expect(response.status).to.equal(500);
      });
    });
    describe("PATCH request to /user/removeFavouriteCity/:id", () => {
      const testUser = users[0];
      const testId = users[0]._id;
      const testPassword = testUser.password;
      const testCityToRemove = {
        city: "New York",
        country: "USA",
        latitude: 40.7128,
        longitude: -74.006,
      };
      const updatedUser = {
        ...testUser,
        favouriteCities: [
          {
            city: "Paris",
            country: "France",
            latitude: 48.8566,
            longitude: 2.3522,
          },
        ],
      };

      it("should respond with a 202 status code for PATCH the path /user/updateFavouriteCities/:id", async () => {
        const response = await request
          .patch(`/user/removeFavouriteCity/${testId}`)
          .send({
            cityToRemove: testCityToRemove,
            password: testPassword,
          });

        expect(response.status).to.equal(202);
      });
      it("should respond with an updated user", async () => {
        const response = await request
          .patch(`/user/removeFavouriteCity/${testId}`)
          .send({
            cityToRemove: testCityToRemove,
            password: testPassword,
          });

        const { body } = response;
        const { __v, ...formattedResponse } = body;

        const formattedCities = body.favouriteCities.map((city) => {
          const { _id, ...cityWithoutId } = city;
          return cityWithoutId;
        });

        expect({
          ...formattedResponse,
          favouriteCities: formattedCities,
        }).to.deep.equal(updatedUser);
      });
      it("should update the user in the database", async () => {
        const addedUser = await request
          .patch(`/user/removeFavouriteCity/${testId}`)
          .send({
            cityToRemove: testCityToRemove,
            password: testPassword,
          });
        const { name } = addedUser.body;
        const response = await request.get("/user/getUsers");
        const { body } = response;

        const findUser = body.find((user) => user.name === name);

        expect(body).to.deep.include(findUser);
      });
      it("should have no effect when user has has no favourite cities", async () => {
        const updatedUser3 = users[3];

        await request
          .patch(`/user/removeFavouriteCity/${updatedUser3._id}`)
          .send({
            cityToRemove: testCityToRemove,
            password: users[3].password,
          });
        const response = await request.get("/user/getUsers");
        const bodyResponse = response.body[3];
        const formattedCities = bodyResponse.favouriteCities.map((city) => {
          const { _id, ...cityWithoutId } = city;
          return cityWithoutId;
        });

        expect({
          ...bodyResponse,
          favouriteCities: formattedCities,
        }).to.deep.equal({ ...updatedUser3, __v: 0 });
      });
      it("should respond with a 404 status code id doesn't exists", async () => {
        const response = await request
          .patch(`/user/removeFavouriteCity/${testId}`)
          .send({
            cityToRemove: testCityToRemove,
            password: users[3].password,
          });

        expect(response.status).to.equal(401);
        expect(response.body).to.deep.equal({ message: "Auth Error" });
      });
      it("should respond with a 500 status code when there is an error", async () => {
        const stub = sinon.stub(userService, "removeFavouriteCity");
        stub.throws(new Error("test error"));
        const response = await request
          .patch(`/user/removeFavouriteCity/${testId}`)
          .send({
            cityToRemove: testCityToRemove,
            password: testPassword,
          });
        expect(response.status).to.equal(500);
      });
    });
  });
});
