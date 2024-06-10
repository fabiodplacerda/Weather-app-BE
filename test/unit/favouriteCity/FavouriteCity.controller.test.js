import { expect } from "chai";
import sinon from "sinon";

import FavouriteCityController from "../../../src/controller/FavouriteCity.controller.js";

describe("FavouriteCityController", () => {
  let favouriteCityController, favouriteCitiesService, req, res;

  beforeEach(() => {
    favouriteCitiesService = {
      getCities: sinon.stub(),
    };
    favouriteCityController = new FavouriteCityController(
      favouriteCitiesService
    );
    res = {
      json: sinon.spy(),
      status: sinon.stub().returnsThis(),
    };
  });
  describe("getCities tests", () => {
    it("should get favourite cities from service and return them as json", async () => {
      // Arrange
      const testCities = [
        {
          id: "1",
          cityName: " test city name",
          cityCountry: "test city country",
        },
      ];
      favouriteCitiesService.getCities.resolves(testCities);

      // Act
      await favouriteCityController.getCities(req, res);

      // Arrange
      expect(res.json.calledWith(testCities)).to.be.true;
    });
    it("should send an empty array if there are no favourite cities", async () => {
      // Arrange
      const testCities = [];
      favouriteCitiesService.getCities.resolves(testCities);

      // Act
      await favouriteCityController.getCities(req, res);

      // Arrange
      expect(res.json.calledWith(testCities)).to.be.true;
    });
    it("should send a 500 response if getCities throws an error", async () => {
      // Arrange
      const testError = new Error();
      favouriteCitiesService.getCities.rejects(testError);

      // Act
      await favouriteCityController.getCities(req, res);

      // Arrange
      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ message: testError.message })).to.be.true;
    });
  });
});
