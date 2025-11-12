import mongoose from "mongoose";
import logger from "../../infrastructure/logging/logger.js";

export const connectDatabase = async (connectionString) => {
  if (!connectionString) {
    throw new Error("Mongo connection string is required");
  }

  try {
    const connection = await mongoose.connect(connectionString, {
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
      socketTimeoutMS: 45000, // 45 seconds socket timeout
      family: 4, // Use IPv4, skip trying IPv6
    });
    logger.info("MongoDB connected", {
      host: connection.connection.host,
      name: connection.connection.name,
    });
    return connection;
  } catch (error) {
    logger.error("MongoDB connection failed", { message: error.message });
    throw error;
  }
};

export const disconnectDatabase = async () => {
  try {
    await mongoose.disconnect();
    logger.info("MongoDB disconnected");
  } catch (error) {
    logger.error("Failed to disconnect MongoDB", { message: error.message });
    throw error;
  }
};

export default connectDatabase;
