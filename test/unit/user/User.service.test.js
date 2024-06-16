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
  describe("Login", () => {
    it("should call findOne on the model", async () => {
      // Arrange
      const findOneStub = sinon.stub(User, "findOne");
      findOneStub.resolves({});
      // Act
      await userService.login();
      // Assert
      expect(findOneStub.calledOnce).to.be.true;
      findOneStub.restore();
    });
    it("should call return a user if password if correct and user exists", async () => {
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
      const result = await userService.login(testUser.email, testUser.password);
      // Assert
      expect(result).to.equal(testUser);
      findOneStub.restore();
    });
    it("should return null if email was not found or password doesn't match", async () => {
      // Arrange
      const findOneStub = sinon.stub(User, "findOne");
      findOneStub.resolves(null);
      // Act
      const result = await userService.login(
        "test@test.com",
        "inexistentPassword"
      );
      // Assert
      expect(result).to.equal(null);
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

    it("should throw an error when save fails", async () => {
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
        expect(err).to.deep.equal(error);
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
    it("should return the update user when password is valid", async () => {
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
      findStub.restore();
    });
    it("should return throw an error when updating fails", async () => {
      // Arrange
      const testId = "66637a57557ca62365e759fe";
      const newPassword = "NewPassword1!";
      const testError = new Error("Test error");
      const findOneAndUpdateStub = sinon.stub(User, "findOneAndUpdate");
      findOneAndUpdateStub.throws(testError);

      // Act
      // Assert
      try {
        await userService.updatePassword(testId, newPassword);
        assert.fail("Expected error was not thrown");
      } catch (e) {
        expect(e.message).to.equal(
          `Error updating password: ${testError.message}`
        );
      }

      findOneAndUpdateStub.restore();
    });
  });
  describe("UpdateFavouriteCities tests ", () => {
    it("should call findOneAndUpdate", async () => {
      const findOneAndUpdateStub = sinon.stub(User, "findOneAndUpdate");
      findOneAndUpdateStub.resolves({});

      await userService.updateFavouriteCities();

      expect(findOneAndUpdateStub.calledOnce).to.be.true;

      findOneAndUpdateStub.restore();
    });
    it("should return the updated user when favouriteCities has been updated successfully", async () => {
      const id = "1";
      const newCity = {
        favouriteCity: { city: "testCity", country: "testCountry" },
      };
      const updatedUser = {
        email: "test@example.com",
        name: "test",
        password: "TestPassword1!",
        favouriteCities: [newCity],
      };

      const findOneAndUpdateStub = sinon.stub(User, "findOneAndUpdate");
      findOneAndUpdateStub.resolves(updatedUser);

      const result = await userService.updateFavouriteCities(id, newCity);

      expect(result).to.equal(updatedUser);

      findOneAndUpdateStub.restore();
    });
    it("should return error when user cities fails to update", async () => {
      const id = "66637a57557ca62365e759fe";
      const error = new Error("test error");
      const newCity = {
        favouriteCity: { city: "testCity", country: "testCountry" },
      };

      const findOneAndUpdateStub = sinon.stub(User, "findOneAndUpdate");
      findOneAndUpdateStub.throws(error);

      try {
        await userService.updateFavouriteCities(id, newCity);
        assert.fail("Expected error was not thrown");
      } catch (err) {
        expect(err.message).to.equal(
          `Error updating favourite cities: ${error.message}`
        );
      }
      findOneAndUpdateStub.restore();
    });
  });
  describe("removeFavouriteCity tests ", () => {
    it("should call findOneAndUpdate", async () => {
      const findOneAndUpdateStub = sinon.stub(User, "findOneAndUpdate");
      findOneAndUpdateStub.resolves({});

      await userService.removeFavouriteCity();

      expect(findOneAndUpdateStub.calledOnce).to.be.true;

      findOneAndUpdateStub.restore();
    });
    it("should return the updated user when city has been removed successfully", async () => {
      const id = "1";
      const cityToRemove = {
        favouriteCity: { city: "testCity", country: "testCountry" },
      };
      const updatedUser = {
        email: "test@example.com",
        name: "test",
        password: "TestPassword1!",
        favouriteCities: [],
      };

      const findOneAndUpdateStub = sinon.stub(User, "findOneAndUpdate");
      findOneAndUpdateStub.resolves(updatedUser);

      const result = await userService.removeFavouriteCity(id, cityToRemove);

      expect(result).to.equal(updatedUser);

      findOneAndUpdateStub.restore();
    });
    it("should return error when user cities fails to update", async () => {
      const id = "66637a57557ca62365e759fe";
      const error = new Error("test error");
      const cityToRemove = {
        favouriteCity: { city: "testCity", country: "testCountry" },
      };

      const findOneAndUpdateStub = sinon.stub(User, "findOneAndUpdate");
      findOneAndUpdateStub.throws(error);

      try {
        await userService.removeFavouriteCity(id, cityToRemove);
        assert.fail("Expected error was not thrown");
      } catch (err) {
        expect(err.message).to.equal(
          `Error removing favourite city: ${error.message}`
        );
      }
      findOneAndUpdateStub.restore();
    });
  });
});
