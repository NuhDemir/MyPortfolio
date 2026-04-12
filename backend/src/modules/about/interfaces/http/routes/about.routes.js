import express from "express";
import { validateRequest } from "../../../../../shared/interfaces/http/middleware/validation.middleware.js";
import createAboutController from "../controllers/about.controller.js";
import { updateAboutSchema } from "../validators/about.schemas.js";

export const createAboutRouter = ({ middleware, ...dependencies }) => {
  const router = express.Router();
  const controller = createAboutController(dependencies);

  router.get("/", controller.getPublic);

  router.get(
    "/admin/content",
    middleware.protect,
    middleware.authorizeAdmin,
    controller.getAdmin,
  );

  router.put(
    "/admin/content",
    middleware.protect,
    middleware.authorizeAdmin,
    validateRequest(updateAboutSchema),
    controller.update,
  );

  return router;
};

export default createAboutRouter;
