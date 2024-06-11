import User from "../models/user.model.js";

export default class UserService {
  getUsers = async () => {
    return await User.find({});
  };
}
