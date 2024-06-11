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
      if (!newUser._id) throw invalidError;
      res.status(201).json(newUser);
    } catch (e) {
      if (e === invalidError) {
        res.status(400).json({ message: e.message });
      }
      res.status(500).json({ message: e.message });
    }
  };

  editUser = async (req, res) => {
    const { id } = req.params;
    const { body } = req;

    try {
      !id && res.status(400).json({ message: "invalid id" });
      !body && res.status(400).json({ message: "invalid request body" });

      const updatedUser = await this.#service.editUser(id, body);

      !updatedUser && res.status(404).json({ message: "user not found" });

      res.status(202).json(updatedUser);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  };
}
