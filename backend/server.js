import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envCandidates = [
  path.resolve(__dirname, ".env"),
  path.resolve(__dirname, "..", ".env"),
];

const envPath = envCandidates.find((candidate) => fs.existsSync(candidate));
if (envPath) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

const [{ createHttpApp }, { connectDatabase }, loggerModule] =
  await Promise.all([
    import("./src/app/http/app.js"),
    import("./src/shared/infrastructure/database/mongoose.js"),
    import("./src/shared/infrastructure/logging/logger.js"),
  ]);
const logger = loggerModule.default;

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
