import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { createHttpApp } from "./src/app/http/app.js";
import { connectDatabase } from "./src/shared/infrastructure/database/mongoose.js";
import logger from "./src/shared/infrastructure/logging/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "..", ".env") });

const startServer = async () => {
  try {
    await connectDatabase(process.env.MONGO_URI);

    const app = createHttpApp();
    const port = process.env.PORT || 5000;

    app.listen(port, () => {
      logger.info("Server started", {
        port,
        environment: process.env.NODE_ENV ?? "development",
      });
    });
  } catch (error) {
    logger.error("Failed to start server", { message: error.message });
    process.exit(1);
  }
};

startServer();
