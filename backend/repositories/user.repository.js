import User from "../models/User.js";

const findUserByUsername = async (username) => {
  return await User.findOne({ username });
};

const findUserById = async (id) => {
  return await User.findById(id).select("-password");
};

const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};
export { findUserById, findUserByUsername, createUser };
