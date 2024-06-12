import { expect } from "chai";
import sinon from "sinon";
import UserController from "../../../src/controller/User.controller.js";

describe("UserController tests", () => {
  let userController, userService, req, res;

  beforeEach(() => {
    userService = {
      getUsers: sinon.stub(),
      findUserByEmail: sinon.stub(),
      addUser: sinon.stub(),
      editUser: sinon.stub(),
    };
    userController = new UserController(userService);
    req = {
      body: {},
      params: { id: "1" },
    };
    res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis(),
    };
  });

  describe("getUsers tests", () => {
    it("should get users from service and return them as json", async () => {
      // Arrange
      const testUser = [
        {
          id: 1,
          email: "user1@example.com",
          name: "User One",
          password: "password1",
          favoriteCities: [
            "66637931557ca62365e759f7",
            "66637931557ca62365e759f8",
          ],
        },
      ];
      userService.getUsers.resolves(testUser);
      // Act
      await userController.getUsers(req, res);
      // Assert
      expect(res.json.calledWith(testUser)).to.be.true;
    });
    it("should send an empty array if there are no users", async () => {
      // Arrange
      const testUser = [];
      userService.getUsers.resolves(testUser);
      // Act
      await userController.getUsers(req, res);
      // Assert
      expect(res.json.calledWith(testUser)).to.be.true;
    });
    it("should send a 500 response if getUsers throws an error", async () => {
      // Arrange
      const testError = new Error();
      userService.getUsers.rejects(testError);
      // Act
      await userController.getUsers(req, res);
      // Assert
      expect(res.json.calledWith({ message: testError.message })).to.be.true;
      expect(res.status.calledWith(500)).to.be.true;
    });
  });
  describe("findUserByEmail tests", () => {
    it("should get one user by email and return it as a json", async () => {
      const testUser = {
        id: 1,
        email: "user1@example.com",
        name: "User One",
        password: "password1",
        favoriteCities: [],
      };

      userService.findUserByEmail.resolves(testUser);

      await userController.findUserByEmail(req, res);

      expect(res.json.calledWith(testUser)).to.be.true;
    });
    it("should send a 404 response if no user was sent back from the service", async () => {
      const testUser = null;

      userService.findUserByEmail.resolves(testUser);

      await userController.findUserByEmail(req, res);

      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: "user not found" })).to.be.true;
    });
    it("should send a 400 response if there is no body", async () => {
      req.params.email = null;

      userService.findUserByEmail.resolves();

      await userController.findUserByEmail(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(
        res.json.calledWith({
          message: "Invalid request: 'email' parameter is missing",
        })
      ).to.be.true;
    });
    it("should send a 500 response if findUserByEmail service throws an error", async () => {
      const testError = new Error();

      userService.findUserByEmail.rejects(testError);

      await userController.findUserByEmail(req, res);

      expect(res.status.calledWith(500)).to.be.true;
    });
  });
  describe("addUser tests", () => {
    it("should add a new user", async () => {
      const newUser = {
        _id: "1",
        email: "user32@example.com",
        name: "User Three Two",
        password: "password22",
      };
      userService.addUser.resolves(newUser);

      await userController.addUser(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith(newUser)).to.be.true;
    });

    it("should send a 500 response if addUser returns a user without an id", async () => {
      const newUser = {
        email: "user32@example.com",
        name: "User Three Two",
        password: "password22",
        favoriteCities: [],
      };
      userService.addUser.resolves(newUser);

      await userController.addUser(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(
        res.json.calledWith({
          message: "Invalid User",
        })
      ).to.be.true;
    });

    it("should send a 400 response if body is null", async () => {
      req.body = null;

      await userController.addUser(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ message: "Invalid User" })).to.be.true;
    });
  });
  describe("editUser tests", () => {
    it("should edit a user ", async () => {
      const updateUser = {
        email: "user3@example.com",
        name: "User Three",
        password: "password3",
        favoriteCities: [
          "66637931557ca62365e759fb",
          "66637931557ca62365e759fc",
        ],
      };
      userService.editUser.resolves(updateUser);
      await userController.editUser(req, res);
      expect(res.status.calledWith(202)).to.be.true;
      expect(res.json.calledWith(updateUser)).to.be.true;
    });
    it("should send a 500 status code if user returns null ", async () => {
      userService.editUser.resolves(null);
      await userController.editUser(req, res);
      expect(res.status.calledWith(404)).to.be.true;
      expect(res.json.calledWith({ message: "user not found" })).to.be.true;
    });
    it("should send a 400 status code if id is null ", async () => {
      req.params.id = null;
      await userController.editUser(req, res);
      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ message: "invalid id" })).to.be.true;
    });
    it("should send a 400 status code if body is null", async () => {
      req.body = null;

      await userController.editUser(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ message: "invalid request body" })).to.be
        .true;
    });
  });
});
