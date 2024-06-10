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
}
