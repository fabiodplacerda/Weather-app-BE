import { Router } from "express";
import FavouriteCityController from "../controller/FavouriteCity.controller.js";
import UserValidator from "../middleware/User.validator.js";

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
    this.#router.post("/", UserValidator.validate(), this.#controller.addUser);
  };

  getRouter() {
    return this.#router;
  }

  getRouteStartingPoint() {
    return this.#routeStartingPoint;
  }
}
