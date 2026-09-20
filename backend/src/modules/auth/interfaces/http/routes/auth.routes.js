import express from "express";
import rateLimit from "express-rate-limit";
import { validateRequest } from "../../../../../shared/interfaces/http/middleware/validation.middleware.js";
import createAuthController from "../controllers/auth.controller.js";
import { loginSchema, registerSchema } from "../validators/auth.schemas.js";

export const createAuthRouter = (dependencies) => {
  const router = express.Router();
  const controller = createAuthController(dependencies);

  const loginLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 saat
    max: 5, // Her IP için maksimum 5 deneme
    message: {
      success: false,
      message: "Çok fazla başarısız giriş denemesi. Lütfen 1 saat sonra tekrar deneyin.",
    },
    standardHeaders: true, // `RateLimit-*` başlıklarını döner
    legacyHeaders: false, // `X-RateLimit-*` başlıklarını devreden çıkarır
  });

  router.post("/login", loginLimiter, validateRequest(loginSchema), controller.login);
  router.post(
    "/register",
    validateRequest(registerSchema),
    controller.register
  );

  return router;
};

export default createAuthRouter;
