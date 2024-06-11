import { expect } from "chai";
import sinon from "sinon";

import FavouriteCity from "../../../src/models/favouriteCity.model.js";
import FavouriteCityService from "../../../src/services/FavouriteCity.service.js";

describe("FavouriteCityService", () => {
  let favouriteCityService;

  beforeEach(() => {
    favouriteCityService = new FavouriteCityService();
  });

  describe("getCities tests", () => {
    it("should call find on the Favourite City model", async () => {
      // Arrange
      const findStub = sinon.stub(FavouriteCity, "find");
      findStub.resolves([]);
      // Act
      await favouriteCityService.getCities();
      // Assert
      expect(findStub.calledOnce).to.be.true;

      findStub.restore();
    });
    it("should return the favourite cities array when find is called on the model", async () => {
      // Arrange
      const testCity = [{ id: 1, name: "Lisbon", country: "Portugal" }];
      const findStub = sinon.stub(FavouriteCity, "find");
      findStub.resolves(testCity);
      // Act
      const result = await favouriteCityService.getCities();
      // Assert
      expect(result).to.equal(testCity);

      findStub.restore();
    });
    it("should return an empty array if there are no Favourite cities", async () => {
      // Arrange
      const testCity = [];
      const findStub = sinon.stub(FavouriteCity, "find");
      findStub.resolves(testCity);
      // Act
      const result = await favouriteCityService.getCities();
      // Assert
      expect(result).to.equal(testCity);

      findStub.restore();
    });
  });

  describe("AddCity tests", () => {
    it("should call save and return the result when a valid city is added", async () => {
      const newCity = {
        _id: "1",
        cityName: "Manchester",
        cityCountry: "UK",
      };
      const saveStub = sinon.stub(FavouriteCity.prototype, "save");
      saveStub.returns(newCity);

      const result = await favouriteCityService.addCity(newCity);

      expect(result).to.equal(newCity);

      saveStub.restore();
    });

    it("should throw an error when save fails", async () => {
      const newCity = {
        _id: "1",
        cityName: "Manchester",
        cityCountry: "UK",
      };
      const error = new Error("Invalid User");
      const saveStub = sinon.stub(FavouriteCity.prototype, "save");
      saveStub.throws(error);

      try {
        await favouriteCityService.addCity(newCity);
        assert.fail("Expected error was not thrown");
      } catch (err) {
        expect(err).to.equal(error);
      }

      saveStub.restore();
    });
  });
});
