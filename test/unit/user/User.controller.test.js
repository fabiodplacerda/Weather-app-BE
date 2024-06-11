import { expect } from "chai";
import sinon from "sinon";
import UserController from "../../../src/controller/User.controller.js";

describe("UserController tests", () => {
  let userController, userService, req, res;

  beforeEach(() => {
    userService = {
      getUsers: sinon.stub(),
    };
    userController = new UserController(userService);
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
});
