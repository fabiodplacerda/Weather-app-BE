import FavouriteCityService from "../services/FavouriteCity.service.js";

export default class FavouriteCityController {
  #service;

  constructor(service = new FavouriteCityService()) {
    this.#service = service;
  }

  getCities = async (req, res) => {
    try {
      res.json(await this.#service.getCities());
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  };

  addCity = async (req, res) => {
    const invalidError = new Error("Invalid City");
    try {
      if (!req.body) throw invalidError;
      const newCity = await this.#service.addCity(req.body);
      if (!newCity._id) throw invalidError;
      res.status(201).json(newCity);
    } catch (e) {
      if (e === invalidError) {
        res.status(400).json({ message: e.message });
      }
      res.status(500).json({ message: e.message });
    }
  };
}
