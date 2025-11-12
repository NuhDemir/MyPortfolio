import path from "path";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { fileURLToPath } from "url";
import {
  errorMiddleware,
  notFoundMiddleware,
} from "../../shared/interfaces/http/middleware/error.middleware.js";
import { registerRoutes } from "./routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:3000",
];

const resolveAllowedOrigins = () => {
  const rawOrigins = process.env.CORS_ALLOWED_ORIGINS;
  if (!rawOrigins) {
    return DEFAULT_ALLOWED_ORIGINS;
  }

  return rawOrigins
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
};

export const createHttpApp = ({
  allowedOrigins = resolveAllowedOrigins(),
  enableStatic = process.env.NODE_ENV === "production",
} = {}) => {
  const app = express();

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Origin not allowed by CORS"));
        }
      },
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    })
  );

  app.use(helmet());

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      standardHeaders: true,
      legacyHeaders: false,
      message: "Too many requests, please try again later.",
    })
  );

  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: false }));

  registerRoutes(app);

  if (enableStatic) {
    const frontendPath = path.resolve(
      __dirname,
      "..",
      "..",
      "..",
      "..",
      "frontend",
      "dist"
    );
    app.use(express.static(frontendPath));

    // Catch-all route for frontend SPA routing
    app.use((req, res, next) => {
      // Skip if it's an API route
      if (req.path.startsWith("/api")) {
        return next();
      }
      res.sendFile(path.resolve(frontendPath, "index.html"));
    });
  } else {
    app.get("/", (_req, res) => {
      res.send("API is running in development mode...");
    });
  }

  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
};

export default createHttpApp;
