import "dotenv/config";
import mongoose from "mongoose";
import PasswordHasher from "../src/modules/auth/infrastructure/security/PasswordHasher.js";
import { UserModel } from "../src/modules/auth/infrastructure/persistence/mongoose/UserModel.js";

const DEFAULT_ADMIN_USERNAME = "nuhdemir";
const DEFAULT_ADMIN_EMAIL = "nuhdemir.dev@gmail.com";
const DEFAULT_ADMIN_PASSWORD = "dMr213**!!";

const resolveSeedConfig = () => {
  const username = process.env.ADMIN_SEED_USERNAME || DEFAULT_ADMIN_USERNAME;
  const email = process.env.ADMIN_SEED_EMAIL || DEFAULT_ADMIN_EMAIL;
  const password = process.env.ADMIN_SEED_PASSWORD || DEFAULT_ADMIN_PASSWORD;

  return { username, email, password };
};

const createAdminUser = async () => {
  const { username, email, password } = resolveSeedConfig();
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error(
      "MONGO_URI or MONGODB_URI must be defined to seed admin user"
    );
  }

  await mongoose.connect(mongoUri);
  try {
    const existingByUsername = await UserModel.findOne({ username });
    if (existingByUsername) {
      const passwordHasher = new PasswordHasher();
      const hashedPassword = await passwordHasher.hash(password);

      await UserModel.updateOne(
        { _id: existingByUsername._id },
        {
          $set: {
            email,
            password: hashedPassword,
            role: "admin",
            isActive: true,
            updatedAt: new Date(),
          },
        }
      );

      console.log(
        `Admin user '${username}' already exists. Role and password were refreshed.`
      );
      return;
    }

    const existingByEmail = await UserModel.findOne({ email });
    if (existingByEmail) {
      const passwordHasher = new PasswordHasher();
      const hashedPassword = await passwordHasher.hash(password);

      await UserModel.updateOne(
        { _id: existingByEmail._id },
        {
          $set: {
            username,
            password: hashedPassword,
            role: "admin",
            isActive: true,
            updatedAt: new Date(),
          },
        }
      );

      console.log(
        `Account with email '${email}' was promoted to admin username '${username}'.`
      );
      return;
    }

    const passwordHasher = new PasswordHasher();
    const hashedPassword = await passwordHasher.hash(password);

    const createdUser = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      role: "admin",
    });

    console.log(
      `Created admin user '${createdUser.username}' with id ${createdUser._id}.`
    );
  } finally {
    await mongoose.disconnect();
  }
};

createAdminUser().catch((error) => {
  console.error("Failed to create admin user:", error);
  process.exitCode = 1;
});
