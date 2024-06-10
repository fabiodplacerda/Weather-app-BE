import FavouriteCity from "../models/favouriteCity.model.js";

export default class FavouriteCityService {
  async getCities() {
    return await FavouriteCity.find({});
  }

  addCity = async (newCity) => {
    let city;
    try {
      city = new FavouriteCity(newCity);
    } catch (e) {
      throw new Error("Invalid City");
    }
    return await city.save();
  };
}
