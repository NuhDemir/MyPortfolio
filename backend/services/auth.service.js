import bcrypt, { hashSync } from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  findUserByUsername,
  createUser,
} from "../repositories/user.repository.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

const loginAdmin = async (username, password) => {
  const user = await findUserByUsername(username);

  if (user && (await bcrypt.compare(password, user.password))) {
    return {
      _id: user._id,
      username: user.username,
      role: user.role,
      token: generateToken(user._id),
    };
  } else {
    throw new Error("Kullanıcı adı veya şifre yanlış.");
  }
};

const registerAdmin = async (username, password) => {
  const userExists = await findUserByUsername(username);

  if (userExists) {
    throw new Error("Kullanıcı adı zaten mevcut.");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await createUser({
    username,
    password: hashedPassword,
    role: "admin",
  });

  if (user) {
    return {
      _id: user._id,
      username: user.username,
      role: user.role,
      token: generateToken(user._id),
    };
  } else {
    throw new Error("Admin oluşturulamadı.");
  }
};

export { loginAdmin, registerAdmin };
