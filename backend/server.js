import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import cron from "node-cron";

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
    // Support both MONGO_URI and MONGODB_URI for flexibility
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
    await connectDatabase(mongoUri);

    const app = createHttpApp();
    const port = process.env.PORT || 5000;

    app.listen(port, () => {
      logger.info("Server started", {
        port,
        environment: process.env.NODE_ENV ?? "development",
      });

      // Keep-Alive Cron (Every 14 minutes)
      const renderUrl = process.env.RENDER_EXTERNAL_URL || `http://localhost:${port}`;
      cron.schedule("*/14 * * * *", () => {
        logger.info(`Sending keep-alive ping to ${renderUrl}/api/health`);
        fetch(`${renderUrl}/api/health`).catch((err) =>
          logger.error("Keep-alive ping failed", { error: err.message })
        );
      });
    });
  } catch (error) {
    logger.error("Failed to start server", { message: error.message });
    process.exit(1);
  }
};

startServer();
