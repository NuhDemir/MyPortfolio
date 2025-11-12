import "dotenv/config";
import mongoose from "mongoose";
import PasswordHasher from "../src/modules/auth/infrastructure/security/PasswordHasher.js";
import { MongooseUserRepository } from "../src/modules/auth/infrastructure/persistence/mongoose/MongooseUserRepository.js";

const DEFAULT_ADMIN = {
  username: "nuhdemirdev",
  email: "nuhdemir.dev@gmail.com",
  password: "dMr213**!",
};

const resolveSeedConfig = () => ({
  username: process.env.ADMIN_SEED_USERNAME ?? DEFAULT_ADMIN.username,
  email: process.env.ADMIN_SEED_EMAIL ?? DEFAULT_ADMIN.email,
  password: process.env.ADMIN_SEED_PASSWORD ?? DEFAULT_ADMIN.password,
});

const createAdminUser = async () => {
  const { username, email, password } = resolveSeedConfig();
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
  
  if (!mongoUri) {
    throw new Error("MONGO_URI or MONGODB_URI must be defined to seed admin user");
  }

  await mongoose.connect(mongoUri);
  try {
    const userRepository = new MongooseUserRepository();

    const existingByUsername = await userRepository.findByIdentity(username);
    if (existingByUsername) {
      console.log(
        `Admin user '${username}' already exists (id: ${existingByUsername.id}).`
      );
      return;
    }

    const existingByEmail = await userRepository.findByEmail(email);
    if (existingByEmail) {
      console.log(
        `An account with email '${email}' already exists (username: ${existingByEmail.username}).`
      );
      return;
    }

    const passwordHasher = new PasswordHasher();
    const hashedPassword = await passwordHasher.hash(password);

    const createdUser = await userRepository.create({
      username,
      email,
      password: hashedPassword,
      role: "admin",
    });

    console.log(
      `Created admin user '${createdUser.username}' with id ${createdUser.id}.`
    );
  } finally {
    await mongoose.disconnect();
  }
};

createAdminUser().catch((error) => {
  console.error("Failed to create admin user:", error);
  process.exitCode = 1;
});
