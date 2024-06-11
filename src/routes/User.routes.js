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
    this.#router.get(
      "/findUserByEmail/:email",
      this.#controller.findUserByEmail
    );
    this.#router.post("/", UserValidator.validate(), this.#controller.addUser);
    this.#router.put(
      "/:id",
      UserValidator.validate(),
      this.#controller.editUser
    );
  };

  getRouter() {
    return this.#router;
  }

  getRouteStartingPoint() {
    return this.#routeStartingPoint;
  }
}
