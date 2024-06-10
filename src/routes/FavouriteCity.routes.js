import { Router } from "express";
import FavouriteCityValidator from "../middleware/FavouriteCity.validator.js";
import FavouriteCityController from "../controller/FavouriteCity.controller.js";

export default class FavouriteCityRoutes {
  #router;
  #routeStartingPoint;
  #controller;

  constructor(
    controller = new FavouriteCityController(),
    routeStartingPoint = "/"
  ) {
    this.#router = Router();
    this.#controller = controller;
    this.#initializeRoutes();
    this.#routeStartingPoint = routeStartingPoint;
  }

  #initializeRoutes() {
    this.#router.get("/getCities", this.#controller.getCities);
    this.#router.post(
      "/",
      FavouriteCityValidator.validate(),
      this.#controller.addCity
    );
  }

  getRouter() {
    return this.#router;
  }

  getRouteStartingPoint() {
    return this.#routeStartingPoint;
  }
}
