import express from "express";
import { validateRequest } from "../../../../../shared/interfaces/http/middleware/validation.middleware.js";
import createResourceUpload from "../../../infrastructure/storage/CloudinaryStorageService.js";
import createResourceController from "../controllers/resource.controller.js";
import {
  createResourceSchema,
  updateResourceSchema,
} from "../validators/resource.schemas.js";

export const createResourceRouter = ({ middleware, ...dependencies }) => {
  const router = express.Router();
  const controller = createResourceController(dependencies);
  const upload = createResourceUpload();

  router.get("/", controller.list);
  router.get("/:slug", controller.get);

  router.post(
    "/",
    middleware.protect,
    middleware.authorizeAdmin,
    upload.single("coverImage"),
    validateRequest(createResourceSchema),
    controller.create,
  );

  router.put(
    "/:id",
    middleware.protect,
    middleware.authorizeAdmin,
    upload.single("coverImage"),
    validateRequest(updateResourceSchema),
    controller.update,
  );

  router.delete(
    "/:id",
    middleware.protect,
    middleware.authorizeAdmin,
    controller.remove,
  );

  return router;
};

export default createResourceRouter;
