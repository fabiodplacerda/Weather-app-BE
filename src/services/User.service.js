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

  editUser = async (userId, updatedUser) => {
    return await User.findOneAndUpdate({ _id: userId }, updatedUser, {
      new: true,
    });
  };
}
