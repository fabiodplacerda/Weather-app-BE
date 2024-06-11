import { expect } from "chai";
import sinon from "sinon";
import User from "../../../src/models/user.model.js";
import UserService from "../../../src/services/User.service.js";

describe("UserService tests", () => {
  let userService;
  beforeEach(() => {
    userService = new UserService();
  });
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
        cityName: " test city name",
        cityCountry: "test city country",
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
