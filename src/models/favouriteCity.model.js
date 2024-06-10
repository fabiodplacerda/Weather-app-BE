import { model, Schema } from "mongoose";

const favouriteCitySchema = new Schema({
  cityName: { type: String, required: true },
  cityCountry: { type: String, required: true },
});

const FavouriteCity = model("Favourite_City", favouriteCitySchema);

export default FavouriteCity;
