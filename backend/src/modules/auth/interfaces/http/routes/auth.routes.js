import express from "express";
import { validateRequest } from "../../../../../shared/interfaces/http/middleware/validation.middleware.js";
import createAuthController from "../controllers/auth.controller.js";
import { loginSchema, registerSchema } from "../validators/auth.schemas.js";

export const createAuthRouter = (dependencies) => {
  const router = express.Router();
  const controller = createAuthController(dependencies);

  router.post("/login", validateRequest(loginSchema), controller.login);
  router.post(
    "/register",
    validateRequest(registerSchema),
    controller.register
  );

  return router;
};

export default createAuthRouter;
