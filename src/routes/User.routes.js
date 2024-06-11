import { Router } from "express";
import FavouriteCityController from "../controller/FavouriteCity.controller.js";

export default class UserRoutes {
  #controller;
  #routeStartingPoint;
  #router;

  constructor(
    controller = new FavouriteCityController(),
    routeStartingPoint = "/user"
  ) {
    this.#router = Router();
    this.#controller = controller;
    this.#routeStartingPoint = routeStartingPoint;
    this.#initializeRoutes();
  }

  #initializeRoutes = () => {
    this.#router.get("/getUsers", this.#controller.getUsers);
  };

  getRouter() {
    return this.#router;
  }

  getRouteStartingPoint() {
    return this.#routeStartingPoint;
  }
}
