import { model, Schema } from "mongoose";

const userSchema = new Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  favouriteCities: { type: Array, default: [] },
});

const User = model("User", userSchema);

export default User;
