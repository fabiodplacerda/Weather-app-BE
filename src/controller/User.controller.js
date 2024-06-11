import UserService from "../services/User.service.js";

export default class UserController {
  #service;

  constructor(service = new UserService()) {
    this.#service = service;
  }

  getUsers = async (req, res) => {
    try {
      res.json(await this.#service.getUsers());
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  };
}
