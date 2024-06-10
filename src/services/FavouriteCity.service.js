import FavouriteCity from "../models/favouriteCity.model.js";

export default class FavouriteCityService {
  async getCities() {
    return await FavouriteCity.find({});
  }
}
