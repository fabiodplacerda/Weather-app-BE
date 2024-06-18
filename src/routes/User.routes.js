import { Router } from "express";
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
    this.#router.post("/login", this.#controller.login);
    this.#router.post("/", UserValidator.validate(), this.#controller.addUser);
    this.#router.patch(
      "/updatePassword/:id",
      UserValidator.validatePassword(),
      UserValidator.validateNewPassword(),
      this.#controller.updatePassword
    );
    this.#router.patch(
      "/updateFavouriteCities/:id",
      UserValidator.validatePassword(),
      UserValidator.validateFavouriteCities(),
      this.#controller.updateFavouriteCities
    );
    this.#router.patch(
      "/removeFavouriteCity/:id",
      UserValidator.validatePassword(),
      this.#controller.removeFavouriteCity
    );
  };

  getRouter() {
    return this.#router;
  }

  getRouteStartingPoint() {
    return this.#routeStartingPoint;
  }
}
