import User from "../models/user.model.js";

export default class UserService {
  getUsers = async () => {
    return await User.find({});
  };

  findUserByEmail = async (email) => {
    return await User.findOne({ email: email });
  };

  login = async (email, password) => {
    try {
      const user = await User.findOne({ email: email });
      if (!user || user.password !== password) return null;
      return user;
    } catch (e) {
      return e;
    }
  };

  addUser = async (newUser) => {
    let user;
    try {
      user = new User(newUser);
      return await user.save();
    } catch (e) {
      throw new Error("Invalid User");
    }
  };

  updatePassword = async (userId, newPassword) => {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        { password: newPassword },
        { new: true }
      );
      return updatedUser;
    } catch (e) {
      throw new Error(`Error updating password: ${e.message}`);
    }
  };

  updateFavouriteCities = async (userId, newFavouriteCity) => {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        { $push: { favouriteCities: newFavouriteCity } },
        { new: true }
      );
      return updatedUser;
    } catch (e) {
      throw new Error(`Error updating favourite cities: ${e.message}`);
    }
  };

  removeFavouriteCity = async (userId, cityToRemove) => {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        { $pull: { favouriteCities: cityToRemove } },
        { new: true }
      );
      return updatedUser;
    } catch (e) {
      throw new Error(`Error removing favourite city: ${e.message}`);
    }
  };
}
