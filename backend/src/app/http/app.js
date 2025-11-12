import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import {
  errorMiddleware,
  notFoundMiddleware,
} from "../../shared/interfaces/http/middleware/error.middleware.js";
import { registerRoutes } from "./routes.js";

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
  enableStatic = false, // Disable static file serving by default
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

  // Simple root endpoint for API-only mode
  app.get("/", (_req, res) => {
    res.status(200).json({
      message: "Portfolio API",
      version: "1.0.0",
      status: "running",
      endpoints: {
        health: "/api/health",
        auth: "/api/auth",
        blog: "/api/blog",
        projects: "/api/projects",
        admin: "/api/admin/dashboard",
      },
    });
  });

  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
};

export default createHttpApp;
