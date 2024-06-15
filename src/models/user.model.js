import { model, Schema } from "mongoose";

const userSchema = new Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  favouriteCities: {
    type: [
      {
        city: { type: String, required: true },
        country: { type: String, required: true },
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
      },
    ],
    default: [],
  },
});

const User = model("User", userSchema);

export default User;
