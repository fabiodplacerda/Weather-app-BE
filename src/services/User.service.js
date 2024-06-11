import User from "../models/user.model.js";

export default class UserService {
  getUsers = async () => {
    return await User.find({});
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
}
