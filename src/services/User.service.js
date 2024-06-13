import User from "../models/user.model.js";

export default class UserService {
  getUsers = async () => {
    return await User.find({});
  };

  findUserByEmail = async (email) => {
    return await User.findOne({ email: email });
  };

  addUser = async (newUser) => {
    let user;
    try {
      user = new User(newUser);
    } catch (e) {
      throw new Error("Invalid User");
    }
    return await user.save();
  };

  updatePassword = async (userId, updatedPassword) => {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        { password: updatedPassword },
        { new: true }
      );
      return updatedUser;
    } catch (e) {
      console.log("Error updating password");
      return e;
    }
  };
}
