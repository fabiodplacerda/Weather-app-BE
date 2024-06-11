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

  addUser = async (req, res) => {
    const invalidError = new Error("Invalid User");
    try {
      if (!req.body) throw invalidError;
      const newUser = await this.#service.addUser(req.body);
      if (!newUser.id) throw invalidError;
      res.status(201).json(newUser);
    } catch (e) {
      if (e === invalidError) {
        res.status(400).json({ message: e.message });
      }
      res.status(500).json({ message: e.message });
    }
  };
}
