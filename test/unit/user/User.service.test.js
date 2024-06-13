import { expect } from "chai";
import sinon from "sinon";
import User from "../../../src/models/user.model.js";
import UserService from "../../../src/services/User.service.js";

describe("UserService tests", () => {
  let userService;
  beforeEach(() => {
    userService = new UserService();
  });
  describe("getUsers", () => {
    it("should call find on the User model", async () => {
      // Arrange
      const findStub = sinon.stub(User, "find");
      findStub.resolves([]);
      // Act
      await userService.getUsers();
      // Assert
      expect(findStub.calledOnce).to.be.true;

      findStub.restore();
    });
    it("should return the users", async () => {
      // Arrange
      const testUser = [
        {
          id: "1",
          email: "user2@example.com",
          name: "User Two",
          password: "password2",
          favoriteCities: [],
        },
      ];
      const findStub = sinon.stub(User, "find");
      findStub.resolves(testUser);
      // Act
      const result = await userService.getUsers();
      // Assert
      expect(result).to.equal(testUser);

      findStub.restore();
    });
    it("should return an empty array when there are no users", async () => {
      // Arrange
      const testUser = [];
      const findStub = sinon.stub(User, "find");
      findStub.resolves(testUser);
      // Act
      const result = await userService.getUsers();
      // Assert
      expect(result).to.equal(testUser);

      findStub.restore();
    });
  });

  describe("findUserByEmail", () => {
    it("should call findOne on the model", async () => {
      // Arrange
      const findOneStub = sinon.stub(User, "findOne");
      findOneStub.resolves({});
      // Act
      await userService.findUserByEmail();
      // Assert
      expect(findOneStub.calledOnce).to.be.true;
      findOneStub.restore();
    });
    it("should call return a user", async () => {
      // Arrange
      const testUser = {
        id: "1",
        email: "user2@example.com",
        name: "User Two",
        password: "password2",
        favoriteCities: [],
      };
      const findOneStub = sinon.stub(User, "findOne");
      findOneStub.resolves(testUser);
      // Act
      const result = await userService.findUserByEmail();
      // Assert
      expect(result).to.equal(testUser);
      findOneStub.restore();
    });
  });

  describe("addUsers tests", () => {
    it("should call save and return the result when a valid newUser is added", async () => {
      const newUser = {
        _id: "1",
        email: "user2@example.com",
        name: "User Two",
        password: "password2",
      };
      const saveStub = sinon.stub(User.prototype, "save");
      saveStub.returns(newUser);

      const result = await userService.addUser(newUser);

      expect(result).to.equal(newUser);

      saveStub.restore();
    });

    it("should throw an error when save fails is added", async () => {
      const newUser = {
        _id: "1",
        email: "user2@example.com",
        name: "User Two",
        password: "",
      };
      const error = new Error("Invalid User");
      const saveStub = sinon.stub(User.prototype, "save");
      saveStub.throws(error);

      try {
        await userService.addUser(newUser);
        assert.fail("Expected error was not thrown");
      } catch (err) {
        expect(err).to.equal(error);
      }

      saveStub.restore();
    });
  });
  describe("updatePassword tests", () => {
    it("should call findOneAndUpdate", async () => {
      // Arrange
      const findOneAndUpdateStub = sinon.stub(User, "findOneAndUpdate");
      findOneAndUpdateStub.resolves([]);
      // Act
      await userService.updatePassword();
      // Assert
      expect(findOneAndUpdateStub.calledOnce).to.be.true;

      findOneAndUpdateStub.restore();
    });
    it("should call return the update user when password is valid", async () => {
      // Arrange
      const id = "1";
      const newPassword = "Password22!";
      const updatedUser = {
        email: "user2@example.com",
        name: "User Two",
        password: newPassword,
      };
      const findOneAndUpdateStub = sinon.stub(User, "findOneAndUpdate");
      findOneAndUpdateStub.resolves(updatedUser);
      // Act
      const result = await userService.updatePassword(id, newPassword);
      // Assert
      expect(result).to.equal(updatedUser);

      findOneAndUpdateStub.restore();
    });
    it("should return null when and invalid id is provided", async () => {
      // Arrange
      const id = "invalid";
      const newPassword = "Password22!";
      const findOneAndUpdateStub = sinon.stub(User, "findOneAndUpdate");
      findOneAndUpdateStub.resolves(null);
      const findStub = sinon.stub(User, "find");
      findStub.returns(null);
      // Act
      const result = await userService.updatePassword(id, newPassword);
      // Assert
      expect(result).to.null;

      findOneAndUpdateStub.restore();
    });
  });
});
