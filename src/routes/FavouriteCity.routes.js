import { Router } from "express";

export default class FavouriteCityRoutes {
  #router;
  #routeStartingPoint;
  #controller;

  constructor(controller, routeStartingPoint = "/") {
    this.#router = Router();
    this.#controller = controller;
    this.#initializeRoutes();
    this.#routeStartingPoint = routeStartingPoint;
  }

  #initializeRoutes() {
    this.#router.get("/getCities", this.#controller.getCities);
  }

  getRouter() {
    return this.#router;
  }

  getRouteStartingPoint() {
    return this.#routeStartingPoint;
  }
}
